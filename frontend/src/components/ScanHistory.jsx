import React, { useState, useEffect } from 'react';
import { Eye, Trash2, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { scanAPI } from '../services/api';
import { format } from 'date-fns';

const ScanHistory = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState(null);

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = async () => {
    try {
      const response = await scanAPI.getAllScans(0, 20);
      setScans(response.data.content);
    } catch (error) {
      console.error('Failed to load scans:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewResults = async (jobId) => {
    try {
      const response = await scanAPI.getScanResults(jobId);
      setSelectedScan(response.data);
    } catch (error) {
      console.error('Failed to load results:', error);
    }
  };

  const deleteScan = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this scan?')) {
      try {
        await scanAPI.deleteScan(jobId);
        loadScans();
      } catch (error) {
        console.error('Failed to delete scan:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      COMPLETED: <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center space-x-1"><CheckCircle className="w-3 h-3" /><span>Completed</span></span>,
      RUNNING: <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center space-x-1"><Clock className="w-3 h-3 animate-spin" /><span>Running</span></span>,
      FAILED: <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center space-x-1"><XCircle className="w-3 h-3" /><span>Failed</span></span>,
      PENDING: <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Pending</span>,
    };
    return badges[status] || <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Scan History</h2>
        <button
          onClick={loadScans}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ports</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Open Ports</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {scans.map((scan) => (
              <tr key={scan.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{scan.target}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{scan.portRange}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(scan.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{scan.openPorts || 0} / {scan.totalPorts}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(scan.createdAt), 'MMM dd, yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {scan.status === 'COMPLETED' && (
                    <button
                      onClick={() => viewResults(scan.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteScan(scan.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedScan && (
        <ScanResultsModal scan={selectedScan} onClose={() => setSelectedScan(null)} />
      )}
    </div>
  );
};

const ScanResultsModal = ({ scan, onClose }) => {
  const openPorts = scan.results.filter(r => r.isOpen);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Scan Results: {scan.target}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Ports Scanned</p>
              <p className="text-2xl font-bold text-gray-800">{scan.totalPorts}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Open Ports</p>
              <p className="text-2xl font-bold text-green-600">{openPorts.length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Scan Duration</p>
              <p className="text-2xl font-bold text-gray-800">
                {scan.completedAt ? `${Math.round((new Date(scan.completedAt) - new Date(scan.createdAt)) / 1000)}s` : 'N/A'}
              </p>
            </div>
          </div>

          <h4 className="text-lg font-semibold mb-4">Open Ports</h4>
          <div className="space-y-2">
            {openPorts.length > 0 ? (
              openPorts.map((result) => (
                <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-lg text-gray-800">Port {result.port}</p>
                      <p className="text-sm text-gray-600">{result.service}</p>
                      {result.banner && (
                        <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-x-auto">{result.banner}</pre>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      {result.responseTime}ms
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No open ports found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanHistory;
