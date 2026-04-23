import  { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  ShieldQuestion,    
  AlertTriangle,
  ChevronRight,
  Info,
  History,
  Lock,
  Eye,
  Zap,
  Loader2
} from 'lucide-react';
import ScannerTab from '../components/scanner/ScannerTabs';

const MOCK_BREACHES = {
  "test@gmail.com": ["LinkedIn (2016)", "Adobe (2013)", "MySpace (2008)"],
  "admin@company.com": ["Canva (2019)", "Dropbox (2012)"],
  "user@example.com": ["Wattpad", "Zomato"]
};

const HEURISTIC_KEYWORDS = {
  urgent: ["urgent", "immediately", "action required", "suspended", "blocked"],
  authority: ["bank", "security", "official", "government", "police", "tax"],
  sensitive: ["otp", "password", "pin", "verify", "login", "credentials"],
  threat: ["legal action", "arrest", "lawsuit", "deleted", "expired"]
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('url');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);

  const analyzeURL = async (url) => {
    if (!url) return;
    setLoading(true);
    // Simulating API latency
    await new Promise(r => setTimeout(r, 1000));

    let score = 0;
    const flags = [];
    const lowerUrl = url.toLowerCase();

    if (url.length > 75) {
      score += 20;
      flags.push("Unusually long URL (often used to hide actual domain)");
    }
    if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)) {
      score += 40;
      flags.push("IP-based URL detected (legitimate sites use domains)");
    }
    
    const brandCheck = ["google", "paypal", "microsoft", "apple", "amazon", "netflix"];
    brandCheck.forEach(brand => {
      if (lowerUrl.includes(brand) && !url.includes(`${brand}.com`) && !url.includes(`${brand}.org`)) {
        score += 35;
        flags.push(`Suspicious use of '${brand}' in non-official domain string`);
      }
    });

    const risk = score >= 60 ? "HIGH" : score >= 30 ? "MEDIUM" : "LOW";

    const result = {
      type: 'URL',
      input: url,
      risk,
      score,
      explanation: flags.length > 0 ? flags : ["No immediate heuristic red flags detected."],
      recommendation: risk === "HIGH" ? "Do not click. Report this link." : "Proceed with caution."
    };

    setResults(result);
    setHistory(prev => [result, ...prev.slice(0, 4)]);
    setLoading(false);
  };

  const analyzeText = async (text) => {
    if (!text) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    let score = 0;
    const detectedPatterns = [];
    const lowerText = text.toLowerCase();

    Object.entries(HEURISTIC_KEYWORDS).forEach(([category, words]) => {
      const matches = words.filter(word => lowerText.includes(word));
      if (matches.length > 0) {
        score += 25;
        detectedPatterns.push(`${category.toUpperCase()}: Found keywords like "${matches[0]}"`);
      }
    });

    const risk = score > 50 ? "HIGH" : score >= 25 ? "MEDIUM" : "LOW";

    const result = {
      type: 'Text',
      input: text.substring(0, 40) + "...",
      risk,
      score,
      explanation: detectedPatterns.length > 0 ? detectedPatterns : ["No suspicious linguistic patterns detected."],
      recommendation: risk === "HIGH" ? "Likely a phishing attempt. Ignore and block." : "Verify via secondary channels."
    };

    setResults(result);
    setHistory(prev => [result, ...prev.slice(0, 4)]);
    setLoading(false);
  };

  const checkEmail = (email) => {
    if (!email) return;
    const breaches = MOCK_BREACHES[email.toLowerCase()] || [];
    const result = {
      type: 'Email',
      input: email,
      risk: breaches.length > 0 ? "HIGH" : "LOW",
      explanation: breaches.length > 0 
        ? [`Found in ${breaches.length} leaks:`, ...breaches]
        : ["No known leaks found in this dataset."],
      recommendation: breaches.length > 0 ? "Enable 2FA and change passwords." : "Maintain good security hygiene."
    };
    setResults(result);
  };

   return (
    <div className="space-y-8 animate-in fade-in duration-500 w-full">
      <div className="space-y-6">
        {/* Main Scanner Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
           <ScannerTab activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setResults(null); }} />

          <div className="p-8">
            {activeTab === 'url' && (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="https://g00gle-security.com"
                    className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-lg"
                    id="urlInput"
                  />
                  <button 
                    onClick={() => analyzeURL(document.getElementById('urlInput').value)}
                    disabled={loading}
                    className="px-10 py-4 bg-indigo-600 text-white font-bold text-lg rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" size={22} /> : "Scan URL"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-4">
                <textarea 
                  rows="5"
                  placeholder="Paste the suspicious message here..."
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-lg"
                  id="textInput"
                />
                <button 
                  onClick={() => analyzeText(document.getElementById('textInput').value)}
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 text-white font-bold text-lg rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? "Analyzing Intent..." : "Analyze Content"}
                </button>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <input 
                    type="email" 
                    placeholder="user@example.com"
                    className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg"
                    id="emailInput"
                  />
                  <button 
                    onClick={() => checkEmail(document.getElementById('emailInput').value)}
                    className="px-10 py-4 bg-slate-800 text-white font-bold text-lg rounded-xl hover:bg-slate-900 transition-colors"
                  >
                    Check Database
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Results Section */}
        {results && (
          <section className={`rounded-2xl border-l-8 p-8 shadow-sm bg-white animate-in slide-in-from-bottom-4 duration-300 ${
            results.risk === 'HIGH' ? 'border-red-500' : results.risk === 'MEDIUM' ? 'border-amber-500' : 'border-green-500'
          }`}>
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  {results.risk === 'HIGH' ? <ShieldAlert className="text-red-500" size={28}/> : <ShieldCheck className="text-green-500" size={28}/>}
                  Risk Level: <span className={results.risk === 'HIGH' ? 'text-red-600' : results.risk === 'MEDIUM' ? 'text-amber-600' : 'text-green-600'}>{results.risk}</span>
                </h3>
                <p className="text-base text-slate-500 mt-2">Classification based on {results.type} analysis engine.</p>
              </div>
              {results.score !== undefined && (
                <div className="text-right bg-slate-50 px-5 py-3 rounded-xl border border-slate-100">
                  <div className="text-3xl font-black text-slate-800 leading-none">{results.score}</div>
                  <div className="text-xs uppercase font-bold text-slate-400 tracking-wider mt-1">Score</div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Info size={16} /> Diagnostic Findings
                </h4>
                <ul className="space-y-3">
                  {results.explanation.map((item, i) => (
                    <li key={i} className="text-base text-slate-700 flex items-start gap-3">
                      <AlertTriangle size={18} className={`mt-0.5 shrink-0 ${results.risk === 'HIGH' ? 'text-red-400' : 'text-amber-400'}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 flex items-center gap-4">
                <Zap size={24} className="text-indigo-500 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-1">Recommendation</p>
                  <p className="text-lg font-semibold text-indigo-900">{results.recommendation}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Vertical Footer Sidebar Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-slate-800">
              <History size={20} className="text-indigo-600" />
              Recent Scans
            </h3>
            <div className="space-y-4">
              {history.length === 0 ? (
                <p className="text-base text-slate-400 italic">No activity yet.</p>
              ) : (
                history.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all border-b border-slate-50 last:border-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">{item.type}</p>
                      <p className="text-sm font-medium text-slate-700 truncate pr-4">{item.input}</p>
                    </div>
                    <div className={`text-xs font-bold px-3 py-1 rounded-md uppercase ${
                      item.risk === 'HIGH' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {item.risk}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Lock size={20} className="text-indigo-400" />
                Security Hub
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-slate-800 p-3 rounded-xl h-fit">
                    <Eye size={20} className="text-indigo-300" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-tight text-indigo-300">Validation First</p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">Always verify the sender's identity through official channels before acting.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-slate-800 p-3 rounded-xl h-fit">
                    <ShieldCheck size={20} className="text-indigo-300" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-tight text-indigo-300">Encrypted Scans</p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">All inputs are processed through secure heuristic layers for privacy.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-12 -right-12 opacity-10">
                <ShieldCheck size={200} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;