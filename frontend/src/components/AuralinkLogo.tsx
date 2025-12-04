// AuralinkLogo.tsx - SVG logo component
export const AuralinkLogo = ({ className = "w-16 h-16" }: { className?: string }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      
      {/* Outer circle */}
      <circle 
        cx="100" 
        cy="100" 
        r="90" 
        stroke="url(#logoGradient)" 
        strokeWidth="8" 
        fill="none"
      />
      
      {/* Middle circle */}
      <circle 
        cx="100" 
        cy="100" 
        r="70" 
        stroke="url(#logoGradient)" 
        strokeWidth="8" 
        fill="none"
      />
      
      {/* Inner circle */}
      <circle 
        cx="100" 
        cy="100" 
        r="50" 
        stroke="url(#logoGradient)" 
        strokeWidth="8" 
        fill="none"
      />
      
      {/* Center circle (@ center dot) */}
      <circle 
        cx="100" 
        cy="100" 
        r="30" 
        fill="url(#logoGradient)"
      />
      
      {/* @ tail */}
      <path 
        d="M 100 70 Q 140 70 140 100 Q 140 130 100 130 Q 60 130 60 100 Q 60 70 100 70 M 140 100 L 140 140 Q 140 160 120 160" 
        stroke="url(#logoGradient)" 
        strokeWidth="10" 
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};
