import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

const UrlScanner = ({ onScan, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleScanClick = () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    // Basic URL regex (forgiving but requires a domain structure)
    const urlPattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i;
    
    if (!urlPattern.test(trimmedInput)) {
      setError('Please enter a valid URL (e.g., example.com or https://example.com)');
      return;
    }

    onScan(trimmedInput);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (error) setError(''); // Clear error when user types
            }}
            placeholder="https://phishing-site.com"
            className={`w-full px-5 py-4 bg-slate-50 border rounded-xl focus:outline-none transition-all text-lg ${
              error ? 'border-red-400 focus:ring-2 focus:ring-red-400' : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
            }`}
          />
          {error && <p className="text-red-500 text-sm font-medium mt-2 ml-1">{error}</p>}
        </div>
        <button 
          onClick={handleScanClick}
          disabled={isLoading || !inputValue.trim()}
          className="h-15 px-10 bg-indigo-600 text-white font-bold text-lg rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="animate-spin" size={22} /> : "Scan URL"}
        </button>
      </div>
    </div>
  );
};

export default UrlScanner;