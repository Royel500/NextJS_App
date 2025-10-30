'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react'; // menu icon

export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left: Page Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {children}
      </div>

    <div>
          {/* Mobile menu button (only visible on small & md screens) */}
       <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden mr-4 mt-5 p-2 rounded-md bg-white shadow text-gray-700 hover:bg-gray-50"
        >
          <Menu className="w-6 h-6" />
        </button>

</div>
      {/* Right: Sidebar Menu */}
      <div
        className={`
          fixed top-0 right-0 z-50
          w-64 bg-white shadow-lg p-6 h-screen
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:static lg:translate-x-0
        `}
      >
        <ul className="space-y-4 text-right">
          <li>
            <Link href="/admin-dashboard" className="text-blue-600 hover:underline">
              Overview
            </Link>
          </li>
          <li>
            <Link href="/admin-dashboard/users" className="text-blue-600 hover:underline">
              All Users
            </Link>
          </li>
          <li>
            <Link href="/admin-dashboard/orders" className="text-blue-600 hover:underline">
              All Orders
            </Link>
          </li>
          <li>
            <Link href="/admin-dashboard/manageprofile" className="text-blue-600 hover:underline">
              Manage Profile
            </Link>
          </li>
          <li>
            <Link href="/admin-dashboard/reports" className="text-blue-600 hover:underline">
              Reports
            </Link>
          </li>
          <li>
            <Link href="/admin-dashboard/settings" className="text-blue-600 hover:underline">
              Settings
            </Link>
          </li>
          <li>
            <Link href="/admin-dashboard/support" className="text-blue-600 hover:underline">
              Support
            </Link>
          </li>
        </ul>
      </div>

      {/* Background overlay when sidebar is open on small screens */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}
