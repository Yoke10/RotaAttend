import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { getEventid, updateUser, verifyMagiccLink } from '@/lib/user.action';
import { BrowserMultiFormatReader } from '@zxing/library'; // Import the ZXing library
import { toast ,Bounce} from 'react-toastify';

const Management = () => {
  const { id } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [scanning, setScanning] = useState(false); // controls loader + scan block

  const token = new URLSearchParams(location.search).get("token");
  const videoRef = useRef(null);

  // Check and request camera access
  const requestCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        // Set the camera stream to video element
        videoRef.current.srcObject = stream;
        // Add an event listener to ensure video is ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play(); // Ensure video plays after metadata is loaded
        };
      }
      return stream;
    } catch (err) {
      console.error('Camera permission denied:', err);
      setError("Unable to access the camera. Please enable camera permissions.");
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await verifyMagiccLink(token);
        if (res.status === 200) {
          setVerified(true);
          setUserData(res.data);
          // Validate dates after setting the event
             const ev = await getEventid(res.data.eventId );
    const today = new Date();
    const start = new Date(ev.startDate);
    const end = new Date(ev.endDate);

    if (today < start || today > end) {
      toast.error(
        `Invalid date configuration on event. Current date: ${today.toDateString()}`,
        { position: "top-center" }
      );
    }
        } else {
          setError("Invalid or expired link");
        }
      } catch (err) {
        setError("Server error or invalid token");
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      verifyToken();
    } else {
      setError("Missing token or event ID");
      setLoading(false);
    }
  }, [token, id]);
  const handelScannedData = async (text) => {
    setScanning(true); // show loader
  
    try {
      // Extract email and ID from the scanned text
      const [email, uid] = text.split("_");
  
      console.log("Scanned Email:", email);
      console.log("Scanned ID:", uid);
      const today = new Date();
      // today.setDate(today.getDate() + 2);
      const res=await updateUser(email,uid,selectedCategory,today);
      console.log(res);         
       if(res.status===200)
       {
        toast.success('✔️ Successfully Processed!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
       }
       if(res.status===201)
        {
            toast.error('❌ Already updated', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
                className: "bg-red-500 text-white", // ensures red background
              });
        }
      // 🔁 Call your API here (replace with real function)
    //   const res = await fetch("/api/confirm", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ email, uid, category: selectedCategory }),
    //   });
  
    //   const data = await res.json();
    //   console.log("API Response:", data);
  
      // ✅ Optionally show success UI/toast
    } catch (err) {
      console.error("Processing failed:", err);
      // ❌ Optionally show error
    } finally {
      setScanning(false); // resume scanning
    }
  };
  
  const handleQrScan = (result) => {
    console.log('scanned');
    console.log(result);
    console.log(result.text);
    handelScannedData(result.text);
  };

  const handleQrError = (err) => {
    // console.error(err);
  };

  useEffect(() => {
    if (verified && selectedCategory) {
      // Start QR code scanning after category selection
      requestCameraAccess();
      if (videoRef.current) {
        const codeReader = new BrowserMultiFormatReader();

      

          codeReader.decodeFromVideoDevice(null, videoRef.current, (result, error) => {
            // console.log('t1');
            if (result && !scanning) {
              handleQrScan(result);
            //   console.log(result);
            }
            if (error) {
              handleQrError(error);
            }
          });
        

        return () => {
          codeReader.reset();
        };
      }
    }
  });

  if (loading) return <div>Loading and verifying token...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-6">Event Management</h1>

      {/* Show Categories Before QR Scanner */}
      {!selectedCategory && verified && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Categories:</h3>
          <ul className="mb-6">
            {userData?.catagories?.map((cat, idx) => (
              <li
                key={idx}
                className={`p-2 rounded-lg mb-2 cursor-pointer ${selectedCategory === cat ? 'bg-blue-200' : 'bg-gray-100'} hover:bg-blue-100`}
                onClick={() => setSelectedCategory(cat)} // Set selected category
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Show QR Scanner After Category Selection */}
      {!scanning&&selectedCategory && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Scan QR Code to Confirm Category</h2>
          <div className="mt-4 border border-gray-300 p-4 rounded-lg">
            {/* Video element to show the live camera stream */}
            <video ref={videoRef} style={{ width: '100%',transform: 'scaleX(-1)' }} />
          </div>
        </div>
      )}
  {scanning && (
  <div className="flex items-center justify-center mt-4 space-x-2">
    <svg className="animate-spin h-6 w-6 text-blue-500" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l4-4-4-4v4a8 8 0 000 16v-4l-4 4 4 4v-4a8 8 0 01-8-8z"/>
    </svg>
    <span className="text-blue-600 font-medium">Processing...</span>
  </div>
)}

      {/* Show selected category */}
      {selectedCategory && (
        <div className="bg-blue-100 p-3 rounded-md">
          <p className="text-lg font-semibold">Selected Category: {selectedCategory}</p>
        </div>
      )}
    </div>
  );
};

export default Management;
