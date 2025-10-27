import React from 'react';

export default function supportPage() {
  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50 text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-8">Support</h1>

      <section className="max-w-3xl mx-auto text-center mb-12">
        <p className="text-lg">
          Need help? We’re here to assist you with anything — whether it's a technical issue, account question, or just general inquiry.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
          <p>Email: <a href="mailto:support@example.com" 
          className="text-blue-600 hover:underline">webdev.royelali@gmail.com</a></p>
          <p>Phone: <a href="tel:+8801907226353" className="text-blue-600 hover:underline">+8801907226353</a></p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">Live Chat</h2>
          <p>Chat with our support team in real time. Available from 9am–6pm (GMT+6).</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">FAQs</h2>
          <p>Check our <a href="/faq" className="text-blue-600 hover:underline">Frequently Asked Questions</a> for quick answers.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">Feedback</h2>
          <p>We’d love to hear your thoughts! Use the contact form or email us directly with suggestions.</p>
        </div>
      </section>
    </div>
  );
}
