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
        <div className="modal-box flex flex-col gap-3">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Rasm yuborish uchun!</h3>
          <div>
            <div className="grid w-full max-w-xs items-center gap-[10px]">
              <input
                id="picture"
                type="file"
                className="flex h-10 w-full rounded-md border border-[#191e24] px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
                onChange={handleFileChange}
              />
            </div>
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
