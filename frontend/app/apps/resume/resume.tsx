/**
 * ResumeApp.tsx
 *
 * Opens Resume.pdf directly inside the portfolio window using a native iframe.
 * The PDF renders exactly as it looks in the document — no parsing, no
 * reconstruction, no third-party libraries required.
 *
 * Setup:
 *   Place Resume.pdf in your /public folder so it is served at /Resume.pdf.
 *   The iframe src="#toolbar=0&navpanes=0" hides the browser's built-in PDF
 *   chrome so the document fills the window cleanly.
 *
 * A floating button in the bottom-right corner is provided for downloads.
 */

import React, { useState } from 'react';
import { Download, ExternalLink, AlertCircle } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Path to the PDF file served from the /public directory.
 * Update this if you place the file in a subdirectory, e.g. '/assets/Resume.pdf'
 */
const PDF_SRC = '/Resume.pdf';

/** Accent colour matching Win11 system blue */
const ACCENT = '#0078d4';

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface ResumeAppProps {
  windowId?: string;
  scrollContainer?: React.RefObject<HTMLDivElement>;
}

const ResumeApp: React.FC<ResumeAppProps> = () => {
  const [loadError, setLoadError] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(PDF_SRC);
      if (!response.ok) throw new Error('Failed to fetch PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Olujimi_Erioluwa_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to direct link
      window.open(PDF_SRC, '_blank');
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#1e1e1e',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        color: '#fff',
        overflow: 'hidden',
      }}
    >
      {/* ── PDF iframe ── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {!loadError ? (
          <iframe
            src={`${PDF_SRC}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
            title="Resume"
            onError={() => setLoadError(true)}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
              background: '#1e1e1e',
            }}
          />
        ) : (
          /* ── Fallback for browsers that block iframe PDF rendering ── */
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              padding: 32,
              textAlign: 'center',
            }}
          >
            <AlertCircle size={36} style={{ color: 'rgba(255,255,255,.25)' }} />
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', maxWidth: 300, lineHeight: 1.6 }}>
              Your browser blocked the PDF preview. Use the button below to open the file directly.
            </p>
            <a
              href={PDF_SRC}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 18px', borderRadius: 6,
                background: ACCENT, color: '#fff',
                fontSize: 12, fontWeight: 600, textDecoration: 'none',
              }}
            >
              <ExternalLink size={13} />
              Open PDF in browser
            </a>
          </div>
        )}
      </div>

      {/* ── Floating Download Button ── */}
      <button
        onClick={handleDownload}
        title="Download PDF"
        style={{
          position: 'absolute',
          bottom: 74,
          right: 32,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 20px',
          borderRadius: 30, // Pill shape
          background: ACCENT,
          color: '#fff',
          fontSize: 13,
          fontWeight: 600,
          textDecoration: 'none',
          cursor: 'pointer',
          border: 'none',
          boxShadow: '0 6px 16px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.2)',
          transition: 'transform 0.15s ease, background 0.15s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#106ebe'; // Slightly darker accent on hover
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = ACCENT;
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        onMouseDown={e => {
          e.currentTarget.style.transform = 'translateY(1px)';
        }}
        onMouseUp={e => {
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
      >
        <Download size={16} />
        Download Resume
      </button>
    </div>
  );
};

export default ResumeApp;