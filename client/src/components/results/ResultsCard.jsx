import { ShieldCheck, ShieldAlert, AlertTriangle, Zap, Info } from 'lucide-react';

const ResultsCard = ({results}) => {

    return (
        results && (
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
        )
    );
}

export default ResultsCard;