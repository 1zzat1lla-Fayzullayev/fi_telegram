import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";

function UserProfile({ userId, onClose }) {
  const [userData, setUserData] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnapshot = await getDoc(userDocRef);

        console.log("User Doc Snapshot:", userDocSnapshot);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          console.log("User Data:", userData);
          setUserData(userData);
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId, db]);

  console.log("User ID:", userId);

  return (
    <div>
      <div className="user-profile-modal mb-[100px]">
        {userData ? (
          <>
            <h2>{userData.displayName}</h2>
            <p>Email: {userData.email}</p>
          </>
        ) : (
          <p>Loading user details...</p>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default UserProfile;
