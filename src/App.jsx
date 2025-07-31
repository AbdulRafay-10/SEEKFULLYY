import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import MainLayout from './layout/MainLayout';
import "./styles/theme.css";
import "./styles/global.css";

import CreateAccount from './pages/CreateAccount';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import Whiteboard from "./pages/WhiteBoard";
import StudyNote from "./pages/StudyNote";
import More from "./pages/More";
import AISeeker from "./pages/AISeeker";
import Community from "./pages/Community";
import CommunityFollowUI from "./pages/CommunityFollow";
import CommunityLike from "./pages/CommunityLikes"
import AISeekerChat from "./pages/AISeekerChat";
import Profile from "./pages/Profile";
import Giving from "./pages/Giving";
import Notes from "./pages/Notes";
import ActivityTracker from "./pages/ActivityTracker";
import About from "./pages/About";
import BookMark from "./pages/BookMark";
import Bible from "./pages/Bible";
import Highlighted from "./pages/Highlighted";
import { ThemeProvider } from "./context/ThemeContext";




function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          {/* Pages that use sidebar */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/study" element={<StudyNote />} />
            <Route path="/more" element={<More />} />
            <Route path="/ai" element={<AISeeker />} />
            <Route path="/community" element={<Community />} />
            <Route path="/follow" element={<CommunityFollowUI />} />
            <Route path="/like" element={<CommunityLike />} />
            <Route path="/ai-chat" element={<AISeekerChat />} />
            <Route path="/more/profile" element={<Profile />} />
            <Route path="/more/giving" element={<Giving />} />
            <Route path="/more/notes" element={<Notes />} />
            <Route path="/more/activity-tracker" element={<ActivityTracker />} />
            <Route path="/more/about" element={<About />} />
            <Route path="/more/bookmark" element={<BookMark />} />
            <Route path="/more/highlighted" element={<Highlighted />} />
            <Route path="/bible" element={<Bible />} />
            
          </Route>

          {/* Pages without sidebar */}
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />
          <Route path="/whiteboard" element={<Whiteboard />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
