'use client'
import React, { useState } from 'react';
import axios from 'axios';

const EmployeeApplication = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        phone: '',
        position: '',
        certificate: null,
        additionalInfo: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [errors, setErrors] = useState({});

    const positions = [
        'Web Developer',
        'App Developer',
        'SEO Specialist',
        'Content Editor',
        'Graphic Designer',
        'Digital Marketer',
        'Data Analyst',
        'Project Manager'
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.position) newErrors.position = 'Position is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type and size
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({
                    ...prev,
                    certificate: 'Please upload PDF, DOC, or DOCX files only'
                }));
                return;
            }

            if (file.size > maxSize) {
                setErrors(prev => ({
                    ...prev,
                    certificate: 'File size must be less than 5MB'
                }));
                return;
            }

            setFormData(prev => ({
                ...prev,
                certificate: file
            }));
            
            // Clear file error
            if (errors.certificate) {
                setErrors(prev => ({
                    ...prev,
                    certificate: ''
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitMessage('');

        if (!validateForm()) {
            setSubmitMessage('Please fix the errors above');
            return;
        }

        setIsSubmitting(true);

        try {
            // Create FormData for file upload
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('email', formData.email);
            submitData.append('address', formData.address);
            submitData.append('phone', formData.phone);
            submitData.append('position', formData.position);
            submitData.append('additionalInfo', formData.additionalInfo);
            
            if (formData.certificate) {
                submitData.append('certificate', formData.certificate);
            }

            const response = await axios.post('/api/employee', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 30000, // 30 second timeout
            });

            if (response.data.success) {
                setSubmitMessage('✅ Application submitted successfully! Status: Pending');
                
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    address: '',
                    phone: '',
                    position: '',
                    certificate: null,
                    additionalInfo: ''
                });
                
                // Reset file input
                const fileInput = document.getElementById('certificate');
                if (fileInput) fileInput.value = '';
                
                // Clear errors
                setErrors({});
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            
            if (error.code === 'ECONNABORTED') {
                setSubmitMessage('❌ Request timeout. Please try again.');
            } else if (error.response?.data?.error) {
                setSubmitMessage(`❌ ${error.response.data.error}`);
            } else {
                setSubmitMessage('❌ Error submitting application. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // File display name
    const getFileName = () => {
        return formData.certificate ? formData.certificate.name : 'No file chosen';
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
                        <h1 className="text-3xl font-bold text-white text-center">
                            Join Our Team
                        </h1>
                        <p className="text-blue-100 text-center mt-2">
                            Apply to become part of our growing team
                        </p>
                    </div>

                    {/* Application Form */}
                    <div className="px-6 py-8">
                        {submitMessage && (
                            <div className={`mb-6 p-4 rounded-lg border ${
                                submitMessage.includes('❌') 
                                    ? 'bg-red-50 text-red-700 border-red-200'
                                    : 'bg-green-50 text-green-700 border-green-200'
                            }`}>
                                <div className="flex items-center">
                                    {submitMessage.includes('❌') ? (
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {submitMessage}
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                                        errors.name ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your full name"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                                        errors.email ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your email address"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            {/* Phone Field */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                                        errors.phone ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your phone number"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                )}
                            </div>

                            {/* Address Field */}
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                    Address *
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    required
                                    rows="3"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                                        errors.address ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your complete address"
                                />
                                {errors.address && (
                                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                                )}
                            </div>

                            {/* Position Selection */}
                            <div>
                                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                                    Apply For Position *
                                </label>
                                <select
                                    id="position"
                                    name="position"
                                    required
                                    value={formData.position}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                                        errors.position ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Select a position</option>
                                    {positions.map((position) => (
                                        <option key={position} value={position}>
                                            {position}
                                        </option>
                                    ))}
                                </select>
                                {errors.position && (
                                    <p className="mt-1 text-sm text-red-600">{errors.position}</p>
                                )}
                            </div>

                            {/* Certificate Upload */}
                            <div>
                                <label htmlFor="certificate" className="block text-sm font-medium text-gray-700 mb-2">
                                    Certificates (PDF, DOC, DOCX) - Optional
                                </label>
                                <div className="flex items-center space-x-4">
                                    <label className="flex flex-col items-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition duration-200">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                        </svg>
                                        <span className="mt-2 text-sm text-gray-500">Choose file</span>
                                        <input
                                            type="file"
                                            id="certificate"
                                            name="certificate"
                                            onChange={handleFileChange}
                                            accept=".pdf,.doc,.docx"
                                            className="hidden"
                                        />
                                    </label>
                                    <span className="text-sm text-gray-600 flex-1 truncate">
                                        {getFileName()}
                                    </span>
                                </div>
                                {errors.certificate && (
                                    <p className="mt-1 text-sm text-red-600">{errors.certificate}</p>
                                )}
                                <p className="text-sm text-gray-500 mt-2">
                                    Maximum file size: 5MB. Supported formats: PDF, DOC, DOCX
                                </p>
                            </div>

                            {/* Additional Information */}
                            <div>
                                <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Information
                                </label>
                                <textarea
                                    id="additionalInfo"
                                    name="additionalInfo"
                                    rows="4"
                                    value={formData.additionalInfo}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                    placeholder="Tell us about your experience, skills, or anything else you'd like to share..."
                                />
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Submitting...
                                        </span>
                                    ) : (
                                        'Submit Application'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Footer Note */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 text-center">
                            All applications will be reviewed and you'll be notified about the status. 
                            Default status for new applications is "Pending".
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeApplication;