import React, { useState, useEffect } from "react";
import { auth, firestore } from "../database/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          // Fetch user data from Firestore based on email
          const email = auth.currentUser.email;
          const userQuery = query(
            collection(firestore, "users"),
            where("email", "==", email)
          );
          const userSnapshot = await getDocs(userQuery);

          if (!userSnapshot.empty) {
            const userDoc = userSnapshot.docs[0]; // Assuming email is unique
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

  const handlePasswordChange = async () => {
    try {
      await auth.currentUser.updatePassword(newPassword);
      alert("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6">User Profile</h1>
        <div className="bg-white shadow-lg rounded-lg p-6">
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
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mb-4 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
        <button
          onClick={handlePasswordChange}
          className="py-2 px-4 bg-green-500 text-white rounded-md shadow-sm"
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
