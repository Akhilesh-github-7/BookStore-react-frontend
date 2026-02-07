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
        <div className={`block w-12 h-6 rounded-full transition-colors ${isChecked ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${isChecked ? 'translate-x-6' : ''}`}></div>
      </div>
    </label>
  );
}

export default ToggleSwitch;
