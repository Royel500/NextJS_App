// app/admin/employee-applications/page.js
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function EmployeeApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('/api/employee');
      console.log('Fetched applications:', response.data.data); // Debug log
      setApplications(response.data.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status, position) => {
    setUpdatingId(applicationId);
    setActionMessage('');

    try {
      const response = await axios.patch('/api/employee', {
        applicationId,
        status,
        position
      });

      if (response.data.success) {
        setActionMessage(`✅ Application ${status} successfully. Email sent to applicant.`);
        
        // Update local state
        setApplications(prev => prev.map(app => 
          app._id === applicationId 
            ? { 
                ...app, 
                status: status === 'approved' ? `${position} active` : 'rejected',
                updatedAt: new Date().toISOString()
              }
            : app
        ));

        // Clear message after 5 seconds
        setTimeout(() => setActionMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      if (error.response?.data?.error) {
        setActionMessage(`❌ ${error.response.data.error}`);
      } else {
        setActionMessage('❌ Failed to update application status');
      }
      setTimeout(() => setActionMessage(''), 5000);
    } finally {
      setUpdatingId(null);
    }
  };

const handleDeleteApplication = async (applicationId) => {
  setUpdatingId(applicationId);
  setActionMessage('');

  try {
    const response = await axios.delete('/api/employee', {
      data: { id: applicationId }
    });
    
    if (response.data.success) {
      setActionMessage('✅ Application deleted successfully');
      
      // Remove from local state
      setApplications(prev => prev.filter(app => app._id !== applicationId));
      
      setTimeout(() => setActionMessage(''), 5000);
    }
  } catch (error) {
    console.error('Error deleting application:', error);
    if (error.response?.data?.error) {
      setActionMessage(`❌ ${error.response.data.error}`);
    } else {
      setActionMessage('❌ Failed to delete application');
    }
    setTimeout(() => setActionMessage(''), 5000);
  } finally {
    setUpdatingId(null);
  }
};

  const viewPdf = (certificate) => {
    if (certificate && certificate.data) {
      try {
        const byteCharacters = atob(certificate.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(blob);
        
        setSelectedPdf({
          url: pdfUrl,
          filename: certificate.filename
        });
      } catch (error) {
        console.error('Error viewing PDF:', error);
        setActionMessage('❌ Error opening PDF file');
        setTimeout(() => setActionMessage(''), 3000);
      }
    }
  };

  const closePdf = () => {
    if (selectedPdf) {
      URL.revokeObjectURL(selectedPdf.url);
      setSelectedPdf(null);
    }
  };

  const downloadPdf = (certificate, applicantName) => {
    if (certificate && certificate.data) {
      try {
        const byteCharacters = atob(certificate.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${applicantName}_${certificate.filename}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading PDF:', error);
        setActionMessage('❌ Error downloading PDF file');
        setTimeout(() => setActionMessage(''), 3000);
      }
    }
  };

  // Check if application should show action buttons
  const shouldShowActions = (app) => {
    return app.status === 'pending' || 
           !app.status || 
           app.status === '' || 
           app.status === undefined;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Loading applications...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">{selectedPdf.filename}</h3>
              <button
                onClick={closePdf}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="flex-1">
              <iframe
                src={selectedPdf.url}
                className="w-full h-full"
                title="PDF Viewer"
              />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Action Message */}
        {actionMessage && (
          <div className={`mb-4 p-4 rounded-lg ${
            actionMessage.includes('✅') 
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            {actionMessage}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b">
            <h1 className="text-2xl font-bold text-gray-800">Employee Applications</h1>
            <p className="text-gray-600">Manage and review all job applications</p>
            <p className="text-sm text-gray-500 mt-1">
              Total applications: {applications.length}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Certificate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{app.name}</div>
                        <div className="text-sm text-gray-500">{app.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.phone}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{app.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        app.status === 'pending' || !app.status
                          ? 'bg-yellow-100 text-yellow-800'
                          : app.status.includes('active')
                          ? 'bg-green-100 text-green-800'
                          : app.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {app.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {app.certificate ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewPdf(app.certificate)}
                            className="text-blue-600 hover:text-blue-900 font-medium text-xs px-2 py-1 border border-blue-200 rounded"
                          >
                            View
                          </button>
                          <button
                            onClick={() => downloadPdf(app.certificate, app.name)}
                            className="text-green-600 hover:text-green-900 font-medium text-xs px-2 py-1 border border-green-200 rounded"
                          >
                            Download
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">No certificate</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A'}
                    </td>
             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
  {shouldShowActions(app) ? (
    <div className="flex space-x-2">
      <button
        onClick={() => handleStatusUpdate(app._id, 'approved', app.position)}
        disabled={updatingId === app._id}
        className="bg-green-600 text-white px-3 py-2 rounded text-xs hover:bg-green-700 disabled:opacity-50 transition duration-200"
      >
        {updatingId === app._id ? 'Approving...' : 'Approve'}
      </button>
      <button
        onClick={() => handleStatusUpdate(app._id, 'rejected', app.position)}
        disabled={updatingId === app._id}
        className="bg-red-600 text-white px-3 py-2 rounded text-xs hover:bg-red-700 disabled:opacity-50 transition duration-200"
      >
        {updatingId === app._id ? 'Rejecting...' : 'Reject'}
      </button>
    </div>
  ) : (
    <button
      onClick={() => handleDeleteApplication(app._id)}
      disabled={updatingId === app._id}
      className="bg-gray-600 text-white px-3 py-2 rounded text-xs hover:bg-gray-700 disabled:opacity-50 transition duration-200"
    >
      {updatingId === app._id ? 'Blocking...' : 'Block'}
    </button>
  )}
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {applications.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">No applications found</div>
              <div className="text-gray-500 mt-2">Applications will appear here when candidates apply</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}