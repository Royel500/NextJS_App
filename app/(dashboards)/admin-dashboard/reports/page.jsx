import React from 'react';

export default function reportsPage() {
  const reports = [
    { id: 1, title: 'Monthly Sales Report', date: 'July 2025', status: 'Completed' },
    { id: 2, title: 'User Feedback Summary', date: 'July 2025', status: 'In Progress' },
    { id: 3, title: 'System Performance Log', date: 'June 2025', status: 'Completed' },
    { id: 4, title: 'Support Requests Analysis', date: 'July 2025', status: 'Pending' },
  ];

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-8">Reports</h1>

      <section className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">#</th>
              <th className="p-3">Title</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">{report.id}</td>
                <td className="p-3 font-medium">{report.title}</td>
                <td className="p-3">{report.date}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      report.status === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : report.status === 'In Progress'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
