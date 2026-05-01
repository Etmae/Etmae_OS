import { motion } from "framer-motion";
import { Power } from "lucide-react";
import { useNavigate } from "react-router";

export const PowerOff = () => {
  const navigate = useNavigate();

  const handlePowerOn = () => {
    // Clear the boot flag and reload to trigger the boot sequence
    sessionStorage.removeItem("system_booted");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
      {/* The "Monitor" Standby Light */}
      <div className="mb-12 w-2 h-2 rounded-full bg-orange-500/20 shadow-[0_0_8px_rgba(249,115,22,0.5)] animate-pulse" />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePowerOn}
        className="group relative flex flex-col items-center gap-6"
      >
        {/* Big Switch Button */}
        <div className="relative">
          <div className="w-24 h-12 rounded-full bg-black border-2 border-gray-600 flex items-center transition-all group-hover:border-gray-400 group-hover:shadow-[0_0_30px_rgba(156,163,175,0.4)]">
            <div className="w-10 h-10 rounded-full bg-gray-600 ml-1 transition-all group-hover:bg-gray-400 group-hover:translate-x-1 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-black"></div>
            </div>
          </div>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-green-500/20 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse"></div>
        </div>
        
        <span className="text-green-500/30 font-mono text-sm uppercase tracking-[0.2em] group-hover:text-green-400 transition-colors">
          Power On
        </span>
      </motion.button>

      <p className="fixed bottom-8 text-white/5 font-mono text-[10px]">
        SYSTEM_STATE: DISCONNECTED
      </p>
    </div>
  );
}