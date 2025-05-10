//@ts-nocheck

import { useEffect, useState } from "react";
import {
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card as UICard } from "@/components/ui/card";
import { createEvents, getEvents } from "@/lib/user.action";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

// const events = [
//   { id: "EVT003", name: "Webinar", date: "2024-10-01" },
//   { id: "EVT002", name: "Hackathon", date: "2024-09-10" },
//   { id: "EVT001", name: "Tech Fest", date: "2024-09-01" },
//   { id: "EVT004", name: "AI Workshop", date: "2024-09-05" },
//   { id: "EVT005", name: "Code Camp", date: "2024-09-20" },
// ];

const Dashboard = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [eventName, setEventName] = useState("");
  const [starteventDate, setstartEventDate] = useState("");
  const [endeventDate, setendEventDate] = useState("");

  const [categoryInput, setCategoryInput] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [events,setEvents]=useState([]);
  useEffect(()=>{
         const get= async() => {
              const ev= await getEvents()
              setEvents(ev);
         }
         get();
  },[])


  const handleAddCategory = () => {
    if (categoryInput && !categories.includes(categoryInput)) {
      setCategories([...categories, categoryInput]);
      setCategoryInput("");
    }
  };

  const handleRemoveCategory = (cat: string) => {
    setCategories(categories.filter((c) => c !== cat));
  };


  const handleSubmit = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // remove time portion
  
    const start = new Date(starteventDate);
    const end = new Date(endeventDate);
  
    if (start < today) {
      toast.error("Start date must be today or later.");
      return;
    }
  
    if (end < start) {
      toast.error("End date must be the same as or after the start date.");
      return;
    }
  
    console.log("Event Name:", eventName);
    console.log("Start Date:", starteventDate);
    console.log("End Date:", endeventDate);
    console.log("Categories:", categories);
  
    await createEvents(eventName, starteventDate, endeventDate, categories);
    setShowCreateDialog(false);
  };
  const navigate=useNavigate();
  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-white to-slate-100 min-h-screen">

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Create Event"
          value="+"
          color="bg-blue-500"
          onClick={() => setShowCreateDialog(true)}
        />
        <StatCard title="Total Events" value="12" color="bg-yellow-400" />
        <StatCard title="Total Attendance" value="230" color="bg-rose-400" />
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <UICard
            key={index}
            className="rounded-xl p-5 shadow-xl border border-gray-200 transition hover:scale-[1.02] duration-300"
            onClick={()=>navigate(`/${event._id}`)}
          >
            <h3 className="text-lg font-bold text-gray-900">{event.name}</h3>
            <p className="text-sm text-gray-600 mt-2">📅 {event.date}</p>
            <p className="text-sm text-gray-500">🆔 {event._id}</p>
          </UICard>
        ))}
      </div>

      {/* Dialog for Create Event */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
            <Label>Start Date</Label>
            <Input
              type="date"
              value={starteventDate}
              onChange={(e) => setstartEventDate(e.target.value)}
            />
            <Label>End Date</Label>
            <Input
              type="date"
              value={endeventDate}
              onChange={(e) => setendEventDate(e.target.value)}
            />

            {/* Category Input */}
            <div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add category"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                />
                <Button onClick={handleAddCategory}>Add</Button>
              </div>
              <div className="flex flex-wrap mt-2 gap-2">
                {categories.map((cat, i) => (
                  <div
                    key={i}
                    className="flex items-center px-2 py-1 bg-blue-100 rounded-full text-sm"
                  >
                    {cat}
                    <Trash2
                      size={14}
                      className="ml-1 cursor-pointer text-red-500"
                      onClick={() => handleRemoveCategory(cat)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance (default) */}
            <Input disabled value="Attendance" />

           

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Create</Button>
            </div>
          </div>  
        </DialogContent>
      </Dialog>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  color,
  onClick,
}: {
  title: string;
  value: string | number;
  color: string;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={`rounded-xl p-6 text-white shadow-lg ${color} cursor-pointer`}
  >
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </div>
    </div>
    <div className="mt-4 w-full h-16 opacity-50">
      <div className="bg-white/40 h-full w-full rounded-md" />
    </div>
  </div>
);

export default Dashboard;
