
'use client';
import React, { useState } from 'react';
import Head from 'next/head';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [email, setEmail] = useState('user@example.com');
  const [name, setName] = useState('John Doe');

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Head>
        <title>Settings</title>
        <meta name="description" content="Account settings page" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Settings</h1>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-white'}`}
            >
              {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* Profile Section */}
            <div className="border-b dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4">Profile</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                </div>
                <div className="flex-grow">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border dark:border-gray-600 rounded bg-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border dark:border-gray-600 rounded bg-transparent"
                      />
                    </div>
                  </div>
                  <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="border-b dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4">Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enable Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive important updates
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications}
                      onChange={() => setNotifications(!notifications)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Language</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Website language preference
                    </p>
                  </div>
                  <select className="p-2 border dark:border-gray-600 rounded bg-transparent">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Account</h2>
              <div className="space-y-4">
                <button className="w-full text-left py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                  <h3 className="font-medium">Change Password</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Update your authentication password
                  </p>
                </button>
                
                <button className="w-full text-left py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Add extra security to your account
                  </p>
                </button>
                
                <button className="w-full text-left py-3 px-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                  <h3 className="font-medium">Delete Account</h3>
                  <p className="text-sm text-red-400">
                    Permanently remove your account and data
                  </p>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Settings updated automatically when changed</p>
            <p className="mt-2">App Version 1.2.3</p>
          </div>
        </div>
      </main>
    </div>
  );
}