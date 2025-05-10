import React, { useState, useRef } from "react";
import { Rnd } from "react-rnd";
import { ChromePicker } from "react-color";

export default function TemplateEditor({ setQr, setTemplateData }) {
  const [template, setTemplate] = useState(null);
  const [layout, setLayout] = useState({ x: 50, y: 50, width: 150, height: 150 });
  const [clublayout, setClubLayout] = useState({ x: 50, y: 50, width: 150, height: 150 });
  const [nameLayout, setNameLayout] = useState({
    x: 100,
    y: 200,
    width: 200,
    height: 40,
    fontSize: 24,
    fontFamily: "Arial",
    color: "#000000",
    fontWeight: "normal",
  });

  const imageRef = useRef();
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // Save the actual file
      setTemplate(URL.createObjectURL(selectedFile)); // For preview
    }
  };

  const handleExport = () => {
    if (!file || !imageRef.current) {
      alert("Please provide file");
      return;
    }

    const img = imageRef.current;
    const scaleX = img.naturalWidth / img.clientWidth;
    const scaleY = img.naturalHeight / img.clientHeight;

    const scaledLayout = {
      x: Math.round(layout.x * scaleX),
      y: Math.round(layout.y * scaleY),
      width: Math.round(layout.width * scaleX),
      height: Math.round(layout.height * scaleY),
    };
    const scaledclubLayout = {
      x: Math.round(clublayout.x * scaleX),
      y: Math.round(clublayout.y * scaleY),
      width: Math.round(clublayout.width * scaleX),
      height: Math.round(clublayout.height * scaleY),
    };
    const scaledNameLayout = {
      x: Math.round(nameLayout.x * scaleX),
      y: Math.round(nameLayout.y * scaleY),
      width: Math.round(nameLayout.width * scaleX),
      height: Math.round(nameLayout.height * scaleY),
      fontSize: nameLayout.fontSize,
      fontFamily: nameLayout.fontFamily,
      color: nameLayout.color,
      fontWeight: nameLayout.fontWeight,
    };

    console.log(scaledclubLayout);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      setTemplateData(base64Image);
      setQr(scaledLayout, scaledNameLayout,scaledclubLayout); // Send scaled layout
    };

    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload Template and Position QR Code</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {template && (
        <div style={{ position: "relative", marginTop: 20 }}>
          <img
            ref={imageRef}
            src={template}
            alt="Template"
            style={{ width: "100%", maxWidth: 600, border: "1px solid #ccc" }}
          />

          {/* Club Layout */}
          <Rnd
            size={{ width: clublayout.width, height: clublayout.height }}
            position={{ x: clublayout.x, y: clublayout.y }}
            onDragStop={(e, d) => setClubLayout({ ...clublayout, x: d.x, y: d.y })}
            onResizeStop={(e, direction, ref, delta, position) => {
              setClubLayout({
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                ...position,
              });
            }}
            bounds="parent"
            style={{
              border: "2px dashed #333",
              backgroundColor: "rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#333",
              fontWeight: "bold",
              zIndex: 10,
            }}
          >
            Club
          </Rnd>

          {/* QR Code Layout */}
          <Rnd
            size={{ width: layout.width, height: layout.height }}
            position={{ x: layout.x, y: layout.y }}
            onDragStop={(e, d) => setLayout({ ...layout, x: d.x, y: d.y })}
            onResizeStop={(e, direction, ref, delta, position) => {
              setLayout({
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                ...position,
              });
            }}
            bounds="parent"
            style={{
              border: "2px dashed #333",
              backgroundColor: "rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#333",
              fontWeight: "bold",
              zIndex: 10,
            }}
          >
            QR Code
          </Rnd>

          {/* Name Layout */}
          <Rnd
            size={{ width: nameLayout.width, height: nameLayout.height }}
            position={{ x: nameLayout.x, y: nameLayout.y }}
            onDragStop={(e, d) => setNameLayout({ ...nameLayout, x: d.x, y: d.y })}
            onResizeStop={(e, direction, ref, delta, position) => {
              setNameLayout({
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                ...position,
              });
            }}
            bounds="parent"
            style={{
              border: "2px dotted #007bff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <div className="flex justify-center items-center bg-transparent h-40 mb-4">
              <span
                className="text-center"
                style={{
                  fontSize: `${nameLayout.fontSize}px`,
                  fontFamily: nameLayout.fontFamily,
                  fontWeight: nameLayout.fontWeight,
                  color: nameLayout.color,
                }}
              >
                {"Text"}
              </span>
            </div>
          </Rnd>
        </div>
      )}

      {template && (
        <button style={{ marginTop: 20 }} onClick={handleExport}>
          Export QR Layout
        </button>
      )}
    </div>
  );
}
