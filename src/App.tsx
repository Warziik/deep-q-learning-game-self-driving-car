import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "@/hooks/use-toast.ts";
import { Separator } from "@/components/ui/separator.tsx";
import { HardDriveDownload, Import, RefreshCcw } from "lucide-react"
import React, { ForwardedRef, forwardRef, Ref, useEffect, useRef, useState } from "react";
import { Switch } from "@/components/ui/switch.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useTheme } from "@/components/theme-provider.tsx";

export function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      // Set canvas dimensions to match viewport size
      canvas.width = window.innerWidth - 2;
      canvas.height = window.innerHeight - 2;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "red"; // Set the pen color to red
        ctx.lineWidth = 5; // Set the pen thickness
        ctx.lineCap = "round"; // Make the line ends rounded
        setCanvasContext(ctx);
      }
    }
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      // Set canvas dimensions to match viewport size
      canvas.width = window.innerWidth - 2;
      canvas.height = window.innerHeight - 2;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "red"; // Set the pen color to red
        ctx.lineWidth = 5; // Set the pen thickness
        ctx.lineCap = "round"; // Make the line ends rounded
        setCanvasContext(ctx);
      }
    }
  }, []);



  return <div className={"bg-primary-foreground h-screen"}>
    <Canvas ref={canvasRef} context={canvasContext} />
    <CarAgent />
    <ActionsPanel canvasRef={canvasRef} canvasContext={canvasContext} />
  </div>;
}

const Canvas = forwardRef(({ context }: { context: CanvasRenderingContext2D | null }, ref: ForwardedRef<HTMLCanvasElement>) => {
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context) return;
    const { offsetX, offsetY } = nativeEvent;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;
    const { offsetX, offsetY } = nativeEvent;
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!context) return;
    context.closePath();
    setIsDrawing(false);
  };

  return (
    <canvas
      ref={ref}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
  );
})

function CarAgent() {
  return <div className="absolute left-[24px] top-[24px] flex h-[32px] w-[96px]">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-50"></span>
    <span className="relative inline-flex rounded-full h-[32px] w-[96px] bg-indigo-500"></span>
  </div>
}

type ActionsPanelProps = {
  canvasContext: CanvasRenderingContext2D | null;
  canvasRef: Ref<HTMLCanvasElement>
}
function ActionsPanel({ canvasContext, canvasRef }: ActionsPanelProps) {
  const onClearCanvas = () => {
    const canvas = (canvasRef ?? {} as any)?.current as HTMLCanvasElement;
    canvasContext?.clearRect(0, 0, canvas.width, canvas.height);
  }

  const onSaveNeuralNetworkCtaClicked = async () => {
    await invoke(`save_neural_network`);
    toast({
      description: `Réseau de neurones sauvegardé`
    })
  }

  const onLoadNeuralNetworkCtaClicked = async () => {
    await invoke(`load_neural_network`);
    toast({
      description: `Réseau de neurones importé`
    })
  }

  return <div className={"absolute drop-shadow-xl rounded-lg bg-card p-[24px] left-[24px] bottom-[24px] flex flex-col gap-[16px]"}>
    <div className={"flex flex-col gap-[16px] text-center"}>
      <ToggleTheme />
      <Button onClick={onClearCanvas} variant={"outline"} className={"gap-[8px]"} size={"lg"}>
        <RefreshCcw size={16} />
        Nettoyer l'interface
      </Button>
    </div>
    <Separator />
    <div className={"flex flex-col gap-[16px] text-center"}>
      <Label>Réseau de neurones</Label>
      <div className={"flex items-center gap-[16px]"}>
        <Button onClick={onSaveNeuralNetworkCtaClicked} variant={"outline"} className={"gap-[8px]"} size={"lg"}>
          <HardDriveDownload size={16} />
          Sauvegarder
        </Button>
        <Button onClick={onLoadNeuralNetworkCtaClicked} variant={"outline"} className={"gap-[8px]"} size={"lg"}>
          <Import size={16} />
          Importer
        </Button>
      </div>
    </div>
  </div>
}

function ToggleTheme() {
  const { theme, setTheme } = useTheme();

  return <div className="flex justify-center items-center space-x-4">
    <Label htmlFor="theme">Thème sombre</Label>
    <Switch id="theme" checked={theme === "dark"} onCheckedChange={checked => {
      setTheme(checked ? "dark" : "light")
    }} />
  </div>
}
