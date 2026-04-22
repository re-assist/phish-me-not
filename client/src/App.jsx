import { ShieldCheck } from 'lucide-react';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      {/* Reverted to max-w-5xl and kept as single column */}
      <header className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-indigo-700 flex items-center gap-2">
            <ShieldCheck className="w-8 h-8" />
            PhishMeNot
          </h1>
          <p className="text-slate-500 mt-1">Unified Cybersecurity Intelligence Hub</p>
        </div>
        <div className="flex gap-2 text-sm font-medium">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live Threat Feed
          </span>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
            Heuristics Active
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto">
        <Dashboard />
      </div>

      <footer className="max-w-5xl mx-auto mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm gap-4">
        <p>© 2024 PhishMeNot CyberSec Assistant</p>
        <div className="flex gap-6">
          <button className="hover:text-indigo-600 transition-colors">Documentation</button>
          <button className="hover:text-indigo-600 transition-colors">API Feed</button>
          <button className="hover:text-indigo-600 transition-colors">Privacy</button>
        </div>
      </footer>
    </div>
  );
};

export default App;