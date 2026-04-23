

const TextScanner = ({activeTab, loading, analyzeText}) => {
    return (
        activeTab === 'text' && (
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
            )
    );
}

export default TextScanner;