import React, { useEffect, useRef, useState } from "react";
import { Designer } from "@pdfme/ui";
//import { Template } from "@pdfme/common";
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

const DocumentSettings = () => {
  const designerRef = useRef(null);
  const designerInstance = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initial template with a blank base PDF or your own base64 PDF
    const template = {
      basePdf: BLANK_A4_PDF,
      schemas: [
        {
          // Start with an empty schema - user will add fields via the designer UI
        },
      ],
    };

    // Plugin schemas - these enable all the field types in the designer
    const plugins = {
      text,
      multiVariableText,
      image,
      qrcode: barcodes.qrcode,

      line,
      rectangle,
      ellipse,
      svg,
      table, // Dynamic tables!
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
        plugins: plugins, // This is the key - it enables all field types!
      });

      designerInstance.current = designer;
      setIsReady(true);
    }

    // Cleanup
    return () => {
      if (designerInstance.current) {
        designerInstance.current.destroy();
      }
    };
  }, []);

  const handleGetSchema = () => {
    if (designerInstance.current) {
      const schema = designerInstance.current.getTemplate();
      console.log("Current Schema:", schema);
      console.log("Schema JSON:", JSON.stringify(schema, null, 2));
    } else {
      console.log("Designer not ready yet");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1>PDF Designer</h1>
        <button
          onClick={handleGetSchema}
          style={{
            padding: "10px 20px",
            backgroundColor: "#0066cc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Console.log Schema
        </button>
        {isReady && (
          <span style={{ marginLeft: "10px", color: "green" }}>
            ✓ Designer Ready
          </span>
        )}
      </div>

      <div
        ref={designerRef}
        style={{
          width: "100%",
          height: "600px",
          border: "1px solid #ccc",
        }}
      />
    </div>
  );
};

export default DocumentSettings;
