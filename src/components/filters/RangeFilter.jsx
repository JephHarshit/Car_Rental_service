import { useState, useEffect } from 'react';

const RangeFilter = ({
  min,
  max,
  step,
  value,
  onChange,
  label,
  prefix = '',
  suffix = ''
}) => {
  const [localValue, setLocalValue] = useState(value || [min, max]);

  useEffect(() => {
    if (value) {
      setLocalValue(value);
    }
  }, [value]);

  const handleChange = (index, newValue) => {
    const updatedValue = [...localValue];
    updatedValue[index] = Number(newValue);
    
    // Ensure min <= max
    if (index === 0 && updatedValue[0] > updatedValue[1]) {
      updatedValue[0] = updatedValue[1];
    } else if (index === 1 && updatedValue[1] < updatedValue[0]) {
      updatedValue[1] = updatedValue[0];
    }
    
    setLocalValue(updatedValue);
    onChange(updatedValue);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="flex items-center">
            <span className="text-gray-500 text-sm mr-1">{prefix}</span>
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={localValue[0]}
              onChange={(e) => handleChange(0, e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <span className="text-gray-500 text-sm ml-1">{suffix}</span>
          </div>
        </div>
        <span className="text-gray-500">to</span>
        <div className="flex-1">
          <div className="flex items-center">
            <span className="text-gray-500 text-sm mr-1">{prefix}</span>
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={localValue[1]}
              onChange={(e) => handleChange(1, e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <span className="text-gray-500 text-sm ml-1">{suffix}</span>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={(e) => handleChange(0, e.target.value)}
          className="w-full"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[1]}
          onChange={(e) => handleChange(1, e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default RangeFilter;