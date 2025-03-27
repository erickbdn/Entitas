import React, { useEffect } from "react";
import { Gradient } from "./subcomponents/MeshGradient";

function MeshGradientBackground() {
  useEffect(() => {
    const gradient = new Gradient();
    gradient.initGradient("#gradient-canvas");
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Canvas for the gradient background */}
      <canvas
        id="gradient-canvas"
        className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] blur-[60px]"
        style={{
          "--gradient-color-1": "#2e4052",
          "--gradient-color-2": "#bca58a",
          "--gradient-color-3": "#cbb9a4",
          "--gradient-color-4": "#2e4052",
        } as React.CSSProperties}
      />
    </div>
  );
}

export default MeshGradientBackground;
