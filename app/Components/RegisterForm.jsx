// components/RegisterForm.js
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { registerUser } from '../api/auth/action/registerUser'
import './index.css'

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const Name = form.name.value.trim()
    const Email = form.email.value.trim()
    const Password = form.password.value
    const ConfirmPassword = form.confirmPassword.value

    if (!Name || !Email || !Password || !ConfirmPassword) {
      Swal.fire('Error', 'Please fill in all fields', 'error')
      return
    }

    if (Password !== ConfirmPassword) {
      Swal.fire('Error', 'Passwords do not match', 'error')
      return
    }

const payload = {
  name: Name,       // lowercase key
  email: Email,     // lowercase key
  password: Password, // lowercase key
  role: 'user',
  createdAt: new Date().toISOString()
}

    try {
      setLoading(true)
      const result = await registerUser(payload);

      if (result.error) {
        Swal.fire({
          title: 'User Already Exists!',
          text: result.message,
          icon: 'error',
          confirmButtonText: 'Go to Login'
        }).then(() => {
          router.push('/api/auth/signin') // redirect to login page
        })
      } else {
        Swal.fire({
          title: 'Registration Successful!',
          text: 'Your account has been created.',
          icon: 'success',
          confirmButtonText: 'Go to Home'
        }).then(() => {
          router.push('/')
        })
      }
    } catch (err) {
      Swal.fire('Error', 'Something went wrong. Please try again.', 'error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h2>Sign Up</h2>
        <p>Create a new account to get started</p>
      </div>
      
      <form onSubmit={handleSubmit} className="register text-left">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <div className="input-with-icon">
            <i className="fas fa-user"></i>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="Enter your full name" 
              required 
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <div className="input-with-icon">
            <i className="fas fa-envelope"></i>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Enter your email address" 
              required 
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-with-icon">
            <i className="fas fa-lock"></i>
            <input 
              type={showPassword ? "text" : "password"} 
              id="password" 
              name="password" 
              placeholder="Create a strong password" 
              required 
            />
            <span 
              className="password-toggle" 
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </span>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="input-with-icon">
            <i className="fas fa-lock"></i>
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              id="confirmPassword" 
              name="confirmPassword" 
              placeholder="Confirm your password" 
              required 
            />
            <span 
              className="password-toggle" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </span>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="register-btn"
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Registering...
            </>
          ) : (
            'Register'
          )}
        </button>
        
        <div className="terms">
          By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
        </div>
        
        <div className="login-link">
          Already have an account? <a href="/api/auth/signin">Login</a>
        </div>
      </form>
    </div>
  )
}