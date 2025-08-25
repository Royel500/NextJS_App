import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import Swal from 'sweetalert2';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://formspree.io/f/xrbldkwz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        // Show success message
        Swal.fire({
          title: 'Success!',
          text: 'Your message has been sent to the admin email successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'There was a problem sending your message. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="bg-gra p-8 rounded-xl font-bold border shadow-md">
      <h3 className="text-2xl font-semibold  mb-6">Send a Message</h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium  mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-black-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Mr Marko"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium  mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="marko@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium  mb-1">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Project Inquiry"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium  mb-1">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your message here..."
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center w-full bg-green-400 py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          <FiSend className="mr-2" />
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactForm;