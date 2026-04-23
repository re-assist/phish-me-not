import { History } from "lucide-react";

const RecentScans = ({history}) => {

    return (
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
    );
}

export default RecentScans;