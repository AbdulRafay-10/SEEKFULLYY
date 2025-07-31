import React from "react";
import { ArrowLeft, Calendar , Search } from "lucide-react";
import { Link } from "react-router-dom";

const notes = [
  {
    verse: "Matthew 5:16",
    text: "16 Let your light shine before others, that they may see your good deeds and glorify your Father in heaven",
    version: "Matthew 5:16 NIV",
    note: "Let your light shine",
    date: "20th Aug 2023",
    time: "10:24 AM",
  },
  // Repeated 3 times for demo
  {
    verse: "Matthew 5:16",
    text: "16 Let your light shine before others, that they may see your good deeds and glorify your Father in heaven",
    version: "Matthew 5:16 NIV",
    note: "Let your light shine",
    date: "20th Aug 2023",
    time: "10:24 AM",
  },
  {
    verse: "Matthew 5:16",
    text: "16 Let your light shine before others, that they may see your good deeds and glorify your Father in heaven",
    version: "Matthew 5:16 NIV",
    note: "Let your light shine",
    date: "20th Aug 2023",
    time: "10:24 AM",
  },
  {
    verse: "Matthew 5:16",
    text: "16 Let your light shine before others, that they may see your good deeds and glorify your Father in heaven",
    version: "Matthew 5:16 NIV",
    note: "Let your light shine",
    date: "20th Aug 2023",
    time: "10:24 AM",
  },
];

const Notes = () => {
  return (
    <div className=" bg-white p-4 shadow-xl rounded-3xl font-sans">
      {/* Header */}
     <Link to="/more"> <div className="flex items-center gap-2 mb-4">
        <ArrowLeft className="w-5 h-5 cursor-pointer" />
        <h1 className="text-3xl text-gray-800">Notes</h1>
      </div></Link>

      {/* Search Box */}
       <div className="flex-1 w-[800px] mx-auto mt-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search notes..."
                    className="w-full pl-10 pr-4 py-5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{
                      border: "1.5px solid var(--primary-color)",
                      boxShadow: "none",
                    }}
                  />
                </div>
              </div>
      

      {/* Notes List */}
      <div className="space-y-4 p-12">
        {notes.map((note, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-md p-4 "
          >
            <i><p className="text-lg ">
              You Added note on{" "}
              <span className="font-semibold">{note.verse}</span>
            </p></i>
            <p className="text-sm text-[#8a8a8a] mt-1 italic">{note.text}</p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3">
              <p className="text-sm font-semibold">{note.version}</p>
              <div className="flex items-center text-sm text-[#8a8a8a] mt-2 sm:mt-0">
                <Calendar className="w-4 h-4 mr-1" />
                {note.date} {note.time}
              </div>
            </div>

            <input
              type="text"
              value={note.note}
              readOnly
              className="w-full mt-2  bg-[#efeff3] rounded-md px-3 py-1 text-sm text-[#8a8a8a]"
            />
          </div>
        ))}
      </div>

      {/* Create Notes Button */}
     <Link to="/whiteboard"> <div className="flex justify-center mb-12">
        <button
          className="w-[400px] bg-[var(--primary-color)] text-white py-3 rounded-full font-medium hover:opacity-90 transition"
          onClick={() => setShowPopup(true)}
        >
          Create Note
        </button>
      </div></Link>
    </div>
  );
};

export default Notes;
