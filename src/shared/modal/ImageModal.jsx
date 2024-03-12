import React from "react";

function ImageModal({
  handleFileChange,
  selectedImage,
  handleImageUpload,
  handleCloseImageModal,
}) {
  return (
    <>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Rasm yuborish uchun!</h3>
          <div>
            <input type="file" onChange={handleFileChange} />
            {selectedImage && (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
                className="mt-2"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            )}
          </div>
          <button className="btn" onClick={handleImageUpload}>
            Jo'natish
          </button>
        </div>
      </dialog>
    </>
  );
}

export default ImageModal;
