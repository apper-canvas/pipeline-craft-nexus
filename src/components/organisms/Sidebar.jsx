import { Link, useLocation } from "react-router-dom"
import { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const navItems = [
  { path: "/", label: "Pipeline", icon: "BarChart3" },
  { path: "/tasks", label: "Tasks", icon: "CheckSquare" },
{ path: "/contacts", label: "Contacts", icon: "Users" },
  { path: "/leads", label: "Leads", icon: "Target" },
  { path: "/companies", label: "Companies", icon: "Building2" },
{ path: "/quotes", label: "Quotes", icon: "FileText" },
  { path: "/deals", label: "Deals", icon: "Handshake" },
  { path: "/sales-orders", label: "Sales Orders", icon: "ShoppingCart" }
]

const Sidebar = () => {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <>
      {/* Mobile overlay */}
      <div className="lg:hidden">
        <div className="fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <span className="sr-only">Close sidebar</span>
                <ApperIcon name="X" className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
              <div className="flex flex-shrink-0 items-center px-4">
                <Link 
                  to="/" 
                  className="flex items-center space-x-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                >
                  <ApperIcon name="TrendingUp" className="w-6 h-6 text-blue-600" />
                  <span>Pipeline</span>
                </Link>
              </div>
              <nav className="mt-8 space-y-1 px-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "group flex items-center space-x-3 px-3 py-3 rounded-lg font-medium transition-colors",
                        isActive 
                          ? "bg-blue-50 text-blue-700 border border-blue-200/60" 
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      <ApperIcon name={item.icon} className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={cn(
        "hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:flex-col transition-all duration-300",
        isCollapsed ? "lg:w-16" : "lg:w-64"
      )}>
        <div className="flex flex-col flex-grow bg-white/80 backdrop-blur-sm border-r border-gray-200/60 pt-5 overflow-y-auto">
          <div className="flex items-center justify-between flex-shrink-0 px-4">
            {!isCollapsed && (
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                <ApperIcon name="TrendingUp" className="w-6 h-6 text-blue-600" />
                <span>Pipeline</span>
              </Link>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="mt-8 flex-1 space-y-1 px-2 pb-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "group flex items-center px-3 py-3 rounded-lg font-medium transition-colors",
                    isCollapsed ? "justify-center" : "space-x-3",
                    isActive 
                      ? "bg-blue-50 text-blue-700 border border-blue-200/60" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                  title={isCollapsed ? item.label : ""}
                >
                  <ApperIcon name={item.icon} className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}

export default Sidebar