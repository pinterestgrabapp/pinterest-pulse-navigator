
import React from "react";
import { cn } from "@/lib/utils";

interface GlowingChartProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

const GlowingChart = ({
  children,
  className,
  title,
  description,
}: GlowingChartProps) => {
  return (
    <div 
      className={cn(
        "rounded-xl bg-black/90 p-5 border border-pinterest-red/30 shadow-[0_0_15px_rgba(234,56,76,0.3)] relative overflow-hidden",
        className
      )}
    >
      {/* Glow effect elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-pinterest-red/5 to-transparent opacity-30"></div>
      <div className="absolute -inset-[1px] z-0 bg-pinterest-red/10 blur-md"></div>
      
      {title && (
        <div className="mb-4 relative z-10">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {description && <p className="text-sm text-gray-400">{description}</p>}
        </div>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlowingChart;
