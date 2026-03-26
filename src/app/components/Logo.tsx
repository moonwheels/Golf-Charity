import { motion } from "motion/react";

export function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      {/* Golf ball - white */}
      <circle cx="50" cy="50" r="32" fill="#ffffff" stroke="#FFD95A" strokeWidth="2"/>
      
      {/* Golf club - positioned to the right */}
      {/* Club is prominent and bold, using warm yellow */}
      <g transform="translate(78, 58)">
        {/* Club shaft */}
        <line x1="0" y1="0" x2="24" y2="-35" stroke="#FFD95A" strokeWidth="4" strokeLinecap="round"/>
        {/* Club head */}
        <rect x="-4" y="0" width="16" height="8" fill="#FFD95A" rx="1"/>
      </g>
      
      {/* Dimple pattern - rich green dots */}
      <circle cx="50" cy="35" r="3" fill="#145A41"/>
      <circle cx="38" cy="44" r="3" fill="#145A41"/>
      <circle cx="62" cy="44" r="3" fill="#145A41"/>
      <circle cx="42" cy="54" r="3" fill="#145A41"/>
      <circle cx="58" cy="54" r="3" fill="#145A41"/>
      <circle cx="50" cy="62" r="3" fill="#145A41"/>
      <circle cx="34" cy="54" r="3" fill="#145A41"/>
      <circle cx="66" cy="54" r="3" fill="#145A41"/>
      <circle cx="50" cy="46" r="3" fill="#145A41"/>
    </motion.svg>
  );
}