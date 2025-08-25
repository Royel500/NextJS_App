'use client'
import React from 'react'
import ContactInfo from './ContactInfo';
import ContactForm from './ContactForm';


export default function contracts() {
  return (
    <section className="pt-20 my-5 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold  mb-4">Contact Me</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Have a project in mind or want to discuss opportunities? I'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ContactInfo/>
          <ContactForm/>
        </div>
      </div>
    </section>
  )
}
