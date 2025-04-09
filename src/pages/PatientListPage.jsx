import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const PatientListPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('Recent');
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    ageInMonths: '',
    ageCategory: 'child',
  });
  const [formError, setFormError] = useState(null);

  // Fetch patients from Firestore
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsCollection = collection(db, 'patients');
        const patientSnapshot = await getDocs(patientsCollection);
        const patientList = patientSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          lastScore: { type: 'N/A', value: 'N/A', time: 'N/A' }
        }));
        setPatients(patientList);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setError("Failed to load patients. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  // Handle sorting
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    // Add sorting logic here if needed
  };

  // Handle filtering
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    // Add filtering logic here if needed
  };

  // Open the Add Patient modal
  const handleAddPatient = () => {
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setNewPatient({ name: '', ageInMonths: '', ageCategory: 'child' });
    setFormError(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient({ ...newPatient, [name]: value });
  };

  // Handle form submission to add a new patient
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Validate form
    if (!newPatient.name.trim()) {
      setFormError("Name is required.");
      return;
    }
    if (!newPatient.ageInMonths || newPatient.ageInMonths <= 0) {
      setFormError("Age in months must be a positive number.");
      return;
    }

    try {
      // Add the new patient to Firestore
      const patientData = {
        name: newPatient.name.trim(),
        ageInMonths: parseInt(newPatient.ageInMonths),
        ageCategory: newPatient.ageCategory,
        // Add MRN or other fields if needed
      };
      const docRef = await addDoc(collection(db, 'patients'), patientData);
      console.log("New patient added with ID:", docRef.id);

      // Refresh the patient list
      const patientsCollection = collection(db, 'patients');
      const patientSnapshot = await getDocs(patientsCollection);
      const patientList = patientSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastScore: { type: 'N/A', value: 'N/A', time: 'N/A' }
      }));
      setPatients(patientList);

      // Close the modal
      closeModal();
    } catch (error) {
      console.error("Error adding patient:", error);
      setFormError("Failed to add patient. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <h2 className="text-lg font-medium text-red-800">Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main Content */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patients</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleAddPatient}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Patient
          </button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-4 p-4">
        <div className="flex justify-between items-center">
          <div>
            <label className="text-sm text-gray-600 mr-2">Sort by:</label>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="border rounded-md px-2 py-1 text-sm"
            >
              <option>Recent</option>
              <option>Name</option>
              <option>Age</option>
              <option>Score</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 mr-2">Filter:</label>
            <select
              value={filter}
              onChange={handleFilterChange}
              className="border rounded-md px-2 py-1 text-sm"
            >
              <option>All</option>
              <option>High Risk</option>
              <option>Medium Risk</option>
              <option>Low Risk</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {patients.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-gray-600">No patients found.</p>
          </div>
        ) : (
          patients.map((patient) => (
            <Link
              key={patient.id}
              to={`/patients/${patient.id}`}
              className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <h2 className="text-lg font-semibold">
                  {patient.name}, {Math.floor(patient.ageInMonths / 12)} years
                </h2>
                <p className="text-gray-600">MRN: {patient.mrn || 'N/A'}</p>
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-sm">
                    Last Score: {patient.lastScore.type} ({patient.lastScore.value})
                  </p>
                  <p className="text-sm text-gray-500">{patient.lastScore.time}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Add Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Patient</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newPatient.name}
                  onChange={handleInputChange}
                  className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter patient name"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="ageInMonths" className="block text-gray-700 mb-2">
                  Age (in months)
                </label>
                <input
                  type="number"
                  id="ageInMonths"
                  name="ageInMonths"
                  value={newPatient.ageInMonths}
                  onChange={handleInputChange}
                  className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter age in months"
                  min="0"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="ageCategory" className="block text-gray-700 mb-2">
                  Age Category
                </label>
                <select
                  id="ageCategory"
                  name="ageCategory"
                  value={newPatient.ageCategory}
                  onChange={handleInputChange}
                  className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="neonate">Neonate (0-30 days)</option>
                  <option value="infant">Infant (31 days - 2 years)</option>
                  <option value="child">Child (2 years - 12 years)</option>
                  <option value="adolescent">Adolescent (13 years and up)</option>
                </select>
              </div>
              {formError && (
                <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 text-sm">{formError}</p>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientListPage;