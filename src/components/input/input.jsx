import { useState } from 'react'
import './input.css'

export function Input({ onCreateTask }) {
  return (
    <form
      action={(formData) => {
        const taskText = formData.get("task") // Extract the input value
        if (taskText.trim()) {
          onCreateTask(taskText) // Pass the input value to the parent
        }
      }}
    >
      <input
        type="text"
        name="task"
        placeholder="Add a task"
      />
      <button type="submit">Add</button>
    </form>
  )
}
