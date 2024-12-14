import React from 'react'
import './taskList.css'
import { Task } from '../task/task.jsx'
import { DndContext, useDroppable } from '@dnd-kit/core'
import confetti from 'canvas-confetti'

export function TaskList({ tasks, updateTaskStatus, updateTaskEmoji, removeTask }) {
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
          y: Math.random() * 0.8, // Confetti appears in the upper part
        },
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    frame()
  }

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

  return (
    <div
      ref={setNodeRef}
      className={`task-column ${isOver ? 'drag-over' : ''}`}
    >
      <h3>{status.replace('-', ' ').toUpperCase()}</h3>
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
