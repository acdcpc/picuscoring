import React, { useState } from 'react';

const ScoreInputForm = ({ fields, onSubmit, formValues, setFormValues }) => {
  const [errors, setErrors] = useState({});

  const validateField = (name, value, field) => {
    if (field.type === 'number' && (field.min || field.max)) {
      const numValue = parseFloat(value);
      if (field.min && numValue < field.min) {
        return `Value must be at least ${field.min}`;
      }
      if (field.max && numValue > field.max) {
        return `Value must be at most ${field.max}`;
      }
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const field = fields.find((f) => f.name === name);
    const inputValue = type === 'checkbox' ? checked : value;
    const error = validateField(name, inputValue, field);

    setErrors((prev) => ({ ...prev, [name]: error }));
    setFormValues((prev) => ({ ...prev, [name]: inputValue }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formErrors = {};
    let hasErrors = false;

    fields.forEach((field) => {
      const value = formValues[field.name] || (field.type === 'checkbox' ? false : '');
      const error = validateField(field.name, value, field);
      if (error) {
        formErrors[field.name] = error;
        hasErrors = true;
      }
    });

    setErrors(formErrors);
    if (!hasErrors) {
      onSubmit(formValues);
    }
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
                ) : field.type === 'checkbox' ? (
                  <div>
                    <input
                      type="checkbox"
                      name={field.name}
                      checked={formValues[field.name] || false}
                      onChange={handleInputChange}
                      className="p-2"
                    />
                  </div>
                ) : (
                  <div>
                    <input
                      type={field.type || 'text'}
                      name={field.name}
                      value={formValues[field.name] || ''}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-md ${
                        errors[field.name] ? 'border-red-500' : ''
                      }`}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      min={field.min}
                      max={field.max}
                      step={field.type === 'number' ? '0.1' : undefined} // Allow decimal values for numbers
                    />
                    {errors[field.name] && (
                      <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                    )}
                  </div>
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