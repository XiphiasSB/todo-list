import { useState } from 'react'
import './input.css'

export function Input({ onCreateTask }) {
  const [inputValue, setInputValue] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault() // Prevent page reload
    if (inputValue.trim()) {
      onCreateTask(inputValue) // Pass the input value to the parent
      setInputValue("") // Clear the input field
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add a task"
      />
      <button type="submit">Add</button> {/* Optional: Add a submit button */}
    </form>
  )
}
