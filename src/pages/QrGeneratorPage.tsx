import React, { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useI18n } from "../i18n/useI18n";

const DEFAULT_VALUE = "https://morningcoffeelabs.no";

const QrGeneratorPage: React.FC = () => {
  const { lang } = useI18n();

  const qrCanvasRef = useRef<HTMLDivElement | null>(null);

  const [value, setValue] = useState(DEFAULT_VALUE);
  const [fgColor, setFgColor] = useState("#1b1a17");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(22);

  const isNo = lang === "no";

  const text = {
    title: isNo ? "Gratis QR-generator" : "Free QR generator",
    tagline: isNo
      ? "Lag QR-koder med valgfri logo i midten. Ingen konto. Ingen betaling. Ingen abonnementstull."
      : "Create QR codes with an optional logo in the center. No account. No payment. No subscription nonsense.",
    inputLabel: isNo ? "Lenke eller tekst" : "Link or text",
    logoLabel: isNo ? "Logo i midten" : "Center logo",
    logoSize: isNo ? "Logo-størrelse" : "Logo size",
    fgColor: isNo ? "QR-farge" : "QR color",
    bgColor: isNo ? "Bakgrunn" : "Background",
    download: isNo ? "Last ned PNG" : "Download PNG",
    removeLogo: isNo ? "Fjern logo" : "Remove logo",
    note: isNo
      ? "Tips: Hold logoen moderat i størrelse, spesielt hvis QR-koden skal trykkes på klær, plakater eller små etiketter."
      : "Tip: Keep the logo moderate in size, especially if the QR code will be printed on clothing, posters, or small labels.",
    warning: isNo
      ? "Logoen er ganske stor. Test QR-koden med mobilkamera før du trykker eller deler den."
      : "The logo is fairly large. Test the QR code with a phone camera before printing or sharing it.",
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert(isNo ? "Velg en bildefil." : "Please choose an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLogoUrl(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  const downloadPng = async () => {
    const sourceCanvas = qrCanvasRef.current?.querySelector("canvas");

    if (!sourceCanvas) return;

    const outputSize = 1200;
    const canvas = document.createElement("canvas");
    canvas.width = outputSize;
    canvas.height = outputSize;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, outputSize, outputSize);
    ctx.drawImage(sourceCanvas, 0, 0, outputSize, outputSize);

    if (logoUrl) {
      const img = new Image();
      img.src = logoUrl;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Could not load logo"));
      });

      const logoPx = Math.round(outputSize * (logoSize / 100));
      const padding = Math.round(logoPx * 0.16);
      const boxSize = logoPx + padding * 2;
      const x = Math.round((outputSize - boxSize) / 2);
      const y = Math.round((outputSize - boxSize) / 2);

      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.roundRect(x, y, boxSize, boxSize, Math.round(boxSize * 0.16));
      ctx.fill();

      ctx.drawImage(img, x + padding, y + padding, logoPx, logoPx);
    }

    const link = document.createElement("a");
    link.download = "morning-coffee-labs-qr.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <main className="page qr-page">
      <section className="hero qr-hero">
        <h1 className="hero-title">{text.title}</h1>
        <p className="hero-tagline">{text.tagline}</p>
      </section>

      <section className="qr-layout">
        <div className="qr-panel intro-card">
          <div className="form-row">
            <label>
              {text.inputLabel}
              <textarea
                value={value}
                onChange={(event) => setValue(event.target.value)}
                rows={4}
                placeholder="https://..."
              />
            </label>
          </div>

          <div className="qr-control-grid">
            <div className="form-row">
              <label>
                {text.fgColor}
                <input
                  type="color"
                  value={fgColor}
                  onChange={(event) => setFgColor(event.target.value)}
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                {text.bgColor}
                <input
                  type="color"
                  value={bgColor}
                  onChange={(event) => setBgColor(event.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="form-row">
            <label>
              {text.logoLabel}
              <input type="file" accept="image/*" onChange={handleLogoUpload} />
            </label>
          </div>

          {logoUrl ? (
            <div className="form-row">
              <label>
                {text.logoSize}: {logoSize}%
                <input
                  type="range"
                  min="10"
                  max="32"
                  value={logoSize}
                  onChange={(event) => setLogoSize(Number(event.target.value))}
                />
              </label>

              <button
                type="button"
                className="qr-secondary-button"
                onClick={() => setLogoUrl(null)}
              >
                {text.removeLogo}
              </button>
            </div>
          ) : null}

          {logoUrl && logoSize > 26 ? (
            <p className="qr-warning">{text.warning}</p>
          ) : null}

          <p className="qr-note">{text.note}</p>
        </div>

        <div className="qr-preview-card intro-card">
          <div
            className="qr-preview"
            style={{ backgroundColor: bgColor }}
            ref={qrCanvasRef}
          >
            <QRCodeCanvas
              value={value.trim() || " "}
              size={360}
              level="H"
              bgColor={bgColor}
              fgColor={fgColor}
              includeMargin
            />

            {logoUrl ? (
              <div
                className="qr-logo-overlay"
                style={{
                  width: `${logoSize}%`,
                  height: `${logoSize}%`,
                  backgroundColor: bgColor,
                }}
              >
                <img src={logoUrl} alt="" />
              </div>
            ) : null}
          </div>

          <button type="button" className="hero-cta qr-download" onClick={downloadPng}>
            {text.download}
          </button>
        </div>
      </section>
    </main>
  );
};

export default QrGeneratorPage;
