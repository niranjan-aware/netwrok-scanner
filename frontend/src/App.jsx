import React, { useState } from 'react';
import { Shield, Activity, Clock, History } from 'lucide-react';
import Dashboard from './components/Dashboard';
import NewScan from './components/NewScan';
import ScanHistory from './components/ScanHistory';
import ScheduledScans from './components/ScheduledScans';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notification, setNotification] = useState(null);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'new-scan', label: 'New Scan', icon: Shield },
    { id: 'history', label: 'History', icon: History },
    { id: 'scheduled', label: 'Scheduled', icon: Clock },
  ];

  const handleScanStarted = (scan) => {
    setNotification(`Scan started for ${scan.target}`);
    setTimeout(() => setNotification(null), 3000);
    setActiveTab('history');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Network Scanner</h1>
            </div>
            <div className="text-sm text-gray-600">
              Enterprise Security Platform
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Notification */}
      {notification && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {notification}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'new-scan' && <NewScan onScanStarted={handleScanStarted} />}
        {activeTab === 'history' && <ScanHistory />}
        {activeTab === 'scheduled' && <ScheduledScans />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © 2024 Network Scanner. Built with Spring Boot Virtual Threads & React.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
