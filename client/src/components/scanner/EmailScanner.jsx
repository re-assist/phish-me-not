


const EmailScanner = ({activeTab,checkEmail}) => {
    return (
        activeTab === 'email' && (
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
            )
    );
}

export default EmailScanner;