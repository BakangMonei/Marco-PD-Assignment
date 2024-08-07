import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, firestore } from '../database/firebase';
import sportsData  from '../database/data';
import SideBar from '../components/sidebar/SideBar';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'; // Icons for "Add to Fav"

const UserDashboard = () => {
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
        const docRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFavorites(docSnap.data().favorites || []);
        }
      };
      fetchFavorites();
    }
  }, [user]);

  const handleFavClick = async (id) => {
    if (user) {
      const docRef = doc(firestore, 'users', user.uid);
      const isFavorite = favorites.includes(id);

      if (isFavorite) {
        // Remove from favorites
        await setDoc(docRef, { favorites: arrayRemove(id) }, { merge: true });
        setFavorites(favorites.filter(fav => fav !== id));
      } else {
        // Add to favorites
        await setDoc(docRef, { favorites: arrayUnion(id) }, { merge: true });
        setFavorites([...favorites, id]);
      }
    } else {
      console.log('User is not logged in');
    }
  };

  return (
    <>
      <SideBar />
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Landing Page</h1>
        {Object.keys(sportsData).map(category => (
          <section key={category} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{category}</h2>
            <Carousel
              showThumbs={false}
              showStatus={false}
              infiniteLoop
              autoPlay
              interval={3000}
              className="carousel-container"
            >
              {sportsData[category].map((sport) => (
                <div key={sport.id} className="relative">
                  <img src={sport.imageUrl} alt={sport.name} className="w-full h-64 object-cover rounded-lg" />
                  <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold">{sport.name}</h2>
                    <p>{sport.venue}</p>
                    <p>{sport.time}</p>
                    <p>{sport.description}</p>
                    <button
                      onClick={() => handleFavClick(sport.id)}
                      className="absolute top-4 right-4"
                    >
                      {favorites.includes(sport.id) ? (
                        <AiFillHeart size={24} className="text-red-500" />
                      ) : (
                        <AiOutlineHeart size={24} className="text-red-500" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </Carousel>
          </section>
        ))}
      </div>
    </>
  );
};

export default UserDashboard;
