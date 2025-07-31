"use client"
import { useState, useRef, useEffect } from "react"
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  ChevronDown,
  Search,
  X,
  Check,
  Moon,
  AlignJustify,
} from "lucide-react"
import clipboard from "../assets/icons/clipboard.png"
import settings from "../assets/icons/settings.png"
import world from "../assets/icons/world.png"

const bibleText = [
  "In the beginning God created the heavens and the earth.",
  "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.",
  "And God said, 'Let there be light,' and there was light.",
  "God saw that the light was good, and he separated the light from the darkness.",
  "God called the light 'day,' and the darkness he called 'night.' And there was evening, and there was morning—the first day.",
  "And God said, 'Let there be a vault between the waters to separate water from water.'",
  "So God made the vault and separated the water under the vault from the water above it. And it was so.",
  "God called the vault 'sky.' And there was evening, and there was morning—the second day.",
  "And God said, 'Let the water under the sky be gathered to one place, and let dry ground appear.' And it was so.",
  "God called the dry ground 'land,' and the gathered waters he called 'seas.' And God saw that it was good.",
]

const oldTestamentBooks = [
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
]

const newTestamentBooks = [
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
]

const fontOptions = ["Merriweather", "Lora", "Inter", "Lato"]

export default function Bible() {
  const [isNotesOpen, setIsNotesOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(-1)
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0)
  const [notes, setNotes] = useState("")
  const [showIndexDropdown, setShowIndexDropdown] = useState(false)
  const [showChapterDropdown, setShowChapterDropdown] = useState(false)
  const [showVerseDropdown, setShowVerseDropdown] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false)
  const [selectedBook, setSelectedBook] = useState("Jeremiah")
  const [selectedChapter, setSelectedChapter] = useState(30)
  const [selectedVerse, setSelectedVerse] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  // Settings state
  const [selectedFont, setSelectedFont] = useState("Inter")
  const [fontSize, setFontSize] = useState([16])
  const [lineSpacing, setLineSpacing] = useState([1.5])
  const [backgroundColor, setBackgroundColor] = useState("white")
  const [isDarkMode, setIsDarkMode] = useState(false)

  const speechRef = useRef(null)
  const isPlayingRef = useRef(isPlaying)

  // Update ref when state changes
  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (speechRef.current) {
        speechSynthesis.cancel()
      }
    }
  }, [])

  // Speak one verse, then immediately chain to the next
  const speakVerse = (verseIdx) => {
    if (verseIdx >= bibleText.length) {
      setIsPlaying(false)
      setCurrentWordIndex(-1)
      return
    }

    const verse = bibleText[verseIdx]
    const utterance = new SpeechSynthesisUtterance(verse)
    speechRef.current = utterance

    utterance.rate = 0.8
    utterance.pitch = 1
    utterance.volume = isMuted ? 0 : 1

    // Reset indices
    setCurrentVerseIndex(verseIdx)
    setCurrentWordIndex(-1)

    // word-by-word highlighting
    const words = verse.split(" ")
    let localWord = 0

    utterance.onboundary = (e) => {
      if (e.name === "word" && isPlayingRef.current) {
        setCurrentWordIndex(localWord++)
      }
    }

    utterance.onend = () => {
      if (isPlayingRef.current) {
        speakVerse(verseIdx + 1) // <-- chain immediately
      }
    }

    utterance.onerror = () => {
      console.error("Speech synthesis error")
      setIsPlaying(false)
      setCurrentWordIndex(-1)
    }

    speechSynthesis.speak(utterance)
  }

  const handlePlay = () => {
    if (isPlaying) {
      speechSynthesis.cancel()
      setIsPlaying(false)
      setCurrentWordIndex(-1)
    } else {
      speechSynthesis.cancel() // ensure clean start
      setIsPlaying(true)
      speakVerse(currentVerseIndex) // start chain
    }
  }

  const handleMute = () => {
    setIsMuted((prev) => !prev)
    if (isPlaying) {
      const restartAt = currentVerseIndex
      speechSynthesis.cancel()
      setTimeout(() => {
        if (isPlayingRef.current) speakVerse(restartAt)
      }, 100)
    }
  }

  const handlePreviousVerse = () => {
    if (currentVerseIndex > 0) {
      const newIndex = currentVerseIndex - 1

      if (isPlaying) {
        // If playing, seamlessly transition to previous verse
        speechSynthesis.cancel()
        setTimeout(() => {
          if (isPlayingRef.current) {
            speakVerse(newIndex)
          }
        }, 100)
      } else {
        // If not playing, just change the verse
        setCurrentVerseIndex(newIndex)
      }
    }
  }

  const handleNextVerse = () => {
    if (currentVerseIndex < bibleText.length - 1) {
      const newIndex = currentVerseIndex + 1

      if (isPlaying) {
        // If playing, seamlessly transition to next verse
        speechSynthesis.cancel()
        setTimeout(() => {
          if (isPlayingRef.current) {
            speakVerse(newIndex)
          }
        }, 100)
      } else {
        // If not playing, just change the verse
        setCurrentVerseIndex(newIndex)
      }
    }
  }

  const renderHighlightedText = (text, verseIndex) => {
    if (verseIndex !== currentVerseIndex || !isPlaying) {
      return text
    }

    const words = text.split(" ")
    return words.map((word, index) => {
      const isHighlighted = currentWordIndex === index
      return (
        <span
          key={index}
          className={`${isHighlighted ? "bg-yellow-300 text-black" : ""} transition-colors duration-200`}
        >
          {word}{" "}
        </span>
      )
    })
  }

  const getBackgroundColor = () => {
    switch (backgroundColor) {
      case "yellow":
        return "bg-yellow-100"
      case "gray":
        return "bg-gray-100"
      case "black":
        return "bg-gray-900 text-white"
      default:
        return "bg-white"
    }
  }

  // Updated font family function to return actual font family strings
  const getFontFamily = () => {
    switch (selectedFont) {
      case "Merriweather":
        return "Merriweather, serif"
      case "Lora":
        return "Lora, serif"
      case "Inter":
        return "Inter, sans-serif"
      case "Lato":
        return "Lato, sans-serif"
      default:
        return "Inter, sans-serif"
    }
  }

  const SettingsDropdown = () => (
    <div className="absolute top-full right-0 mt-1 bg-white border rounded-md shadow-lg z-20 w-[500px] p-6">
      {/* Font Selection */}
      <div className="mb-6">
        <div className="grid grid-cols-4 gap-4">
          {fontOptions.map((font) => (
            <button
              key={font}
              onClick={() => setSelectedFont(font)}
              className={`p-3 text-sm text-center transition-colors ${
                selectedFont === font ? "font-semibold" : "text-gray-700 hover:text-gray-900"
              }`}
              style={{
                color: selectedFont === font ? "var(--primary-color)" : undefined,
                fontFamily:
                  font === "Merriweather"
                    ? "Merriweather, serif"
                    : font === "Lora"
                      ? "Lora, serif"
                      : font === "Inter"
                        ? "Inter, sans-serif"
                        : font === "Lato"
                          ? "Lato, sans-serif"
                          : "inherit",
              }}
            >
              {font}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm">Aa</span>
          <div className="flex-1 relative">
            <input
              type="range"
              min="12"
              max="24"
              step="1"
              value={fontSize[0]}
              onChange={(e) => setFontSize([Number.parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <span className="text-lg">Aa</span>
        </div>
      </div>

      {/* Line Spacing */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <AlignJustify className="h-4 w-4" />
          <div className="flex-1 relative">
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={lineSpacing[0]}
              onChange={(e) => setLineSpacing([Number.parseFloat(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <AlignJustify className="h-5 w-5" />
        </div>
      </div>

      {/* Background Colors */}
      <div className="mb-6">
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => {
              setBackgroundColor("white")
              setIsDarkMode(false)
            }}
            className="w-28 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center"
          >
            {backgroundColor === "white" && <Check className="h-5 w-5" />}
          </button>
          <button
            onClick={() => {
              setBackgroundColor("yellow")
              setIsDarkMode(false)
            }}
            className="w-28 h-12 bg-yellow-200 border-2 border-gray-300 rounded-full flex items-center justify-center"
          >
            {backgroundColor === "yellow" && <Check className="h-5 w-5" />}
          </button>
          <button
            onClick={() => {
              setBackgroundColor("gray")
              setIsDarkMode(false)
            }}
            className="w-28 h-12 bg-gray-300 border-2 border-gray-300 rounded-full flex items-center justify-center"
          >
            {backgroundColor === "gray" && <Check className="h-5 w-5" />}
          </button>
          <button
            onClick={() => {
              setBackgroundColor("black")
              setIsDarkMode(true)
            }}
            className="w-28 h-12 bg-black border-2 border-gray-300 rounded-full flex items-center justify-center"
          >
            <Moon className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Close Button */}
      <div className="flex justify-center">
        <button onClick={() => setShowSettingsDropdown(false)} className="p-2 hover:bg-gray-100 rounded-full">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )

  const BibleIndexDropdown = () => (
    <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-20 w-96">
      <div className="p-6">
        <h3 className="font-semibold text-center mb-4">Bible Index</h3>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium mb-4">Old Testament</h4>
            <div className="space-y-3">
              {oldTestamentBooks.map((book) => (
                <button
                  key={book}
                  className="block text-left text-sm w-full py-1 px-2 rounded hover:bg-gray-200"
                  onClick={() => {
                    setSelectedBook(book)
                    setShowIndexDropdown(false)
                  }}
                >
                  {book}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-4">New Testament</h4>
            <div className="space-y-3">
              {newTestamentBooks.map((book) => (
                <button
                  key={book}
                  className="block text-left text-sm w-full py-1 px-2 rounded hover:bg-gray-200"
                  onClick={() => {
                    setSelectedBook(book)
                    setShowIndexDropdown(false)
                  }}
                >
                  {book}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const ChapterDropdown = () => (
    <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-20 w-96">
      <div className="p-6">
        <h3 className="font-semibold text-center mb-4">Chapter</h3>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <p className="text-sm">Book</p>
        <span className="font-medium text-2xl">{selectedBook}</span>
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 29 }, (_, i) => i + 1).map((chapter) => (
            <button
              key={chapter}
              className="py-3 text-sm bg-gray-100 hover:bg-gray-200 rounded text-center transition-colors"
              onClick={() => {
                setSelectedChapter(chapter)
                setShowChapterDropdown(false)
              }}
            >
              {chapter}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const VerseDropdown = () => (
    <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-20 w-96">
      <div className="p-6">
        <h3 className="font-semibold text-center mb-4">Verse</h3>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Book: <span className="font-medium">{selectedBook}</span>
        </p>
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 29 }, (_, i) => i + 1).map((verse) => (
            <button
              key={verse}
              className="py-3 text-sm bg-gray-100 hover:bg-gray-200 rounded text-center transition-colors"
              onClick={() => {
                setSelectedVerse(verse)
                setShowVerseDropdown(false)
              }}
            >
              {verse}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className={`${isDarkMode ? "bg-gray-900" : "bg-gray-50"} shadow-xl rounded-3xl relative`}>
      {/* Header */}
      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} px-2 py-3 flex`}>
        <div className="flex items-center gap-4">
          <h1 className="text-5xl font-semibold" style={{ color: "var(--primary-color)" }}>
            Bible
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Bible..."
              className="pl-10 w-full px-96 py-4 border border-gray-300 rounded-md"
              style={{ borderColor: "var(--primary-color-light)" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <button
              className={`shadow-sm ml-8 flex items-center gap-2 px-4 py-4 text-sm hover:bg-gray-100 rounded-full border border-gray-300 ${isDarkMode ? "text-white hover:bg-gray-700 border-gray-600" : ""}`}
            >
              <img src={world} alt="" className="h-4 w-4" />
              KJV
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className={`shadow-sm flex items-center gap-2 px-3 py-1 text-sm hover:bg-gray-100 rounded-full border border-gray-300 ${isDarkMode ? "text-white hover:bg-gray-700 border-gray-600" : ""}`}
            >
              Language
              <ChevronDown className="h-10 w-3" />
            </button>
            {showLanguageDropdown && (
              <div className="absolute top-full right-0 mt-1 bg-white border rounded-md shadow-lg z-10 min-w-[120px]">
                {["English", "Spanish", "French", "German"].map((lang) => (
                  <button
                    key={lang}
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setShowLanguageDropdown(false)}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              className="p-2 shadow-sm border border-gray-300 rounded-full hover:bg-gray-100"
              onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
            >
              <img src={settings} alt="" className="h-6 w-6" />
            </button>
            {showSettingsDropdown && <SettingsDropdown />}
          </div>
          <button className="p-2 mr-6 shadow-sm border border-gray-300 rounded-full hover:bg-gray-100">
            <img src={clipboard} alt="" className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-6">
          <div className="relative">
            <button
              onClick={() => setShowIndexDropdown(!showIndexDropdown)}
              className={`flex items-center gap-1 px-6 py-3 text-sm shadow-sm hover:bg-gray-100 rounded-full border border-gray-300 ${isDarkMode ? "text-white hover:bg-gray-700 border-gray-600" : ""}`}
            >
              Index
              <ChevronDown className="h-3 w-3" />
            </button>
            {showIndexDropdown && <BibleIndexDropdown />}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowChapterDropdown(!showChapterDropdown)}
              className={`flex items-center gap-1 px-6 py-3 text-sm shadow-sm hover:bg-gray-100 rounded-full border border-gray-300 ${isDarkMode ? "text-white hover:bg-gray-700 border-gray-600" : ""}`}
            >
              Chapter
              <ChevronDown className="h-3 w-3" />
            </button>
            {showChapterDropdown && <ChapterDropdown />}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowVerseDropdown(!showVerseDropdown)}
              className={`flex items-center gap-1 px-6 py-3 shadow-sm text-sm hover:bg-gray-100 rounded-full border border-gray-300 ${isDarkMode ? "text-white hover:bg-gray-700 border-gray-600" : ""}`}
            >
              Verse
              <ChevronDown className="h-3 w-3" />
            </button>
            {showVerseDropdown && <VerseDropdown />}
          </div>
        </div>
        {/* Notes Button */}
        <button
          onClick={() => setIsNotesOpen(true)}
          className="text-white px-4 py-2 rounded-l-full flex items-center gap-2 ml-auto -mr-4"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <ChevronLeft className="h-4 w-4" />
          Notes
        </button>
      </div>

      {/* Main Content */}
      <div className={`px-4 py-6 pb-32 ${getBackgroundColor()}`}>
        <h2 className={`text-3xl font-bold mb-6`} style={{ fontFamily: getFontFamily() }}>
          Jeremiah 30
        </h2>
        <div className="space-y-4">
          {bibleText.map((verse, index) => (
            <div
              key={index}
              className={`flex gap-3 ${index === currentVerseIndex && isPlaying ? "bg-blue-50 p-2 rounded" : ""}`}
            >
              <span
                className={`text-sm font-semibold text-gray-500 mt-1 min-w-[20px]`}
                style={{ fontFamily: getFontFamily() }}
              >
                {index + 1}.
              </span>
              <p
                className={`leading-relaxed ${backgroundColor === "black" ? "text-white" : "text-gray-800"}`}
                style={{
                  fontFamily: getFontFamily(),
                  fontSize: `${fontSize[0]}px`,
                  lineHeight: lineSpacing[0],
                }}
              >
                {renderHighlightedText(verse, index)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Audio Player */}
      <div className={`fixed bottom-0 left-0 right-0 ${isDarkMode ? "bg-gray-800" : ""} shadow-lg`}>
        <div className="px-4 py-6">
          {/* Large Circular Play Button */}
          <div className="flex items-center justify-center mb-6">
            <button
              onClick={handlePlay}
              className="rounded-full w-20 h-20 bg-white shadow-lg border flex items-center justify-center"
              style={{ borderColor: "var(--primary-color)" }}
            >
              {isPlaying ? <Pause className="h-8 w-8 text-black" /> : <Play className="h-8 w-8 text-black ml-1" />}
            </button>
          </div>
          {/* Control Bar */}
          <div className="bg-gray-100 rounded-full px-6 py-3 mx-auto max-w-md">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePreviousVerse}
                disabled={currentVerseIndex === 0}
                className="p-2 hover:bg-gray-200 rounded-full disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <div className="text-center flex-1">
                <span className="font-medium text-gray-900">Jeremiah 30</span>
              </div>
              <button
                onClick={handleNextVerse}
                disabled={currentVerseIndex === bibleText.length - 1}
                className="p-2 hover:bg-gray-200 rounded-full disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
              <button onClick={handleMute} className="p-2 hover:bg-gray-200 rounded-full ml-2">
                {isMuted ? (
                  <VolumeX className="h-5 w-5 text-gray-700" />
                ) : (
                  <Volume2 className="h-5 w-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isNotesOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          className="px-4 py-2 rounded-r-full w-28 border-b flex items-center justify-between text-white"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold">Notes</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">Galatians 5 22-24</h3>
          <p className="text-gray-700 mb-4">But the fruit of the Spirit is love, joy, peace, forbearance, kindness.</p>
          <div className="border-l-2 border-gray-300 pl-4 mb-6">
            <textarea
              placeholder="Add your notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full min-h-[300px] resize-none border-none p-0 focus:outline-none focus:ring-0"
            />
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <button className="w-full text-white py-3 rounded-full" style={{ backgroundColor: "var(--primary-color)" }}>
            Save Notes
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isNotesOpen && <div className="fixed inset-0 bg-black opacity-10 z-40" onClick={() => setIsNotesOpen(false)} />}

      {/* Click outside to close dropdowns */}
      {(showIndexDropdown ||
        showChapterDropdown ||
        showVerseDropdown ||
        showLanguageDropdown ||
        showSettingsDropdown) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowIndexDropdown(false)
            setShowChapterDropdown(false)
            setShowVerseDropdown(false)
            setShowLanguageDropdown(false)
            setShowSettingsDropdown(false)
          }}
        />
      )}

      <style jsx>{`
        .slider {
          -webkit-appearance: none;
          appearance: none;
          background: #d1d5db;
          outline: none;
          border-radius: 15px;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--primary-color);
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--primary-color);
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}
