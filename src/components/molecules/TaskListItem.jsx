import { formatDate, formatRelativeTime } from '@/utils/formatters'
import { TASK_STATUSES, TASK_PRIORITIES, STATUS_COLORS, PRIORITY_COLORS } from '@/utils/constants'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import { cn } from '@/utils/cn'

const TaskListItem = ({ task, onClick, onStatusChange, onDelete }) => {
  const isOverdue = task.due_date_c && new Date(task.due_date_c) < new Date() && task.status_c !== 'Completed'
  
  const handleStatusClick = (e) => {
    e.stopPropagation()
    const currentIndex = Object.values(TASK_STATUSES).indexOf(task.status_c)
    const nextStatus = Object.values(TASK_STATUSES)[(currentIndex + 1) % Object.values(TASK_STATUSES).length]
    onStatusChange(task.Id, nextStatus)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this task?')) {
      onDelete(task.Id)
    }
  }

  return (
    <div 
      className={cn(
        "bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-pointer",
        isOverdue && "border-l-4 border-l-red-500",
        task.status_c === 'Completed' && "opacity-75"
      )}
      onClick={() => onClick(task)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-medium text-gray-900 mb-1",
            task.status_c === 'Completed' && "line-through text-gray-500"
          )}>
            {task.title_c}
          </h3>
          {task.description_c && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {task.description_c}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={handleStatusClick}
            className="p-1 hover:bg-gray-100 rounded"
            title={`Change status from ${task.status_c}`}
          >
            <Badge 
              variant={STATUS_COLORS[task.status_c]} 
              className="cursor-pointer"
            >
              {task.status_c}
            </Badge>
          </button>
          
          <button
            onClick={handleDelete}
            className="p-1 hover:bg-red-50 text-red-600 rounded"
            title="Delete task"
          >
            <ApperIcon name="Trash2" size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <Badge variant={PRIORITY_COLORS[task.priority_c]} size="sm">
            <ApperIcon name="Flag" size={12} className="mr-1" />
            {task.priority_c}
          </Badge>
          
          {task.assigned_to_c?.Name && (
            <div className="flex items-center text-gray-600">
              <ApperIcon name="User" size={12} className="mr-1" />
              {task.assigned_to_c.Name}
            </div>
          )}
          
          {task.related_to_c?.Name && (
            <div className="flex items-center text-gray-600">
              <ApperIcon name="Link" size={12} className="mr-1" />
              {task.related_to_c.Name}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3 text-gray-500">
          {task.due_date_c && (
            <div className={cn(
              "flex items-center",
              isOverdue && "text-red-600 font-medium"
            )}>
              <ApperIcon name="Calendar" size={12} className="mr-1" />
              {isOverdue ? 'Overdue' : formatRelativeTime(task.due_date_c)}
            </div>
          )}
          
          <div className="flex items-center">
            <ApperIcon name="Clock" size={12} className="mr-1" />
            {formatRelativeTime(task.CreatedOn)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskListItem