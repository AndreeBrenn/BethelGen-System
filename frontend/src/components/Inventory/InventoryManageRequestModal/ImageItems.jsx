import React from "react";

const ImageItems = ({ itemData }) => {
  return (
    <>
      <div className="bg-white flex flex-col border border-gray-200 rounded-lg p-5 mb-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Uploaded Images
        </h3>
        {itemData.Item_image == null && (
          <span className="text-center w-full p-5">No image</span>
        )}
        <div className="grid grid-cols-4 gap-3">
          {itemData.Item_image?.map((image, index) => (
            <div key={index} className="relative group">
              <a
                href={"/server" + image}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={"/server" + image}
                  alt={`Image ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ImageItems;
