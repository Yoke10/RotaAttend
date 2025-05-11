// @ts-nocheck
import React, { useState, useRef } from "react";
import { Rnd } from "react-rnd";
import { ChromePicker } from "react-color";
import { Button } from "./ui/button";
import { UploadCloud } from "lucide-react";

export default function TemplateEditor({ setQr, setTemplateData,file, setFile,template, setTemplate }) {
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
    text: "Name",
  });

  const [clubText, setClubText] = useState("Club");
  const [clubFontSize, setClubFontSize] = useState(20);
  const [clubFontFamily, setClubFontFamily] = useState("Arial");
  const [clubFontColor, setClubFontColor] = useState("#000000");
  const [clubFontWeight, setClubFontWeight] = useState("bold");

  const imageRef = useRef();
  const fileref = useRef();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setTemplate(URL.createObjectURL(selectedFile));
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
      fontSize: clubFontSize,
      fontFamily: clubFontFamily,
      color: clubFontColor,
      fontWeight: clubFontWeight,
      text: clubText,
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
      text: nameLayout.text,
    };
   console.log(scaledLayout);
   console.log(scaledNameLayout);
   console.log(scaledNameLayout);
   console.log(scaledclubLayout);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      setTemplateData(base64Image);
      setQr(scaledLayout, scaledNameLayout, scaledclubLayout);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: 20 }}>
      <div className="flex flex-col items-center justify-center">
        <h2 className="font-bold text-2xl">Upload Template and Position QR Code</h2>
        <input type="file" accept="image/png" onChange={handleFileChange} ref={fileref} style={{ display: 'none' }} />
        <Button className="mt-2" variant="outline" onClick={() => fileref.current.click()}>
          <UploadCloud className="w-4 h-4 mr-2" /> Upload
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {template && (
          <div style={{ position: "relative", marginTop: 20 }}>
            <img
              ref={imageRef}
              src={template}
              alt="Template"
              style={{ width: "100%", maxWidth: 600, border: "1px solid #ccc" }}
            />

            {/* Club Text Box */}
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
                color: clubFontColor,
                fontWeight: clubFontWeight,
                fontFamily: clubFontFamily,
                fontSize: `${clubFontSize/3}px`,
                zIndex: 10, 
              }}
            >
              {clubText}
            </Rnd>

            {/* QR Code Box */}
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

            {/* Name Text Box */}
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
              <divconsole.log('TemplateEditor component rendered');
console.log('File uploaded:', file);
console.log('Template data:', template);
console.log('Layout:', layout);
console.log('Club layout:', clublayout);
console.log('Name layout:', nameLayout);
console.log('Club text:', clubText);
console.log('Club font size:', clubFontSize);
console.log('Club font family:', clubFontFamily);
console.log('Club font color:', clubFontColor);
console.log('Club font weight:', clubFontWeight);
console.log('Name text:', nameLayout.text);
console.log('Name font size:', nameLayout.fontSize);
console.log('Name font family:', nameLayout.fontFamily);
console.log('Name font weight:', nameLayout.fontWeight);
console.log('Name color:', nameLayout.color);
               style={{ fontSize: `${nameLayout.fontSize/2}px`, fontFamily: nameLayout.fontFamily, fontWeight: nameLayout.fontWeight, color: nameLayout.color }}
               >
                {nameLayout.text}
              </divconsole.log>
            </Rnd>
          </div>
        )}

        {template && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg">Club Text Settings</h3>
              <input type="text" value={clubText} onChange={(e) => setClubText(e.target.value)} className="border px-2 py-1 w-full" placeholder="Club Text" />
              <input type="number" value={clubFontSize} onChange={(e) => setClubFontSize(Number(e.target.value))} className="border px-2 py-1 w-full" placeholder="Font Size" />
              <input type="text" value={clubFontFamily} onChange={(e) => setClubFontFamily(e.target.value)} className="border px-2 py-1 w-full" placeholder="Font Family" />
              <select className="border px-2 py-1 w-full" value={clubFontWeight} onChange={(e) => setClubFontWeight(e.target.value)}>
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
              </select>
              <ChromePicker color={clubFontColor} onChangeComplete={(color) => setClubFontColor(color.hex)} />
              {/* <div className="flex gap-4">
                <input type="number" value={clublayout.width} 
                 onChange={(e) =>
                  setClubLayout((prevState) => ({
                    ...prevState,
                    width: parseInt(e.target.value),
                  }))} className="border px-2 py-1 w-full" placeholder="Width" />
                <input type="number" value={clublayout.height} onChange={(e) => setClubLayout({ ...clublayout, height: parseInt(e.target.value) })} className="border px-2 py-1 w-full" placeholder="Height" />
              </div> */}
            </div>

            <div>
              <h3 className="font-semibold text-lg">Name Text Settings</h3>
              <input type="text" value={nameLayout.text} onChange={(e) => setNameLayout({ ...nameLayout, text: e.target.value })} className="border px-2 py-1 w-full" />
              <input type="number" value={nameLayout.fontSize} onChange={(e) => setNameLayout({ ...nameLayout, fontSize: Number(e.target.value) })} className="border px-2 py-1 w-full" placeholder="Font Size" />
              <input type="text" value={nameLayout.fontFamily} onChange={(e) => setNameLayout({ ...nameLayout, fontFamily: e.target.value })} className="border px-2 py-1 w-full" placeholder="Font Family" />
              <select className="border px-2 py-1 w-full" value={nameLayout.fontWeight} onChange={(e) => setNameLayout({ ...nameLayout, fontWeight: e.target.value })}>
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
              </select>
              <ChromePicker color={nameLayout.color} onChangeComplete={(color) => setNameLayout({ ...nameLayout, color: color.hex })} />
              {/* <div className="flex gap-4">
                <input type="number" value={nameLayout.width} onChange={(e) => setNameLayout({ ...nameLayout, width: parseInt(e.target.value) })} className="border px-2 py-1 w-full" placeholder="Width" />
                <input type="number" value={nameLayout.height} onChange={(e) => setNameLayout({ ...nameLayout, height: parseInt(e.target.value) })} className="border px-2 py-1 w-full" placeholder="Height" />
              </div> */}
            </div>
          </div>
        )}
      </div>

      {template && (
        <Button className="mt-4" onClick={handleExport}>
          Export QR Layout
        </Button>
      )}
    </div>
  );
}
