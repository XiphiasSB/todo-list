import ReactDOM from 'react-dom'
import './emoji.css'
import { useState, useRef, useEffect } from 'react'

export function EmojiPicker({ selectedEmoji, onSelectEmoji }) {
  const [showPicker, setShowPicker] = useState(false)
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 })
  const containerRef = useRef(null)
  const pickerRef = useRef(null)

  const handleEmojiSelect = (emoji) => {
    onSelectEmoji(emoji)
    setShowPicker(false)
  }

  const handleOpenPicker = (e) => {
    e.stopPropagation()
    setShowPicker(!showPicker)

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setPickerPosition({
        top: rect.bottom + window.scrollY, // Adjust for scrolling
        left: rect.left + window.scrollX, // Adjust for horizontal scrolling
      })
    }
  }

  const handleClickOutside = (e) => {
    if (
      pickerRef.current &&
      !pickerRef.current.contains(e.target) &&
      !containerRef.current.contains(e.target)
    ) {
      setShowPicker(false)
    }
  }

  useEffect(() => {
    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPicker])

  const emojiPicker = (
    <div
      ref={pickerRef}
      className="emoji-picker"
      style={{
        top: pickerPosition.top,
        left: pickerPosition.left,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <span onClick={() => handleEmojiSelect('😊')} role="button">😊</span>
      <span onClick={() => handleEmojiSelect('❤️')} role="button">❤️</span>
      <span onClick={() => handleEmojiSelect('🌞')} role="button">🌞</span>
      <span onClick={() => handleEmojiSelect('📅')} role="button">📅</span>
      <span onClick={() => handleEmojiSelect('😭')} role="button">😭</span>
      <span onClick={() => handleEmojiSelect('🎉')} role="button">🎉</span>
      <span onClick={() => handleEmojiSelect('😇')} role="button">😇</span>
      <span onClick={() => handleEmojiSelect('🤩')} role="button">🤩</span>
      <span onClick={() => handleEmojiSelect('🤢')} role="button">🤢</span>
      <span onClick={() => handleEmojiSelect('😵')} role="button">😵</span>
      <span onClick={() => handleEmojiSelect('💪')} role="button">💪</span>
      <span onClick={() => handleEmojiSelect('🧠')} role="button">🧠</span>
      <span onClick={() => handleEmojiSelect('👩‍🎓')} role="button">👩‍🎓</span>
      <span onClick={() => handleEmojiSelect('🌳')} role="button">🌳</span>
      <span onClick={() => handleEmojiSelect('🐾')} role="button">🐾</span>
      <span onClick={() => handleEmojiSelect('+')} role="button">+</span> {/* No emoji */}
    </div>
  )

  return (
    <div
      ref={containerRef}
      className="emoji-container"
      onClick={handleOpenPicker}
    >
      {selectedEmoji ? (
        <span className="selected-emoji">{selectedEmoji}</span>
      ) : (
        <span className="placeholder-emoji">+</span>
      )}
      {showPicker && ReactDOM.createPortal(emojiPicker, document.body)}
    </div>
  )
}
