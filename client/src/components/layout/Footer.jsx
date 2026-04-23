

const Footer = () => {
    return (
        <footer className="max-w-6xl w-full mx-auto mt-auto pt-10 pb-4 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm gap-6 shrink-0">
        <p className="font-medium">© 2026 PhishMeNot Smart Threat Detection  System</p>
        <div className="flex gap-8 font-semibold">
           <a
            href="https://github.com/re-assist/phish-me-not"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 transition-colors  tracking-wider text-xs"
            >
            Documentation
            </a>
          <a
            href="https://github.com/openphish/pyopdb"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 transition-colors  tracking-wider text-xs"
            >
            Phising URL Detection API
                </a>
                <a
            href="https://huggingface.co/MrTher/scam_detector"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 transition-colors  tracking-wider text-xs"
            >
            Scam Detection Model
            </a>
                
        
         
        </div>
      </footer>
    );
}

export default Footer;