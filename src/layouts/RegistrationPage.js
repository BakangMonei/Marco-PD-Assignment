import React, { useState } from "react";
import { countries } from "countries-list";
import { auth, firestore } from "../database/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


export const RegistrationPage = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastame] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [sport, setSport] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [error, setError] = useState(null);


  const dispatch = useDispatch();
  const registrationState = useSelector((state) => state.auth); // Assuming you have combined your reducers and authReducer is part of the state

  // Extracting countries from the countries-list package
  const countryOptions = Object.values(countries);

  // Lists
  const sports = [  "Archery",
  "Athletics",
  "Badminton",
  "Basketball",
  "Boxing",
  "Canoeing",
  "Cycling",
  "Diving",
  "Equestrian",
  "Fencing",
  "Football",
  "Golf",
  "Gymnastics",
  "Handball",
  "Hockey",
  "Judo",
  "Karate",
  "Modern Pentathlon",
  "Rowing",
  "Rugby Sevens",
  "Sailing",
  "Shooting",
  "Skateboarding",
  "Sport Climbing",
  "Surfing",
  "Swimming",
  "Table Tennis",
  "Taekwondo",
  "Tennis",
  "Trampoline",
  "Triathlon",
  "Volleyball",
  "Water Polo",
  "Weightlifting",
  "Wrestling"];
  const genderM = ["Male", "Female", "Other"];
  // State for validation and registration success
  const [validationError, setValidationError] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Initialize useNavigate for redirection
  const navigate = useNavigate();

  const validatePassword = (password, repassword) => {
    if (password !== repassword) {
      return { error: true, message: "Passwords do not match" };
    }
    if (password.length < 8) {
      return { error: true, message: "Password must be at least 8 characters" };
    }
    if (
      !/[a-zA-Z]/.test(password) ||
      !/\d/.test(password) ||
      !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    ) {
      return {
        error: true,
        message:
          "Password must include a mix of letters, numbers, and special characters",
      };
    }
    return { error: false, message: "" };
  };

  // Function to handle user registration
  const handleRegister = async (e) => {
    e.preventDefault();
    const passwordError = validatePassword(password, repassword);

    if (passwordError.error) {
      setValidationError(true);
      setError(passwordError.message);
      return;
    }

    // Check if all required fields are filled
    const requiredFields = [
      firstname,
      lastname,
      email,
      password,
      repassword,
      username,
      sport,
      selectedCountry,
      phonenumber,
      gender,
      password,
    ];

    if (requiredFields.some((field) => field.trim() === "")) {
      setValidationError(true);
      setRegistrationSuccess(false);
      return;
    }

    // Check if email is unique
    const emailQuery = query(
      collection(firestore, "users"),
      where("email", "==", email)
    );
    const emailSnapshot = await getDocs(emailQuery);

    if (!emailSnapshot.empty) {
      setValidationError(true);
      setRegistrationSuccess(false);
      return;
    }

    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Create an object with the user's data (excluding password)
      const userData = {
        firstname,
        lastname,
        email,
        username,
        gender,
        sport,
        selectedCountry,
        phonenumber,
        password,
      };

      // Add the user's data to Firestore
      const docRef = await addDoc(collection(firestore, "users"), userData);

      if (docRef) {
        // Registration and Firestore data addition successful
        setRegistrationSuccess(true);

        // Send verification email
        await sendEmailVerification(userCredential.user);

        // Redirect to verification page or display message
        navigate("/LoginPage"); // Replace '/verify-email' with the actual path to your verification page
        alert("Please verify your email address before logging in.");
      } else {
        console.error("Error adding user data to Firestore.");
        setRegistrationSuccess(false);
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setRegistrationSuccess(false);
    }
  };

  return (
    <div className="bg_image flex items-center justify-center min-h-screen">
      <div className="login_container grid grid-cols-2 gap-4 p-8 rounded-xl shadow-md w-full max-w-4xl">
        <div className="col-span-2">
          <h1 className="text-4xl font-sans mb-1 text-left">
            Create an account
          </h1>
          <h1 className="text-left font-thin mb-4">
            Already have an account?{" "}
            <a href="/LoginPage" className="text-black underline">
              Log in
            </a>
          </h1>
          {validationError && (
            <p className="text-red-500 mb-2">
              Please fill out all required fields.
            </p>
          )}
          {registrationSuccess && (
            <p className="text-green-500 mb-2">Registered Successfully!</p>
          )}
          <form onSubmit={handleRegister}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
              <div>
                <label className="block text-sm font-thin mb-1">
                  FirstName
                </label>
                <input
                  type="text"
                  placeholder="FirstName"
                  className="bg-transparent w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-thin mb-1">LastName</label>
                <input
                  type="text"
                  placeholder="LastName"
                  className="bg-transparent w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                  value={lastname}
                  onChange={(e) => setLastame(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-thin mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="bg-transparent w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                  value={phonenumber}
                  onChange={(e) => setPhonenumber(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-thin mb-1">Sport</label>
                <select
                  className="bg-transparent w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                >
                  <option value="">Select Sport</option>
                  {sports.map((sport, index) => (
                    <option key={index} value={sport}>
                      {sport}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-thin mb-1">Gender</label>
                <select
                  className="bg-transparent w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  {genderM.map((gender, index) => (
                    <option key={index} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-thin mb-1">Country</label>
                <select
                  className=" bg-transparent w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                >
                  <option value="">Select Country</option>
                  {countryOptions.map((country, index) => (
                    <option key={index} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-thin mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  className="bg-transparent w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-thin mb-1">Username</label>
                <input
                  type="text"
                  placeholder="Username"
                  className="bg-transparent w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-thin mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  className="bg-transparent w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-thin mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="bg-transparent w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                  value={repassword}
                  onChange={(e) => setRePassword(e.target.value)}
                />
              </div>
            </div>
            <p className="font-thin p-3">
              Use 8 or more characters with a mix of letters, numbers & symbols
            </p>
            <div className="flex items-center mb-4">
              <input type="checkbox" className="mr-2" id="terms" name="terms" />
              <label htmlFor="terms" className="text-sm font-thin">
                I agree to the{" "}
                <a href="/terms" className="text-black underline">
                  Terms and Conditions
                </a>
              </label>
            </div>
            <div className="flex flex-auto">
              {/*Navigate to forgot Password Page*/}
              <a
                href="/ForgotPassword"
                className="text-black underline w-full p-3"
              >
                Forgot Password?
              </a>

              <button
                type="submit"
                className="w-full bg-gray-500 text-white py-2 rounded-3xl hover:bg-gray-800 transition duration-200"
              >
                Sign Up
              </button>
            </div>

            {/* <div className="item-center justify-center flex-auto p-3">
              <ReCAPTCHA
                sitekey="6LcgtOIfAAAAAPKY4tPJouA-7ujrn7IHYJNvuOk6"
                // sitekey="6Lcmd9EpAAAAAB-OWZucytCG02_mFrByM5sJDEid"
                onChange={verifyCaptcha}
                onExpired={resetCaptcha}
              />
            </div> */}
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default RegistrationPage;
