
import React, { useState } from 'react';
import { Play, Clock } from 'lucide-react';
import { scanAPI } from '../services/api';

const NewScan = ({ onScanStarted }) => {
  const [formData, setFormData] = useState({
    target: '',
    portRange: 'common',
    timeout: 2000,
    includeClosedPorts: true,
    includeFilteredPorts: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await scanAPI.startScan(formData);
      onScanStarted(response.data);
      setFormData({ 
        target: '', 
        portRange: 'common', 
        timeout: 2000,
        includeClosedPorts: true,
        includeFilteredPorts: true,
      });
    } catch (err) {
      setError(err.response?.data?.target || err.response?.data?.portRange || 'Failed to start scan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">New Port Scan</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target (IP or Hostname)
          </label>
          <input
            type="text"
            value={formData.target}
            onChange={(e) => setFormData({ ...formData, target: e.target.value })}
            placeholder="192.168.1.1 or example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Enter an IP address (e.g., 192.168.1.1) or hostname (e.g., example.com)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Port Range
          </label>
          <select
            value={formData.portRange}
            onChange={(e) => setFormData({ ...formData, portRange: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="common">Common Ports (17 ports)</option>
            <option value="1-100">Quick Scan: 1-100</option>
            <option value="1-1000">Port Range: 1-1000</option>
            <option value="1-10000">Extended: 1-10000</option>
          </select>
          <input
            type="text"
            placeholder="Or enter custom: 80,443,8080-8090"
            onChange={(e) => {
              if (e.target.value) {
                setFormData({ ...formData, portRange: e.target.value });
              }
            }}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            Format: 80,443,8080-8090 or use presets
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timeout (ms)
          </label>
          <input
            type="number"
            value={formData.timeout}
            onChange={(e) => setFormData({ ...formData, timeout: parseInt(e.target.value) })}
            min="500"
            max="10000"
            step="100"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            Connection timeout in milliseconds (500-10000)
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <p className="text-sm font-medium text-gray-700">Port Status Options</p>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.includeClosedPorts}
              onChange={(e) => setFormData({ ...formData, includeClosedPorts: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Include Closed Ports (connection refused)</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.includeFilteredPorts}
              onChange={(e) => setFormData({ ...formData, includeFilteredPorts: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Include Filtered Ports (timeout/firewall)</span>
          </label>
          
          <p className="text-xs text-gray-500 mt-2">
            Note: Including closed and filtered ports will show all scanned ports regardless of status
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Clock className="w-5 h-5 animate-spin" />
              <span>Starting Scan...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Start Scan</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default NewScan;