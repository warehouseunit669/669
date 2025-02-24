import {
    setPersistence,
    browserLocalPersistence,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";
import { auth, db } from "./firebase-config";
import React, { useState } from "react";
import AuthContext from "./AuthContext";
import {
    query,
    where,
    collection,
    getDocs,
} from "firebase/firestore";

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in
                setUser(user);
                setIsAuthenticated(true);

                // Call setUsername after setting user state
                await setUsername(user);
            } else {
                // User is signed out
                setUser({});
                setIsAuthenticated(false);
            }
            setLoading(false); // Set loading to false when onAuthStateChanged completes
        });

        const setUsername = async (user) => {
            let userUpdatedData = user;

            // Update the equipment's "fileAllocation" key
            const collectionRef = collection(db, "users");
            const querySnapshot = await getDocs(
                query(collectionRef, where("userId", "==", user.uid)),
            );
            querySnapshot.forEach(async (doc) => {
                userUpdatedData['username'] = doc.data().items[3]
                userUpdatedData['role'] = doc.data().items[0]
                setUser(userUpdatedData);
            });
        };

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const login = async (email, password, rememberMe) => {
        // This function is responsible for signing in with email and password.
        // It will validate the input and sign in the user.
        // params: email, password.
        // returns: None.

        // If the email or password are empty, set the input valid to true and after 6 seconds set it to false.
        if (email === "" || password === "") return false;

        try {
            if (rememberMe) {
                // Set the persistence to local storage
                await setPersistence(auth, browserLocalPersistence);
            }

            // Sign in with email and password
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );
            // Signed in
            setUser(userCredential.user);
            setIsAuthenticated(true);
            return true;
        } catch (error) {
            console.log(error);
            // If there is an error, return false.
            return false;
        }
    };

    const logout = () => {
        // This function is responsible for signing out the user.
        // It will sign out the user and navigate to the login page.
        signOut(auth)
            .then(() => {
                setIsAuthenticated(false);
                setUser({});
            })
            .catch((error) => {
                console.error("Error signing out: ", error);
            });
    };

    const value = {
        isAuthenticated,
        loading,
        user,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;
