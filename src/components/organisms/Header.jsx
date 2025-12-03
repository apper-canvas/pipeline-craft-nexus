import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import UserMenu from "@/components/molecules/UserMenu";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import AddContactModal from "@/components/organisms/AddContactModal";
import AddDealModal from "@/components/organisms/AddDealModal";
import Pipeline from "@/components/pages/Pipeline";
import SearchBar from "@/components/molecules/SearchBar";
import { cn } from "@/utils/cn";

const Header = ({ 
  onSearch,
  searchResults = [],
  onSearchResultClick,
  onContactAdded,
  onDealAdded
}) => {
const [showAddContact, setShowAddContact] = useState(false)
  const [showAddDeal, setShowAddDeal] = useState(false)
  const location = useLocation()
  
  const navItems = [
    { path: "/", label: "Pipeline", icon: "BarChart3" },
    { path: "/contacts", label: "Contacts", icon: "Users" }
  ]
  
  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-40">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                <ApperIcon name="TrendingUp" className="w-6 h-6 text-blue-600" />
                <span>Pipeline</span>
              </Link>
              
              <nav className="hidden md:flex items-center space-x-6">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors",
                        isActive 
                          ? "bg-blue-50 text-blue-700 border border-blue-200/60" 
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      <ApperIcon name={item.icon} className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  )
})}
              </nav>
            </div>
            
            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              <SearchBar
                placeholder="Search contacts and deals..."
                onSearch={onSearch}
                showResults={true}
                results={searchResults}
                onResultClick={onSearchResultClick}
                className="hidden md:block w-80"
              />
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="default"
                  onClick={() => setShowAddContact(true)}
                  className="flex items-center space-x-2"
                >
                  <ApperIcon name="UserPlus" className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Contact</span>
                </Button>
                
                <Button
                  variant="primary"
                  size="default"
                  onClick={() => setShowAddDeal(true)}
                  className="flex items-center space-x-2"
                >
                  <ApperIcon name="Plus" className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Deal</span>
                </Button>
              </div>
              
              {/* User Actions */}
              <div className="flex items-center space-x-4">
                <UserMenu />
              </div>
            </div>
</div>
          {/* Mobile Search */}
          <div className="md:hidden pb-3">
            <SearchBar
              placeholder="Search contacts and deals..."
              onSearch={onSearch}
              showResults={true}
              results={searchResults}
              onResultClick={onSearchResultClick}
            />
          </div>
        </div>
      </header>
      
      <AddContactModal
        isOpen={showAddContact}
        onClose={() => setShowAddContact(false)}
        onSuccess={(contact) => {
          onContactAdded?.(contact)
          setShowAddContact(false)
        }}
      />
      
      <AddDealModal
        isOpen={showAddDeal}
        onClose={() => setShowAddDeal(false)}
        onSuccess={(deal) => {
          onDealAdded?.(deal)
          setShowAddDeal(false)
        }}
      />
    </>
  )
}

export default Header