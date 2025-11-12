import React, { useEffect } from "react";
import { FaImage, FaTimes, FaUpload, FaUser } from "react-icons/fa";

const AssignSignatoriesDocument = ({
  setSignatoriesSelected,
  autoSignatureSelected,
  setUploadedFiles,
  uploadedFiles,
}) => {
  useEffect(() => {
    const setTheSignatory = () => {
      const signatoryData = autoSignatureSelected.map((data) => {
        return {
          ID: data.User_ID,
          Name: data.Name,
          Date: null,
          Order: data.Order,
          Position: data.Position,
          Role: data.Role,
          Status: "Pending",
        };
      });

      setSignatoriesSelected(signatoryData);
    };

    if (autoSignatureSelected && autoSignatureSelected.length > 0) {
      setTheSignatory();
    }
  }, [autoSignatureSelected]);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaUser className="text-blue-600" />
          Assign Signatories
        </h3>
        <div className="space-y-4">
          {autoSignatureSelected
            .sort((a, b) => a.Order - b.Order)
            .map((data, index) => (
              <div key={data.ID || index}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {data.Order === 1 && "First Signatory"}
                  {data.Order === 2 && "Second Signatory"}
                  {data.Order === 3 && "Third Signatory"}
                  {data.Order > 3 && `Signatory ${data.Order}`}
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                  {data.Name} - {data.Position}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Upload Image */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaUpload className="text-blue-600" />
          Upload Supporting Document
        </h3>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={(e) => {
                const newFiles = Array.from(e.target.files);
                setUploadedFiles((prev) => [...prev, ...newFiles]);
                // Reset input value so same file can be selected again
                e.target.value = "";
              }}
              className="hidden"
              multiple
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <FaUpload className="text-4xl text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
            </label>
          </div>

          {/* File Preview List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Uploaded Files ({uploadedFiles.length})
              </p>
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* File Icon or Image Preview */}
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-12 h-12 object-cover rounded border border-gray-300"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                        <FaImage className="text-blue-600 text-xl" />
                      </div>
                    )}

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => {
                      setUploadedFiles((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                    }}
                    className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Remove file"
                  >
                    <FaTimes className="text-lg" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AssignSignatoriesDocument;
