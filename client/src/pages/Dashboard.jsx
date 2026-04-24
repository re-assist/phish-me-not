import  { useState } from 'react';
import ScannerTabs from '../components/scanner/ScannerTabs';
import UrlScanner from '../components/scanner/UrlScanner';
import TextScanner from '../components/scanner/TextScanner';
import EmailScanner from '../components/scanner/EmailScanner';
import ResultsCard from '../components/results/ResultsCard';
import RecentScans from '../components/widgets/RecentScans';
import SecurityHub from '../components/widgets/SecurityHub';
import { analyzeURL, analyzeTextContent, checkEmailBreach } from '../services/scannerService';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('url');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);

  // --- HANDLERS (Bridging React State to Pure Services) ---

  const handleUrlScan = async (inputUrl) => {
    setLoading(true);
    try {
      const data = await analyzeURL(inputUrl); 
      setResults(data);
      setHistory(prev => [data, ...prev.slice(0, 4)]);
    } catch (error) {
      console.error("URL Scan failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTextScan = async (inputText) => {
    setLoading(true);
    try {
      const data = await analyzeTextContent(inputText);
      setResults(data);
      setHistory(prev => [data, ...prev.slice(0, 4)]);
    } catch (error) {
      console.error("Text Scan failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailScan = async (inputEmail) => {
    setLoading(true);
    try {
      const data = await checkEmailBreach(inputEmail);
      setResults(data);
      setHistory(prev => [data, ...prev.slice(0, 4)]);
    } catch (error) {
      console.error("Email Scan failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 w-full">
      <div className="space-y-6">
        
        {/* Main Scanner Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <ScannerTabs activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setResults(null); }} />

          <div className="p-8">
            {/* FIXED: 'url' must be lowercase to match state. Props standardized. */}
            {activeTab === 'url' && (
              <UrlScanner onScan={handleUrlScan} isLoading={loading} />
            )}
            
            {/* FIXED: Passed handleTextScan to onScan. */}
            {activeTab === 'text' && (
              <TextScanner onScan={handleTextScan} isLoading={loading} />
            )}
            
            {/* FIXED: Passed handleEmailScan to onScan. Removed activeTab prop. */}
            {activeTab === 'email' && (
              <EmailScanner onScan={handleEmailScan} isLoading={loading} />
            )}
          </div>
        </section>

        {/* 3. FIXED: Results Section protected by null check */}
        {results && (
          <ResultsCard results={results} />        
        )}

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