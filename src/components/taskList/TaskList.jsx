import React, { useEffect } from 'react'
import './taskList.css'
import { Task } from '../task/task.jsx'
import { DndContext, useDroppable } from '@dnd-kit/core'
import confetti from 'canvas-confetti'

export function TaskList({ tasks, updateTaskStatus, updateTaskEmoji, removeTask }) {
  useEffect(() => {
    const handleTouchMove = (e) => {
      if (e.target.closest('.task')) {
        e.preventDefault()
      }
    }

    document.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      document.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (over) {
      const newStatus = over.id // The ID of the column where the task was dropped
      const task = tasks.find((task) => task.id.toString() === active.id) // Find the dragged task

      // Only update and trigger confetti if the task is moved to a new column
      if (task && task.status !== newStatus) {
        updateTaskStatus(active.id, newStatus)

        if (newStatus === 'complete') {
          triggerConfetti()
        }
      }
    }
  }

  const triggerConfetti = () => {
    const duration = 200 // Confetti duration
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 100,
        spread: 120,
        startVelocity: 45,
        origin: {
          x: Math.random(),
          y: Math.random() * 0.8,
        },
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    frame()
  }

  const capitalizeWords = (text) =>
    text
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('-')

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="task-list-container">
        <DroppableColumn id="to-do" tasks={tasks} status="to-do" updateTaskEmoji={updateTaskEmoji} removeTask={removeTask} />
        <DroppableColumn id="in-progress" tasks={tasks} status="in-progress" updateTaskEmoji={updateTaskEmoji} removeTask={removeTask} />
        <DroppableColumn id="complete" tasks={tasks} status="complete" updateTaskEmoji={updateTaskEmoji} removeTask={removeTask} />
      </div>
    </DndContext>
  )
}

function DroppableColumn({ id, tasks, status, updateTaskEmoji, removeTask }) {
  const { isOver, setNodeRef } = useDroppable({ id })
  const columnTasks = tasks.filter((task) => task.status === status)

  function capitalizeWords(text) {
    return text
      .split('-') // Split by hyphen instead of space
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('-') // Join with hyphen instead of space
  }

  return (
    <div
      ref={setNodeRef}
      className={`task-column ${isOver ? 'drag-over' : ''}`}
    >
      <h3>{capitalizeWords(status)}</h3>
      {columnTasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          updateTaskEmoji={updateTaskEmoji}
          removeTask={removeTask}
        />
      ))}
    </div>
  )
}