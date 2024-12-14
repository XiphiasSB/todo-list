import './task.css'
import { useState } from 'react'

export function Task({ task, onDragStart, onRemove, updateEmoji }) {
  const [showPicker, setShowPicker] = useState(false) // State to toggle emoji picker visibility

  const handleEmojiSelect = (selectedEmoji) => {
    updateEmoji(task.id, selectedEmoji) // Update emoji in parent state
    setShowPicker(false) // Close the picker
  }

  return (
    <div
      className="task"
      draggable="true"
      onDragStart={(event) => onDragStart(event, task)}
    >
      {/* Emoji Display */}
      <div className="emoji-container" onClick={() => setShowPicker(!showPicker)}>
        {task.emoji ? <span className="selected-emoji">{task.emoji}</span> : <span className="placeholder-emoji">+</span>}
        {showPicker && (
          <div className="emoji-picker">
            <span onClick={() => handleEmojiSelect("😊")} role="button">😊</span>
            <span onClick={() => handleEmojiSelect("❤️")} role="button">❤️</span>
            <span onClick={() => handleEmojiSelect("🌧️")} role="button">🌧️</span>
            <span onClick={() => handleEmojiSelect("🌞")} role="button">🌞</span>
            <span onClick={() => handleEmojiSelect("📅")} role="button">📅</span>
            <span onClick={() => handleEmojiSelect("😭")} role="button">😭</span>
            <span onClick={() => handleEmojiSelect("🎉")} role="button">🎉</span>
            <span onClick={() => handleEmojiSelect("+")} role="button">+</span> {/* No emoji */}
          </div>
        )}
      </div>

      {/* Task Text */}
      <p>{task.text}</p>
      
      {/* Remove Task Button */}
      <button
        className="remove-task-button"
        onClick={() => onRemove(task.id)}
      >
        ×
      </button>
    </div>
  )
}
