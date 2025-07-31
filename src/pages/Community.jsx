import React, { useState } from 'react';
import {
  Home,
  Plus,
  MessageCircle,
  Heart,
  Bookmark,
  MoreHorizontal,
  Paperclip,
  Search as SearchIcon,
  User as UserIcon,
  ArrowUpRight
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

import profileImg from '../assets/images/Profile1.png';
import profileimg2 from "../assets/images/Profile2.png";
import postImg from '../assets/images/PostImg.png';
import heart from "../assets/icons/heart.png";
import massege from "../assets/icons/message.png";
import repost from "../assets/icons/repost.png";
import send from "../assets/icons/send.png";
import redheart from "../assets/icons/redheart.png";
import shareicon from "../assets/icons/Shareicon.png";

const posts = [
  {
    user: 'Ruchi_shah',
    content: 'Failures are stepping stones to success. Embrace them, learn from them, and keep moving forward',
    image: null,
    likes: 1,
    time: '49m',
  },
  {
    user: 'Ruchi_shah',
    content: 'Failures are stepping stones to success. Embrace them, learn from them, and keep moving forward',
    image: null,
    likes: 1,
    time: '49m',
  },
  {
    user: 'Ruchi_shah',
    content: 'Failures are stepping stones to success. Embrace them, learn from them, and keep moving forward',
    image: postImg,
    likes: 1,
    time: '49m',
  },
];

const trendingTopics = [
  { category: 'DESIGN', topic: 'ThreadsDesktop', tweets: '732K' },
  { category: 'MOVIES AND SERIES', topic: 'Spider-Man: Across the Spider-Verse', tweets: '934.4K' },
  { category: 'TECH', topic: 'iPhone 15', tweets: '85.9K' },
  { category: 'GAMES', topic: 'Rob Games', tweets: '78.4K' },
  { category: 'DESIGN', topic: '#Minimalism', tweets: '71K' },
  { category: 'DESIGN', topic: '#Minimalism', tweets: '71K' },
  { category: 'DESIGN', topic: '#Minimalism', tweets: '71K' },
  { category: 'DESIGN', topic: '#Minimalism', tweets: '71K' },
];

const Community = () => {
  const navigate = useNavigate();
  const [activeIcon, setActiveIcon] = useState('home');

  return (
    <div className="shadow-xl rounded-3xl p-3 flex flex-col  font-sans bg-white">
      {/* Top Navbar */}
      <nav className="w-full px-4 py-4 flex gap-40 items-center justify-start ">
        <h1 className="text-4xl  text-[var(--primary-color)] mb-2 text-center">Welcome Jackson...</h1>
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate('/')}
            className={`pb-1 border-b-2 text-lg font-medium ${
              window.location.pathname === '/'
                ? "text-[var(--primary-color)] border-[var(--primary-color)]"
                : "text-gray-400 font-semibold border-transparent"
            }`}
          >
            Mapping
          </button>
          <button
            onClick={() => navigate('/community')}
            className={`pb-1 border-b-2 text-lg font-medium ${
              window.location.pathname === '/community'
                ? "text-[var(--primary-color)] border-[var(--primary-color)]"
                : "text-gray-400 font-semibold border-transparent"
            }`}
          >
            Community
          </button>
        </div>
      </nav>

      <div className="flex flex-1 h-0">
        {/* Left Sidebar */}
       <aside className="w-20 bg-white flex flex-col items-center justify-start relative pt-36">
          <div className="flex flex-col items-center gap-7">
            <Link to="/community"><button onClick={() => setActiveIcon('home')}>
              <Home className={`w-6 h-6 ${activeIcon === 'home' ? 'text-[var(--primary-color)]' : 'text-gray-400'}`} />
            </button></Link>
           <Link to="/follow"><button onClick={() => setActiveIcon('search')}>
              <SearchIcon className={`w-6 h-6 ${activeIcon === 'search' ? 'text-[var(--primary-color)]' : 'text-gray-400'}`} />
            </button></Link> 
            <button
              onClick={() => setActiveIcon('plus')}
              className={`flex items-center justify-center px-2 py-1 rounded-md ${activeIcon === 'plus' ? 'ring-2 ring-[var(--primary-color)]' : ''}`}
              style={{ backgroundColor: "var(--primary-color-light)" }}
            >
              <Plus className="w-6 h-6 text-black" />
            </button>
            <Link to="/like"><button onClick={() => setActiveIcon('heart')}>
              <Heart className={`w-6 h-6 ${activeIcon === 'heart' ? 'text-[var(--primary-color)]' : 'text-gray-400'}`} />
            </button></Link>
            <button onClick={() => setActiveIcon('user')}>
              <UserIcon className={`w-6 h-6 ${activeIcon === 'user' ? 'text-[var(--primary-color)]' : 'text-gray-400'}`} />
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full  ">
          <main className="flex-1 flex flex-col px-8 py-6 ">
            {/* Post Input */}
            <div className="flex items-start mb-8">
              <img src={profileImg} alt="Profile" className="w-10 h-10 rounded-full mr-3" />
              <div className="flex-1 flex flex-col">
                <input
                  type="text"
                  placeholder="Share something cool today"
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-400 border-none shadow-none focus:ring-0 focus:outline-none"
                  style={{ boxShadow: "none", background: "none" }}
                />
                <div className="flex items-center mt-1">
                  <Paperclip className="text-gray-400" size={18} />
                </div>
              </div>
              <button className="ml-4 flex items-center justify-center bg-[#f5f5f5] rounded-full p-3">
                <img src={shareicon} alt="Send" className="w-3 h-3 text-gray-700" />
              </button>
            </div>
            {/* Posts */}
            <div className="space-y-8">
              {posts.map((post, index) => (
                <div key={index} className="flex">
                  {/* Profile image with vertical line and plus icon */}
                  <div className="relative flex flex-col items-center mr-3">
                    {/* Top vertical line (hide for first post) */}
                    {index !== 0 && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-gray-300 z-0" />
                    )}
                    {/* Profile image */}
                    <div className="relative z-10">
                      <img src={profileimg2} alt="User" className="w-12 h-12 rounded-full" />
                      {/* Plus icon */}
                      <span className="absolute -bottom-1 -right-1 bg-black rounded-full p-1 flex items-center justify-center">
                        <Plus className="w-3 h-3 text-white" />
                      </span>
                    </div>
                    {/* Bottom vertical line (hide for last post) */}
                    {index !== posts.length - 1 && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gray-300 z-0" style={{ top: '2.5rem' }} />
                    )}
                  </div>
                  {/* Post content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="font-semibold text-lg">{post.user}</div>
                      <span className="text-gray-400 text-xs ml-2">{post.time}</span>
                      <MoreHorizontal className="ml-auto text-gray-500" size={18} />
                      
                    </div>
                    <p className="text-sm mb-2">{post.content}</p>
                    {post.image && <img src={post.image} alt="Post" className="rounded-lg w-full max-h-80 object-cover mb-2" />}
                    <div className="flex items-center gap-6 text-gray-600 text-sm">
                      <img src={heart} alt="" className='w-4 h-4'/>
                      <img src={massege} alt="" className='w-4 h-4' />
                      <button className="">
                        <img src={repost} alt="" className='w-4 h-4'/>
                      </button>
                      <img src={send} alt="" className='w-4 h-4'/>
                    </div>
                    <span className="ml-auto text-[#a0a0a0] text-sm ">{post.likes} like</span>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>

        {/* Right Sidebar */}
        <aside className="w-80 bg-white px-6 py-8 ">
  <h2 className="font-bold text-3xl mb-4">Trending Topics</h2>
  <div className="space-y-4 text-sm">
    {trendingTopics.map((topic, index) => (
      <div key={index} className="flex items-start">
        {topic.icon}
        <div>
          <p className="text-gray-400 text-xs font-medium uppercase">{topic.category}</p>
          <p className="font-medium">{topic.topic}</p>
          <p className="text-gray-500 text-xs">{topic.tweets} Tweets</p>
        </div>
      </div>
    ))}
    <button className="text-blue-600 text-sm mt-2">see more</button>
  </div>
</aside>
      </div>
    </div>
  );
};

export default Community;