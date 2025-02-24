import ValidateNewUserInput from "../../help_functions/ValidateNewUserInput";
import LinearProgress from "@mui/joy/LinearProgress";
import DialogContent from "@mui/joy/DialogContent";
import ModalDialog from "@mui/joy/ModalDialog";
import FormControl from "@mui/joy/FormControl";
import DialogTitle from "@mui/joy/DialogTitle";
import Typography from "@mui/joy/Typography";
import FormLabel from "@mui/joy/FormLabel";
import Add from "@mui/icons-material/Add";
import Key from "@mui/icons-material/Key";
import Alert from "@mui/material/Alert";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import Stack from "@mui/joy/Stack";
import { React, useState } from "react";

function PasswordMeterInput({ text, inputState, input }) {
    const minLength = 12;

    return (
        <FormControl
            sx={{ direction: "rtl", textAlign: "right", alignContent: "right" }}
        >
            <FormLabel>{text}</FormLabel>
            <Stack
                spacing={0.5}
                sx={{
                    "--hue": Math.min(input.length * 10, 120),
                }}
            >
                <Input
                    type={"password"}
                    placeholder=""
                    startDecorator={<Key />}
                    value={input}
                    onChange={(event) => inputState(event.target.value)}
                    sx={{ direction: "ltr" }}
                />
                <LinearProgress
                    determinate
                    size="sm"
                    value={Math.min((input.length * 100) / minLength, 100)}
                    sx={{
                        bgcolor: "background.level3",
                        color: "hsl(var(--hue) 80% 40%)",
                    }}
                />
                <Typography
                    level="body-xs"
                    sx={{
                        alignSelf: "flex-end",
                        color: "hsl(var(--hue) 80% 30%)",
                        direction: "rtl",
                        textAlign: "right",
                        alignContent: "right",
                        alignItems: "right",
                    }}
                >
                    {input.length < 3 && "חלשה מאוד"}
                    {input.length >= 3 && input.length < 6 && "חלשה"}
                    {input.length >= 6 && input.length < 10 && "חזקה"}
                    {input.length >= 10 && "חזקה מאוד"}
                </Typography>
            </Stack>
        </FormControl>
    );
}

function InputFieldFormControl({ text, inputState }) {
    return (
        <FormControl>
            <FormLabel>{text}</FormLabel>
            <Input
                sx={{ direction: "ltr" }}
                onChange={(e) => inputState(e.target.value)}
                autoFocus
                required
            />
        </FormControl>
    );
}

export default function AddRowUserModal({ tableData, tableState }) {
    // This modal renders the users' table.
    // Once you add a row, you create a new user in the authentication page in firebase.

    const [open, setOpen] = useState(false);
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [userLevel, setUserLevel] = useState("3");
    const [isInputValid, setIsInputValid] = useState(false);
    const [errorText, setErrorText] = useState("");

    const cardTitle = "יצירת משתמש חדש";
    const cardBody =
        "יצירת משתמש חדש תתן למשתמש גישה לאתר, יש לשים לב למי נותנים את המשתמש מכיוון שהמידע באתר רגיש. בנוסף יש לזכור את הסיסמה כי מעתה והלאה היא לא תוצג מעולם. זכרו כי רמת ההרשאה של מנהלן היא 1, עורך מתקדם 2 ועורך רגיל 3.";
    const inputLabel1Text = "שם מלא";
    const inputLabel2Text = "מספר טלפון";
    const inputLabel3Text = "אימייל";
    const inputLabel4Text = "סיסמה";
    const inputLabel5Text = "סיסמה חוזרת";
    const inputLabel6Text = "רמת הרשאות";
    const submitButtonText = "יצירת משתמש";
    const collectionName = "users";

    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (
            !ValidateNewUserInput(
                tableData,
                tableState,
                setErrorText,
                collectionName,
                fullName,
                phoneNumber,
                email,
                password,
                rePassword,
                userLevel,
            )
        ) {
            setIsInputValid(true);
            setTimeout(() => {
                setIsInputValid(false);
            }, 6000);
        } else {
            setOpen(false);
        }
        setPassword("");
        setRePassword("");
    };

    return (
        <>
            <Button
                className="w-100"
                variant="outlined"
                color="success"
                onClick={() => setOpen(true)}
            >
                <Add />
            </Button>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                sx={{ textAlign: "right", direction: "rtl" }}
            >
                <ModalDialog
                    aria-labelledby="nested-modal-title"
                    aria-describedby="nested-modal-description"
                    sx={(theme) => ({
                        [theme.breakpoints.only("xs")]: {
                            top: "unset",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            borderRadius: 0,
                            transform: "none",
                            maxWidth: "unset",
                        },
                    })}
                >
                    <DialogTitle>{cardTitle}</DialogTitle>
                    <DialogContent>{cardBody}</DialogContent>
                    <form onSubmit={handleFormSubmit}>
                        <Stack spacing={2}>
                            <InputFieldFormControl
                                text={inputLabel1Text}
                                inputState={setFullName}
                            />
                            <InputFieldFormControl
                                text={inputLabel2Text}
                                inputState={setPhoneNumber}
                            />
                            <InputFieldFormControl
                                text={inputLabel3Text}
                                inputState={setEmail}
                            />
                            <PasswordMeterInput
                                text={inputLabel4Text}
                                inputState={setPassword}
                                input={password}
                            />
                            <PasswordMeterInput
                                text={inputLabel5Text}
                                inputState={setRePassword}
                                input={rePassword}
                            />

                            <FormControl>
                                <FormLabel>{inputLabel6Text}</FormLabel>
                                <Select
                                    value={userLevel}
                                    color="primary"
                                    disabled={false}
                                    size="sm"
                                    onChange={(event) => {
                                        setUserLevel(event.target.textContent);
                                    }}
                                    variant="outlined"
                                    required
                                >
                                    <Option value={"1"}>1</Option>
                                    <Option value={"2"}>2</Option>
                                    <Option value={"3"}>3</Option>
                                </Select>
                            </FormControl>
                            <Button type="submit" color="primary">
                                {submitButtonText}
                            </Button>
                        </Stack>
                    </form>

                    {isInputValid && (
                        <Alert
                            severity="error"
                            sx={{
                                textAlign: "right",
                                direction: "rtl",
                                gap: 0.6,
                            }}
                        >
                            {errorText}
                        </Alert>
                    )}
                </ModalDialog>
            </Modal>
        </>
    );
}
