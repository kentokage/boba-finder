import axios from "axios";
import * as actionTypes from "./actionTypes";

// sync functions
export const authStart = (email, password) => {
    return {
        type: actionTypes.AUTH_START,
        email,
        password,
    };
};

export const authSuccess = (token, userId, email) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId,
        email: email,
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error,
    };
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    return {
        type: actionTypes.AUTH_LOGOUT,
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return (dispatch) => {
        setTimeout(() => {
            dispatch(logout()); // execute these sync functions so it will dispatch the action??
        }, expirationTime * 1000);
    };
};

// async
export const auth = (email, password, isSignup) => {
    return (dispatch) => {
        dispatch(authStart(email, password));
        const k = `AIzaSyAZDDwgLQa-2L0m1q9vLZDtThaIA1tEwfU`;
        const BASE_API_URL = `https://identitytoolkit.googleapis.com/v1/accounts:`;
        const SIGNUP_API_URL = `${BASE_API_URL}signUp?key=${k}`;
        const SIGNIN_API_URL = `${BASE_API_URL}signInWithPassword?key=${k}`;
        const url = isSignup ? SIGNUP_API_URL : SIGNIN_API_URL;
        const payload = {
            email,
            password,
            returnSecureToken: true,
        };
        axios
            .post(url, payload)
            .then((response) => {
                const expirationDate = new Date(
                    new Date().getTime() + response.data.expiresIn * 1000
                );
                localStorage.setItem("token", response.data.idToken);
                localStorage.setItem("expirationDate", expirationDate);
                localStorage.setItem("userId", response.data.localId);
                localStorage.setItem("email", response.data.email);
                dispatch(
                    authSuccess(
                        response.data.idToken,
                        response.data.localId,
                        response.data.email
                    )
                );
                dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch((err) => {
                console.log(err);
                dispatch(authFail(err.response.data.error));
            });
    };
};

export const authCheckState = () => {
    return (dispatch) => {
        const token = localStorage.getItem("token");
        if (!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(
                localStorage.getItem("expirationDate")
            );

            if (new Date() > expirationDate) {
                dispatch(logout());
            } else {
                const userId = localStorage.getItem("userId");
                const email = localStorage.getItem("email");
                dispatch(authSuccess(token, userId, email));
                dispatch(
                    checkAuthTimeout((expirationDate - new Date()) / 1000)
                );
            }
        }
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path,
    };
};
