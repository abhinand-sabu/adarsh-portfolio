import React, { useState, useEffect } from 'react';
import { Smartphone, Wifi, Copy, Check, X, QrCode, ExternalLink } from 'lucide-react';
import { copyTextToClipboard } from '../utils/mediaUtils';
import QRCode from 'qrcode';

export default function NetworkBanner() {
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Machine IP address determined during network configuration
  const defaultLanIp = '192.168.1.3';
  const defaultPort = '5173';
  const lanUrl = `http://${defaultLanIp}:${defaultPort}`;

  useEffect(() => {
    // Generate QR Code data URL
    QRCode.toDataURL(lanUrl, {
      width: 280,
      margin: 2,
      color: {
        dark: '#050814',
        light: '#F5D061',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code:', err));

    // Detect if client is already accessing from a mobile device or non-localhost
    if (typeof window !== 'undefined') {
      const isMobileAgent = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isLanHost = window.location.hostname === defaultLanIp || window.location.hostname !== 'localhost';
      setIsMobileDevice(isMobileAgent || isLanHost);
    }
  }, [lanUrl]);

  const handleCopy = async () => {
    const success = await copyTextToClipboard(lanUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (dismissed) return null;

  return (
    <>
      <div className="relative bg-gradient-to-r from-red-950/90 via-[#0a1128]/95 to-blue-950/90 border-b border-amber-500/30 backdrop-blur-md px-3 sm:px-4 py-2 text-xs text-slate-200 transition-all z-40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          
          {/* Status Indicator & LAN URL */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex h-2 w-2 relative flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <div className="flex items-center gap-1.5 font-medium truncate">
                <Wifi className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="text-amber-200 font-semibold hidden xs:inline">Home Network:</span>
                <span className="text-slate-300 hidden md:inline">
                  {isMobileDevice ? 'Mobile Scaling Active' : 'Test on Phone/Tablet'}
                </span>
              </div>
            </div>

            <code className="bg-black/60 px-2 py-0.5 rounded border border-amber-500/30 text-amber-300 font-mono text-[11px] sm:text-xs tracking-wide">
              {lanUrl}
            </code>
          </div>

          {/* Action buttons: QR Code, Copy, Open, Dismiss */}
          <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-end">
            {/* Instant Mobile QR Scan Button */}
            <button
              onClick={() => setShowQrModal(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300 font-bold text-[11px] transition shadow cursor-pointer"
              title="Scan with phone camera to open instantly"
            >
              <QrCode className="w-3.5 h-3.5 text-slate-950" />
              <span>Scan QR</span>
            </button>

            {/* Copy button with secure & HTTP fallback */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 text-amber-300 text-[11px] font-medium transition cursor-pointer"
              title="Copy LAN address"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <a
              href={lanUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[11px] font-medium transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open</span>
            </a>

            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Modal for Instant Mobile Phone Testing */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setShowQrModal(false)} />
          <div className="relative w-full max-w-sm bg-[#090e21] border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-center z-10 space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white font-cinzel">Mobile Device Test</h3>
              </div>
              <button
                onClick={() => setShowQrModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Point your iPhone or Android camera at this code to open the portfolio on your mobile device instantly:
            </p>

            {/* QR Code Container */}
            <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl shadow-xl inline-block mx-auto">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="LAN QR Code"
                  className="w-56 h-56 rounded-xl mx-auto shadow-inner"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center bg-slate-900 rounded-xl text-amber-300 text-xs font-mono">
                  Generating QR...
                </div>
              )}
            </div>

            <div className="space-y-1 text-center">
              <code className="text-xs font-mono font-bold text-amber-300 bg-black/60 px-3 py-1 rounded-full border border-amber-500/30">
                {lanUrl}
              </code>
              <p className="text-[11px] text-slate-400 pt-1">
                Make sure your mobile phone is connected to the same home Wi-Fi network.
              </p>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </>
  );
}
