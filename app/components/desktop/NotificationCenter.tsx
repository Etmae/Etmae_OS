import React, { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import {

  Bell,

  Settings,

  X,

  ChevronDown,

  ChevronUp,

  Minimize2 // Using a placeholder icon for the app

} from 'lucide-react';



interface Notification {

  id: number;

  app: string;

  time: string;

  icon: React.ReactNode;

  message: string;

  subText?: string;

}



interface NotificationCenterProps {

  isOpen: boolean;

  onClose: () => void;

}



// --- SIMULATED DATA ---



const initialNotifications: Notification[] = [

  {

    id: 1,

    app: 'Microsoft Store',

    time: '23:04',

    icon: <Minimize2 size={16} className="text-blue-600" />,

    message: 'Updates complete',

    subText: '30 titles got updated, check them out.',

  },

  {

    id: 2,

    app: 'Startup App Notification',

    time: '23:04',

    icon: <Minimize2 size={16} className="text-gray-500" />,

    message: 'Some apps were registered to start running when you log in.',

    subText: 'If you want to see the apps or change them, go to Settings.',

  },

  {

    id: 3,

    app: 'Skype',

    time: '22:06',

    icon: <Minimize2 size={16} className="text-blue-500" />,

    message: 'Skype is now enabled',

    subText: 'You are now signed in as example@hotmail.com',

  },

];



// --- HELPER COMPONENTS ---



const NotificationItem: React.FC<Notification> = ({ app, time, message, subText }) => {

    const [collapsed, setCollapsed] = useState(false); // Notifications often collapse/expand



    return (

        // The main container for a single notification (Note the white/translucent background)

        <div className={`bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-3 mb-2 shadow-sm text-gray-800 cursor-pointer transition-all hover:shadow-md ${collapsed ? 'h-14 overflow-hidden' : ''}`}>



            {/* Header: App Name, Time, and Collapse Toggle */}

            <div className="flex justify-between items-center text-xs font-semibold mb-1">

                <div className="flex items-center gap-2">

                    {/* App Icon (Placeholder) */}

                    <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center"></div>

                    <span className="text-gray-800">{app}</span>

                </div>

                <div className="text-gray-500 flex items-center gap-1">

                     {time}

                     <button onClick={() => setCollapsed(!collapsed)} className="p-1 -mr-2 rounded-full hover:bg-gray-200">

                        <ChevronUp size={12} className={`transition-transform ${collapsed ? 'rotate-180' : 'rotate-0'}`} />

                     </button>

                </div>

            </div>



            {/* Message Body */}

            <p className="text-sm font-medium leading-tight">{message}</p>



            {/* Sub Text (Only visible when not collapsed) */}

            {!collapsed && subText && (

                <p className="text-xs text-gray-600 mt-1">{subText}</p>

            )}



            {/* Action Area (e.g., +3 notifications button) */}

            {app === 'Startup App Notification' && !collapsed && (

                 <button className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">

                    +3 notifications

                 </button>

            )}

        </div>

    );

};



// --- CALENDAR WIDGET ---



const CalendarWidget: React.FC = () => {

    const today = new Date();

    const currentMonth = today.getMonth();

    const currentYear = today.getFullYear();

    const day = today.getDate();



    // Helper to generate calendar days for the current month

    const generateCalendar = () => {

        const date = new Date(currentYear, currentMonth, 1);

        const days = [];

        // Add preceding gray days from previous month

        const firstDayOfWeek = date.getDay(); // 0 (Sun) to 6 (Sat)

        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

        for (let i = firstDayOfWeek; i > 0; i--) {

            days.push({ day: daysInPrevMonth - i + 1, current: false });

        }

        // Add current month days

        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        for (let i = 1; i <= daysInMonth; i++) {

            days.push({ day: i, current: true, isToday: i === day });

        }

        // Add succeeding gray days from next month

        const remainingCells = 42 - days.length; // Max 6 weeks

        for (let i = 1; i <= remainingCells; i++) {

            days.push({ day: i, current: false });

        }

        return days.slice(0, 42); // Ensure max 6 weeks (42 cells)

    };



    const days = generateCalendar();

    const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];



    return (

        <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 mt-3 text-gray-800 border border-gray-200">

            <div className="flex justify-between items-center mb-3">

                <h4 className="text-sm font-semibold">{today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h4>

                <div className="flex items-center text-gray-500">

                    <ChevronUp size={14} className="cursor-pointer hover:text-gray-700" />

                    <ChevronDown size={14} className="cursor-pointer hover:text-gray-700" />

                </div>

            </div>



            {/* Day Labels */}

            <div className="grid grid-cols-7 gap-1 text-xs font-medium text-center text-gray-500 mb-1">

                {dayLabels.map(label => <span key={label}>{label}</span>)}

            </div>



            {/* Day Grid */}

            <div className="grid grid-cols-7 gap-1 text-center">

                {days.map((d, index) => (

                    <div

                        key={index}

                        className={`

                            text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full cursor-pointer

                            ${d.isToday ? 'bg-blue-600 text-white' : ''}

                            ${d.current && !d.isToday ? 'text-gray-800 hover:bg-gray-200' : ''}

                            ${!d.current ? 'text-gray-400' : ''}

                        `}

                    >

                        {d.day}

                    </div>

                ))}

            </div>

        </div>

    );

};



// --- MAIN COMPONENT ---



const NotificationCenter: React.FC<NotificationCenterProps> = ({

  isOpen,

  onClose,

}) => {

  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);



  const clearAll = () => {

    setNotifications([]);

  };



  const today = new Date();



  return (

    <AnimatePresence>

      {isOpen && (

        <>

          {/* Invisible Overlay to close on click-outside */}

          <motion.div

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            exit={{ opacity: 0 }}

            className="fixed inset-0 z-40"

            onClick={onClose}

          />



          {/* Calendar Card - Bottom position */}

          <motion.div

            className={`

              fixed bottom-14 right-4 z-49 w-[360px] rounded-2xl shadow-2xl ring-1 ring-gray-200

              bg-white/70 backdrop-blur-2xl text-gray-900 transition-all duration-300

            `}

            initial={{ opacity: 0, y: 40, scale: 0.95 }}

            animate={{ opacity: 1, y: 0, scale: 1 }}

            exit={{ opacity: 0, y: 40, scale: 0.95 }}

            transition={{ duration: 0.2, ease: "easeOut" }}

          >

            <div className="p-4">

              <div className="text-sm font-semibold text-gray-800 mb-2">

                {today.toLocaleDateString('en-US', { weekday: 'long' })}, {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}

              </div>

              <CalendarWidget />

            </div>

          </motion.div>



          {/* Notifications Card - Above calendar */}

          <motion.div

            className={`

              fixed bottom-[380px] right-4 z-50 w-[360px] rounded-2xl shadow-2xl ring-1 ring-gray-200

              bg-white/70 backdrop-blur-2xl text-gray-900 transition-all duration-300

            `}

            style={{
              maxHeight: 'calc(100vh - 350px)'
            }}

            initial={{ opacity: 0, y: 20, scale: 0.95 }}

            animate={{ opacity: 1, y: 0, scale: 1 }}

            exit={{ opacity: 0, y: 20, scale: 0.95 }}

            transition={{ duration: 0.2, ease: "easeOut", delay: 0.1 }}

          >

            <div className="flex flex-col max-h-[400px]">



              {/* 1. Notifications Header */}

              <div className="p-4 flex-shrink-0 border-b border-gray-200 bg-white/70 rounded-t-2xl">

                <div className="flex justify-between items-center">

                  <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>

                  <div className="flex items-center gap-2">

                    {notifications.length > 0 && (

                        <button

                            onClick={clearAll}

                            className="text-sm text-blue-600 hover:underline font-medium"

                        >

                            Clear All

                        </button>

                    )}

                    <button className="p-2 rounded-full hover:bg-gray-200 text-gray-700">

                      <Settings size={16} />

                    </button>

                  </div>

                </div>

              </div>



              {/* 2. Notifications List (Scrollable Section) */}

              <div className="flex-1 p-4 overflow-y-auto rounded-b-2xl bg-white/70">

                {notifications.length > 0 ? (

                  notifications.map(n => <NotificationItem key={n.id} {...n} />)

                ) : (

                  <div className="text-center text-gray-500 py-6">

                    No new notifications.

                  </div>

                )}

              </div>



            </div>

          </motion.div>

        </>

      )}

    </AnimatePresence>

  );

};



export default NotificationCenter;

