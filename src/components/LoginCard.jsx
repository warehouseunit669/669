import medicalImage from "../assets/medical-1.png";
import { useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import Checkbox from "@mui/joy/Checkbox";
import AuthContext from "../AuthContext";
import Alert from "@mui/material/Alert";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";

export default function LoginCard() {
    // The login card component.
    // The component renders the card and uses a special auth methods to validate google users that tries to sign in.
    // The google auth functionality allows me to be in control of the website's security.

    const cardTitle = "כניסה לאתר";
    const loginButtonText = "כניסה";
    const checkBoxText = "Remember me";
    const errorText = "שם המשתמש או הסיסמה אינם נכונים, יש לנסות שוב בעוד 6 שניות.";

    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isInputValid, setIsInputValid] = React.useState(false);
    const [rememberMe, setRememberMe] = React.useState(false);

    const handleSignInWithEmailPassword = async () => {
        // This function is responsible for signing in with email and password.
        // It will validate the input and sign in the user.
        // params: None.
        // returns: None.

        try {
            const isAuth = await authContext.login(email, password, rememberMe);

            if (!isAuth) {
                setIsInputValid(true);
                setTimeout(() => {
                    setIsInputValid(false);
                }, 6000);

                // Introduce a delay before the next login attempt can be made
                await new Promise((resolve) =>
                    setTimeout(resolve, 6000),
                );
            } else {
                navigate("/equipment");
            }
        } catch (error) {
            console.error("Error during login: ", error);
        }
    };

    return (
        <div className="login-card bg-login-card d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-10 col-lg-12 col-md-9">
                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div className="card-body p-0">
                                <div className="row">
                                    <div className="col-lg-6 d-none d-lg-block bg-image-card">
                                        <img
                                            src={medicalImage}
                                            id="login-card-image"
                                        />
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="p-5">
                                            <div className="text-center">
                                                <h1 className="h4 text-gray-900 mb-4">
                                                    {cardTitle}
                                                </h1>
                                            </div>
                                            <form
                                                className="user"
                                                onSubmit={(event) => {
                                                    event.preventDefault();
                                                    handleSignInWithEmailPassword();
                                                }}
                                            >
                                                <div className="form-group">
                                                    <Input
                                                        type="email"
                                                        placeholder={"Email"}
                                                        sx={{
                                                            direction: "ltr",
                                                        }}
                                                        onChange={(e) =>
                                                            setEmail(
                                                                e.target.value,
                                                            )
                                                        }
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <Input
                                                        type="password"
                                                        placeholder={"Password"}
                                                        sx={{
                                                            direction: "ltr",
                                                        }}
                                                        onChange={(e) =>
                                                            setPassword(
                                                                e.target.value,
                                                            )
                                                        }
                                                        required
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <Checkbox
                                                        id="checkbox-login"
                                                        label={checkBoxText}
                                                        checked={rememberMe}
                                                        onClick={() =>
                                                            setRememberMe(
                                                                !rememberMe,
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="row">
                                                    <div className="col-12">
                                                        <Button
                                                            type="submit"
                                                            sx={{
                                                                width: "100%",
                                                            }}
                                                            disabled={isInputValid}
                                                        >
                                                            {loginButtonText}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </form>
                                            {isInputValid && (
                                                <Alert
                                                    severity="error"
                                                    sx={{
                                                        marginTop: 2,
                                                        textAlign: "right",
                                                        direction: "rtl",
                                                        gap: 0.6,
                                                    }}
                                                >
                                                    {errorText}
                                                </Alert>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
