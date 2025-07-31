import React from "react";
import { ArrowLeft, Calendar , Search } from "lucide-react";
import { Link } from "react-router-dom";

const notes = [
  {
    verse: "Matthew 5:16",
    text: "16 For God so loved the world, that he gave his only Son...",
    version: "John 6:13 NIV",
    date: "20th Aug 2023",
    time: "10:24 AM",
  },
  // Repeated 3 times for demo
  {
    verse: "Matthew 5:16",
    text: " 16 For God so loved the world, that he gave his only Son...",
    version: "John 6:13 NIV",
    date: "20th Aug 2023",
    time: "10:24 AM",
  },
  {
    verse: "Matthew 5:16",
    text: "16 For God so loved the world, that he gave his only Son...",
    version: "John 6:13 NIV",
    date: "20th Aug 2023",
    time: "10:24 AM",
  },
  {
    verse: "Matthew 5:16",
    text: "16 For God so loved the world, that he gave his only Son...",
    version: "John 6:13 NIV",
    date: "20th Aug 2023",
    time: "10:24 AM",
  },
  {
    verse: "Matthew 5:16",
    text: "16 For God so loved the world, that he gave his only Son...",
    version: "John 6:13 NIV",
    date: "20th Aug 2023",
    time: "10:24 AM",
  },
  {
    verse: "Matthew 5:16",
    text: "16 For God so loved the world, that he gave his only Son...",
    version: "John 6:13 NIV",
    date: "20th Aug 2023",
    time: "10:24 AM",
  },
  {
    verse: "Matthew 5:16",
    text: "16 For God so loved the world, that he gave his only Son...",
    version: "John 6:13 NIV",
    date: "20th Aug 2023",
    time: "10:24 AM",
  },
];

const colors = ["#a4fea7", "#ffebd2", "#d5f1fc", "#fdffdc"];

const Highlighted = () => {
  return (
    <div className=" bg-white p-4 shadow-xl rounded-3xl font-sans">
      {/* Header */}
     <Link to="/more"> <div className="flex items-center gap-2 mb-4">
        <ArrowLeft className="w-5 h-5 cursor-pointer" />
        <h1 className="text-3xl text-gray-800">HighLights</h1>
      </div></Link>
      

      {/* Notes List */}
      <div className="space-y-4 p-8">
        {notes.map((note, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-md p-3 "
          >
            <i><p className="text-xl ">
              You Highlighted{" "}
              <span className="font-semibold">{note.verse}</span>
            </p></i>
            <p
  className="text-sm mt-1 italic rounded-md px-2 py-1"
  style={{ backgroundColor: colors[index % colors.length], color: "#333" }}
>
  {note.text}
</p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3">
              <p className="text-sm font-semibold">{note.version}</p>
              <div className="flex items-center text-sm text-[#8a8a8a] mt-2 sm:mt-0">
                <Calendar className="w-4 h-4 mr-1" />
                {note.date} {note.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Highlighted;
