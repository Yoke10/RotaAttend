import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { creatMagiccLink, getEventid, SendQr } from "@/lib/user.action";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud, UserX2, Users, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import * as XLSX from "xlsx"; 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import TemplateEditor from '../components/TemplateEditor'
import { toast } from "react-toastify";
import Analysis from '../components/Analysis'
import Nav from "../components/Nav";
import { handel_Remove_Admin } from "../lib/user.action";
import EmailEditor from "../components/EmailEditor";
const EvenPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState();
  const [email, setEmail] = useState("");
  const [hours, setHours] = useState("");
  const [comment, setComment] = useState("");
  const [magicLinks, setMagicLinks] = useState([]);
  const [x,setX]=useState('');
  const [y,setY]=useState('');
  const [width,setWidth]=useState('');
  const [height,setHeight]=useState('');
  const [templateData,setTemplateData]=useState('');
  const [nameLayout, setNameLayout] = useState();
  const [clubLayout,setclubLayout]=useState();
  const [eventM,seteventM]=useState(true);
  const [templateM,settemplateM]=useState(false);
  const [analysisM,setanalysisM]=useState(false);
  const navigate=useNavigate();
  const Userref=useRef();
  const [file, setFile] = useState(null);
  const [template, setTemplate] = useState(null);
  const [loading,setLoading] = useState(false);
  const [toggler,setToggler] = useState(false);


