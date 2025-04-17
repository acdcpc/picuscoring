import React from 'react';

const ScoreInputForm = ({ fields, onSubmit, formValues, setFormValues }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <h2 className="text-lg font-medium mb-4">Enter Score Parameters</h2>
      <div className="space-y-4">
        {fields.map((field) => {
          try {
            return (
              <div key={field.name}>
                <label className="block text-gray-700">{field.label}</label>
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formValues[field.name] || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select an option</option>
                    {field.options && field.options.length > 0 ? (
                      field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No options available
                      </option>
                    )}
                  </select>
                ) : (
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    value={formValues[field.name] || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    min={field.min}
                    max={field.max}
                  />
                )}
              </div>
            );
          } catch (error) {
            console.error(`Error rendering field ${field.name}:`, error);
            return (
              <div key={field.name} className="text-red-600">
                Error rendering field: {field.name}
              </div>
            );
          }
        })}
        {fields.length === 0 && (
          <p className="text-gray-500">No fields defined for this score type.</p>
        )}
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Calculate Score
        </button>
      </div>
    </form>
  );
};

export default ScoreInputForm;