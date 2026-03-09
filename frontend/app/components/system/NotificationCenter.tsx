import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Wifi, Code, ChevronRight } from 'lucide-react';

interface NotificationCenterProps {
  notificationOpen: boolean;
  setNotificationOpen: (open: boolean) => void;
  currentTime: Date;
  formatTime: (date: Date) => string;
  formatLongDate: (date: Date) => string;
  hasNotifications: boolean;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notificationOpen,
  setNotificationOpen,
  currentTime,
  formatTime,
  formatLongDate,
  hasNotifications
}) => {
  return (
    <AnimatePresence>
      {notificationOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setNotificationOpen(false)}
          />
          <motion.div
            data-notification
            className="fixed bottom-14 right-2 z-50 w-96 space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(32, 32, 32, 0.95)',
                backdropFilter: 'blur(40px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
              }}
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <span className="text-white text-base font-semibold" style={{ fontFamily: 'Segoe UI' }}>
                  Notifications
                </span>
                <button className="text-white/60 hover:text-white text-sm" style={{ fontFamily: 'Segoe UI' }}>
                  Clear all
                </button>
              </div>
              <div className="max-h-[320px] overflow-y-auto p-4 space-y-3">
                {[
                  { icon: <Mail size={18} className="text-green-400" />, title: 'WhatsApp', description: 'GET (200LV.)', meta: '~M.: 📄 schaum_s_outlines_', badge: '+7 notifications' },
                  { icon: <Wifi size={18} className="text-blue-400" />, title: 'Proton VPN', description: 'You are now protected', meta: 'Connected to Fastest free server Netherlands', badge: '+20 notifications' },
                  { icon: <Code size={18} className="text-orange-400" />, title: 'claude.ai', description: 'Claude responded', meta: 'Thursday', badge: null },
                ].map((notification, idx) => (
                  <div key={idx} className="rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 transition-colors p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        {notification.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium" style={{ fontFamily: 'Segoe UI' }}>
                          {notification.title}
                        </div>
                        <div className="text-white/80 text-sm mt-0.5" style={{ fontFamily: 'Segoe UI' }}>
                          {notification.description}
                        </div>
                        <div className="text-white/50 text-xs mt-1" style={{ fontFamily: 'Segoe UI' }}>
                          {notification.meta}
                        </div>
                        {notification.badge && (
                          <div className="inline-flex mt-2 px-2 py-0.5 rounded-full text-[11px] text-white/80 border border-white/10" style={{ fontFamily: 'Segoe UI' }}>
                            {notification.badge}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(32, 32, 32, 0.95)',
                backdropFilter: 'blur(40px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
              }}
            >
              <div className="p-6 pb-4 flex items-center justify-between">
                <div>
                  <div className="text-white text-lg font-semibold" style={{ fontFamily: 'Segoe UI' }}>
                    Friday, {formatLongDate(currentTime).split(',')[1]?.trim() || formatLongDate(currentTime)}
                  </div>
                  <div className="text-white/70 text-sm" style={{ fontFamily: 'Segoe UI' }}>
                    {formatTime(currentTime)}
                  </div>
                </div>
                <button className="text-white/60 hover:text-white" style={{ fontFamily: 'Segoe UI' }}>
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="px-6 pb-4">
                <div
                  className="rounded-lg p-4"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={day} className="text-white/50 text-xs text-center font-medium">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 35 }, (_, i) => {
                      const day = i - 2;
                      const isToday = day === currentTime.getDate();
                      return (
                        <button
                          key={i}
                          className={`aspect-square rounded-md text-xs transition-colors ${
                            day < 1 || day > 30
                              ? 'text-white/20'
                              : isToday
                              ? 'bg-blue-600 text-white font-semibold'
                              : 'text-white/70 hover:bg-white/10'
                          }`}
                        >
                          {day > 0 && day <= 30 ? day : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="px-6 pb-4 flex gap-2">
                <button className="flex-1 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-colors" style={{ fontFamily: 'Segoe UI' }}>
                  30 mins +
                </button>
                <button className="flex-1 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-colors flex items-center justify-center gap-1" style={{ fontFamily: 'Segoe UI' }}>
                  <span>►</span> Focus
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;
