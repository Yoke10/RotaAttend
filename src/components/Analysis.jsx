//@ts-nocheck
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { getEvenUserAnaysis } from "../lib/user.action";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
const Analysis = ({ eventId, event }) => {
  const [users, setUsers] = useState([]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userRes = await getEvenUserAnaysis(event._id);
      const start = dayjs(event.startDate);
      const end = dayjs(event.endDate);

      const dateList = [];
      for (let d = start; d.isBefore(end) || d.isSame(end); d = d.add(1, 'day')) {
        dateList.push(d.format('YYYY-MM-DD'));
      }

      setUsers(userRes);
      setDates(dateList);
    };

    fetchData();
  }, [eventId, event]);

  const checkStatus = (user, date, category) => {
 
  
    return user.categories.some(
      cat => dayjs(cat.date).format('YYYY-MM-DD') === date && cat.label === category && cat.status
    );
  };

  const exportToExcel = () => {
    if (!event || !event.categories || event.categories.length === 0) {
      alert("Event categories are not available yet.");
      return;
    }
  
    const headerRow1 = ["Name", "Club", "Email", "Email Status"];
    const headerRow2 = ["", "", "", ""];
  
    dates.forEach(date => {
      headerRow1.push(...Array(event.categories.length).fill(date));
      headerRow2.push(...event.categories);
    });
  
    const dataRows = users.map(user => {
      const row = [
        user.name,
        user.club,
        user.email,
        user.emailstatus ? "✓" : "✗",
      ];
  
      dates.forEach(date => {
        event.categories.forEach(category => {
          row.push(checkStatus(user, date, category) ? "✓" : "✗");
        });
      });
  
      return row;
    });
  
    const sheetData = [headerRow1, headerRow2, ...dataRows];
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  
    // Merge cells for date headers
    const merges = [];
    let col = 4; // First 4 columns are user info
    dates.forEach(() => {
      merges.push({
        s: { r: 0, c: col },
        e: { r: 0, c: col + event.categories.length - 1 },
      });
      col += event.categories.length;
    });
    worksheet["!merges"] = merges;
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Event Analysis");
  
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileData, `${event.name || "analysis"}_report.xlsx`);
  };
  
  return (
    <div className="p-6">
      <div className='flex items-center justify-center'>
          <button
            onClick={exportToExcel}
            className="mb-4 flex  cursor-pointer px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-400"
          >
          Export to Excel
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">Analysis for Event: {event?.name}</h2>
      <div className="overflow-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Club</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-center">Email Status</th>
              {dates.map((date) => (
                <th key={date} colSpan={event.categories.length} className="px-4 py-2 text-center whitespace-nowrap border-l">
                  {date}
                </th>
              ))}
            </tr>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              {dates.map((date) => (
                event.categories.map((category, index) => (
                  <th key={`${date}-${index}`} className="px-4 py-2 text-center border-l">
                    {category}
                  </th>
                ))
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {users?.map(user => (
              <tr key={user._id}>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.club}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 text-center">
                  {user.emailstatus ? (
                    <span className="text-green-600 font-bold">✓</span>
                  ) : (
                    <span className="text-red-500 font-bold">✗</span>
                  )}
                </td>
                {dates.map((date) => (
                  event.categories.map((category, index) => (
                    <td key={`${date}-${category}-${index}`} className="px-4 py-2 text-center border-l">
                      {checkStatus(user, date, category) ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : (
                        <span className="text-red-500 font-bold">✗</span>
                      )}
                    </td>
                  ))
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analysis;
