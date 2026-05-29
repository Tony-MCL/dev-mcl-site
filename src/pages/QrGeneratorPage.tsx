import React, { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useI18n } from "../i18n/useI18n";

const DEFAULT_VALUE = "https://morningcoffeelabs.no";
const SIGNATURE_TEXT = "Generated at morningcoffeelabs.no";

const QrGeneratorPage: React.FC = () => {
  const { t } = useI18n();

  const qrCanvasRef = useRef<HTMLDivElement | null>(null);

  const [value, setValue] = useState(DEFAULT_VALUE);
  const [fgColor, setFgColor] = useState("#1b1a17");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(22);
  const [logoBackground, setLogoBackground] = useState(false);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert(t("qrGenerator.alerts.chooseImage"));
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
    const signatureArea = 90;

    const canvas = document.createElement("canvas");
    canvas.width = outputSize;
    canvas.height = outputSize + signatureArea;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(sourceCanvas, 0, 0, outputSize, outputSize);

    if (logoUrl) {
      const img = new Image();
      img.src = logoUrl;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Could not load logo"));
      });

      const logoPx = Math.round(outputSize * (logoSize / 100));
      const padding = logoBackground ? Math.round(logoPx * 0.16) : 0;
      const boxSize = logoPx + padding * 2;
      const x = Math.round((outputSize - boxSize) / 2);
      const y = Math.round((outputSize - boxSize) / 2);

      if (logoBackground) {
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.roundRect(x, y, boxSize, boxSize, Math.round(boxSize * 0.16));
        ctx.fill();
      }

      ctx.drawImage(img, x + padding, y + padding, logoPx, logoPx);
    }

    ctx.fillStyle = fgColor;
    ctx.font = "34px sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    
    ctx.globalAlpha = 0.55;
    ctx.fillText(SIGNATURE_TEXT, outputSize - 24, outputSize + signatureArea / 2);
    ctx.globalAlpha = 1;

    const link = document.createElement("a");
    link.download = "morning-coffee-labs-qr.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <main className="page qr-page">
      <section className="hero qr-hero">
        <h1 className="hero-title">{t("qrGenerator.title")}</h1>
        <p className="hero-tagline">{t("qrGenerator.tagline")}</p>
      </section>

      <section className="qr-layout">
        <div className="qr-panel intro-card">
          <div className="form-row">
            <label>
              {t("qrGenerator.inputLabel")}
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
                {t("qrGenerator.fgColor")}
                <input
                  type="color"
                  value={fgColor}
                  onChange={(event) => setFgColor(event.target.value)}
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                {t("qrGenerator.bgColor")}
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
              {t("qrGenerator.logoLabel")}
              <input type="file" accept="image/*" onChange={handleLogoUpload} />
            </label>
          </div>

          {logoUrl ? (
            <div className="form-row">
              <label>
                {t("qrGenerator.logoSize")}: {logoSize}%
                <input
                  type="range"
                  min="10"
                  max="32"
                  value={logoSize}
                  onChange={(event) => setLogoSize(Number(event.target.value))}
                />
              </label>

              <label className="qr-checkbox-row">
                <input
                  type="checkbox"
                  checked={logoBackground}
                  onChange={(event) => setLogoBackground(event.target.checked)}
                />
                {t("qrGenerator.logoBackground")}
              </label>

              <button
                type="button"
                className="qr-secondary-button"
                onClick={() => setLogoUrl(null)}
              >
                {t("qrGenerator.removeLogo")}
              </button>
            </div>
          ) : null}

          {logoUrl && logoSize > 26 ? (
            <p className="qr-warning">{t("qrGenerator.warning")}</p>
          ) : null}

          <p className="qr-note">{t("qrGenerator.note")}</p>
        </div>

        <div className="qr-preview-card intro-card">
          <div className="qr-preview" style={{ backgroundColor: bgColor }}>
            <div className="qr-preview-code" ref={qrCanvasRef}>
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
                    backgroundColor: logoBackground ? bgColor : "transparent",
                    padding: logoBackground ? "2.5%" : "0",
                  }}
                >
                  <img src={logoUrl} alt="" />
                </div>
              ) : null}
            </div>
          
            <div className="qr-signature" style={{ color: fgColor }}>
              {SIGNATURE_TEXT}
            </div>
          </div>

          <button type="button" className="hero-cta qr-download" onClick={downloadPng}>
            {t("qrGenerator.download")}
          </button>
        </div>
      </section>

      <section className="qr-info-card intro-card">
        <h2>{t("qrGenerator.info.title")}</h2>
        <p>{t("qrGenerator.info.p1")}</p>
        <p>{t("qrGenerator.info.p2")}</p>
        <p>{t("qrGenerator.info.p3")}</p>
      </section>
    </main>
  );
};

export default QrGeneratorPage;
