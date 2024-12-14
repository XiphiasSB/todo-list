import { useState, useEffect } from 'react'
import './App.css'
import { Header } from './components/header/Header.jsx'
import { Input } from './components/input/input.jsx'
import { TaskList } from './components/taskList/TaskList.jsx'

export function App() {
  const [tasks, setTasks] = useState(() => {
    // Load tasks from localStorage when the app starts
    const savedTasks = localStorage.getItem('tasks')
    return savedTasks ? JSON.parse(savedTasks) : [] // Parse tasks or start with an empty array
  })

  // Save tasks to localStorage whenever the state changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const createTask = (text) => {
    const newTask = {
      id: tasks.length + 1,
      text,
      status: "to-do",
      emoji: "" // Add emoji property to task
    }
    setTasks([...tasks, newTask])
  }

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === parseInt(taskId) ? { ...task, status: newStatus } : task
      )
    )
  }

  const updateTaskEmoji = (taskId, newEmoji) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === parseInt(taskId) ? { ...task, emoji: newEmoji } : task
      )
    )
  }

  const removeTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
  }

  return (
    <div className="main">
      <Header />
      <Input onCreateTask={createTask} />
      <TaskList
        tasks={tasks}
        updateTaskStatus={updateTaskStatus}
        updateTaskEmoji={updateTaskEmoji}
        removeTask={removeTask}
      />
    </div>
  )
}