const onOpenEvent=()=>{
  seteventM(true);
  settemplateM(false);
  setanalysisM(false);

}
const onOpenTemplate=()=>{
  seteventM(false);
  settemplateM(true);
  setanalysisM(false);

}
const onOpenAnalaysis=()=>{
  seteventM(false);
  settemplateM(false);
  setanalysisM(true);

}
const setQr=(data,scaledNameLayout,scaledclubLayout)=>{
    setX(data.x);
    setY(data.y);
    setHeight(data.height);
    setclubLayout(scaledclubLayout);
    setWidth(data.width);
    setNameLayout(scaledNameLayout);
    console.log(x);
    console.log(y);

    console.log(width);

    console.log(height);

}


  useEffect(() => {
    const get = async () => {
      const ev = await getEventid(id);
      setEvent(ev);
       
    };
    get();
  }, [id,toggler]);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAddMagicLink = () => {
    if (!isValidEmail(email)) return alert("Invalid email");
    if (!hours || isNaN(Number(hours))) return alert("Hours must be a number");

    const newEntry = { email, hours, comment };
    setMagicLinks((prev) => [...prev, newEntry]);

    // Clear inputs
    setEmail("");
    setHours("");
    setComment("");
  };

  const handleRemove = (index) => {
    setMagicLinks((prev) => prev.filter((_, i) => i !== index));
  };
  const [excelData, setExcelData] = useState([]); // ← Add state to store Excel rows

  if (!event) return <div className="p-10">Loading...</div>;

  const handleExcelUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result);
      const workbook = XLSX.read(data, { type: "array" });
  
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rawJson = XLSX.utils.sheet_to_json(sheet);
  
      // Trim and lowercase keys
      const cleanedJson = rawJson.map((row) => {
        const trimmedRow= {};
        for (const key in row) {
          const normalizedKey = key.trim().toLowerCase(); // ← lowercased column names
          const value = row[key];
          trimmedRow[normalizedKey] =
            typeof value === "string" ? value.trim() : value;
        }
        return trimmedRow;
      });
  
      setExcelData(cleanedJson);
    };
    reader.readAsArrayBuffer(file);
  };
  
  
  const handleBulkUpload = async () => {
    setLoading(true);
    if (excelData.length === 0) {
       setLoading(false);
      toast.error('Select correct excel sheet to send qr codes')
      return;
    }
  
    // Add eventId to each entry before sending
    const enrichedData = excelData.map((item) => ({
      ...item,
      eventId: id,
    }));
    if(!templateData||!nameLayout||!clubLayout)
    { setLoading(false);
      toast.error("Configure or Export Template Layout to send qr codes")
      return;
    }
    try {
      const res=await SendQr(enrichedData,x,y,width,height,templateData,nameLayout,clubLayout);
      console.log(res.status);
     if(res.status==202)
      { 
        toast.error(res.data.eror);
      }
      if (res.status==200) {
        toast.success("QR codes sent successfully");
      }
       else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      console.error("Bulk upload error:", err);
      toast.error("Failed to send QR codes");
    }
    setLoading(false);
  };
   const handleCreateMagicLink=async()=>{
           setLoading(true);
           const res= await creatMagiccLink(magicLinks,id);
           if(res.status==200)
           {
             toast.success("Magic Link For Admins are send Succssesfully..")
           }
           setToggler(!toggler);
           setLoading(false);
           
   }
   const handelAdminRemove=async(admin)=>{
    console.log(admin,event._id);
    await handel_Remove_Admin(admin,event._id);
    setToggler(!toggler);
    
   }
  return (<>
   <div className="flex items-center justify-center cursor-pointer" >
          <img src="/rotao.png" width={400} height={50} onClick={()=>navigate('/')}/>
       </div>
       <Nav onEClick={onOpenEvent} onTClick={onOpenTemplate} onAClick={onOpenAnalaysis}/>
   { eventM&&<div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-center">{event.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Attendance */}
          {/* <div className="flex items-center gap-2 text-gray-700">
            <Users className="w-5 h-5" />
            <span className="text-sm font-medium">Attendance: {event.attendance}</span>
          </div> */}

          {/* Admins */}
          <div>
            <h4 className="font-semibold mb-1">Admins</h4>
            {event.admins.length > 0 ? (
              <div className="flex flex-wrap gap-2" >
                {event.admins.map((admin, i) => (
                  <Badge key={i} variant="secondary" 
                 >
                    {admin} 
                    <AlertDialog>
                        <AlertDialogTrigger>
                          <Badge variant="secondary" className={'cursor-pointer'}>
                                            X
                                          </Badge></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete this account
                              and remove data from this event as well credentials also revoke.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={()=>handelAdminRemove(admin)}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 flex items-center gap-2 text-sm">
                <UserX2 className="w-4 h-4" /> No admins
              </div>
            )}
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-1">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {event.categories.map((cat, i) => (
                <Badge key={i} className="bg-blue-100 text-blue-700">
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          {/* Upload Excel */}
          <div className="mt-4">
            <Label htmlFor="excel" className="font-medium mb-2 block">
              Upload Attendance Sheet
            </Label>
            <Input id="excel" type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} ref={Userref} />
            <Button className="mt-2" variant="outline" onClick={()=>{
              Userref.current.click();
            }}>
              <UploadCloud className="w-4 h-4 mr-2" /> Upload
            </Button>
          </div>

          {/* Add Magic Link Section */}
          <div className="mt-6 space-y-3">
            <h4 className="font-semibold">Add Magic Link</h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Hours"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
              
              <Button onClick={handleAddMagicLink}>Add</Button>
            </div>

            {/* Badge list */}
            {magicLinks.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-3">
                {magicLinks.map((link, i) => (
                  <Badge
                    key={i}
                    className="flex items-center gap-2 bg-green-100 text-green-700"
                    onClick={() => handleRemove(i)}
                  >
                    {link.email} ({link.hours})
                    <X
                      className="w-4 h-4 cursor-pointer"
                      onClick={() => handleRemove(i)}
                    />
                  </Badge>
                ))}

              </div>
            )}
              {magicLinks.length > 0&&<Button onClick={handleCreateMagicLink} disabled={loading}>
                {loading&&<div className="animate-spin">
                  <img
                src="/loader.svg" width={20} />
                  </div>}
                Create Links</Button>}

          </div>
          <div>
             <h4 className="font-semibold mb-1">Email Content</h4>
             <EmailEditor event={event}/>
          </div>
        </CardContent>
      </Card>
      
      {/* Preview Table from Excel */}

{excelData.length > 0 && (
  <div className="mt-6">
    <h4 className="font-semibold mb-2">Preview Uploaded Users</h4>
    <div className="overflow-auto rounded border">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            {Object.keys(excelData[0]).map((key) => (
              <th key={key} className="px-4 py-2 font-semibold">
                {key.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {excelData.map((row, idx) => (
            <tr key={idx} className="border-t">
              {Object.values(row).map((val, i) => (
                <td key={i} className="px-4 py-2">
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}
    </div>}
    {/* templade fixing qr */}
    
    {templateM&&<TemplateEditor setQr={setQr} setTemplateData={setTemplateData} file ={file} setFile={setFile} template={template} setTemplate={setTemplate} handleBulkUpload={handleBulkUpload} loading={loading}/>}
    {analysisM&&<Analysis eventId={id} event={event}/>
}

    </>
  );
};

export default EvenPage;
