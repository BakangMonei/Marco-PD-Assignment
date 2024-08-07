// authActions.js
import { auth } from "../../database/firebase"; // Import your Firebase configuration here
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

// FORGOTPASSWORD
export const SEND_PASSWORD_RESET_EMAIL_REQUEST =
  "SEND_PASSWORD_RESET_EMAIL_REQUEST";
export const SEND_PASSWORD_RESET_EMAIL_SUCCESS =
  "SEND_PASSWORD_RESET_EMAIL_SUCCESS";
export const SEND_PASSWORD_RESET_EMAIL_FAILURE =
  "SEND_PASSWORD_RESET_EMAIL_FAILURE";

// Action Creators
export const sendPasswordResetEmailRequest = () => ({
  type: SEND_PASSWORD_RESET_EMAIL_REQUEST,
});

export const sendPasswordResetEmailSuccess = () => ({
  type: SEND_PASSWORD_RESET_EMAIL_SUCCESS,
});

export const sendPasswordResetEmailFailure = (error) => ({
  type: SEND_PASSWORD_RESET_EMAIL_FAILURE,
  error,
});

// Thunk Action Creator
export const sendPasswordResetEmail = (email) => {
  return (dispatch) => {
    dispatch(sendPasswordResetEmailRequest());
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        dispatch(sendPasswordResetEmailSuccess());
      })
      .catch((error) => {
        dispatch(sendPasswordResetEmailFailure(error));
      });
  };
};

// LOGIN
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";

// Action creators
export const login = (email, password) => async (dispatch) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    dispatch({ type: LOGIN_SUCCESS });
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: error.message });
  }
};

export const logout = () => async (dispatch) => {
  try {
    await signOut(auth);
    dispatch({ type: LOGOUT_SUCCESS });
  } catch (error) {
    console.error("Logout error:", error);
  }
};

// REGISTRATION USER
export const REGISTER_USER_REQUEST = "REGISTER_USER_REQUEST";
export const REGISTER_USER_SUCCESS = "REGISTER_USER_SUCCESS";
export const REGISTER_USER_FAILURE = "REGISTER_USER_FAILURE";

// Action Creators
export const registerUserRequest = () => ({
  type: REGISTER_USER_REQUEST,
});

export const registerUserSuccess = () => ({
  type: REGISTER_USER_SUCCESS,
});

export const registerUserFailure = (error) => ({
  type: REGISTER_USER_FAILURE,
  error,
});

// Thunk Action Creator
export const registerUser = (userData) => {
  return async (dispatch) => {
    dispatch(registerUserRequest());
    try {
      // Here you would perform the registration logic
      // For simplicity, let's assume it was successful
      dispatch(registerUserSuccess());
    } catch (error) {
      dispatch(registerUserFailure(error));
    }
  };
};

// REGISTER ADMINISTRATOR
export const REGISTER_ADMIN_REQUEST = "REGISTER_ADMIN_REQUEST";
export const REGISTER_ADMIN_SUCCESS = "REGISTER_ADMIN_SUCCESS";
export const REGISTER_ADMIN_FAILURE = "REGISTER_ADMIN_FAILURE";

// Action Creators
export const registerAdminRequest = () => ({
  type: REGISTER_ADMIN_REQUEST,
});

export const registerAdminSuccess = () => ({
  type: REGISTER_ADMIN_SUCCESS,
});

export const registerAdminFailure = (error) => ({
  type: REGISTER_ADMIN_FAILURE,
  error,
});

// Thunk Action Creator
export const registerAdmin = (userData) => {
  return async (dispatch) => {
    dispatch(registerAdminRequest());
    try {
      dispatch(registerAdminSuccess());
    } catch (error) {
      dispatch(registerAdminFailure(error));
    }
  };
};
