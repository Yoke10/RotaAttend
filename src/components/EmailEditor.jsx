import { useState } from 'react';
import { Email_Update } from '../lib/user.action';
import { Button } from './ui/button';
import { toast } from 'react-toastify';

const EmailEditor = ({event}) => {
  const [emailBody, setEmailBody] = useState(event.html);
  const [from, setFrom] = useState(event.from);
  const [subject, setSubject] = useState(event.subject);
  const [loading,setLoading]=useState(false);

  const handleSend = async() => {
    setLoading(true);
    const emailData = {
      from,
      subject,
      htmlContent: emailBody,
    };
    console.log(emailData); 
    const res=await Email_Update(from,subject,emailBody,event._id);
    console.log(res);
    if(res.status==200)
    {
        toast.success('Email Content for this event is updated...')
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-md space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Compose Email</h2>

      <div>
        <label className="block mb-1 font-medium text-gray-700">From</label>
        <input
          type="text"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="RotractClub"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Your Event QR Code"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">Body</label>
        <textarea
          value={emailBody}
          onChange={(e) => setEmailBody(e.target.value)}
          rows={10}
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <Button
        onClick={handleSend}
        className="px-4 py-2 bg-black text-white rounded"
        disabled={loading}
      >{loading&&<div className="animate-spin">
                  <img
                src="/loader.svg" width={20} />
                  </div>}
        Save Email Template
      </Button>
    </div>
  );
};

export default EmailEditor;
