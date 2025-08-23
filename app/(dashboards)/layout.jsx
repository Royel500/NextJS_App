import Link from 'next/link';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Left: Dynamic Page Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {children}
      </div>

      {/* Right: Sidebar Menu */}
      <div className="w-64 bg-white shadow-lg p-6 sticky top-0 h-screen">
        <ul className="space-y-4 text-right">
          <li>
            <Link href="/admin-dashboard/overview" className="text-blue-600 hover:underline">Overview</Link>
          </li>
          <li>
            <Link href="/admin-dashboard/users" className="text-blue-600 hover:underline">Users</Link>
          </li>
          <li>
            <Link href="/admin-dashboard/reports" className="text-blue-600 hover:underline">Reports</Link>
          </li>
          <li>
            <Link href="/admin-dashboard/settings" className="text-blue-600 hover:underline">Settings</Link>
          </li>
          <li>
            <Link href="/admin-dashboard/support" className="text-blue-600 hover:underline">Support</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
