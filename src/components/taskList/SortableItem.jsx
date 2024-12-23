import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task } from '../task/task.jsx'

export function SortableItem({ task, updateTaskEmoji, removeTask }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1
  }

  // Instead of spreading {...attributes} {...listeners} on this wrapper,
  // we pass them as props to <Task> so the Task can decide which area is draggable.
  return (
    <div ref={setNodeRef} style={style}>
      <Task
        task={task}
        updateTaskEmoji={updateTaskEmoji}
        removeTask={removeTask}
        dragAttributes={attributes}
        dragListeners={listeners}
      />
    </div>
  )
}
