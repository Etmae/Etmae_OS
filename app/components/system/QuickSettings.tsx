import React, { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import {

  Wifi,

  Bluetooth,

  Plane,

  Moon,

  Battery,

  Volume2,

  Sun,

  Settings,

  PenLine,

  Accessibility,

  ChevronRight

} from 'lucide-react';



interface QuickSettingsProps {

  quickSettingsOpen: boolean;

  setQuickSettingsOpen: (open: boolean) => void;

  brightness: number;

  setBrightness: (value: number) => void;

  volume: number;

  setVolume: (value: number) => void;

}



// Windows 11 Light Mode Colors

const ACTIVE_BG = 'bg-blue-500'; // Standard Windows Accent Blue

const ACTIVE_TEXT = 'text-white';

const INACTIVE_BG = 'bg-gray-100'; // Light gray, nearly white

const INACTIVE_BORDER = 'border-gray-200';

const INACTIVE_TEXT = 'text-gray-800';

const PRIMARY_BG = '#f3f3f3'; // Near white for the main panel background



// Helper for the Toggle Buttons

const QuickToggle: React.FC<{
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  hasSubMenu?: boolean;
}> = ({ icon, label, active, onClick, hasSubMenu }) => (
  <div className="col-span-1 flex flex-col gap-2">
    <div
      className={`
        h-16 rounded-lg flex items-stretch transition-all duration-200 border
        ${active
          ? `${ACTIVE_BG} ${ACTIVE_TEXT} border-blue-500 hover:bg-blue-600`
          : `${INACTIVE_BG} ${INACTIVE_TEXT} ${INACTIVE_BORDER} hover:bg-gray-200`
        }
      `}
    >
      <button
        onClick={onClick}
        className="flex-1 flex items-center justify-center rounded-l-lg"
      >
        <div className={active ? ACTIVE_TEXT : 'text-gray-700'}>
          {icon}
        </div>
      </button>

      {hasSubMenu && (
        <button className={`
          w-8 flex items-center justify-center rounded-r-lg border-l transition-colors
          ${active
            ? 'border-white/30 hover:bg-blue-600'
            : 'border-gray-300 hover:bg-gray-200'
          }
        `}>
          <ChevronRight size={14} className={active ? ACTIVE_TEXT : 'text-gray-600'} />
        </button>
      )}
    </div>
    <span className={`text-[11px] font-medium text-center leading-tight ${active ? 'text-gray-900' : 'text-gray-700'}`}>
      {label}
    </span>
  </div>
);


// Helper for Sliders

const QuickSlider: React.FC<{ icon: React.ReactNode; value: number; onChange: (val: number) => void }> = ({ icon, value, onChange }) => (

  <div className="flex items-center gap-4 h-8 group">

    {/* Icon (Dark text in Light Mode) */}

    <div className="text-gray-600 group-hover:text-gray-900 transition-colors">

      {icon}

    </div>

    <div className="flex-1 relative h-1 bg-gray-300 rounded-full group hover:bg-gray-400 transition-colors">

      {/* Background Track */}

      <input

        type="range"

        min="0"

        max="100"

        value={value}

        onChange={(e) => onChange(Number(e.target.value))}

        className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"

      />

      {/* Active Fill Track (Blue) */}

      <div

        className="absolute top-0 left-0 h-full bg-blue-500 rounded-full z-10 pointer-events-none transition-all duration-75 ease-out"

        style={{ width: `${value}%` }}

      />

      {/* Handle (White circle on hover) */}

      <div

        className="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-white rounded-full shadow-md z-10 pointer-events-none scale-0 group-hover:scale-100 transition-transform duration-200 ring-1 ring-gray-400"

        style={{ left: `${value}%`, transform: `translate(-50%, -50%) scale(${value > -1 ? 1 : 0})` }}

      />

    </div>

  </div>

);





const QuickSettings: React.FC<QuickSettingsProps> = ({

  quickSettingsOpen,

  setQuickSettingsOpen,

  brightness,

  setBrightness,

  volume,

  setVolume

}) => {

  const [wifi, setWifi] = useState(true);

  const [bluetooth, setBluetooth] = useState(true);

  const [airplane, setAirplane] = useState(false);

  const [saver, setSaver] = useState(false);

  const [nightLight, setNightLight] = useState(false);

  const [accessibility, setAccessibility] = useState(false);



  return (

    <AnimatePresence>

      {quickSettingsOpen && (

        <>

          {/* Invisible Overlay */}

          <motion.div

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            exit={{ opacity: 0 }}

            className="fixed inset-0 z-40"

            onClick={() => setQuickSettingsOpen(false)}

          />



          {/* Main Panel */}

          <motion.div

            className="fixed bottom-14 right-4 z-50 w-[360px] overflow-hidden rounded-2xl origin-bottom-right shadow-2xl ring-1 ring-gray-200"

            style={{

              background: PRIMARY_BG, // Light Mode Background

              backdropFilter: 'blur(40px)', // Mica blur

            }}

            initial={{ opacity: 0, y: 20, scale: 0.95 }}

            animate={{ opacity: 1, y: 0, scale: 1 }}

            exit={{ opacity: 0, y: 20, scale: 0.95 }}

            transition={{ duration: 0.2, ease: "easeOut" }}

          >

            {/* 1. Toggles Grid */}

            <div className="p-6 pb-2 grid grid-cols-3 gap-3">

              <QuickToggle

                icon={<Wifi size={18} />}

                label="Wi-Fi"

                active={wifi}

                onClick={() => setWifi(!wifi)}

                hasSubMenu

              />

              <QuickToggle

                icon={<Bluetooth size={18} />}

                label="Bluetooth"

                active={bluetooth}

                onClick={() => setBluetooth(!bluetooth)}

                hasSubMenu

              />

              <QuickToggle

                icon={<Plane size={18} />}

                label="Airplane mode"

                active={airplane}

                onClick={() => setAirplane(!airplane)}

              />

              <QuickToggle

                icon={<Battery size={18} />}

                label="Battery saver"

                active={saver}

                onClick={() => setSaver(!saver)}

              />

              {/* Note: In your reference, this spot is "Focus Assist" */}

              <QuickToggle

                icon={<Moon size={18} />}

                label="Night light"

                active={nightLight}

                onClick={() => setNightLight(!nightLight)}

              />

              <QuickToggle

                icon={<Accessibility size={18} />}

                label="Accessibility"

                active={accessibility}

                onClick={() => setAccessibility(!accessibility)}

              />

            </div>



            {/* 2. Sliders Section */}

            <div className="px-6 py-4 space-y-6">

              <QuickSlider

                icon={<Sun size={18} />}

                value={brightness}

                onChange={setBrightness}

              />

              <QuickSlider

                icon={<Volume2 size={18} />}

                value={volume}

                onChange={setVolume}

              />

            </div>



            {/* 3. Footer */}

            <div className="h-12 bg-gray-200 border-t border-gray-300 px-4 flex items-center justify-between mt-2">

              <div className="flex items-center gap-2 hover:bg-gray-300 p-2 rounded-md transition-colors cursor-pointer text-gray-800">

                <Battery size={16} />

                <span className="text-xs font-medium">58%</span>

              </div>



              <div className="flex items-center gap-2">

                <button className="p-2 hover:bg-gray-300 rounded-full text-gray-700 hover:text-gray-900 transition-colors">

                  <PenLine size={14} />

                </button>

                <button className="p-2 hover:bg-gray-300 rounded-full text-gray-700 hover:text-gray-900 transition-colors">

                  <Settings size={14} />

                </button>

              </div>

            </div>



          </motion.div>

        </>

      )}

    </AnimatePresence>

  );

};



export default QuickSettings;
