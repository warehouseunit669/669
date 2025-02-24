import { auth, db } from "../firebase-config";
import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithCustomToken } from "firebase/auth";

function isFullNameValid(fullName) {
    // Check for valid length.
    // params: fullName -> string
    // return: boolean

    return fullName.length > 1 && fullName.length < 50;
}

function isPhoneNumberValid(phoneNumber) {
    // Check for a valid phone number
    // params: phoneNumber -> string.
    //
    // return: boolean

    var phoneRe = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    var digits = phoneNumber.replace(/\D/g, "");
    return phoneRe.test(digits);
}

function isEmailValid(email, tableData) {
    // Validate email and check for duplicates.
    // params: email     -> string
    //         tableData -> Array[Object{key: string, key: Object{Array[string]}}]
    //
    // return: boolean

    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let tempEmail;

    // If tableData is empty return true.
    if (tableData.length === 0) {
        return String(email).toLowerCase().match(re);
    }

    // Check for duplicates in emails
    for (let i = 0; i < tableData.length; i++) {
        tempEmail = tableData[i].items[1];

        if (tempEmail === email) {
            return false;
        }
    }

    return String(email).toLowerCase().match(re);
}

function isPasswordValid(password) {
    // Check if password contains:
    // At least one uppercase letter
    // At least one lowercase letter
    // At least one digit
    // At least one special symbol
    // should be more than 6 character AND less then 21
    //
    // return: boolean

    return (
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password) &&
        password.length > 6 &&
        password.length < 21
    );
}

function isPasswordsMatch(password, rePassword) {
    // Check if the passwords match each other.
    // params: password   -> string,
    //         rePassword -> string.
    //
    // return: boolean

    return password === rePassword;
}

function isUserLevelValid(userLevel) {
    // Check if user level is valid
    // params: userLevel -> string
    //
    // return: boolean

    const availableOptions = ["1", "2", "3"];

    // If the selectedLevel not in available options exit the function.
    if (!availableOptions.includes(userLevel)) {
        return false;
    }

    return true;
}

async function commitDataToFirebase(
    collectionName,
    fullName,
    phoneNumber,
    email,
    password,
    userLevel,
    tableState,
) {
    // Commit new user to firebase
    // params: collectionName -> string,
    //         fullName       -> string,
    //         phoneNumber    -> string,
    //         email          -> string,
    //         password       -> string,
    //         userLevel      -> string,
    //         tableState     -> useState().
    //
    // returns None.

    const collectionRef = collection(db, collectionName);
    const id_generated = Date.now().toString(36);
    let userId = "";

    // // Save current user before signing in the new user
    // const currentUser = auth.currentUser;

    // Sign up the user with email and password.
    const signUpUser = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );
            const user = userCredential.user;
            userId = user.uid;

            // // Restore the original user
            // auth.signInWithEmailAndPassword(currentUser.email, currentUser.password);
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        }
    };

    // Create a new row in the "collectionName" table.
    const createNewUser = async () => {
        await addDoc(collectionRef, {
            id: id_generated,
            userId: userId,
            items: [userLevel, email, phoneNumber, fullName],
        });
    };

    await signUpUser();
    await createNewUser();
    tableState((prevData) => [
        ...prevData,
        { items: [userLevel, email, phoneNumber, fullName], id: id_generated },
    ]);
}

export default function ValidateNewUserInput(
    tableData,
    tableState,
    setErrorText,
    collectionName,
    userFullName,
    phoneNumber,
    email,
    password,
    rePassword,
    userLevel,
) {
    const errors = {
        "full name error": "שם מלא צריך להיות עד 50 תווים!",
        "phone number error": "מספר הטלפון אינו תקין!",
        "email error": "האימייל שהוכנס כבר קיים או לא תקין!",
        "password error":
            "הסיסמה אינה תקינה! סיסמה חייבת להכיל אותיות גדולות, אותיות קטנות, ספרות ותווים מיוחדים. בנוסף היא חייבת להיות בין 6 ל-20 תווים בלבד.",
        "passwords not equal error":
            "הסיסמה שהכנסת לא תואמת לסיסמה המשנית שהכנסת!",
        "user level error": "הרשאת המשתמש שגויה ולא נמצאת בין 1-3",
    };

    if (!isFullNameValid(userFullName)) {
        setErrorText(errors["full name error"]);
        return false;
    } else if (!isPhoneNumberValid(phoneNumber)) {
        setErrorText(errors["phone number error"]);
        return false;
    } else if (!isEmailValid(email, tableData)) {
        setErrorText(errors["email error"]);
        return false;
    } else if (!isPasswordValid(password)) {
        setErrorText(errors["password error"]);
        return false;
    } else if (!isPasswordsMatch(password, rePassword)) {
        setErrorText(errors["passwords not equal error"]);
        return false;
    } else if (!isUserLevelValid(userLevel)) {
        setErrorText(errors["user level error"]);
        return false;
    }

    commitDataToFirebase(
        collectionName,
        userFullName,
        phoneNumber,
        email,
        password,
        userLevel,
        tableState,
    );

    return true;
}
