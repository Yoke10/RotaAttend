import React, { useState, useRef } from "react";
import { Rnd } from "react-rnd";

export default function TemplateEditor({setQr,setTemplateData}) {
  const [template, setTemplate] = useState(null);
  const [layout, setLayout] = useState({ x: 50, y: 50, width: 150, height: 150 });
  const imageRef = useRef();
  const [file, setFile] = useState(null);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // <-- Save the actual file
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
  
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      setTemplateData(base64Image);
      setQr(scaledLayout); // Send scaled layout
    };
  
    reader.readAsDataURL(file);
  };
  

  return (<div style={{ padding: 20 }}>
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
