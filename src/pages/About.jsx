import React from 'react'
import { ArrowLeft   } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className='shadow-xl rounded-3xl p-12'>
      <Link to="/more"> <div className="flex items-center gap-2 mb-4">
        <ArrowLeft className="w-5 h-5 cursor-pointer" />
        <h1 className="text-3xl text-gray-800">About Seekfully</h1>
      </div></Link>
      <div className='text-[17px] font-light mt-12  '>
        <p>Seekfully is a faith-driven company committed to making the Bible accessible, engaging, and impactful for people everywhere. Founded on the belief that God's Word has the power to transform lives, we offer a range of innovative digital tools designed to help individuals explore, understand, and live out their faith</p>
        <br />
        <p>Our mission is simple: to inspire and equip believers on their spiritual journey. Whether you're new to the faith or have been walking with God for years, Seekfully provides the resources you need to deepen your understanding of the Scriptures and grow closer to God. Our platform features daily devotionals, personalized Bible reading plans, audio Bibles, and tools for note-taking, highlighting, and reflection, all crafted to fit seamlessly into your daily life</p>
      
      <br />
      <p>At Seekfully, we believe that community is essential to spiritual growth. That’s why we’ve built features that allow you to connect with others, share insights, and offer encouragement through prayers and discussions. Our goal is to foster a vibrant and supportive community where believers can learn from one another and walk together in faith.</p>
      <br />
      <p>We are passionate about leveraging technology to bring the timeless truths of the Bible to the modern world. Our team is dedicated to continuously improving and expanding our offerings to meet the evolving needs of our users. We are committed to excellence, integrity, and a heart of service, ensuring that every interaction with Seekfully reflects the love and grace of Jesus Christ.
</p>
</div>
<div className="flex justify-center mt-12">
        <button
          className="w-[400px] bg-[var(--primary-color)] text-white py-3 rounded-full font-medium hover:opacity-90 transition"
          onClick={() => setShowPopup(true)}
        >
          Give Now
        </button>
      </div>
    </div>
  )
}

export default About