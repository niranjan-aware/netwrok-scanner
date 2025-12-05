
import React, { useState, useEffect } from 'react';
import { Eye, Trash2, RefreshCw, CheckCircle, XCircle, Clock, Shield, AlertTriangle } from 'lucide-react';
import { scanAPI } from '../services/api';
import { format } from 'date-fns';

const ScanHistory = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState(null);
  const [filter, setFilter] = useState('all'); // all, open, closed, filtered

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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Results</th>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {scan.openPorts || 0}
                    </span>
                    <span className="flex items-center text-red-600">
                      <XCircle className="w-4 h-4 mr-1" />
                      {scan.closedPorts || 0}
                    </span>
                    <span className="flex items-center text-orange-600">
                      <Shield className="w-4 h-4 mr-1" />
                      {scan.filteredPorts || 0}
                    </span>
                  </div>
                </td>
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
  const [activeTab, setActiveTab] = useState('all');
  
  const openPorts = scan.results.filter(r => r.status === 'OPEN');
  const closedPorts = scan.results.filter(r => r.status === 'CLOSED');
  const filteredPorts = scan.results.filter(r => r.status === 'FILTERED');

  const getFilteredResults = () => {
    switch (activeTab) {
      case 'open': return openPorts;
      case 'closed': return closedPorts;
      case 'filtered': return filteredPorts;
      default: return scan.results;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'text-green-600 bg-green-50';
      case 'CLOSED': return 'text-red-600 bg-red-50';
      case 'FILTERED': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'OPEN': return <CheckCircle className="w-5 h-5" />;
      case 'CLOSED': return <XCircle className="w-5 h-5" />;
      case 'FILTERED': return <Shield className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Scan Results: {scan.target}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Statistics */}
          <div className="mb-6 grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Scanned</p>
              <p className="text-2xl font-bold text-gray-800">{scan.totalPorts}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Open Ports</p>
              <p className="text-2xl font-bold text-green-600">{openPorts.length}</p>
              <p className="text-xs text-gray-500">
                {scan.totalPorts > 0 ? ((openPorts.length / scan.totalPorts) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Closed Ports</p>
              <p className="text-2xl font-bold text-red-600">{closedPorts.length}</p>
              <p className="text-xs text-gray-500">
                {scan.totalPorts > 0 ? ((closedPorts.length / scan.totalPorts) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Filtered Ports</p>
              <p className="text-2xl font-bold text-orange-600">{filteredPorts.length}</p>
              <p className="text-xs text-gray-500">
                {scan.totalPorts > 0 ? ((filteredPorts.length / scan.totalPorts) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-2xl font-bold text-gray-800">
                {scan.completedAt ? `${Math.round((new Date(scan.completedAt) - new Date(scan.createdAt)) / 1000)}s` : 'N/A'}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 mb-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                activeTab === 'all' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All ({scan.results.length})
            </button>
            <button
              onClick={() => setActiveTab('open')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                activeTab === 'open' 
                  ? 'border-green-500 text-green-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Open ({openPorts.length})
            </button>
            <button
              onClick={() => setActiveTab('closed')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                activeTab === 'closed' 
                  ? 'border-red-500 text-red-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Closed ({closedPorts.length})
            </button>
            <button
              onClick={() => setActiveTab('filtered')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                activeTab === 'filtered' 
                  ? 'border-orange-500 text-orange-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Filtered ({filteredPorts.length})
            </button>
          </div>

          {/* Results */}
          <div className="space-y-2">
            {getFilteredResults().length > 0 ? (
              getFilteredResults().map((result) => (
                <div key={result.id} className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(result.status)}
                        <p className="font-semibold text-lg">Port {result.port}</p>
                        <span className="px-2 py-1 bg-white rounded text-xs font-medium">
                          {result.service}
                        </span>
                        <span className="text-xs font-medium uppercase">
                          {result.status}
                        </span>
                      </div>
                      {result.banner && (
                        <pre className="mt-2 text-xs bg-white p-2 rounded overflow-x-auto border">
                          {result.banner}
                        </pre>
                      )}
                      {result.errorMessage && (
                        <p className="mt-2 text-xs italic">{result.errorMessage}</p>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-medium ml-4">
                      {result.responseTime}ms
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No {activeTab} ports found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanHistory;
