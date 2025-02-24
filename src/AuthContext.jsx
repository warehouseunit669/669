import { createContext } from "react";

const AuthContext = createContext({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    login: () => {},
    logout: () => {},
});

export default AuthContext;
