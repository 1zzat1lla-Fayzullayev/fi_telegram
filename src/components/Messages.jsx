import React, { useEffect, useRef, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { format } from "date-fns";
import Wrapper from "../layout/Wrapper";
import UserProfile from "../pages/UserProfile";
import ImageModal from "../shared/modal/ImageModal";
import Aos from "aos";

function Messages({
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
  onAuthStateChanged,
  db,
  auth,
}) {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const storage = getStorage();
  const sendMessageDivRef = useRef(null);

  useEffect(() => {
    Aos.refresh();
  }, [messages]);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
    return unsubscribe;
  }, [db, onSnapshot, orderBy]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const sendMessage = async () => {
    try {
      if (newMessage.trim() === "" && !selectedImage) {
        return;
      }

      let imageUrl = null;

      if (selectedImage) {
        const storageRef = ref(storage, `images/${selectedImage.name}`);
        await uploadBytes(storageRef, selectedImage);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "messages"), {
        uid: user.uid,
        photoURL: user.photoURL,
        displayName: user.displayName,
        text: newMessage,
        imageUrl: imageUrl,
        timestamp: serverTimestamp(),
      });

      setNewMessage("");
      setSelectedImage(null);
      // Scroll to last message
      if (sendMessageDivRef.current) {
        sendMessageDivRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const openUserProfile = (userId) => {
    setSelectedUserProfile(userId);
  };

  const closeUserProfile = () => {
    setSelectedUserProfile(null);
  };

  const handleOpenImageModal = () => {
    setIsImageModalOpen(true);
    document.getElementById("my_modal_3").showModal();
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
  };

  const handleImageUpload = async () => {
    try {
      const storageRef = ref(storage, `images/${selectedImage.name}`);
      await uploadBytes(storageRef, selectedImage);
      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, "messages"), {
        uid: user.uid,
        photoURL: user.photoURL,
        displayName: user.displayName,
        text: newMessage,
        imageUrl: imageUrl,
        timestamp: serverTimestamp(),
      });

      setNewMessage("");
      setSelectedImage(null);

      handleCloseImageModal();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="pt-[30px]">
      <div className="messageBox fixed bottom-0 z-[888] w-full">
        <div className="flex justify-center items-center">
          <div className="fileUploadWrapper absolute left-[10px] top-[50%] transform translate-y-[-50%]"></div>
          {/* Modal */}

          <div onClick={handleOpenImageModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 337 337"
              className="w-[20px] cursor-pointer"
            >
              <circle
                strokeWidth="20"
                stroke="#6c6c6c"
                fill="none"
                r="158.5"
                cy="168.5"
                cx="168.5"
              ></circle>
              <path
                strokeLinecap="round"
                strokeWidth="25"
                stroke="#6c6c6c"
                d="M167.759 79V259"
              ></path>
              <path
                strokeLinecap="round"
                strokeWidth="25"
                stroke="#6c6c6c"
                d="M79 167.138H259"
              ></path>
            </svg>
          </div>

          <ImageModal
            handleFileChange={handleFileChange}
            selectedImage={selectedImage}
            handleImageUpload={handleImageUpload}
            handleCloseImageModal={handleCloseImageModal}
          />
          {/* Modal / */}

          <input
            required=""
            placeholder="Message..."
            type="text"
            id="messageInput"
            value={newMessage}
            className="w-full ml-[16px] mb-[3px] relative"
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <button
          id="sendButton"
          onClick={sendMessage}
          className="absolute right-[10px] top-[50%] transform translate-y-[-50%]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 664 663"
          >
            <path
              fill="none"
              d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
            ></path>
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="33.67"
              stroke="#6c6c6c"
              d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
            ></path>
          </svg>
        </button>
      </div>
      <Wrapper>
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className={`${msg.data.uid === user?.uid ? "current" : "other"}`}
          >
            <div
              ref={index === messages.length - 1 ? sendMessageDivRef : null}
              className="chat chat-start"
              data-aos="fade-right"
            >
              <div className="flex justify-center items-start flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-3 relative">
                    <div className="chat-image avatar">
                      <div className="w-10 rounded-full">
                        <img
                          src={msg.data.photoURL}
                          alt={msg.data.displayName}
                          className="cursor-pointer"
                          onClick={() => openUserProfile(msg.data.uid)}
                        />
                      </div>
                    </div>
                    <div className="chat-bubble relative">
                      <div className="min-w-[120px] flex flex-col whitespace-pre-wrap gap-2 pb-[10px] pr-[25px]">
                        <p className="text-white font-semibold font-Montserrat border-b border-[#80808033]">
                          {msg.data.displayName}
                        </p>
                        <p>{msg.data.text}</p>
                      </div>
                      <time className="text-xs opacity-50 absolute bottom-1 right-2 pl-[10px]">
                        {msg.data.timestamp?.toDate() &&
                          format(msg.data.timestamp.toDate(), "HH:mm")}
                      </time>
                    </div>
                  </div>
                </div>
                <div className="bg-[#2a323c] rounded-[20px]">
                  {msg.data.imageUrl && (
                    <img
                      src={msg.data.imageUrl}
                      alt="Sent"
                      className="max-w-[200px] md:max-w-[300px] rounded-[20px] cursor-pointer"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Wrapper>
      {/* UserProfileModal component */}
      {selectedUserProfile && (
        <UserProfile userId={selectedUserProfile} onClose={closeUserProfile} />
      )}
    </div>
  );
}

export default Messages;
