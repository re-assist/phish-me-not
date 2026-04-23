import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

const UrlScanner = ({ onScan, isLoading }) => {

  const [inputValue, setInputValue] = useState('');

  const handleScanClick = () => {
    if (inputValue.trim()) {
      onScan(inputValue);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="https://google-security123.com"
          className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-lg"
        />
        <button 
          onClick={handleScanClick}
          disabled={isLoading || !inputValue.trim()}
          className="px-10 py-4 bg-indigo-600 text-white font-bold text-lg rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="animate-spin" size={22} /> : "Scan URL"}
        </button>
      </div>
    </div>
  );
};

export default UrlScanner;