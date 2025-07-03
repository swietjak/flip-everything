import React, { useRef, useState } from "react";

function ordinal(n: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

function getMonthName(date: Date): string {
  return date.toLocaleString("default", { month: "long" });
}

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const drawCaptionOnImage = () => {
    if (!imageFile || !canvasRef.current) return;

    const now = new Date();

    // Create tomorrow's date
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    // Build captions
    const top_caption = `Damn it's ${getMonthName(now)} ${ordinal(now.getDate())} already?`;
    const mid_text = `What's next?`;
    const bottom_text = `${getMonthName(tomorrow)} ${ordinal(tomorrow.getDate())}? Fuck everything`;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Set caption styles
      const fontSize = Math.max(24, img.width * 0.07);
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;

      // Caption position
      const top_x = canvas.width / 2;
      const top_y = fontSize * 2.5;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Stroke + Fill for readability
      ctx.strokeText(top_caption, top_x, top_y);
      ctx.fillText(top_caption, top_x, top_y);

      // Caption position
      const mid_x = canvas.width / 2;
      const mid_y = canvas.height - fontSize * 2.5;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Stroke + Fill for readability
      ctx.strokeText(mid_text, mid_x, mid_y);
      ctx.fillText(mid_text, mid_x, mid_y);
      
      // Caption position
      const bottom_x = canvas.width / 2;
      const bottom_y = canvas.height - fontSize * 1.4;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Stroke + Fill for readability
      ctx.strokeText(bottom_text, bottom_x, bottom_y);
      ctx.fillText(bottom_text, bottom_x, bottom_y);
    };
    img.src = URL.createObjectURL(imageFile);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 space-y-4">
      <h1 className="text-2xl font-bold">Image Caption Tool</h1>

      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button
        onClick={drawCaptionOnImage}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={!imageFile}
      >
        Add Caption
      </button>
      <div>
      <canvas ref={canvasRef} className="border rounded max-w-full" />
      </div>
    </div>
  );
};

export default App;
