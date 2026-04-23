import  { useState } from 'react';
import { Loader2 } from 'lucide-react';

const TextScanner = ({ onScan, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleScanClick = () => {
    if (inputValue.trim()) {
      onScan(inputValue);
    }
  };

  return (
    <div className="space-y-4">
      <textarea 
        rows="5"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Paste the suspicious message here..."
        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-lg"
      />
      <button 
        onClick={handleScanClick}
        disabled={isLoading || !inputValue.trim()}
        className="w-full py-4 bg-indigo-600 text-white font-bold text-lg rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
      >
        {isLoading ? <Loader2 className="animate-spin" size={22} /> : "Analyze Content"}
      </button>
    </div>
  );
};

export default TextScanner;