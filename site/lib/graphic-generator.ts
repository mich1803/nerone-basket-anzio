import { assetPath } from '@/lib/paths';

export type GraphicType = 'calendario' | 'week' | 'matchday' | 'risultato';
export type WeekFormat = 'post' | 'story';
export type GlassLayer = 'behind' | 'front';
export type Appointment = { id: string; club: 'nerone' | 'nerone-bounganvillae'; date: string; time: string; opponent: string; atHome: boolean };
export type WeekMatch = {
  gameId: string; title: string; homeTeam: string; awayTeam: string; homeLogo: string; awayLogo: string;
  competition: string; dateTime: string; address: string;
};
type GlassBase = { id: string; x: number; y: number; width: number; height: number; layer: GlassLayer };
export type MatchGlass = GlassBase & { kind: 'match'; match: WeekMatch };
export type SponsorGlass = GlassBase & { kind: 'sponsor'; sponsorId: string };
export type Glass = MatchGlass | SponsorGlass;
export type GraphicState = {
  type: GraphicType; month: string; leftName: string; rightName: string; appointments: Appointment[];
  sponsor: string; photo: string; subjectPhoto: string; photoX: number; photoY: number; photoZoom: number;
  weekFormat: WeekFormat; backgroundBlur: number;
  glasses: Glass[]; homeTeam: string; awayTeam: string;
  homeLogo: string; awayLogo: string; competition: string; dateTime: string; address: string;
  homeScore: string; awayScore: string; resultClubSide: 'home' | 'away' | 'none';
};

export const SPONSORS = [
  { id: 'maisondali', name: 'Maison Dalì', logo: '/assets/sponsors/maisondali.png' },
  { id: 'superette', name: 'Superettè', logo: '/assets/sponsors/superette.png' },
  { id: 'silviomarsili', name: 'Silvio Marsili', logo: '/assets/sponsors/neg/silviomarsili_white.png' },
  { id: 'mastroianni', name: 'Mastroianni', logo: '/assets/sponsors/mastroianni.png' },
] as const;
export const LOGOS = [
  { id: 'nerone', name: 'Nerone', logo: '/assets/logo-testo-bianco.png', mono: '/assets/teams/2026-27/mono_white/nerone_white_text.png' },
  { id: 'nerone-bounganvillae', name: 'Nerone BGV', logo: '/assets/bgv-logo-testo-bianco.png', mono: '/assets/teams/2026-27/mono_white/nerone_bgv_white_text.png' },
  { id: 'samurai-csi', name: 'Samurai', logo: '/assets/teams/2026-27/samurai.png', mono: '' },
  { id: 'ciampino', name: 'Ciampino', logo: '', mono: '/assets/teams/2026-27/mono_white/ciampino_white.png' },
] as const;

const imageCache = new Map<string, Promise<HTMLImageElement>>();
function image(src: string): Promise<HTMLImageElement> {
  const url = src.startsWith('data:') || src.startsWith('blob:') ? src : assetPath(src);
  if (!imageCache.has(url)) imageCache.set(url, new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => { imageCache.delete(url); reject(new Error(`Impossibile caricare ${src}`)); };
    img.src = url;
  }));
  return imageCache.get(url)!;
}
async function optionalImage(src: string) { try { return src ? await image(src) : null; } catch { return null; } }

