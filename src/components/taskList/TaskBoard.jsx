// src/components/taskList/TaskBoard.jsx
import React, { useState } from 'react'
import './TaskBoard.css'  // <--- Import the board/container CSS
import {
  pointerWithin,
  DndContext,
  DragOverlay,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable'
import { TaskColumn } from './TaskColumn.jsx'
import { Task } from '../task/task.jsx'

// The statuses (columns) to display in order:
const STATUSES = ['to-do', 'in-progress', 'complete']

export function TaskBoard({
  tasks,
  updateTaskStatus,
  updateTaskEmoji,
  removeTask,
  reorderTasks
}) {
  // Build array: [{ status: "to-do", tasks: [...] }, ...]
  const columns = STATUSES.map((status) => ({
    status,
    tasks: tasks.filter((t) => t.status === status)
  }))

  // Track which task is currently being dragged
  const [activeId, setActiveId] = useState(null)
  const activeTask = tasks.find((t) => t.id === activeId)

  // Configure sensors & collision detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // e.g. activationConstraint: { distance: 5 }
    })
  )

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null); // Clear after dropping
  
    if (!over) return;
  
    // "activeContainer" is the column from which we started
    const activeContainer = active.data.current?.sortable?.containerId;
    // "overContainer" is usually the column we hover (but might be undefined if it's empty)
    let overContainer = over.data.current?.sortable?.containerId;
  
    // If dropping on an empty column, fallback to `over.id`
    const columnIds = ['to-do', 'in-progress', 'complete'];
    if (!overContainer && columnIds.includes(over.id)) {
      overContainer = over.id;
    }
  
    if (!activeContainer || !overContainer) return;
  
    // If we're moving to a different column
    if (activeContainer !== overContainer) {
      updateTaskStatus(active.id, overContainer);
      return;
    }
  
    // Otherwise, reorder within the same column
    if (active.id !== over.id) {
      const column = columns.find((col) => col.status === activeContainer);
      if (!column) return;
  
      const oldIndex = column.tasks.findIndex((t) => t.id === active.id);
      const newIndex = column.tasks.findIndex((t) => t.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;
  
      const newOrderOfIds = arrayMove(
        column.tasks.map((t) => t.id),
        oldIndex,
        newIndex
      );
      reorderTasks(activeContainer, newOrderOfIds);
    }
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {/* Your columns */}
      <div className="task-list-container">
        {columns.map((col) => (
          <SortableContext
            key={col.status}
            items={col.tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
            id={col.status}
          >
            <TaskColumn
              status={col.status}
              tasks={col.tasks}
              updateTaskEmoji={updateTaskEmoji}
              removeTask={removeTask}
            />
          </SortableContext>
        ))}
      </div>

      {/* The DragOverlay to allow free movement */}
      <DragOverlay>
        {activeTask ? (
          /* Force a certain width & center text so it doesn’t shift left */
          <div style={{textAlign: 'center' }}>
            <Task
              task={activeTask}
              updateTaskEmoji={updateTaskEmoji}
              removeTask={removeTask}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
