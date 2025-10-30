// app/profile/page.js
"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { MdVerified } from "react-icons/md";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (session?.user?.id) {
      fetchCurrentUserData();
    }
  }, [session, status, router]);

  const fetchCurrentUserData = async () => {
    try {
      const response = await fetch(`/api/profile/${session.user.id}`);
      const result = await response.json();
      console.log(result);
      
      if (result.success) {
        setUserData(result.user);
        setFormData(result.user);
      } else {
        Swal.fire('Error', result.error, 'error');
      }
    } catch (error) {
      console.error('Fetch user data error:', error);
      Swal.fire('Error', 'Failed to load profile data', 'error');
    } finally {
      setLoading(false);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fetch(`/api/profile/${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setUserData(result.user);
        setEditing(false);
        Swal.fire('Success', 'Profile updated successfully!', 'success');
      } else {
        Swal.fire('Error', result.error, 'error');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      Swal.fire('Error', 'Failed to update profile', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setFormData(userData);
    setEditing(false);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Profile Not Found
          </h2>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Manage your personal information and account settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Profile Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
              {/* Profile Photo */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={userData.photoURL || `/api/placeholder/128/128`}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-100
                     dark:border-blue-900 mx-auto"
                  />
                  {editing && (
                    <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition shadow-lg">
                      <i className="fas fa-camera text-sm"></i>
                    </button>
                  )}

                  <div className='absolute left-23 top-28'><MdVerified  className="w-7 h-7 fill-current text-green-600" /></div>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mt-4">
                  {userData.name}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 capitalize">{userData.role}</p>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    userData.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    <i className={`fas fa-circle mr-1 text-xs ${userData.status === 'active' ? 'text-green-500' : 'text-red-500'}`}></i>
                    {userData.status || 'active'}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">Member Since</span>
                  <span className="text-gray-800 dark:text-white text-sm font-medium">
                    {new Date(userData.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
              

                <div className="flex justify-between items-center">
                  <div className="text-gray-600 whitespace-nowrap dark:text-gray-300 text-sm">Email <span
  className={` font-bold ${
    userData.emailVerified
      ? 'text-green-600 dark:text-green-400'
      : 'text-orange-600 dark:text-orange-400'
  }`}
>
  {userData.emailVerified ? 'Verified' : 'Unverified'}
</span>
</div>
                  <span className="text-green-600 dark:text-green-400 text-sm">
                    <i className="fas fa-check-circle"></i>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium"
                  >
                    <i className="fas fa-edit"></i>
                    Edit Profile
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={handleSave}
                      disabled={updating}
                      className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-green-400 transition flex items-center justify-center gap-2 font-medium"
                    >
                      {updating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save"></i>
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2 font-medium"
                    >
                      <i className="fas fa-times"></i>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Profile Details */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              {/* Personal Information Section */}
              <div className="border-b border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <i className="fas fa-user text-blue-600 dark:text-blue-400 text-xl"></i>
                    </div>
                    Personal Information
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <i className="fas fa-id-card"></i>
                    Your personal details
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white transition"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-gray-800 dark:text-white font-semibold text-lg">{userData.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-800 dark:text-white font-semibold text-lg">{userData.email}</p>
                      <span className="text-green-600 bg-amber-100 rounded-2xl dark:text-green-400 text-sm
                       dark:bg-green-900 px-2 ">
                        <i className="fas fa-check-circle "></i>
                                        <p
  className={`text-xs mx-1 p-1 font-bold ${
    userData.emailVerified
      ? 'text-green-600 dark:text-green-400'
      : 'text-orange-600 dark:text-orange-400'
  }`}
>
  {userData.emailVerified ? 'Verified' : 'Unverified'}
</p>
                      </span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white transition"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-gray-800 dark:text-white font-semibold text-lg">
                          {userData.phone || 'Not provided'}
                        </p>
                        {userData.phone && (
                          <span className="text-orange-600 bg-amber-100 dark:text-orange-400
                           text-sm  dark:bg-orange-900 px-2 rounded-2xl">
                            <i className="fas fa-clock "></i>
                <p
  className={`text-xs font-bold ${
    userData.phoneVerified
      ? 'text-green-600 dark:text-green-400'
      : 'text-orange-600 dark:text-orange-400'
  }`}
>
  {userData.phoneVerified ? 'Verified' : 'Unverified'}
</p>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date of Birth
                    </label>
                    {editing ? (
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white transition"
                      />
                    ) : (
                      <p className="text-gray-800 dark:text-white font-semibold text-lg">
                        {userData.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString() : 'Not provided'}
                      </p>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Gender
                    </label>
                    {editing ? (
                      <select
                        name="gender"
                        value={formData.gender || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white transition"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    ) : (
                      <p className="text-gray-800 dark:text-white font-semibold text-lg capitalize">
                        {userData.gender || 'Not specified'}
                      </p>
                    )}
                  </div>

                  {/* Role */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Account Role
                    </label>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-800 dark:text-white font-semibold text-lg capitalize">
                        {userData.role}
                      </p>
                      <span className="text-purple-600 dark:text-purple-400 text-sm bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded-full">
                        <i className="fas fa-user-shield mr-1"></i>
                        {userData.role === 'admin' ? 'Administrator' : 'User'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="border-b border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <i className="fas fa-home text-green-600 dark:text-green-400 text-xl"></i>
                    </div>
                    Address Information
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <i className="fas fa-map-marker-alt"></i>
                    Your location details
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Address */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Street Address
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="address"
                        value={formData.address || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white transition"
                        placeholder="Enter your complete address"
                      />
                    ) : (
                      <p className="text-gray-800 dark:text-white font-semibold text-lg">
                        {userData.address || 'Not provided'}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="city"
                        value={formData.city || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white transition"
                        placeholder="Enter your city"
                      />
                    ) : (
                      <p className="text-gray-800 dark:text-white font-semibold text-lg">
                        {userData.city || 'Not provided'}
                      </p>
                    )}
                  </div>

                  {/* Country */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Country
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="country"
                        value={formData.country || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white transition"
                        placeholder="Enter your country"
                      />
                    ) : (
                      <p className="text-gray-800 dark:text-white font-semibold text-lg">
                        {userData.country || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Summary */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <i className="fas fa-chart-bar text-purple-600 dark:text-purple-400 text-xl"></i>
                    </div>
                    Account Summary
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <i className="fas fa-info-circle"></i>
                    Account overview
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-center">
                    <div className="text-blue-600 dark:text-blue-400 text-2xl mb-2">
                      <i className="fas fa-user-clock"></i>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Member For</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-white">
                      {Math.floor((new Date() - new Date(userData.createdAt)) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 text-center">
                    <div className="text-green-600 dark:text-green-400 text-2xl mb-2">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Email Status</p>
                <p
  className={`text-lg font-bold ${
    userData.emailVerified
      ? 'text-green-600 dark:text-green-400'
      : 'text-orange-600 dark:text-orange-400'
  }`}
>
  {userData.emailVerified ? 'Verified' : 'Unverified'}
</p>

                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900 rounded-lg p-4 text-center">
                    <div className="text-orange-600 dark:text-orange-400 text-2xl mb-2">
                      <i className="fas fa-mobile-alt"></i>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Phone Status</p>
                <p
  className={`text-lg font-bold ${
    userData.phoneVerified
      ? 'text-green-600 dark:text-green-400'
      : 'text-orange-600 dark:text-orange-400'
  }`}
>
  {userData.phoneVerified ? 'Verified' : 'Unverified'}
</p>

                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4 text-center">
                    <div className="text-purple-600 dark:text-purple-400 text-2xl mb-2">
                      <i className="fas fa-shield-alt"></i>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Account Type</p>
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400 capitalize">
                      {userData.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}