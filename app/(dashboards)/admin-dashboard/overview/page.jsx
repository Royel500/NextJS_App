import React from 'react';

export default function overviewPage() {
  return (
    <div className="min-h-screen px-6 py-10 bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-8">Overview</h1>

      <section className="max-w-4xl mx-auto text-center mb-12">
        <p className="text-lg">
          Welcome to our platform! This page gives you a quick overview of what we offer, how it works, and the key benefits you get as a user.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Feature One</h2>
          <p>Details about the first feature, how it benefits users and why it's useful.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Feature Two</h2>
          <p>Description of the second key feature in a clear and concise way.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Feature Three</h2>
          <p>Insight into how this feature improves the overall user experience.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Security</h2>
          <p>We ensure your data is secure using modern security protocols.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Fast Support</h2>
          <p>Get support whenever you need it from our expert team.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Easy Integration</h2>
          <p>Our platform integrates easily with your existing workflow and tools.</p>
        </div>
      </section>
    </div>
  );
}
