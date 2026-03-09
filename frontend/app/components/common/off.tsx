import { motion } from "framer-motion";
import { Power } from "lucide-react";
import { useNavigate } from "react-router";

export const PowerOff = () => {
  const navigate = useNavigate();

  const handlePowerOn = () => {
    // Navigate back to the main OS route
    // The Root layout will see 'system_booted' is missing and trigger the boot sequence
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
      {/* The "Monitor" Standby Light */}
      <div className="mb-12 w-2 h-2 rounded-full bg-orange-500/20 shadow-[0_0_8px_rgba(249,115,22,0.5)] animate-pulse" />

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handlePowerOn}
        className="group relative flex flex-col items-center gap-4"
      >
        {/* Glowing Green Button */}
        <div className="w-20 h-20 rounded-full bg-black border-2 border-green-500/30 flex items-center justify-center transition-all group-hover:border-green-400 group-hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]">
          <Power className="text-green-500/50 group-hover:text-green-400 transition-colors" size={32} />
        </div>
        
        <span className="text-green-500/30 font-mono text-xs uppercase tracking-[0.2em] group-hover:text-green-400 transition-colors">
          Power On
        </span>
      </motion.button>

      <p className="fixed bottom-8 text-white/5 font-mono text-[10px]">
        SYSTEM_STATE: DISCONNECTED
      </p>
    </div>
  );
}