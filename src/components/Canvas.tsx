import { useEffect, useRef } from "react";
import { Scene } from "../core/Scene";

function Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new Scene();
    if (canvasRef.current) {
      scene.didMount(canvasRef.current);
    }
    return () => {
      if (canvasRef.current) {
        scene.dispose();
      }
    };
  }, []);

  return <div className="w-full h-full" ref={canvasRef}></div>;
}

export default Canvas;
