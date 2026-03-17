import React, { useState, useEffect, useRef } from "react";

interface StarBorderProps {
  as?: React.ElementType;
  className?: string;
  color?: string;
  speed?: string; // duration like "4s"
  children: React.ReactNode;
}

export const StarBorder = ({
  as: Component = "div",
  className = "",
  color = "#6366F1", // Default Indigo
  speed = "6s",
  withTrail = true,
  children,
  ...props
}: StarBorderProps & { withTrail?: boolean }) => {
  const containerRef = useRef<HTMLElement>(null);
  const [rect, setRect] = useState({ width: 0, height: 0, radius: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const style = window.getComputedStyle(containerRef.current);
        const radius = parseFloat(style.borderRadius) || 0;
        setRect({ width, height, radius });
      }
    };

    // Initial measure
    updateDimensions();

    // Observe changes
    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Also listen to window resize just in case
    window.addEventListener("resize", updateDimensions);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const { width: w, height: h, radius: r } = rect;

  // Calculate perimeter for dasharray
  // 4 straight sides + 4 quarter circles (which is 1 full circle)
  // Straight width: w - 2r
  // Straight height: h - 2r
  // Circle circumference: 2 * PI * r
  const perimeter = 2 * (w - 2 * r) + 2 * (h - 2 * r) + 2 * Math.PI * r;
  
  // Tail length (approximate)
  const tailLength = Math.max(perimeter * 0.25, 100); // 25% of perimeter or at least 100px

  // Generate Path String (Rounded Rectangle)
  // M = Move, L = Line, A = Arc
  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
  const pathData = w && h ? `
    M ${r} 0
    L ${w - r} 0
    A ${r} ${r} 0 0 1 ${w} ${r}
    L ${w} ${h - r}
    A ${r} ${r} 0 0 1 ${w - r} ${h}
    L ${r} ${h}
    A ${r} ${r} 0 0 1 0 ${h - r}
    L 0 ${r}
    A ${r} ${r} 0 0 1 ${r} 0
    Z
  ` : "";

  return (
    <Component
      ref={containerRef}
      className={`relative ${className}`}
      {...props}
    >
        {/* Original Content */}
        {children}

        {/* Animation Overlay */}
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-50"
            style={{ 
                // Ensure SVG aligns perfectly with the border-box
                width: w, 
                height: h,
                left: 0,
                top: 0
            }}
        >
            <defs>
                {/* The Star Shape */}
                <path
                    id="star-symbol"
                    d="M10 0C11.6 6.4 13.6 8.4 20 10C13.6 11.6 11.6 13.6 10 20C8.4 13.6 6.4 11.6 0 10C6.4 8.4 8.4 6.4 10 0Z"
                    fill={color}
                />
                
                {/* Gradient for the tail (Optional - simple stroke color for now) */}
                <linearGradient id="tail-gradient" gradientUnits="userSpaceOnUse">
                     <stop offset="0%" stopColor={color} stopOpacity="0" />
                     <stop offset="100%" stopColor={color} stopOpacity="1" />
                </linearGradient>
            </defs>

            {/* If path is not ready, don't render animations to avoid glitches */}
            {pathData && (
                <>
                    {/* The Traveling Beam (Tail) */}
                    {withTrail && (
                        <path
                            d={pathData}
                            fill="none"
                            stroke={color}
                            strokeWidth="1.5"
                            strokeOpacity="0.8"
                            strokeDasharray={`${tailLength} ${perimeter}`}
                            strokeLinecap="round"
                        >
                            <animate
                                attributeName="stroke-dashoffset"
                                from={perimeter + tailLength}
                                to={tailLength} 
                                values={`${perimeter}; ${-perimeter}`}
                                dur={speed}
                                repeatCount="indefinite"
                            />
                        </path>
                    )}

                    {/* The Star Following the Path */}
                    <g>
                        <animateMotion
                            dur={speed}
                            repeatCount="indefinite"
                            rotate="auto"
                            path={pathData}
                        />
                        <g>
                            <use href="#star-symbol" width="16" height="16" x="-8" y="-8" />
                            <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0 0 0"
                                to="360 0 0"
                                dur="3s"
                                repeatCount="indefinite"
                            />
                        </g>
                    </g>
                    
                    {/* Small Orbiting Circle */}
                    <circle r="2" fill={color} opacity="0.8">
                        <animateMotion
                            dur={speed}
                            repeatCount="indefinite"
                            rotate="auto"
                            path={pathData}
                            begin="-4s"
                        />
                    </circle>
                </>
            )}
        </svg>
    </Component>
  );
};
