import './task.css'
import { EmojiPicker } from './emoji/emojiPicker.jsx'
import { useState, useEffect, useRef } from 'react'

export function Task({
  task,
  updateTaskEmoji,
  removeTask,
  dragAttributes,
  dragListeners
}) {
  const [showPicker, setShowPicker] = useState(false)
  const emojiRef = useRef(null)

  const handleEmojiSelect = (emoji) => {
    updateTaskEmoji(task.id, emoji)
    setShowPicker(false)
  }

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowPicker(false)
      }
    }
    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPicker])

  return (
    <div className="task">
      {/* The draggable region */}
      <div
        className="task-handle"
        {...dragAttributes}
        {...dragListeners}
      >
        <p>{task.text}</p>
      </div>

      {/* Emoji button in the top-left corner */}
      <div className="task-emoji-button" ref={emojiRef}>
        <EmojiPicker
          selectedEmoji={task.emoji}
          onSelectEmoji={handleEmojiSelect}
          showPicker={showPicker}
          togglePicker={() => setShowPicker(!showPicker)}
        />
      </div>

      {/* “×” remove button in the top-right corner */}
      <button
        className="remove-task-button"
        onClick={() => removeTask(task.id)}
      >
        ×
      </button>
    </div>
  )
}
