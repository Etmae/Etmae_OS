/**
 * TaskbarThumbnailPreview.tsx
 *
 * Windows 11-style window thumbnail preview panel.
 *
 * Fixes applied:
 * - Removed 'instances' from ThumbnailPreviewProps. The component now reads
 *   live window state directly from useWindowStore filtered by appId. This
 *   prevents stale snapshot data — the old prop was captured at hover time
 *   and never reflected snapshot updates written to the store afterward.
 * - All snapshot reads now hit the live store, so thumbnails appear as soon
 *   as html2canvas finishes capturing them.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useWindowStore, type WindowState } from '../../state/useWindowStore';
import { APP_REGISTRY } from '../../apps/registry';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface ThumbnailPreviewProps {
  appId: string;
  anchorRect: DOMRect | null;
  /** Parent-managed dismiss timer ref — shared so the icon and panel cooperate. */
  dismissTimerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
  onDismiss: () => void;
}

interface ThumbnailCardProps {
  win: WindowState;
  isFocused: boolean;
  index: number;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// THUMBNAIL CARD
// ─────────────────────────────────────────────────────────────────────────────

const ThumbnailCard: React.FC<ThumbnailCardProps> = ({
  win,
  isFocused,
  index,
  onClose,
  onFocus,
}) => {
  const [hovered, setHovered] = useState(false);
  const AppConfig = APP_REGISTRY[win.appId];

  const renderIcon = (icon: any, size = 13) => {
    if (!icon) return null;
    if (typeof icon === 'string') return <img src={icon} alt="" style={{ width: size, height: size }} />;
    if (React.isValidElement(icon)) return React.cloneElement(icon as React.ReactElement<any>, { size } as any);
    return React.createElement(icon, { size, className: 'text-gray-300' });
  };

  // Read snapshot directly from the win object — live from the store
  const snapshot = win.snapshot ?? null;
  console.log('ThumbnailCard for', win.id, 'snapshot length:', snapshot?.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 420, damping: 30, delay: index * 0.045 }}
      style={{ width: 200, display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onFocus(win.id)}
    >
      {/* ── Thumbnail frame ── */}
      <div
        style={{
          position: 'relative',
          height: 120,
          borderRadius: 8,
          overflow: 'hidden',
          background: '#1a1a1a',
          border: `1px solid ${
            hovered
              ? isFocused ? 'rgba(0,120,212,0.9)' : 'rgba(255,255,255,0.3)'
              : isFocused ? 'rgba(0,120,212,0.5)' : 'rgba(255,255,255,0.1)'
          }`,
          boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.55)' : '0 4px 12px rgba(0,0,0,0.3)',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
      >
        {snapshot ? (
          <img
            src={snapshot}
            alt={win.title}
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top left',
              display: 'block',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              background: 'linear-gradient(135deg, #2d2d2d 0%, #1c1c1c 100%)',
            }}
          >
            <div style={{ opacity: 0.4, transform: 'scale(2.2)' }}>
              {renderIcon(AppConfig?.icon, 16)}
            </div>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', marginTop: 6 }}>
              Loading preview…
            </span>
          </div>
        )}

        {isFocused && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 8,
              pointerEvents: 'none',
              boxShadow: 'inset 0 0 0 1.5px rgba(0,120,212,0.65)',
            }}
          />
        )}

        <motion.button
          initial={false}
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }}
          transition={{ duration: 0.1 }}
          onClick={(e) => {
            e.stopPropagation();
            onClose(win.id);
          }}
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 20,
            height: 20,
            borderRadius: 5,
            background: '#c42b1c',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: hovered ? 'auto' : 'none',
            zIndex: 10,
          }}
          title="Close window"
        >
          <X size={11} strokeWidth={2.5} color="#fff" />
        </motion.button>
      </div>

      {/* ── Label row ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginTop: 6,
          paddingInline: 2,
          minWidth: 0,
        }}
      >
        <div style={{ flexShrink: 0 }}>{renderIcon(AppConfig?.icon)}</div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
            color: isFocused ? 'rgba(255,255,255,.95)' : 'rgba(255,255,255,.6)',
          }}
        >
          {win.title}
        </span>
        {isFocused && (
          <div
            style={{
              flexShrink: 0,
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#0078d4',
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PREVIEW PANEL
// ─────────────────────────────────────────────────────────────────────────────

const TaskbarThumbnailPreview: React.FC<ThumbnailPreviewProps> = ({
  appId,
  anchorRect,
  dismissTimerRef,
  onDismiss,
}) => {
  const { windows, windowOrder, focusWindow, closeWindow } = useWindowStore();
  const focusedId = windowOrder[windowOrder.length - 1];

  // Read live from the store — always up to date, snapshots included
  const instances = Object.values(windows).filter((w) => w.appId === appId);

  const getLeft = (): number => {
    if (!anchorRect) return 8;
    const panelWidth =
      instances.length * 200 + Math.max(instances.length - 1, 0) * 12 + 24;
    const centre = anchorRect.left + anchorRect.width / 2;
    const ideal = centre - panelWidth / 2;
    return Math.max(8, Math.min(ideal, window.innerWidth - panelWidth - 8));
  };

  const handleMouseEnter = () => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    dismissTimerRef.current = setTimeout(onDismiss, 400);
  };

  if (!instances.length || !anchorRect) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ type: 'tween', duration: 0.14, ease: 'easeOut' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'fixed',
        bottom: 56,
        left: getLeft(),
        zIndex: 9998,
        display: 'flex',
        flexDirection: 'row',
        gap: 12,
        padding: 12,
        borderRadius: 12,
        background: 'rgba(30,30,30,0.92)',
        backdropFilter: 'blur(28px) saturate(160%)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 -4px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {instances.map((win, idx) => (
        <ThumbnailCard
          key={win.id}
          win={win}
          isFocused={win.id === focusedId}
          index={idx}
          onClose={closeWindow}
          onFocus={focusWindow}
        />
      ))}
    </motion.div>
  );
};

export default TaskbarThumbnailPreview;