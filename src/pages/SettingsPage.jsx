import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SettingsPage = () => {
  // State for scoring systems (default to all enabled)
  const [scoringSystemsEnabled, setScoringSystemsEnabled] = useState({
    prism3: true,
    sofa: true,
    comfortb: true,
    pim3: true,
    pelod2: true,
  });

  // State for display mode toggle
  const [isDarkMode, setIsDarkMode] = useState(false);

  // State for other settings (font size and units)
  const [fontSize, setFontSize] = useState('Medium');
  const [units, setUnits] = useState('Metric');

  // Handler for scoring system checkboxes
  const handleScoringSystemChange = (systemId) => (e) => {
    setScoringSystemsEnabled({
      ...scoringSystemsEnabled,
      [systemId]: e.target.checked,
    });
  };

  // Handler for display mode toggle
  const handleDarkModeChange = (e) => {
    setIsDarkMode(e.target.checked);
  };

  // Handlers for select inputs
  const handleFontSizeChange = (e) => {
    setFontSize(e.target.value);
  };

  const handleUnitsChange = (e) => {
    setUnits(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/" className="mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Account</h2>
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex justify-between items-center">
            <span>User Profile</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex justify-between items-center">
            <span>Notification Preferences</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex justify-between items-center">
            <span>Change Password</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Application</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Display Mode</span>
            <div className="relative inline-block w-12 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="toggle"
                checked={isDarkMode}
                onChange={handleDarkModeChange}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="toggle"
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              ></label>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span>Font Size</span>
            <select
              value={fontSize}
              onChange={handleFontSizeChange}
              className="border rounded-md px-3 py-1"
            >
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
          </div>

          <div className="flex justify-between items-center">
            <span>Units</span>
            <select
              value={units}
              onChange={handleUnitsChange}
              className="border rounded-md px-3 py-1"
            >
              <option>Metric</option>
              <option>Imperial</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Scoring Systems</h2>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="prism3"
              checked={scoringSystemsEnabled.prism3}
              onChange={handleScoringSystemChange('prism3')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="prism3" className="ml-2 block text-gray-700">
              PRISM-3
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sofa"
              checked={scoringSystemsEnabled.sofa}
              onChange={handleScoringSystemChange('sofa')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="sofa" className="ml-2 block text-gray-700">
              SOFA
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="comfortb"
              checked={scoringSystemsEnabled.comfortb}
              onChange={handleScoringSystemChange('comfortb')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="comfortb" className="ml-2 block text-gray-700">
              COMFORT-B
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="pim3"
              checked={scoringSystemsEnabled.pim3}
              onChange={handleScoringSystemChange('pim3')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="pim3" className="ml-2 block text-gray-700">
              PIM-3
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="pelod2"
              checked={scoringSystemsEnabled.pelod2}
              onChange={handleScoringSystemChange('pelod2')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="pelod2" className="ml-2 block text-gray-700">
              PELOD-2
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Data Management</h2>
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex justify-between items-center">
            <span>Backup Data</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex justify-between items-center">
            <span>Restore Data</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex justify-between items-center">
            <span>Export All Data</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex justify-between items-center">
            <span>Clear Cache</span>
            <svg
              xmlns="http://www.w3.org/0/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <Link
          to="/login"
          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </Link>
      </div>
    </div>
  );
};

export default SettingsPage;