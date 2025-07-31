import React, { useState } from "react";
import { ArrowLeft , Heart,  } from "lucide-react";
import ProfileImg from "../assets/images/ProfileImg.png";
import Mail from "../assets/icons/Mail.svg";
import PostImage1 from "../assets/images/post1.png";
import PostImage2 from "../assets/images/post2.png";
import comment2 from "../assets/icons/comment2.png";
import share2 from "../assets/icons/share2.png";
import Friend1 from "../assets/images/friend1.png";
import Friend2 from "../assets/images/friend2.png";
import Friend3 from "../assets/images/friend3.png";
import Friend4 from "../assets/images/friend4.png";
import Friend5 from "../assets/images/friend5.png";
import Friend6 from "../assets/images/friend6.png";
import { Link } from "react-router-dom";

const posts = [
  {
    name: "Bernard Ward",
    location: "Minnesota, US",
    image: PostImage1,
    username: "Joshua.J",
    text: "For God so love the world and he gave us his only begotten son.",
    time: "3m ago",
    likes: 300,
    comments: 20,
  },
  {
    name: "Bernard Ward",
    location: "Minnesota, US",
    image: PostImage2,
    username: "Bernard Ward",
    text: "For God so love the world and he gave us his only begotten son.",
    time: "5m ago",
    likes: 180,
    comments: 12,
  },
];

const friends = [
  { name: "Ralph Edwards", role: "TCPA Compliance", image: Friend1 },
  { name: "Jerome Bell", role: "Speech Recognition", image: Friend2 },
  { name: "Ronald Richards", role: "Quality Monitoring", image: Friend3 },
  { name: "Guy Hawkins", role: "Voicestream", image: Friend4 },
  { name: "Kristin Watson", role: "UC Integrations", image: Friend5 },
  { name: "Floyd Miles", role: "Preview Dialer", image: Friend6 },
];

const Profile = () => {
  const [tab, setTab] = useState("posts");

  return (
    <div className="bg-white shadow-xl rounded-3xl overflow-hidden font-sans h-full">
      {/* Profile Section with Arrow and Title inside gradient */}
      <div className="relative flex flex-col bg-gradient-to-b from-gray-100 via-gray-50 to-white items-center mb-8 rounded-3xl pt-10 pb-6">
       <Link to="/more"> <div className="absolute top-4 left-4 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
          <h1 className="text-3xl font-medium text-gray-800">Profile</h1>
        </div></Link>
        <img
          src={ProfileImg}
          alt="Profile"
          className="rounded-full w-32 h-32 object-cover border-2 mb-4"
          style={{ borderColor: "var(--primary-color)" }}
        />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bernard Ward</h1>
        <div className="flex items-center gap-2 text-gray-600">
          <img src={Mail} alt="Email" className="w-4 h-4" />
          <span className="text-sm">Bernardward@gmail.com</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-gray-200 text-2xl">
        <button
          onClick={() => setTab("posts")}
          className={`px-20 py-2 ${tab === "posts" ? "border-b-2  text-black" : "text-gray-400"}`}style={{ borderColor: "var(--primary-color)" }}
        >
          Posts
        </button>
        <button
          onClick={() => setTab("friends")}
          className={`px-20 py-2 ${tab === "friends" ? "border-b-2  text-black" : "text-gray-400"}`}style={{ borderColor: "var(--primary-color)" }}
        >
          Friends
        </button>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-4">
        {tab === "posts" && (
          <div className="space-y-6">
            {posts.map((post, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                {/* Post Header */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={ProfileImg} alt="User" className="w-12 h-12 rounded-full" />
                      <div>
                        <h3 className="font-semibold text-lg">{post.username}</h3>
                        <p className="text-xs ">{post.location}</p>
                      </div>
                    </div>
                    
                  </div>
                </div>

                {/* Post Image */}
                <img src={post.image} alt="Post" className="w-full object-cover max-h-80" />

                {/* Post Footer */}
                <div className="p-4">
                    <div className="flex justify-between">
                    <h3 className="font-semibold text-sm">{post.username}</h3>
                    <span className="text-xs text-gray-400">{post.time}</span> 
                    </div>   
                  {post.text && <p className="text-sm text-gray-700 mb-3">{post.text}</p>}
                    
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex gap-4 items-center">
                      <div className="flex items-center gap-1 hover:text-[var(--primary-color)] cursor-pointer">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1 hover:text-[var(--primary-color)] cursor-pointer">
                        <img src={comment2} alt="Comment" className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                    <img src={share2} alt="Share" className="w-4 h-4 hover:text-[var(--primary-color)] cursor-pointer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "friends" && (
  <div className="space-y-4">
       {friends.map((friend, idx) => (
  <div
    key={idx}
    className="flex items-center justify-between p-1 bg-white border border-gray-200 rounded-xl "
  >
    <div className="flex items-center gap-4">
      <img
        src={friend.image}
        alt={friend.name}
        className="w-20 h-20 rounded-lg"
      />
      <div>
        <h3 className="font-semibold text-base text-gray-800">{friend.name}</h3>
        <p className="text-sm text-gray-500">{friend.role}</p>
        <p className="text-sm text-black font-semibold mt-6">6k followers</p>
      </div>
    </div>
  </div>
))}
  </div>
)}
      </div>
    </div>
  );
};

export default Profile;
