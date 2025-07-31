const TextSubSidebar = ({ onAddText, onAddHeading, onAddSubheading, onAddBodyText, onClose }) => {
  return (
    <div
      className="fixed top-42  right-0 z-[9999] w-72 bg-white rounded-l-2xl shadow-2xl border border-gray-200 px-6 py-8 flex flex-col gap-6 animate-fadeIn text-sub-sidebar"
      style={{
        minHeight: "320px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        transition: "transform 0.3s cubic-bezier(.4,0,.2,1)",
      }}
    >
    
      
      <button
        className="w-full text-4xl py-3 rounded-lg  text-[#C0392B] font-semibold transition"
        onClick={onAddHeading}
      >
        Add Heading
      </button>
      <button
        className="w-full text-2xl py-3 rounded-lg   text-[#D4A017] font-semibold transition"
        onClick={onAddSubheading}
      >
        Add Subheading
      </button>
      <button
        className="w-full text-xl py-3 rounded-lg   text-[#D8A39D] font-semibold transition"
        onClick={onAddBodyText}
      >
        Add Body Text
      </button>
      
      <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={onClose} title="Close">
        ✕
      </button>
      <button
        className="w-full py-3  rounded-lg   text-[#3C3E50] font-semibold transition"
        onClick={onAddText}
      >
        Add Text
      </button>
     
    </div>
  )
}

export default TextSubSidebar
