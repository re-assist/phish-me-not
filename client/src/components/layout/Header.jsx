import { ShieldCheck } from 'lucide-react';

const Header = () => {
    return (
        <header className="max-w-6xl w-full mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
        <div>
            <h1 className="text-4xl font-bold tracking-tight text-indigo-700 flex items-center gap-3">
                <ShieldCheck className="w-10 h-10" />
                PhishMeNot
            </h1>
            <p className="text-slate-500 mt-2 text-lg">Unified Cybersecurity Intelligence Hub</p>
        </div>
        <div className="flex gap-3 text-sm font-medium">
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full flex items-center gap-2 shadow-sm">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                Live Threat Feed
            </span>
            <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full shadow-sm">
                Heuristics Active
            </span>
        </div>
    </header>
    );
}

export default Header;