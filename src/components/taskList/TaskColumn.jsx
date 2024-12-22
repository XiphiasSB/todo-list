// src/components/taskList/TaskColumn.jsx
import React from 'react'
import './TaskColumn.css'  // <-- column styling
import { useDroppable } from '@dnd-kit/core'
import { SortableItem } from './SortableItem.jsx'

export function TaskColumn({ status, tasks, updateTaskEmoji, removeTask }) {
  // Make this column droppable
  const { isOver, setNodeRef } = useDroppable({ id: status })

  const capitalizeWords = (text) =>
    text
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('-')

  return (
    <div
      ref={setNodeRef}
      className={`task-column ${isOver ? 'drag-over' : ''}`}
    >
      <h3>{capitalizeWords(status)}</h3>
      {tasks.map((task) => (
        <SortableItem
          key={task.id}
          task={task}
          updateTaskEmoji={updateTaskEmoji}
          removeTask={removeTask}
        />
      ))}
    </div>
  )
}