function contain(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const scale = Math.min(w / img.width, h / img.height);
  const width = img.width * scale, height = img.height * scale;
  ctx.drawImage(img, x + (w - width) / 2, y + (h - height) / 2, width, height);
}
const visibleBoundsCache = new WeakMap<HTMLImageElement, { x: number; y: number; w: number; h: number }>();
function visibleBounds(img: HTMLImageElement) {
  let bounds = visibleBoundsCache.get(img);
  if (!bounds) {
    const mask = document.createElement('canvas');
    mask.width = img.naturalWidth; mask.height = img.naturalHeight;
    const maskCtx = mask.getContext('2d', { willReadFrequently: true });
    bounds = { x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight };
    if (maskCtx) {
      maskCtx.drawImage(img, 0, 0);
      try {
        const pixels = maskCtx.getImageData(0, 0, mask.width, mask.height).data;
        let left = mask.width, top = mask.height, right = -1, bottom = -1;
        for (let py = 0; py < mask.height; py++) for (let px = 0; px < mask.width; px++) {
          if (pixels[(py * mask.width + px) * 4 + 3] <= 24) continue;
          left = Math.min(left, px); top = Math.min(top, py);
          right = Math.max(right, px); bottom = Math.max(bottom, py);
        }
        if (right >= left) bounds = { x: left, y: top, w: right - left + 1, h: bottom - top + 1 };
      } catch { /* Use the full image when pixel access is unavailable. */ }
    }
    visibleBoundsCache.set(img, bounds);
  }
  return bounds;
}
function containVisible(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const bounds = visibleBounds(img);
  const scale = Math.min(w / bounds.w, h / bounds.h);
  const dw = bounds.w * scale, dh = bounds.h * scale;
  ctx.drawImage(img, bounds.x, bounds.y, bounds.w, bounds.h, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}
export async function sponsorGlassSize(sponsorId: string) {
  const sponsor = SPONSORS.find(item => item.id === sponsorId) ?? SPONSORS[3];
  const img = await image(sponsor.logo);
  const bounds = visibleBounds(img);
  const scale = Math.min(340 / bounds.w, 130 / bounds.h);
  return { width: Math.round(bounds.w * scale + 48), height: Math.round(bounds.h * scale + 48) };
}
function cover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, zoom = 1, panX = 0, panY = 0) {
  const scale = Math.max(w / img.width, h / img.height) * zoom;
  const width = img.width * scale, height = img.height * scale;
  const maxX = Math.max(0, (width - w) / 2), maxY = Math.max(0, (height - h) / 2);
  ctx.drawImage(img, x + (w - width) / 2 + maxX * panX / 100, y + (h - height) / 2 + maxY * panY / 100, width, height);
}
function text(ctx: CanvasRenderingContext2D, value: string, x: number, y: number, maxWidth: number, size: number, family: string, weight = '400', align: CanvasTextAlign = 'left', minSize = 20) {
  ctx.textAlign = align;
  ctx.textBaseline = 'top';
  const string = value.trim() || ' ';
  for (let fontSize = size; fontSize >= minSize; fontSize -= 1) {
    ctx.font = `${weight} ${fontSize}px ${family}`;
    if (ctx.measureText(string).width <= maxWidth || fontSize === minSize) { ctx.fillText(string, x, y, maxWidth); return; }
  }
}
function lines(ctx: CanvasRenderingContext2D, value: string, x: number, y: number, width: number, maxLines: number, size: number, lineHeight: number, family: string, weight = '400', align: CanvasTextAlign = 'left') {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return;
  for (let fontSize = size; fontSize >= 17; fontSize -= 1) {
    ctx.font = `${weight} ${fontSize}px ${family}`;
    const rows: string[] = [];
    let row = '';
    for (const word of words) {
      const next = row ? `${row} ${word}` : word;
      if (ctx.measureText(next).width <= width || !row) row = next;
      else { rows.push(row); row = word; }
    }
    if (row) rows.push(row);
    if (rows.length > maxLines && fontSize > 17) continue;
    ctx.textAlign = align; ctx.textBaseline = 'top';
    rows.slice(0, maxLines).forEach((line, i) => ctx.fillText(line, x, y + i * lineHeight, width));
    return;
  }
}
function weekDetails(ctx: CanvasRenderingContext2D, match: WeekMatch, centerX: number, top: number, width: number, height: number, scale: number) {
  const fields = [
    { value: match.competition, size: 42, maxLines: 2 },
    { value: match.dateTime, size: 33, maxLines: 3 },
    { value: match.address, size: 30, maxLines: 4 },
  ].filter(field => field.value.trim());
  if (!fields.length) return;
  const gap = Math.max(8, 12 * scale);
  let blocks: { rows: string[]; size: number; lineHeight: number; maxLines: number }[] = [];
  for (let factor = 1; factor >= .35; factor -= .025) {
    blocks = fields.map(field => {
      const size = Math.max(15, Math.round(field.size * scale * factor));
      ctx.font = `${size}px Arial, sans-serif`;
      const rows: string[] = [];
      let row = '';
      for (const word of field.value.trim().split(/\s+/)) {
        const next = row ? `${row} ${word}` : word;
        if (ctx.measureText(next).width <= width || !row) row = next;
        else { rows.push(row); row = word; }
      }
      if (row) rows.push(row);
      return { rows, size, lineHeight: size * 1.14, maxLines: field.maxLines };
    });
    const totalHeight = blocks.reduce((sum, block) => sum + block.rows.length * block.lineHeight, 0) + gap * (blocks.length - 1);
    if (blocks.every(block => block.rows.length <= block.maxLines) && totalHeight <= height) break;
  }
  const visibleHeight = blocks.reduce((sum, block) => sum + Math.min(block.rows.length, block.maxLines) * block.lineHeight, 0) + gap * (blocks.length - 1);
  let cursorY = top + Math.max(0, (height - visibleHeight) / 2);
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  blocks.forEach(block => {
    ctx.font = `${block.size}px Arial, sans-serif`;
    block.rows.slice(0, block.maxLines).forEach((row, index) => ctx.fillText(row, centerX, cursorY + index * block.lineHeight, width));
    cursorY += Math.min(block.rows.length, block.maxLines) * block.lineHeight + gap;
  });
}
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
}
function house(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save(); ctx.translate(x, y); ctx.scale(size / 40, size / 40);
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(2, 18); ctx.lineTo(20, 2); ctx.lineTo(38, 18); ctx.lineTo(34, 18); ctx.lineTo(34, 38); ctx.lineTo(24, 38); ctx.lineTo(24, 26); ctx.lineTo(16, 26); ctx.lineTo(16, 38); ctx.lineTo(6, 38); ctx.lineTo(6, 18); ctx.closePath(); ctx.fill(); ctx.restore();
}
function car(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save(); ctx.translate(x, y); ctx.scale(size / 48, size / 48);
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.moveTo(3, 22); ctx.lineTo(10, 11); ctx.lineTo(35, 11); ctx.lineTo(43, 22); ctx.lineTo(46, 23); ctx.lineTo(46, 33); ctx.lineTo(2, 33); ctx.lineTo(2, 24); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#303030'; ctx.fillRect(12, 14, 10, 7); ctx.fillRect(25, 14, 9, 7);
  for (const wheelX of [11, 37]) {
    ctx.beginPath(); ctx.arc(wheelX, 34, 6, 0, Math.PI * 2); ctx.fillStyle = '#171717'; ctx.fill();
    ctx.beginPath(); ctx.arc(wheelX, 34, 4.2, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
  }
  ctx.restore();
}
function dateLabel(date: string, time: string) {
  if (!date) return time || 'Data e ora';
  const parsed = new Date(`${date}T12:00:00`);
  const label = Number.isNaN(parsed.getTime()) ? date : new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long' }).format(parsed);
  return `${label}, ${time || '--:--'}`;
}
async function calendario(ctx: CanvasRenderingContext2D, s: GraphicState) {
  const bg = await image('/assets/elementi_social/calendario_bg.png');
  ctx.drawImage(bg, 0, 0, 1080, 1350);
  ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(0, 0, 0, .4)'; ctx.shadowBlur = 8;
  text(ctx, 'CALENDARIO', 540, 265, 700, 104, '"Bebas Neue", Impact, sans-serif', '700', 'center', 70);
  text(ctx, s.month.toUpperCase(), 540, 365, 600, 60, '"Bebas Neue", Impact, sans-serif', '700', 'center', 40);
  text(ctx, s.leftName.toUpperCase(), 61, 472, 450, 70, '"Bebas Neue", Impact, sans-serif', '700', 'left', 38);
  text(ctx, s.rightName.toUpperCase(), 1020, 472, 450, 70, '"Bebas Neue", Impact, sans-serif', '700', 'right', 38);
  ctx.shadowBlur = 0;
  const groups = [s.appointments.filter(a => a.club === 'nerone'), s.appointments.filter(a => a.club === 'nerone-bounganvillae')];
  groups.forEach((group, column) => {
    const max = Math.max(1, group.length);
    const step = Math.min(145, 510 / max);
    group.forEach((a, i) => {
      const y = 576 + i * step;
      const atRight = column === 1;
      const x = atRight ? 1020 : 62;
      ctx.fillStyle = '#fff';
      const label = dateLabel(a.date, a.time);
      text(ctx, label, x, y, 395, 34, 'Arimo, Arial, sans-serif', '400', atRight ? 'right' : 'left', 23);
      const measure = ctx.measureText(label).width;
      const iconSize = a.atHome ? 32 : 40;
      const iconX = atRight ? Math.max(550, x - measure - iconSize - 18) : Math.min(448, x + measure + 18);
      (a.atHome ? house : car)(ctx, iconX, y + (a.atHome ? -4 : -10), iconSize);
      text(ctx, a.opponent.toUpperCase(), x, y + 47, 430, 35, 'Arimo, Arial, sans-serif', '700', atRight ? 'right' : 'left', 22);
    });
  });
  const sponsor = SPONSORS.find(item => item.id === s.sponsor) ?? SPONSORS[0];
  text(ctx, 'presented by:', 540, 1138, 400, 31, 'Arimo, Arial, sans-serif', '400', 'center');
  const logo = await optionalImage(sponsor.logo);
  if (logo) contain(ctx, logo, 340, 1180, 400, 82);
  ctx.fillStyle = '#999';
  text(ctx, '*Ogni data ed orario sono variabili in base alla disponibilità delle altre squadre e provvedimenti UISP*', 540, 1288, 960, 20, 'Arimo, Arial, sans-serif', 'italic', 'center', 16);
}
async function week(ctx: CanvasRenderingContext2D, s: GraphicState) {
  const canvasHeight = s.weekFormat === 'story' ? 1920 : 1350;
  ctx.fillStyle = '#171717'; ctx.fillRect(0, 0, 1080, canvasHeight);
  const photo = await optionalImage(s.photo);
  const originalCanvas = document.createElement('canvas'); originalCanvas.width = 1080; originalCanvas.height = canvasHeight;
  const original = originalCanvas.getContext('2d')!;
  if (photo) {
    cover(original, photo, 0, 0, 1080, canvasHeight, s.photoZoom, s.photoX, s.photoY);
    ctx.drawImage(originalCanvas, 0, 0);
    ctx.save(); ctx.filter = `blur(${s.backgroundBlur}px)`; ctx.drawImage(originalCanvas, 0, 0); ctx.restore();
  }
  const blurCanvas = document.createElement('canvas'); blurCanvas.width = 1080; blurCanvas.height = canvasHeight;
  const blur = blurCanvas.getContext('2d')!;
  if (photo) { blur.filter = 'blur(24px)'; blur.drawImage(originalCanvas, 0, 0); }
  const logos = await Promise.all(s.glasses.map(async g => g.kind === 'match'
    ? { home: await optionalImage(g.match.homeLogo), away: await optionalImage(g.match.awayLogo), sponsor: null }
    : { home: null, away: null, sponsor: await optionalImage((SPONSORS.find(item => item.id === g.sponsorId) ?? SPONSORS[3]).logo) }));
  const drawGlass = (g: Glass, index: number) => {
    const { x, y, width: w, height: h } = g;
    ctx.save(); ctx.shadowColor = '#0009'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 9;
    roundRect(ctx, x, y, w, h, 42); ctx.fillStyle = '#ffffff12'; ctx.fill(); ctx.restore();
    ctx.save(); roundRect(ctx, x, y, w, h, 42); ctx.clip();
    if (photo) ctx.drawImage(blurCanvas, x, y, w, h, x, y, w, h);
    ctx.fillStyle = 'rgba(40,49,59,.38)'; ctx.fillRect(x, y, w, h);
    const reflection = ctx.createLinearGradient(x, y, x + w, y + h);
    reflection.addColorStop(0, '#ffffff38'); reflection.addColorStop(.35, '#ffffff05'); reflection.addColorStop(1, '#ffffff16');
    ctx.fillStyle = reflection; ctx.fillRect(x, y, w, h);
    ctx.restore();
    ctx.save(); ctx.shadowColor = '#fff8'; ctx.shadowBlur = 9; ctx.strokeStyle = '#ffffff9c'; ctx.lineWidth = 1.5; roundRect(ctx, x + 1, y + 1, w - 2, h - 2, 41); ctx.stroke(); ctx.restore();
    ctx.save(); roundRect(ctx, x, y, w, h, 42); ctx.clip(); ctx.fillStyle = '#fff';
    if (g.kind === 'sponsor') {
      if (logos[index].sponsor) containVisible(ctx, logos[index].sponsor!, x + 24, y + 24, w - 48, h - 48);
      ctx.restore();
      return;
    }
    const scale = Math.min(w / 440, h / 500);
    const inset = Math.max(18, w * .075);
    const textWidth = w - inset * 2;
    text(ctx, g.match.title.toUpperCase(), x + w / 2, y + h * .055, textWidth, Math.round(55 * scale), 'Aharoni, "Archivo Black", "Arial Black", Arial, sans-serif', '700', 'center', Math.round(30 * scale));
    const logoGap = Math.max(12, w * .06);
    const logoWidth = (textWidth - logoGap) / 2;
    const logoTop = y + h * .185;
    const logoHeight = h * .275;
    if (logos[index].home) contain(ctx, logos[index].home!, x + inset, logoTop, logoWidth, logoHeight);
    if (logos[index].away) contain(ctx, logos[index].away!, x + inset + logoWidth + logoGap, logoTop, logoWidth, logoHeight);
    weekDetails(ctx, g.match, x + w / 2, y + h * .48, textWidth, h * .50, Math.min(1.25, h / 500));
    ctx.restore();
  };
  s.glasses.forEach((g, index) => { if (g.layer === 'behind') drawGlass(g, index); });
  const subject = await optionalImage(s.subjectPhoto);
  if (subject) cover(ctx, subject, 0, 0, 1080, canvasHeight, s.photoZoom, s.photoX, s.photoY);
  s.glasses.forEach((g, index) => { if (g.layer === 'front') drawGlass(g, index); });
}
async function matchday(ctx: CanvasRenderingContext2D, s: GraphicState) {
  ctx.drawImage(await image('/assets/elementi_social/matchday_bg.png'), 0, 0, 1080, 1350);
  ctx.fillStyle = '#fff';
  const titleWidth = 620;
  text(ctx, s.homeTeam.toUpperCase(), 62, 53, titleWidth, 100, 'Arimo, Arial, sans-serif', '700', 'left', 48);
  text(ctx, s.awayTeam.toUpperCase(), 62, 171, titleWidth, 88, 'Arimo, Arial, sans-serif', '400', 'left', 44);
  const vs = await optionalImage('/assets/elementi_social/vs.png');
  if (vs) {
    ctx.font = '700 100px Arimo, Arial, sans-serif';
    const first = ctx.measureText(s.homeTeam.toUpperCase()).width;
    ctx.font = '400 88px Arimo, Arial, sans-serif';
    const second = ctx.measureText(s.awayTeam.toUpperCase()).width;
    const shorter = Math.min(first, second, 500);
    contain(ctx, vs, Math.min(590, 62 + shorter + 24), first < second ? 77 : 190, 65, 86);
  }
  const photo = await optionalImage(s.photo);
  if (photo) { ctx.save(); ctx.beginPath(); ctx.rect(62, 296, 620, 802); ctx.clip(); ctx.filter = 'grayscale(1)'; cover(ctx, photo, 62, 296, 620, 802, s.photoZoom, s.photoX, s.photoY); ctx.restore(); }
  else { ctx.fillStyle = '#ffffff18'; ctx.fillRect(62, 296, 620, 802); ctx.fillStyle = '#fff9'; text(ctx, 'CARICA UNA FOTO', 372, 675, 530, 35, 'Arimo, Arial, sans-serif', '700', 'center'); }
  ctx.fillStyle = '#fff';
  text(ctx, s.competition, 62, 1144, 625, 43, 'Arimo, Arial, sans-serif', '400', 'left', 27);
  text(ctx, s.dateTime, 62, 1202, 625, 47, 'Arimo, Arial, sans-serif', '700', 'left', 28);
  lines(ctx, s.address, 62, 1267, 625, 2, 32, 37, 'Arimo, Arial, sans-serif');
  text(ctx, 'PRESENTED BY', 859, 1067, 280, 28, '"DM Sans", Arial, sans-serif', '700', 'center');
  const sponsor = SPONSORS.find(item => item.id === s.sponsor) ?? SPONSORS[1];
  const logo = await optionalImage(sponsor.logo);
  if (logo) contain(ctx, logo, 770, 1124, 180, 180);
}
async function risultato(ctx: CanvasRenderingContext2D, s: GraphicState) {
  ctx.fillStyle = '#171717'; ctx.fillRect(0, 0, 1080, 1350);
  const photo = await optionalImage(s.photo);
  if (photo) cover(ctx, photo, 0, 0, 1080, 1350, s.photoZoom, s.photoX, s.photoY);
  ctx.drawImage(await image('/assets/elementi_social/black_strip.png'), 655, 0, 384, 1350);
  ctx.fillStyle = '#fff';
  lines(ctx, s.competition.toUpperCase(), 847, 34, 290, 3, 29, 34, '"DM Sans", Arial, sans-serif', '700', 'center');
  const home = await optionalImage(s.homeLogo), away = await optionalImage(s.awayLogo);
  if (home) containVisible(ctx, home, 767, 210, 160, 160);
  const drawScore = (value: string, y: number, side: 'home' | 'away') => {
    const isNerone = s.resultClubSide === side;
    ctx.save();
    ctx.font = '158px Anton, Impact, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.lineJoin = 'round';
    if (!isNerone) {
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 9;
      ctx.strokeText(value || '0', 847, y, 295);
    }
    ctx.fillStyle = isNerone ? '#fff' : '#111';
    ctx.fillText(value || '0', 847, y, 295);
    ctx.restore();
  };
  drawScore(s.homeScore, 440, 'home');
  drawScore(s.awayScore, 720, 'away');
  if (away) containVisible(ctx, away, 767, 890, 160, 145);
  text(ctx, 'PRESENTED BY', 847, 1103, 270, 27, '"DM Sans", Arial, sans-serif', '700', 'center');
  const sponsor = SPONSORS.find(item => item.id === s.sponsor) ?? SPONSORS[2];
  const logo = await optionalImage(sponsor.logo);
  if (logo) containVisible(ctx, logo, 742, 1150, 210, 177);
}
export async function drawGraphic(canvas: HTMLCanvasElement, state: GraphicState) {
  canvas.width = 1080; canvas.height = state.type === 'week' && state.weekFormat === 'story' ? 1920 : 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas non disponibile nel browser.');
  await document.fonts.ready;
  if (state.type === 'calendario') await calendario(ctx, state);
  if (state.type === 'week') await week(ctx, state);
  if (state.type === 'matchday') await matchday(ctx, state);
  if (state.type === 'risultato') await risultato(ctx, state);
}
