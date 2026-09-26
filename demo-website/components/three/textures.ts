import * as THREE from "three";

const ORANGE = "#ff5a1f";
const CREAM = "#f6e9d8";

function displayFont(): string {
  if (typeof document === "undefined") return "Impact, sans-serif";
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-anton").trim();
  return v || "Impact, 'Arial Black', sans-serif";
}

function bodyFont(): string {
  if (typeof document === "undefined") return "sans-serif";
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-grotesk").trim();
  return v || "'Helvetica Neue', Arial, sans-serif";
}

function chili(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, fill: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(-2, -14);
  ctx.bezierCurveTo(10, -12, 12, 4, 2, 18);
  ctx.bezierCurveTo(0, 22, -3, 22, -3, 16);
  ctx.bezierCurveTo(-8, 4, -10, -8, -2, -14);
  ctx.fill();
  ctx.fillRect(-3, -22, 3, 9);
  ctx.restore();
}

/** Wrap-around paper label for the hero jar. Redrawn once web fonts are ready. */
export function drawLabel(canvas: HTMLCanvasElement) {
  const W = canvas.width;
  const H = canvas.height;
  const ctx = canvas.getContext("2d")!;
  const disp = displayFont();
  const body = bodyFont();

  // paper
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#120d0b");
  g.addColorStop(1, "#070504");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // paper fibres
  for (let i = 0; i < 9000; i++) {
    ctx.fillStyle = `rgba(255,${120 + Math.random() * 80},60,${Math.random() * 0.035})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, 1 + Math.random() * 3, 1);
  }

  const cx = W / 2;

  // frame lines
  ctx.strokeStyle = ORANGE;
  ctx.lineWidth = 6;
  ctx.strokeRect(24, 24, W - 48, H - 48);
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, W - 80, H - 80);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // top eyebrow
  ctx.fillStyle = CREAM;
  ctx.font = `600 34px ${body}`;
  ctx.fillText("SMALL  BATCH  ·  EST. 2019  ·  HAND  SEALED", cx, 110);

  // wordmark
  ctx.fillStyle = ORANGE;
  ctx.font = `330px ${disp}`;
  ctx.fillText("MOLTEN", cx, 330);

  // sub
  ctx.fillStyle = CREAM;
  ctx.font = `700 46px ${body}`;
  ctx.fillText("HABANERO  ×  ROASTED  GARLIC", cx, 520);

  // heat row
  for (let i = 0; i < 5; i++) {
    chili(ctx, cx - 120 + i * 60, 610, 1.4, i < 4 ? ORANGE : "rgba(255,90,31,0.25)");
  }

  ctx.font = `500 30px ${body}`;
  ctx.fillStyle = "rgba(246,233,216,0.7)";
  ctx.fillText("NO. 01   —   8 FL OZ / 236 ML", cx, 700);

  // left side panel: ingredients
  ctx.textAlign = "left";
  ctx.fillStyle = ORANGE;
  ctx.font = `42px ${disp}`;
  ctx.fillText("INGREDIENTS", 120, 190);
  ctx.fillStyle = "rgba(246,233,216,0.75)";
  ctx.font = `400 26px ${body}`;
  const ing = [
    "Fire-roasted habanero",
    "Heirloom garlic",
    "Apple cider vinegar",
    "Raw wildflower honey",
    "Smoked sea salt",
    "Key lime",
  ];
  ing.forEach((t, i) => ctx.fillText(t.toUpperCase(), 120, 250 + i * 44));

  // right side panel: barcode + text
  ctx.textAlign = "right";
  ctx.fillStyle = ORANGE;
  ctx.font = `42px ${disp}`;
  ctx.fillText("SHAKE. POUR. IGNITE.", W - 120, 190);
  const bx = W - 420;
  for (let i = 0; i < 70; i++) {
    const w = Math.random() > 0.6 ? 6 : 3;
    ctx.fillStyle = CREAM;
    ctx.fillRect(bx + i * 4.3, 260, w * 0.6, 150);
  }
  ctx.font = `400 24px ${body}`;
  ctx.fillStyle = "rgba(246,233,216,0.6)";
  ctx.fillText("8 60012 34019 7", W - 120, 440);
  ctx.fillText("REFRIGERATE AFTER OPENING", W - 120, 500);
}

/** Speckled sauce surface — chili flakes and seeds suspended in the purée. */
export function makeSauceTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, 1024);
  g.addColorStop(0, "#ff6a1a");
  g.addColorStop(0.5, "#e8430f");
  g.addColorStop(1, "#b52a08");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 1400; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = Math.random();
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.random() * Math.PI);
    if (r < 0.55) {
      ctx.fillStyle = `rgba(${90 + Math.random() * 60},10,4,${0.5 + Math.random() * 0.4})`;
      ctx.fillRect(-4, -1.5, 5 + Math.random() * 9, 2 + Math.random() * 3);
    } else if (r < 0.85) {
      ctx.fillStyle = `rgba(255,${200 + Math.random() * 40},120,${0.55 + Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, 3 + Math.random() * 2, 1.6, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = "rgba(40,10,5,0.6)";
      ctx.beginPath();
      ctx.arc(0, 0, 1.5 + Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}

/** Vertical knurling bump map for the lid. */
export function makeKnurlTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 16;
  const ctx = c.getContext("2d")!;
  for (let x = 0; x < 512; x++) {
    const v = Math.floor(128 + 127 * Math.sin((x / 512) * Math.PI * 2 * 96));
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(x, 0, 1, 16);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Embossed logo disc for the lid top. */
export function makeLidTopTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#0d0b0a";
  ctx.fillRect(0, 0, 512, 512);
  ctx.strokeStyle = ORANGE;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(256, 256, 200, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(256, 256, 182, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = ORANGE;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `200px ${displayFont()}`;
  ctx.fillText("M", 256, 266);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/**
 * Opaque backdrop: an ember glow fading into the page colour. It must be opaque
 * so the glass transmission pass can refract it.
 */
export function makeGlowTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#0a0706";
  ctx.fillRect(0, 0, 1024, 1024);
  const g = ctx.createRadialGradient(512, 512, 0, 512, 512, 190);
  g.addColorStop(0, "#e2521c");
  g.addColorStop(0.25, "#9a2a0c");
  g.addColorStop(0.6, "#2e0c05");
  g.addColorStop(1, "#0a0706");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 1024);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Soft blob shadow for under the jar. */
export function makeShadowTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(0,0,0,0.85)");
  g.addColorStop(0.5, "rgba(0,0,0,0.45)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}
