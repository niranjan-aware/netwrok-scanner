
import React, { useState, useEffect } from 'react';
import { Activity, Shield, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { dashboardAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
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
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Shield className="w-8 h-8 text-blue-500" />}
          title="Total Scans"
          value={stats?.totalScans || 0}
          subtitle="All time"
          color="blue"
        />
        
        <StatCard
          icon={<Activity className="w-8 h-8 text-yellow-500" />}
          title="Running Scans"
          value={stats?.runningScans || 0}
          subtitle="Active now"
          color="yellow"
        />
        
        <StatCard
          icon={<CheckCircle className="w-8 h-8 text-green-500" />}
          title="Completed"
          value={stats?.completedScans || 0}
          subtitle="Successfully finished"
          color="green"
        />
        
        <StatCard
          icon={<AlertCircle className="w-8 h-8 text-red-500" />}
          title="Failed"
          value={stats?.failedScans || 0}
          subtitle="With errors"
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <ActivityItem
              label="Last 24 Hours"
              value={stats?.scansLast24h || 0}
            />
            <ActivityItem
              label="Last 7 Days"
              value={stats?.scansLast7d || 0}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Port Status Summary</h3>
          <div className="space-y-3">
            <QuickStat
              icon={<CheckCircle className="w-4 h-4 text-green-500" />}
              label="Open Ports Found"
              value="View in History"
            />
            <QuickStat
              icon={<XCircle className="w-4 h-4 text-red-500" />}
              label="Closed Ports"
              value="Tracked"
            />
            <QuickStat
              icon={<Shield className="w-4 h-4 text-orange-500" />}
              label="Filtered Ports"
              value="Detected"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, subtitle, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6`}>
      <div className="flex items-center justify-between mb-4">
        {icon}
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <p className="text-sm font-medium text-gray-600 mt-1">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );
};

const ActivityItem = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="text-lg font-semibold text-gray-800">{value}</span>
  </div>
);

const QuickStat = ({ icon, label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100">
    <div className="flex items-center space-x-2">
      {icon}
      <span className="text-sm text-gray-600">{label}</span>
    </div>
    <span className="text-sm font-medium text-gray-800">{value}</span>
  </div>
);

export default Dashboard;
