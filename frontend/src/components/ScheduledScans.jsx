import React, { useState, useEffect } from 'react';
import { Plus, Play, Pause, Trash2, Edit } from 'lucide-react';
import { scheduledScanAPI } from '../services/api';

const ScheduledScans = () => {
  const [scans, setScans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingScan, setEditingScan] = useState(null);

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = async () => {
    try {
      const response = await scheduledScanAPI.getAllScheduledScans();
      setScans(response.data);
    } catch (error) {
      console.error('Failed to load scheduled scans:', error);
    }
  };

  const toggleScan = async (id) => {
    try {
      await scheduledScanAPI.toggleScheduledScan(id);
      loadScans();
    } catch (error) {
      console.error('Failed to toggle scan:', error);
    }
  };

  const deleteScan = async (id) => {
    if (window.confirm('Are you sure you want to delete this scheduled scan?')) {
      try {
        await scheduledScanAPI.deleteScheduledScan(id);
        loadScans();
      } catch (error) {
        console.error('Failed to delete scan:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Scheduled Scans</h2>
        <button
          onClick={() => { setEditingScan(null); setShowModal(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Schedule</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scans.map((scan) => (
          <div key={scan.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{scan.name}</h3>
                <p className="text-sm text-gray-600">{scan.target}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${scan.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {scan.enabled ? 'Active' : 'Paused'}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="text-sm">
                <span className="text-gray-600">Ports:</span>
                <span className="ml-2 text-gray-800">{scan.portRange}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Schedule:</span>
                <span className="ml-2 text-gray-800">{scan.cronExpression}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => toggleScan(scan.id)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center justify-center space-x-2"
              >
                {scan.enabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{scan.enabled ? 'Pause' : 'Resume'}</span>
              </button>
              <button
                onClick={() => { setEditingScan(scan); setShowModal(true); }}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteScan(scan.id)}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <ScheduleModal
          scan={editingScan}
          onClose={() => { setShowModal(false); setEditingScan(null); }}
          onSave={loadScans}
        />
      )}
    </div>
  );
};

const ScheduleModal = ({ scan, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: scan?.name || '',
    target: scan?.target || '',
    portRange: scan?.portRange || 'common',
    cronExpression: scan?.cronExpression || '0 0 * * *',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (scan) {
        await scheduledScanAPI.updateScheduledScan(scan.id, formData);
      } else {
        await scheduledScanAPI.createScheduledScan(formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to save scheduled scan:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4">{scan ? 'Edit' : 'New'} Scheduled Scan</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
            <input
              type="text"
              value={formData.target}
              onChange={(e) => setFormData({ ...formData, target: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Port Range</label>
            <input
              type="text"
              value={formData.portRange}
              onChange={(e) => setFormData({ ...formData, portRange: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cron Expression</label>
            <input
              type="text"
              value={formData.cronExpression}
              onChange={(e) => setFormData({ ...formData, cronExpression: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="0 0 * * * (Daily at midnight)"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduledScans;
