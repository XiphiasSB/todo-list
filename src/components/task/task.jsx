import './task.css'
import { useDraggable } from '@dnd-kit/core'
import { EmojiPicker } from './emoji/emojiPicker.jsx'
import { useState, useEffect, useRef } from 'react'

export function Task({ task, updateTaskEmoji, removeTask }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id.toString(),
  })

  const [showPicker, setShowPicker] = useState(false)
  const emojiRef = useRef(null) // Ref for emoji container

  const handleEmojiSelect = (emoji) => {
    updateTaskEmoji(task.id, emoji)
    setShowPicker(false)
  }

  const handleStopPropagation = (e) => {
    e.stopPropagation() // Prevent drag
  }

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowPicker(false) // Close picker
      }
    }

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPicker])

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    willChange: 'transform',
    transition: isDragging ? 'none' : 'transform 0.2s ease',
  }

  return (
    <div ref={setNodeRef} className="task" style={style}>
      <div className="task-content" {...listeners} {...attributes}>
        <p>{task.text}</p>
      </div>

      <div ref={emojiRef}>
        <EmojiPicker
          selectedEmoji={task.emoji}
          onSelectEmoji={(emoji) => handleEmojiSelect(emoji)}
          showPicker={showPicker}
          togglePicker={() => setShowPicker(!showPicker)}
        />
      </div>

      <button
        className="remove-task-button"
        onClick={(e) => {
          handleStopPropagation(e) // Prevent drag
          removeTask(task.id)
        }}
        style={{ pointerEvents: 'auto' }}
      >
        ×
      </button>
    </div>
  )
}
