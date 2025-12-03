import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '@/layouts/Root';
import ApperIcon from '@/components/ApperIcon';
import Avatar from '@/components/atoms/Avatar';
import { cn } from '@/utils/cn';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useSelector(state => state.user);
  const { logout } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Avatar 
          name={user.firstName ? `${user.firstName} ${user.lastName}` : user.emailAddress} 
          size="sm" 
        />
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-900">
            {user.firstName ? `${user.firstName} ${user.lastName}` : user.emailAddress}
          </div>
          {user.accounts?.[0]?.companyName && (
            <div className="text-xs text-gray-500">
              {user.accounts[0].companyName}
            </div>
          )}
        </div>
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          className="w-4 h-4 text-gray-400" 
        />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-3 border-b border-gray-100">
              <div className="text-sm font-medium text-gray-900">
                {user.firstName ? `${user.firstName} ${user.lastName}` : user.emailAddress}
              </div>
              <div className="text-xs text-gray-500">
                {user.emailAddress}
              </div>
            </div>
            <div className="py-1">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ApperIcon name="LogOut" className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;