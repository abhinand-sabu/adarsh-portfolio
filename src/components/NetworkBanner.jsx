import React, { useState } from 'react';
import { Smartphone, Wifi, Copy, Check, X, ExternalLink } from 'lucide-react';

export default function NetworkBanner() {
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const lanUrl = 'http://192.168.1.3:5173';

  const handleCopy = () => {
    navigator.clipboard?.writeText(lanUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (dismissed) return null;

  return (
    <div className="relative bg-gradient-to-r from-red-950/80 via-[#0d142b]/90 to-blue-950/80 border-b border-amber-500/20 backdrop-blur-md px-4 py-2.5 text-xs sm:text-sm text-slate-200 transition-all z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <div className="flex items-center gap-1.5 font-medium">
            <Wifi className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="text-amber-200/90 font-semibold">Home Network Testing Ready:</span>
            <span className="hidden sm:inline text-slate-300">Open on phone/tablet:</span>
          </div>
          <code className="bg-black/50 px-2 py-0.5 rounded border border-amber-500/30 text-amber-300 font-mono text-xs">
            {lanUrl}
          </code>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-medium transition cursor-pointer"
            title="Copy LAN URL"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>
          
          <a
            href={lanUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:text-blue-200 text-xs font-medium transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open</span>
          </a>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-white/10 transition cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
