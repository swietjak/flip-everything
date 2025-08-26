import React, { Suspense, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./i18.ts";
import "./App.css";

const lngs = {
  en: { nativeName: "English" },
  de: { nativeName: "Deutsch" },
};

const App: React.FC = () => {
  const { t, i18n } = useTranslation("translation");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    drawCaptionOnImage(file)
  };

  const drawCaptionOnImage = (file: File | null) => {
    if (!file || !canvasRef.current) return;

    const now = new Date();

    // Create tomorrow's date
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    // Build captions
    const top_caption = t("upperText", { date: now });
    const mid_text = t("whatsNext");
    const bottom_text = t("lowerText", { date: tomorrow });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image
      ctx.save();
      if (now.getDate() % 2 == 0) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      const saturationCoef = ((31 - now.getDate() / 2) / 31) * 100;
      console.log(saturationCoef);
      ctx.filter = `saturate(${saturationCoef}%)`;
      ctx.drawImage(img, 0, 0);
      ctx.restore();
      // Set caption styles
      const fontSize = Math.max(24, img.width * 0.075);
      if (i18n.resolvedLanguage === "de")
        ctx.font = `${fontSize}px 'UnifrakturCook'`;
      else ctx.font = `${fontSize}px sans-serif`;

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
    img.src = URL.createObjectURL(file);
  };

  return (
    <Suspense>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 space-y-4">
        <header>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <select
            name="cars"
            id="cars"
            onChange={(e) => {
              i18n.changeLanguage(e.target.value);
              drawCaptionOnImage(imageFile);
            }}
            value={i18n.resolvedLanguage}
          >
            {Object.keys(lngs).map((lng) => (
              <option value={lng}>{lngs[lng].nativeName}</option>
            ))}
          </select>
        </header>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <div>
          <canvas ref={canvasRef} className="border rounded max-w-full" />
        </div>
      </div>
    </Suspense>
  );
};

export default App;
