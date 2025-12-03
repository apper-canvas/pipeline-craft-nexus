import { useState, useEffect } from 'react'
import { taskService } from '@/services/api/taskService'
import { TASK_STATUSES, TASK_PRIORITIES } from '@/utils/constants'
import Layout from '@/components/organisms/Layout'
import Header from '@/components/organisms/Header'
import SearchBar from '@/components/molecules/SearchBar'
import TaskListItem from '@/components/molecules/TaskListItem'
import AddTaskModal from '@/components/organisms/AddTaskModal'
import Loading from '@/components/ui/Loading'
import Empty from '@/components/ui/Empty'
import ErrorView from '@/components/ui/ErrorView'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { cn } from '@/utils/cn'

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'board'

  useEffect(() => {
    loadTasks()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [tasks, searchTerm, selectedStatus, selectedPriority])

  const loadTasks = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await taskService.getAll()
      setTasks(data)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const applyFilters = () => {
    let filtered = tasks

    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description_c?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedStatus) {
      filtered = filtered.filter(task => task.status_c === selectedStatus)
    }

    if (selectedPriority) {
      filtered = filtered.filter(task => task.priority_c === selectedPriority)
    }

    setFilteredTasks(filtered)
  }

  const handleTaskClick = (task) => {
    setEditingTask(task)
  }

  const handleStatusChange = async (taskId, newStatus) => {
    const task = tasks.find(t => t.Id === taskId)
    if (!task) return

    const updatedTask = { ...task, status_c: newStatus }
    await taskService.update(taskId, updatedTask)
    loadTasks()
  }

  const handleDeleteTask = async (taskId) => {
    await taskService.delete(taskId)
    loadTasks()
  }

  const handleAddTask = () => {
    setEditingTask(null)
    setIsAddModalOpen(true)
  }

  const handleModalClose = () => {
    setIsAddModalOpen(false)
    setEditingTask(null)
  }

  const handleModalSuccess = () => {
    loadTasks()
  }

  const getStatusCounts = () => {
    const counts = {}
    Object.values(TASK_STATUSES).forEach(status => {
      counts[status] = tasks.filter(task => task.status_c === status).length
    })
    return counts
  }

  const getPriorityCounts = () => {
    const counts = {}
    Object.values(TASK_PRIORITIES).forEach(priority => {
      counts[priority] = tasks.filter(task => task.priority_c === priority).length
    })
    return counts
  }

  const statusCounts = getStatusCounts()
  const priorityCounts = getPriorityCounts()

  if (loading) {
    return (
      <Layout>
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loading />
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <ErrorView message={error} onRetry={loadTasks} />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
                <p className="text-gray-600 mt-1">
                  Manage your tasks and track progress
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      viewMode === 'list' 
                        ? "bg-blue-100 text-blue-600" 
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    <ApperIcon name="List" size={16} className="mr-1" />
                    List
                  </button>
                  <button
                    onClick={() => setViewMode('board')}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      viewMode === 'board' 
                        ? "bg-blue-100 text-blue-600" 
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    <ApperIcon name="Kanban" size={16} className="mr-1" />
                    Board
                  </button>
                </div>
                
                <Button onClick={handleAddTask}>
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  Add Task
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                      <p className="text-sm text-gray-600">{status}</p>
                    </div>
                    <ApperIcon 
                      name={status === 'Completed' ? 'CheckCircle' : 'Circle'} 
                      size={20} 
                      className="text-gray-400"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search tasks..."
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className={cn(
                      "h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    )}
                  >
                    <option value="">All Statuses</option>
                    {Object.values(TASK_STATUSES).map(status => (
                      <option key={status} value={status}>
                        {status} ({statusCounts[status] || 0})
                      </option>
                    ))}
                  </select>
                  
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className={cn(
                      "h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    )}
                  >
                    <option value="">All Priorities</option>
                    {Object.values(TASK_PRIORITIES).map(priority => (
                      <option key={priority} value={priority}>
                        {priority} ({priorityCounts[priority] || 0})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <Empty
                title="No tasks found"
                description={
                  searchTerm || selectedStatus || selectedPriority
                    ? "Try adjusting your filters to see more tasks"
                    : "Create your first task to get started"
                }
                action={{
                  label: "Add Task",
                  onClick: handleAddTask
                }}
              />
            ) : (
              filteredTasks.map(task => (
                <TaskListItem
                  key={task.Id}
                  task={task}
                  onClick={handleTaskClick}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen || !!editingTask}
        onClose={handleModalClose}
        task={editingTask}
        onSuccess={handleModalSuccess}
      />
    </Layout>
  )
}

export default Tasks