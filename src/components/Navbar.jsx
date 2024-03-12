import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState, useRef } from "react";

function Navbar() {
  const [userPhoto, setUserPhoto] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !event.target.classList.contains("menu")
    ) {
      setShowSidebar(false);
    }
  };

  const handleShowSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleLogOut = () => {
    localStorage.clear();
    window.location.reload();
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      try {
        if (user) {
          const { displayName, photoURL } = user;
          setDisplayName(displayName);
          setUserPhoto(photoURL);
          localStorage.setItem("displayName", displayName);
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
      }
    });

    document.addEventListener("click", handleClickOutside);

    return () => {
      unsubscribe();
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar bg-base-100 fixed z-[999] font-Montserrat">
      <div className="navbar-start">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle menu"
            onClick={handleShowSidebar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="navbar-center">
        <h1 className="text-[30px] font-semibold pb-[10px]">
          <span className="text-[#9668fe]">FI</span>{" "}
          <span className="text-[#0ae0eb]">CHAT</span>
        </h1>
      </div>
      <div className="navbar-end">
        <button className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>

      {/* Left Sidebar */}
      {showSidebar && (
        <div
          className="sidebar absolute top-0 left-0 h-[100vh] max-w-[300px] bg-base-200 p-4 flex flex-col z-[999]"
          ref={dropdownRef}
        >
          {/* Close button */}
          <button className="close-button" onClick={handleShowSidebar}>
            <span className="X"></span>
            <span className="Y"></span>
          </button>
          {/* Close button end */}
          <div className="flex items-center mb-4 mt-8">
            {userPhoto && (
              <img
                src={userPhoto}
                alt="User Photo"
                className="rounded-full w-12 h-12 mr-2 cursor-pointer"
              />
            )}
            <div>
              <h3 className="text-lg font-semibold">{displayName}</h3>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>
          <ul className="menu">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Messages</a>
            </li>
            <li>
              <a href="#" className="text-red-500" onClick={handleLogOut}>
                Chiqish
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Navbar;
