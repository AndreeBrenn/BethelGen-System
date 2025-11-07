import React, { useEffect, useRef, useState } from "react";
import { Designer } from "@pdfme/ui";
import { BLANK_A4_PDF } from "@pdfme/common";
import {
  text,
  multiVariableText,
  image,
  barcodes,
  line,
  rectangle,
  ellipse,
  svg,
  table,
  select,
  date,
  time,
  dateTime,
  radioGroup,
  checkbox,
} from "@pdfme/schemas";
import { MdSave, MdVisibility, MdDescription } from "react-icons/md";
import { handleApiError } from "../../utils/HandleError";
import usePrivateAxios from "../../hooks/useProtectedAxios";

const DocumentSettings = () => {
  const designerRef = useRef(null);
  const designerInstance = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [filename, setFilename] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [fieldCount, setFieldCount] = useState(0);
  const [pdfInput, setPdfInput] = useState(null);

  const axiosPrivate = usePrivateAxios();

  useEffect(() => {
    const template = {
      basePdf: pdfInput || BLANK_A4_PDF,
      schemas: [{}],
    };

    const font = {
      Roboto: {
        data: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf",
        fallback: true,
      },
      Montserrat: {
        data: "https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wlhyw.ttf",
      },
      "Open Sans": {
        data: "https://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0C4nY1M2xLER.ttf",
      },
      Lato: {
        data: "https://fonts.gstatic.com/s/lato/v23/S6uyw4BMUTPHjx4wXiWtFCc.ttf",
      },
      Poppins: {
        data: "https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.ttf",
      },
      "Noto Sans": {
        data: "https://fonts.gstatic.com/s/notosans/v30/o-0IIpQlx3QUlC5A4PNr5TRASf6M7Q.ttf",
      },
    };

    const plugins = {
      text,
      multiVariableText,
      image,
      qrcode: barcodes.qrcode,
      line,
      rectangle,
      ellipse,
      svg,
      table,
      select,
      date,
      time,
      dateTime,
      radioGroup,
      checkbox,
    };

    if (designerRef.current) {
      const designer = new Designer({
        domContainer: designerRef.current,
        template: template,
        plugins: plugins,
        options: {
          font: font,
        },
      });

      designerInstance.current = designer;
      setIsReady(true);

      // Listen for schema changes to update field count
      const interval = setInterval(() => {
        if (designerInstance.current) {
          const schema = designerInstance.current.getTemplate();
          const count = schema.schemas?.[0]
            ? Object.keys(schema.schemas[0]).length
            : 0;
          setFieldCount(count);
        }
      }, 1000);

      return () => {
        clearInterval(interval);
        if (designerInstance.current) {
          designerInstance.current.destroy();
        }
      };
    }
  }, [pdfInput]);

  const handleGetSchema = () => {
    if (designerInstance.current) {
      const schema = designerInstance.current.getTemplate();
      console.log("Current Schema:", schema);
      console.log("Schema JSON:", JSON.stringify(schema, null, 2));
      alert("Schema logged to console! Check browser console (F12)");
    } else {
      alert("Designer not ready yet");
    }
  };

  const handleSaveToDatabase = async () => {
    if (!filename.trim()) {
      setMessageType("error");
      setSaveMessage("⚠️ Please enter a filename");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }

    if (!isReady || !designerInstance.current) {
      setMessageType("error");
      setSaveMessage("⚠️ Designer not ready yet");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }

    setIsSaving(true);
    setSaveMessage("");

    try {
      const schema = designerInstance.current.getTemplate();

      const hasFields =
        schema.schemas &&
        schema.schemas.length > 0 &&
        Object.keys(schema.schemas[0]).length > 0;

      if (!hasFields) {
        setMessageType("error");
        setSaveMessage("⚠️ Please add at least one field to the template");
        setIsSaving(false);
        setTimeout(() => setSaveMessage(""), 3000);
        return;
      }

      const dataToSave = {
        File_name: filename.trim(),
        Schema: schema,
      };

      const response = axiosPrivate.post(
        "/Documents/create-document",
        dataToSave
      );

      console.log(response);
      setMessageType("success");
      setSaveMessage("✅ Template saved successfully!");
      console.log("Saved to database:", result);

      setTimeout(() => {
        setFilename("");
        setSaveMessage("");
      }, 3000);
    } catch (error) {
      console.log(error);
      handleApiError(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <MdDescription className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Template Designer
              </h1>
              <p className="text-slate-500 mt-1">
                Create and customize PDF templates
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleGetSchema}
              disabled={!isReady}
              className="flex items-center space-x-2 px-6 py-3 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdVisibility className="text-xl" />
              <span>Preview Schema</span>
            </button>
            <button
              onClick={handleSaveToDatabase}
              disabled={isSaving || !isReady}
              className="flex items-center space-x-2 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdSave className="text-xl" />
              <span>{isSaving ? "Saving..." : "Save Template"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">
            Designer Status
          </div>
          <div
            className={`text-2xl font-bold ${
              isReady ? "text-green-600" : "text-slate-400"
            }`}
          >
            {isReady ? "Ready" : "Loading..."}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">
            Fields Added
          </div>
          <div className="text-2xl font-bold text-blue-600">{fieldCount}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">
            Available Types
          </div>
          <div className="text-2xl font-bold text-slate-800">15</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">
            Template Size
          </div>
          <div className="text-2xl font-bold text-slate-800">A4</div>
        </div>
      </div>

      {/* Filename Input Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Template Filename <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="e.g., invoice-template, certificate-2024"
          disabled={isSaving}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-slate-50 disabled:cursor-not-allowed text-slate-800"
        />
        <p className="text-slate-500 text-sm mt-2">
          💡 Use a descriptive name to identify your template in the database
        </p>

        {/* Save Message */}
        {saveMessage && (
          <div
            className={`mt-4 px-4 py-3 rounded-lg border font-medium ${
              messageType === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {saveMessage}
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Upload Template File <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept=".pdf"
          onChange={async (e) => {
            const file = e.target.files[0];

            if (file) {
              const reader = new FileReader();

              reader.onload = (e) => {
                // The result property contains the data as a URL representing the file's data as a base64 encoded string.
                setPdfInput(e.target.result);
              };

              reader.onerror = (error) => {
                console.error("Error reading file:", error);
              };

              // Read the file as a data URL
              reader.readAsDataURL(file);
            }
          }}
          className="w-full text-slate-800 border border-slate-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
        />
        <p className="text-slate-500 text-sm mt-2">
          📎 Supported formats: PDF, DOCX, PNG, JPG
        </p>
      </div>

      {/* Designer Container */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div ref={designerRef} className="w-full h-[600px]" />
      </div>

      {/* Field Types Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          📌 Available Field Types
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            "Text",
            "Multi-variable Text",
            "Image",
            "QR Code",
            "Line",
            "Rectangle",
            "Ellipse",
            "SVG",
            "Table",
            "Select",
            "Date",
            "Time",
            "DateTime",
            "Radio Group",
            "Checkbox",
          ].map((type) => (
            <div
              key={type}
              className="flex items-center space-x-2 text-sm text-slate-700"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentSettings;
