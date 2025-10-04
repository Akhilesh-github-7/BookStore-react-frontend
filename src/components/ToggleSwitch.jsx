import React, { useState } from 'react';

function ToggleSwitch({ initialChecked = false, onChange }) {
  const [isChecked, setIsChecked] = useState(initialChecked);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    if (onChange) {
      onChange(!isChecked);
    }
  };

  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={isChecked} onChange={handleToggle} />
        <div className={`block w-14 h-8 rounded-full ${isChecked ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isChecked ? 'transform translate-x-6' : ''}`}></div>
      </div>
    </label>
  );
}

export default ToggleSwitch;
