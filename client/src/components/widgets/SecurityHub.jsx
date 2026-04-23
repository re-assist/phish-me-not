import { ShieldCheck, Eye, Lock } from "lucide-react";

const SecurityHub = () => {

    return (
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
    );
}

export default SecurityHub;