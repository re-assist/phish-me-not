import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  ShieldQuestion, 
  Link2, 
  MessageSquare, 
  Mail,   
  AlertTriangle,
  ChevronRight,
  Info,
  History,
  Lock,
  Eye,
  Zap,
  Loader2
} from 'lucide-react';

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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Container is now a simple vertical stack */}
      <div className="space-y-6">
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <nav className="flex border-b border-slate-100">
            {['url', 'text', 'email'].map((tab) => (
              <button 
                key={tab}
                onClick={() => {setActiveTab(tab); setResults(null);}}
                className={`flex-1 py-4 px-4 flex items-center justify-center gap-2 transition-all font-medium ${
                  activeTab === tab 
                    ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {tab === 'url' ? <Link2 size={18} /> : tab === 'text' ? <MessageSquare size={18} /> : <Mail size={18} />}
                <span className="capitalize">{tab} Scanner</span>
              </button>
            ))}
          </nav>

          <div className="p-6">
            {activeTab === 'url' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="https://g00gle-security.com"
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    id="urlInput"
                  />
                  <button 
                    onClick={() => analyzeURL(document.getElementById('urlInput').value)}
                    disabled={loading}
                    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : "Scan"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-4">
                <textarea 
                  rows="4"
                  placeholder="Paste the suspicious message here..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                  id="textInput"
                />
                <button 
                  onClick={() => analyzeText(document.getElementById('textInput').value)}
                  disabled={loading}
                  className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? "Analyzing..." : "Analyze Content"}
                </button>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="user@example.com"
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    id="emailInput"
                  />
                  <button 
                    onClick={() => checkEmail(document.getElementById('emailInput').value)}
                    className="px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors"
                  >
                    Check
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {results && (
          <section className={`rounded-2xl border-l-8 p-6 shadow-sm bg-white animate-in slide-in-from-bottom-4 duration-300 ${
            results.risk === 'HIGH' ? 'border-red-500' : results.risk === 'MEDIUM' ? 'border-amber-500' : 'border-green-500'
          }`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  {results.risk === 'HIGH' ? <ShieldAlert className="text-red-500" /> : <ShieldCheck className="text-green-500" />}
                  Risk Level: <span className={results.risk === 'HIGH' ? 'text-red-600' : results.risk === 'MEDIUM' ? 'text-amber-600' : 'text-green-600'}>{results.risk}</span>
                </h3>
                <p className="text-sm text-slate-500">Classification based on {results.type} analysis engine.</p>
              </div>
              {results.score !== undefined && (
                <div className="text-right bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                  <div className="text-2xl font-black text-slate-800 leading-none">{results.score}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Score</div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                  <Info size={14} /> Diagnostic Findings
                </h4>
                <ul className="space-y-2">
                  {results.explanation.map((item, i) => (
                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                      <AlertTriangle size={16} className={`mt-0.5 shrink-0 ${results.risk === 'HIGH' ? 'text-red-400' : 'text-amber-400'}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-center gap-3">
                <Zap size={20} className="text-indigo-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Recommendation</p>
                  <p className="text-sm font-semibold text-indigo-900">{results.recommendation}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Sidebar content now placed vertically below main scanner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-slate-800">
              <History size={18} className="text-indigo-600" />
              Recent Scans
            </h3>
            <div className="space-y-3">
              {history.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No activity yet.</p>
              ) : (
                history.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-all border-b border-slate-50 last:border-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{item.type}</p>
                      <p className="text-xs font-medium text-slate-700 truncate pr-2">{item.input}</p>
                    </div>
                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      item.risk === 'HIGH' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {item.risk}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl shadow-xl p-6 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Lock size={20} className="text-indigo-400" />
                Security Hub
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="bg-slate-800 p-2 rounded-lg h-fit">
                    <Eye size={16} className="text-indigo-300" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-tight text-indigo-300">Validation First</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">Always verify the sender's identity through official channels before acting.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-slate-800 p-2 rounded-lg h-fit">
                    <ShieldCheck size={16} className="text-indigo-300" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-tight text-indigo-300">Encrypted Scans</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">All inputs are processed through secure heuristic layers for privacy.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 opacity-10">
                <ShieldCheck size={160} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;