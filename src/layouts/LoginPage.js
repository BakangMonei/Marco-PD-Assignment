import React, { useState } from "react";
import { connect } from "react-redux";
import { showPassword } from "../redux/actions/passwordActions";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth } from "../database/firebase";
import Check from "../components/checkbox/check";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Trefoill from "../components/loaders/Trefoil";

export const LoginPage = ({ showPasswordToggle, showPassword }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const db = getFirestore();

  const [loginClicked, setLoginClicked] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginClicked(true);
    
    if (!email || !password) {
      toast.error("Email and password are required.");
      setError("Email and password are required.");
      setLoginClicked(false); // Reset the login button state
      return;
    }
    
    try {
      const userSnapshot = await getDocs(
        query(collection(db, "users"), where("email", "==", email))
      );
      const adminSnapshot = await getDocs(
        query(collection(db, "admin"), where("email", "==", email))
      );
      const s_adminSnapshot = await getDocs(
        query(collection(db, "s_admin"), where("email", "==", email))
      );
  
      if (userSnapshot.size > 0) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Successfully logged in as User.");
        navigate("/MainIndex");
      } else if (adminSnapshot.size > 0) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Successfully logged in as Admin.");
        navigate("/AdminDashboard");
      } else if (s_adminSnapshot.size > 0) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Successfully logged in as Super Admin.");
        navigate("/SuperAdminDashboard");
      } else {
        toast.error("Invalid email or password.");
        setError("Invalid email or password.");
      }
    } catch (error) {
      toast.error("Login error: " + error.message);
      console.error("Login error:", error);
    } finally {
      setLoginClicked(false); // Reset the login button state
    }
  };
  

  return (
    <div className="bg_image flex items-center justify-center min-h-screen ">
      <div className="login_container p-8 rounded-xl shadow-md w-full max-w-md">
        <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-500 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-500">
          <h1 className="mx-4 text-2xl mb-0 text-center font-semibold text-gray-500 dark:text-white">
            Fun Olympics Login
          </h1>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="bg-transparent w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="">
            <label className="block text-sm font-medium mb-1">
              Password
              <button
                type="button"
                className="float-right text-gray-500 text-sm font-medium focus:outline-none hover:text-gray-700 transition duration-200"
                onClick={() => showPassword()}
              >
                {showPasswordToggle ? "Hide" : "Show"}
              </button>
            </label>
            <input
              placeholder="Password"
              className="bg-transparent w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
              id="pass"
              type={showPasswordToggle ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
  
          <div className="flex flex-row mb-4 mt-1 text-end">
            <div className="">
              <Check />
            </div>
            <div className="ml-auto">
              <a href="/ForgotPassword" className="text-gray-500">
                Forgot password?
              </a>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gray-500 text-white py-2 rounded-3xl hover:bg-gray-800 transition duration-200"
          >
            Log in
          </button>
          <div className="justify-center items-center flex">
            {loginClicked && <Trefoill />}
          </div>
          <h1 className="text-center font-thin mb-4">
            Don’t have an account?{" "}
            <a href="/RegistrationPage" className="text-black underline">
              Sign up
            </a>
          </h1>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
  
};
const mapStateToProps = (state) => ({
  showPasswordToggle: state.password.showPassword,
});

export default connect(mapStateToProps, { showPassword })(LoginPage);
