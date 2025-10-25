// components/RegisterForm.js
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    country: '',
    dateOfBirth: '',
    gender: '',
    photoURL: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to upload image to ImgBB
  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_PHOTO_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error(data.error?.message || 'Image upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  // Function to register user
  const registerUser = async (userData) => {
    try {
      const response = await fetch('/api/auth/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Registration API error:', error);
      return { error: true, message: 'Failed to connect to server' };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phone, password, confirmPassword, address, city, country, dateOfBirth, gender } = formData;

    // Validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire('Error', 'Passwords do not match', 'error');
      return;
    }

    if (phone.length < 10) {
      Swal.fire('Error', 'Please enter a valid phone number', 'error');
      return;
    }

    try {
      setLoading(true);

      let photoURL = formData.photoURL;

      // Upload image if file is selected
      if (formData.file) {
        setUploading(true);
        try {
          photoURL = await uploadImageToImgBB(formData.file);
          setFormData(prev => ({ ...prev, photoURL }));
        } catch (error) {
          Swal.fire('Error', 'Failed to upload image. Please try again.', 'error');
          return;
        } finally {
          setUploading(false);
        }
      }

      const payload = {
        name,
        email,
        phone,
        password,
        address: address || '',
        city: city || '',
        country: country || '',
        dateOfBirth: dateOfBirth || '',
        gender: gender || '',
        photoURL: photoURL || '',
      };

      const result = await registerUser(payload);

      if (result.error) {
        Swal.fire('Registration Failed', result.message, 'error');
      } else {
        Swal.fire({
          title: 'Success!',
          text: result.message || 'Your account has been created!',
          icon: 'success',
          confirmButtonText: 'Continue'
        }).then(() => {
          router.push('/login');
        });
      }
    } catch (err) {
      console.error('Registration error:', err);
      Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      Swal.fire('Error', 'Please upload a valid image file (JPEG, PNG, GIF, WEBP)', 'error');
      return;
    }

    if (file.size > maxSize) {
      Swal.fire('Error', 'Image size should be less than 5MB', 'error');
      return;
    }

    // Create preview URL and store file
    const previewURL = URL.createObjectURL(file);
    setFormData(prev => ({ 
      ...prev, 
      file,
      photoURL: previewURL 
    }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-600 to-blue-500 p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <i className="fas fa-user-plus text-4xl text-blue-600 mb-2"></i>
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500 mt-2">Join our community and get started today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Personal Information */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-xl font-semibold text-blue-600 flex items-center gap-2 mb-4">
              <i className="fas fa-user"></i> Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name *"
                  required
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address *"
                  required
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number *"
                  required
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <span className="text-xs text-gray-500 ml-1">Date Of Birth</span>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <span className="text-xs text-gray-500 ml-1">Gender</span>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-xl font-semibold text-blue-600 flex items-center gap-2 mb-4">
              <i className="fas fa-home"></i> Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street Address"
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-xl font-semibold text-blue-600 flex items-center gap-2 mb-4">
              <i className="fas fa-shield-alt"></i> Security
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password *"
                  required
                  className="input input-bordered w-full pr-10"
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password *"
                  required
                  className="input input-bordered w-full pr-10"
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <span className="text-red-500 text-sm mt-1 block">Passwords do not match</span>
                )}
              </div>
            </div>
          </div>

          {/* Profile Picture */}
          <div className="pb-4">
            <h3 className="text-xl font-semibold text-blue-600 flex items-center gap-2 mb-4">
              <i className="fas fa-camera"></i> Profile Picture
            </h3>
            <div className="flex flex-col items-center gap-4">
              <input
                type="file"
                id="photoUpload"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input file-input-bordered w-full max-w-xs"
                disabled={uploading}
              />
              {uploading && (
                <div className="flex items-center gap-2 text-blue-600">
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Uploading image...</span>
                </div>
              )}
              {formData.photoURL && (
                <div className="text-center">
                  <img 
                    src={formData.photoURL} 
                    alt="Profile preview" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 mx-auto"
                  />
                  <p className="text-sm text-gray-500 mt-2">Profile Preview</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || uploading}
            className="btn btn-primary w-full mt-4 text-lg py-3"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fas fa-spinner fa-spin"></i> 
                {uploading ? 'Uploading Image...' : 'Creating Account...'}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <i className="fas fa-user-plus"></i> Create Account
              </span>
            )}
          </button>

          {/* Footer */}
          <div className="text-center mt-4 text-gray-500 text-sm space-y-1">
            <p>
              By creating an account, you agree to our{' '}
              <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
              <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
            </p>
            <p>
              Already have an account?{' '}
              <a href="/api/auth/signin" className="text-blue-600 font-medium hover:underline">Sign In</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}