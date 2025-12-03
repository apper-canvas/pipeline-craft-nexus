import { Link } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-blue-600" />
        </div>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
          Page Not Found
        </h1>
        
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. The page might have been moved or doesn't exist.
        </p>
        
        <div className="space-y-4">
          <Link to="/">
            <Button variant="primary" size="lg" className="w-full">
              <ApperIcon name="Home" className="w-5 h-5 mr-2" />
              Back to Pipeline
            </Button>
          </Link>
          
          <Link to="/contacts">
            <Button variant="secondary" size="lg" className="w-full">
              <ApperIcon name="Users" className="w-5 h-5 mr-2" />
              View Contacts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound