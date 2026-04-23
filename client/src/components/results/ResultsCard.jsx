import { ShieldCheck, ShieldAlert, AlertTriangle, Zap, Info } from 'lucide-react';

const ResultsCard = ({ results }) => {
  if (!results) return null; // Failsafe to prevent null rendering errors

  // Dynamic styling object based on risk level
  const getAlertStyles = (risk) => {
    if (risk === 'HIGH') return {
      container: 'bg-red-50 border-red-200',
      header: 'text-red-600',
      text: 'text-red-900 font-bold uppercase text-sm tracking-wide',
      icon: 'text-red-500'
    };
    if (risk === 'MEDIUM') return {
      container: 'bg-amber-50 border-amber-200',
      header: 'text-amber-600',
      text: 'text-amber-900 font-semibold text-base',
      icon: 'text-amber-500'
    };
    return {
      container: 'bg-green-50 border-green-200',
      header: 'text-green-600',
      text: 'text-green-800 text-base font-medium',
      icon: 'text-green-500'
    };
  };

  const alertStyles = getAlertStyles(results.risk);

  return (
    <section className={`rounded-2xl border-l-8 p-8 shadow-md bg-white animate-in slide-in-from-bottom-4 duration-300 ${
      results.risk === 'HIGH' ? 'border-red-500' : results.risk === 'MEDIUM' ? 'border-amber-500' : 'border-green-500'
    }`}>
      
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-3">
            {results.risk === 'HIGH' ? <ShieldAlert className="text-red-500" size={28}/> : <ShieldCheck className="text-green-500" size={28}/>}
            Risk Level: <span className={results.risk === 'HIGH' ? 'text-red-600' : results.risk === 'MEDIUM' ? 'text-amber-600' : 'text-green-600'}>{results.risk}</span>
          </h3>
          <p className="text-base text-slate-500 mt-2">Classification based on {results.type} analysis engine.</p>
        </div>
        {results.score !== undefined && (
          <div className="text-right bg-slate-50 px-5 py-3 rounded-xl border border-slate-200 shadow-inner">
            <div className="text-3xl font-black text-slate-800 leading-none">{results.score}</div>
            <div className="text-xs uppercase font-bold text-slate-400 tracking-wider mt-1">Score</div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        
        {/* Dynamic Findings Section */}
        <div className={`rounded-xl p-6 border ${alertStyles.container}`}>
          <h4 className={`text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${alertStyles.header}`}>
            <Info size={18} /> Diagnostic Findings
          </h4>
          <ul className="space-y-3">
            {results.explanation.map((item, i) => (
              <li key={i} className={`flex items-start gap-3 leading-relaxed ${alertStyles.text}`}>
                <AlertTriangle size={18} className={`mt-0.5 shrink-0 ${alertStyles.icon}`} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* High-Contrast Recommendation Section */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex items-center gap-4 shadow-lg">
          <Zap size={28} className={results.risk === 'HIGH' ? 'text-red-400' : results.risk === 'MEDIUM' ? 'text-amber-400' : 'text-green-400'} shrink-0 />
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Recommended Action</p>
            <p className="text-xl font-bold text-white tracking-wide">{results.recommendation}</p>
          </div>
        </div>
        
      </div>
    </section>
  );
}

export default ResultsCard;