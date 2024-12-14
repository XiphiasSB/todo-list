import React, { useState } from 'react'
import './taskList.css'
import { Task } from '../task/task.jsx'
import confetti from 'canvas-confetti' // Ensure this is imported

export function TaskList({ tasks, updateTaskStatus, updateTaskEmoji, removeTask }) {
  const [dragOverColumn, setDragOverColumn] = useState(null) // Track the column being dragged over

  const handleDragOver = (event, column) => {
    event.preventDefault() // Allow drop
    setDragOverColumn(column) // Set the current column as the active drop zone
  }

  const handleDragLeave = () => {
    setDragOverColumn(null) // Clear the active drop zone
  }

  const handleDrop = (event, newStatus) => {
    event.preventDefault()
    const taskId = event.dataTransfer.getData("text/plain")
    updateTaskStatus(taskId, newStatus)

    // Trigger confetti if the task is dropped into the "Complete" column
    if (newStatus === "complete") {
      triggerConfetti()
    }

    setDragOverColumn(null) // Clear the active drop zone after dropping
  }

  const handleDragStart = (event, task) => {
    event.dataTransfer.setData("text/plain", task.id) // Pass the task ID
    event.dataTransfer.effectAllowed = "move"
  }

  const triggerConfetti = () => {
    const duration = 200 // Confetti will last for 2 seconds
    const end = Date.now() + duration
  
    const frame = () => {
      confetti({
        particleCount: 50, // Increased number of particles for each burst
        spread: 120, // Wider spread for a bigger effect
        startVelocity: 45, // Particles shoot out faster
        origin: {
          x: Math.random(), // Random horizontal start positions
          y: Math.random() * 0.8, // Confetti appears in the upper third
        },
      })
  
      if (Date.now() < end) {
        requestAnimationFrame(frame) // Keep firing bursts until duration ends
      }
    }
  
    frame() // Start the confetti effect
  }
  

  const renderTasks = (tasks) =>
    tasks.map((task) => (
      <Task
        key={task.id}
        task={task}
        onDragStart={handleDragStart}
        onRemove={removeTask}
        updateEmoji={updateTaskEmoji}
      />
    ))

  return (
    <div className="task-list-container">
      {/* To-Do Column */}
      <div
        className={`task-column ${dragOverColumn === "to-do" ? "drag-over" : ""}`}
        onDragOver={(event) => handleDragOver(event, "to-do")}
        onDragLeave={handleDragLeave}
        onDrop={(event) => handleDrop(event, "to-do")}
      >
        <h3>To-Do</h3>
        {renderTasks(tasks.filter((task) => task.status === "to-do"))}
      </div>

      {/* In-Progress Column */}
      <div
        className={`task-column ${dragOverColumn === "in-progress" ? "drag-over" : ""}`}
        onDragOver={(event) => handleDragOver(event, "in-progress")}
        onDragLeave={handleDragLeave}
        onDrop={(event) => handleDrop(event, "in-progress")}
      >
        <h3>In-Progress</h3>
        {renderTasks(tasks.filter((task) => task.status === "in-progress"))}
      </div>

      {/* Complete Column */}
      <div
        className={`task-column ${dragOverColumn === "complete" ? "drag-over" : ""}`}
        onDragOver={(event) => handleDragOver(event, "complete")}
        onDragLeave={handleDragLeave}
        onDrop={(event) => handleDrop(event, "complete")}
      >
        <h3>Complete</h3>
        {renderTasks(tasks.filter((task) => task.status === "complete"))}
      </div>
    </div>
  )
}
