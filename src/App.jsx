// src/App.jsx
import React, { useState, useEffect } from 'react'
import './App.css'
import { Header } from './components/header/Header.jsx'
import { Input } from './components/input/input.jsx'
import { TaskBoard } from './components/taskList/TaskBoard.jsx'
import { v4 as uuidv4 } from 'uuid'
import confetti from 'canvas-confetti'

export function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  // Create a new task
  const createTask = (text) => {
    const newTask = {
      id: uuidv4(),
      text,
      status: 'to-do',
      emoji: '',
    }
    setTasks((prev) => [...prev, newTask])
  }

  // Update a task’s status (column)
  const updateTaskStatus = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus }
          : task
      )
    )
    
    if (newStatus === 'complete') {
      triggerConfetti()
    }
  }

  function triggerConfetti() {
    const duration = 200; // 1.5s
    const end = Date.now() + duration;
  
    (function frame() {
      confetti({
        particleCount: 100,
        startVelocity: 20,
        spread: 360,
        colors: ['#FFC0CB', '#FF69B4', '#FFB6C1', '#DB7093', '#FF1493'],
        origin: {
          x: Math.random(),
          y: Math.random() * 0.8
        }
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }

  // Update a task’s emoji
  const updateTaskEmoji = (taskId, newEmoji) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, emoji: newEmoji }
          : task
      )
    )
  }

  // Remove a task
  const removeTask = (taskId) => {
    setTasks((prev) =>
      prev.filter((task) => task.id !== taskId)
    )
  }

  // Reorder tasks inside the same status
  const reorderTasks = (status, newOrderOfIds) => {
    setTasks((prev) => {
      // Filter out tasks that belong to other columns
      const tasksNotInColumn = prev.filter((t) => t.status !== status)

      // Rebuild the tasks for this column in the new order
      const reorderedColumnTasks = newOrderOfIds.map((id) => {
        return prev.find((t) => t.id === id)
      })

      // Combine them
      return [...tasksNotInColumn, ...reorderedColumnTasks]
    })
  }

  return (
    <div className="main">
      <Header />
      <Input onCreateTask={createTask} />
      <TaskBoard
        tasks={tasks}
        updateTaskStatus={updateTaskStatus}
        updateTaskEmoji={updateTaskEmoji}
        removeTask={removeTask}
        reorderTasks={reorderTasks}
      />
    </div>
  )
}
