import React, { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getFirestore,
  getDoc,
  onSnapshot,
  collection,
  addDoc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { auth, app } from "../firebase/store";
import Messages from "../components/Messages";
import Navbar from "../components/Navbar";
import chatIMG from "../assets/chat.png";
import googleIMG from "../assets/google.png";
import Aos from "aos";
import Wrapper from "../layout/Wrapper";
const db = getFirestore(app);

function GoogleProvider() {
  const [user, setUser] = useState("");

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const data = await signInWithPopup(auth, provider);
      setUser(data.user);
      localStorage.setItem(
        "users",
        JSON.stringify({ uid: data.user.uid, email: data.user.email })
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("users"));
    setUser(storedUser);
  }, []);

  Aos.init({
    duration: 400,
    offset: 100,
    easing: "ease-in-out",
    once: true,
  });

  return (
    <div>
      {user ? (
        <>
          <Navbar user={user} setUser={setUser} />
          <Messages
            doc={doc}
            setDoc={setDoc}
            getDoc={getDoc}
            onSnapshot={onSnapshot}
            collection={collection}
            addDoc={addDoc}
            orderBy={orderBy}
            query={query}
            serverTimestamp={serverTimestamp}
            onAuthStateChanged={onAuthStateChanged}
            db={db}
            auth={auth}
          />
        </>
      ) : (
        <div
          data-aos="fade-right"
          data-aos-offset="300"
          data-aos-easing="ease-in-sine"
        >
          <Wrapper>
            <div className="max-w-[400px] p-[20px] h-auto relative top-[150px] flex justify-center items-center m-auto rounded-[20px] border-[#191e24] border">
              <div className="flex flex-col items-center justify-center font-Montserrat">
                <img src={chatIMG} alt="chat png" className="w-[200px]" />
                <h1 className="text-[30px] font-semibold pb-[10px]">
                  <span className="text-[#9668fe]">FI</span>{" "}
                  <span className="text-[#0ae0eb]">CHAT</span>
                </h1>
                <button
                  onClick={handleGoogleLogin}
                  className="btn flex justify-center items-center w-full"
                >
                  <img src={googleIMG} alt="google png" className="w-[40px]" />
                  Tizimga kirish
                </button>
              </div>
            </div>
          </Wrapper>
        </div>
      )}
    </div>
  );
}

export default GoogleProvider;
