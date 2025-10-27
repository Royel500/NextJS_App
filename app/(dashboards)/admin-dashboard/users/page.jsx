"use client";

import React, { useState, useEffect } from 'react';

export default function UsersPage() {
  // State management
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  
  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Fetching users...');
        const response = await fetch('/api/auth/action');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API response:', data);
        
        // Handle different response structures
        let usersArray = [];
        if (Array.isArray(data)) {
          usersArray = data;
        } else if (data && Array.isArray(data.users)) {
          usersArray = data.users;
        } else if (data.success && Array.isArray(data.users)) {
          usersArray = data.users;
        } else if (Array.isArray(data.data)) {
          usersArray = data.data;
        }
        
        console.log('Final users array:', usersArray);
        setUsers(usersArray);
        setFilteredUsers(usersArray);
        
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Search functionality
  useEffect(() => {
    const results = users.filter(user => 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
    setCurrentPage(1);
  }, [searchTerm, users]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Status badge styling
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Role badge styling
  const getRoleClass = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'editor':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Verification badge styling
  const getVerificationClass = (verified) => {
    return verified 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  // Check if user is protected (admin with specific email)
  const isProtectedUser = (user) => {
    return user.role === 'admin' && user.email === 'webdev.royelali@gmail.com';
  };

  // Check if user is fully verified
  const isFullyVerified = (user) => {
    return user.emailVerified && user.phoneVerified;
  };

  // Handle verify user
  const handleVerify = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleVerifyConfirm = async (verifyType) => {
    if (!selectedUser) return;

    if (verifyType === 'email') {
      setVerifyingEmail(true);
    } else {
      setVerifyingPhone(true);
    }

    try {
      const updateData = verifyType === 'email' 
        ? { emailVerified: true }
        : { phoneVerified: true };

      console.log('Sending verification update:', {
        userId: selectedUser._id,
        updateData: updateData
      });

      const response = await fetch(`/api/auth/action/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();
      console.log('Update response:', result);

      if (response.ok && result.success) {
        // Update the user in state
        const updatedUser = {
          ...selectedUser,
          ...updateData
        };
        
        setUsers(users.map(user => 
          user._id === selectedUser._id ? updatedUser : user
        ));
        setSelectedUser(updatedUser);
        
        alert(`${verifyType === 'email' ? 'Email' : 'Phone'} verified successfully!`);
        
      } else {
        alert(`Error: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      alert('Network error. Please try again.');
    } finally {
      if (verifyType === 'email') {
        setVerifyingEmail(false);
      } else {
        setVerifyingPhone(false);
      }
    }
  };

  // Handle edit user
  const handleEdit = (user) => {
    setEditingUser({...user});
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/auth/action/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role,
          status: editingUser.status
        }),
      });

      const result = await response.json();
      console.log('Edit response:', result);

      if (response.ok && result.success) {
        setUsers(users.map(user => 
          user._id === editingUser._id ? editingUser : user
        ));
        setShowEditModal(false);
        setEditingUser(null);
        alert('User updated successfully!');
      } else {
        alert(`Error updating user: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Network error. Please try again.');
    }
  };

  // Handle delete user
  const handleDelete = async (userId, userEmail, userRole) => {
    // Check if user is protected
    if (userRole === 'admin' && userEmail === 'webdev.royelali@gmail.com') {
      alert('This admin user cannot be deleted.');
      return;
    }

    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch(`/api/auth/action/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Remove user from state
          setUsers(users.filter(user => user._id !== userId));
          alert('User deleted successfully');
        } else {
          alert(`Error deleting user: ${result.error || 'Unknown error'}`);
        }
      } else {
        const errorData = await response.json();
        alert(`Error deleting user: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">
            Manage all registered users and their verifications
          </p>
        </div>

        {/* Search and Action Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Search users by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg 
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {/* <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg flex items-center transition">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New User
            </button> */}
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email Verified
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone Verified
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentUsers.length > 0 ? (
                      currentUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-15 w-15 bg-gray-200 rounded-full flex items-center 
                              justify-center text-gray-700 font-bold">
                                {/* {user.name?.charAt(0) || 'U'} */}
        
                  <img
                    src={user?.photoURL || `/api/placeholder/128/128`}
                    alt="Profile"
                    className="h-15 w-15 rounded-full object-cover"
                  />

                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name || 'No Name'}</div>
                                <div className="text-sm text-gray-500">{user.email || 'No Email'}</div>
                                <div className="text-sm text-gray-500">{user.phone || 'No Phone'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleClass(user.role)}`}>
                              {user.role || 'User'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(user.status)}`}>
                              {user.status || 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getVerificationClass(user.emailVerified)}`}>
                              {user.emailVerified ? 'Verified' : 'Not Verified'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getVerificationClass(user.phoneVerified)}`}>
                              {user.phoneVerified ? 'Verified' : 'Not Verified'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            {/* Verify Button - Shows "Verified" when both are verified */}
                            <button 
                              onClick={() => handleVerify(user)}
                              disabled={isFullyVerified(user)}
                              className={`${
                                isFullyVerified(user) 
                                  ? ' bg-green-600 py-1 text-white px-2 rounded cursor-not-allowed' 
                                  : 'text-white py-1 bg-pink-500 rounded px-2 hover:text-green-900'
                              }`}
                            >
                              {isFullyVerified(user) ? 'Verified' : 'Verify'}
                            </button>
                            
                            {/* Edit Button */}
                            <button 
                              onClick={() => handleEdit(user)}
                              className="text-white px-2 rounded py-1 bg-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            
                            {/* Delete Button - Disabled for protected user */}
                            <button 
                              onClick={() => handleDelete(user._id, user.email, user.role)}
                              disabled={isProtectedUser(user)}
                              className={`${
                                isProtectedUser(user)
                                  ? 'text-white px-2 rounded bg-red-500 py-1  cursor-not-allowed'
                                  : 'text-white px-2 py-1 rounded bg-red-500 hover:text-red-900'
                              }`}
                            >
                              Block
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-24 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
                            <p className="mt-1 text-gray-500">
                              {users.length === 0 ? 'No users in the system.' : 'Try adjusting your search or filter.'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>


              {/* Pagination */}
              {filteredUsers.length > itemsPerPage && (
                <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredUsers.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredUsers.length}</span> users
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`px-4 py-2 rounded-md ${
                          currentPage === number
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Verify User Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Verify User</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                  disabled={verifyingEmail || verifyingPhone}
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold text-lg">
                    {selectedUser.name?.charAt(0) || 'U'}
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-medium text-gray-900">{selectedUser.name || 'No Name'}</div>
                    <div className="text-sm text-gray-500">{selectedUser.email || 'No Email'}</div>
                    <div className="text-sm text-gray-500">{selectedUser.phone || 'No Phone'}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Email Verification</div>
                    <div className="text-sm text-gray-500">
                      Status: {selectedUser.emailVerified ? 'Verified' : 'Not Verified'}
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getVerificationClass(selectedUser.emailVerified)}`}>
                    {selectedUser.emailVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Phone Verification</div>
                    <div className="text-sm text-gray-500">
                      Status: {selectedUser.phoneVerified ? 'Verified' : 'Not Verified'}
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getVerificationClass(selectedUser.phoneVerified)}`}>
                    {selectedUser.phoneVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={verifyingEmail || verifyingPhone}
                >
                  Cancel
                </button>
                {!selectedUser.emailVerified && (
                  <button
                    onClick={() => handleVerifyConfirm('email')}
                    disabled={verifyingEmail || verifyingPhone}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {verifyingEmail ? 'Verifying...' : 'Verify Email'}
                  </button>
                )}
                {!selectedUser.phoneVerified && (
                  <button
                    onClick={() => handleVerifyConfirm('phone')}
                    disabled={verifyingEmail || verifyingPhone}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {verifyingPhone ? 'Verifying...' : 'Verify Phone'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Edit User</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editingUser.name || ''}
                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingUser.email || ''}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={editingUser.role || 'user'}
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingUser.status || 'active'}
                    onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}