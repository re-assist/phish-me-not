import  { useState } from 'react';
import ScannerTab from '../components/scanner/ScannerTabs';
import UrlScanner from '../components/scanner/URLScanner';
import TextScanner from '../components/scanner/TextScanner';
import EmailScanner from '../components/scanner/EmailScanner';
import ResultsCard from '../components/results/ResultsCard';
import RecentScans from '../components/widgets/RecentScans';
import SecurityHub from '../components/widgets/SecurityHub';

const MOCK_BREACHES = {
  "test@gmail.com": ["LinkedIn (2016)", "Adobe (2013)", "MySpace (2008)"],
  "admin@company.com": ["Canva (2019)", "Dropbox (2012)"],
  "user@example.com": ["Vercel", "SupaBase"]
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
             <UrlScanner activeTab={activeTab} loading={loading} analyzeURL={analyzeURL} />
            <TextScanner activeTab={activeTab} loading={loading} analyzeText={analyzeText} />
            <EmailScanner activeTab={activeTab} checkEmail={checkEmail}/>
          </div>
        </section>

        {/* Results Section */}
        <ResultsCard results={results} />        

        {/* Vertical Footer Sidebar Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentScans history={history} />

          <SecurityHub />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;