import React, { useState, useEffect } from "react";
import { auth, firestore } from "../database/firebase";
import { doc, getDoc, updateDoc, query, where, getDocs, collection } from "firebase/firestore";
import { reauthenticateWithCredential, updatePassword, EmailAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const email = auth.currentUser.email;
          const userQuery = query(
            collection(firestore, "users"),
            where("email", "==", email)
          );
          const userSnapshot = await getDocs(userQuery);

          if (!userSnapshot.empty) {
            const userDoc = userSnapshot.docs[0];
            setUserData(userDoc.data());
            setFormData(userDoc.data());
          } else {
            console.error("No user data found.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.error("No authenticated user found.");
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async () => {
    if (auth.currentUser) {
      const email = auth.currentUser.email;
      const userQuery = query(
        collection(firestore, "users"),
        where("email", "==", email)
      );
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const userDocRef = doc(firestore, "users", userDoc.id);
        await updateDoc(userDocRef, formData);
        setUserData(formData);
        setEditMode(false);
      } else {
        console.error("No user data found to update.");
      }
    } else {
      console.error("No authenticated user found.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      try {
        await reauthenticateWithCredential(user, credential);
        if (newPassword === confirmPassword) {
          await updatePassword(user, newPassword);
          toast.success("Password updated successfully!");
          auth.signOut().then(() => navigate("/LoginPage"));
        } else {
          setError("Passwords do not match.");
        }
      } catch (error) {
        toast.error("Error updating password.");
      }
    }
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">User Profile</h1>
      <div className="flex gap-6">
        {/* User Details Form */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex-1">
          <div className="flex items-center mb-6">
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-bold text-white">
              {userData.firstname[0]}
              {userData.lastname[0]}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold">{userData.username}</h2>
              <p className="text-gray-600">{userData.email}</p>
            </div>
          </div>
          <div className="mb-6">
            <button
              className={`py-2 px-4 rounded ${
                editMode ? "bg-blue-500 text-white" : "bg-gray-500 text-white"
              }`}
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "Cancel" : "Edit Profile"}
            </button>
          </div>
          {editMode ? (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phonenumber"
                  value={formData.phonenumber}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Country</label>
                <input
                  type="text"
                  name="selectedCountry"
                  value={formData.selectedCountry}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Sport</label>
                <input
                  type="text"
                  name="sport"
                  value={formData.sport}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <button
                onClick={handleUpdate}
                className="py-2 px-4 bg-blue-500 text-white rounded-md shadow-sm"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div>
              <p className="mb-2">
                <strong>Email:</strong> {userData.email}
              </p>
              <p className="mb-2">
                <strong>First Name:</strong> {userData.firstname}
              </p>
              <p className="mb-2">
                <strong>Last Name:</strong> {userData.lastname}
              </p>
              <p className="mb-2">
                <strong>Phone Number:</strong> {userData.phonenumber}
              </p>
              <p className="mb-2">
                <strong>Country:</strong> {userData.selectedCountry}
              </p>
              <p className="mb-2">
                <strong>Sport:</strong> {userData.sport}
              </p>
            </div>
          )}
        </div>

        {/* Password Change Form */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex-1">
          <form onSubmit={handlePasswordChange}>
            <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
            <div className="mb-4 relative">
              <label className="block text-sm">Current Password</label>
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm">New Password</label>
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm">Confirm Password</label>
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <button type="submit" className="p-2 bg-blue-500 text-white rounded">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
