import React from "react";
import "startbootstrap-sb-admin-2/css/sb-admin-2.min.css";
import "../css/login.css";
import LoginCard from "../components/LoginCard";

export default function Login(props) {
    // The login page component.
    // params: setIsAuth -> useState(Boolean).

    return (
        <>
            <LoginCard setIsAuth={props.setIsAuth} />
        </>
    );
}
