import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../database/firebase";
import sportsData from "../database/data";

const UserFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch current user
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      // Fetch favorite sports for the current user
      const fetchFavorites = async () => {
        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFavorites(docSnap.data().favorites || []);
        }
      };
      fetchFavorites();
    }
  }, [user]);

  return (
    <div className="p-6  min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">User Favorites</h1>
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" draggable='true'>
          {favorites.map((id) => {
            const sport = Object.values(sportsData)
              .flat()
              .find((sport) => sport.id === id);
            return sport ? (
              <div
                key={id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  src={sport.imageUrl}
                  alt={sport.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{sport.name}</h2>
                  <p className="text-gray-600 mb-1">
                    <strong>Venue:</strong> {sport.venue}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>Time:</strong> {sport.time}
                  </p>
                  <p className="text-gray-600">
                    <strong>Description:</strong> {sport.description}
                  </p>
                </div>
              </div>
            ) : null;
          })}
        </div>
      ) : (
        <p className="text-center text-gray-600">No favorites yet.</p>
      )}
    </div>
  );
};

export default UserFavorites;
