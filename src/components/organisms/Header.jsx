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

const Header = () => {
  const location = useLocation()
  
return (
    <>
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-40">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button - only show on mobile */}
            <div className="lg:hidden">
              <button
                type="button"
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <ApperIcon name="Menu" className="w-5 h-5" />
              </button>
            </div>
            
            {/* Logo - only show on mobile, hidden on desktop since it's in sidebar */}
            <div className="lg:hidden">
<Link 
                to="/" 
                className="flex items-center space-x-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                <ApperIcon name="TrendingUp" className="w-6 h-6 text-blue-600" />
                <span>PipeLine Pro</span>
              </Link>
            </div>
            
            {/* Desktop spacing */}
            <div className="hidden lg:block flex-1"></div>
            
            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
{/* Global search removed - each page has its own search */}
              
{/* Add buttons moved to respective pages */}
              
              {/* User Actions */}
              <div className="flex items-center space-x-4">
                <UserMenu />
              </div>
            </div>
</div>
          {/* Mobile Search */}
{/* Mobile search removed - each page has its own search */}
        </div>
      </header>
      
{/* Modals moved to respective pages */}
    </>
  )
}

export default Header