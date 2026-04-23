import { Link2, MessageSquare, Mail } from 'lucide-react';

const ScannerTab = ({ activeTab, onTabChange }) => {
    return (
        <nav className="flex border-b border-slate-100">
            {['url', 'text', 'email'].map((tab) => (
              <button 
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`flex-1 py-5 px-6 flex items-center justify-center gap-3 transition-all font-semibold text-lg ${
                  activeTab === tab 
                    ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {tab === 'url' ? <Link2 size={22} /> : tab === 'text' ? <MessageSquare size={22} /> : <Mail size={22} />}
                <span className="capitalize">{tab} Scanner</span>
              </button>
            ))}
          </nav>
    );
}

export default ScannerTab;