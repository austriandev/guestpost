"use client";

import { useEffect, useRef } from "react";
import { LAND } from "@/lib/landDots";

/**
 * Dotted Earth that slowly turns. Arcs fly from one city to another; where
 * an arc lands, a ripple goes out and a small newspaper card pops up: an
 * article published on one site, reaching a reader somewhere else.
 * Canvas 2D, no dependencies. Drag to spin. Pauses off-screen.
 */

const CITIES: [string, number, number][] = [
  ["New York", 40.7, -74],
  ["London", 51.5, -0.1],
  ["Berlin", 52.5, 13.4],
  ["Paris", 48.9, 2.35],
  ["Madrid", 40.4, -3.7],
  ["Rome", 41.9, 12.5],
  ["Athens", 38, 23.7],
  ["Lagos", 6.5, 3.4],
  ["Nairobi", -1.3, 36.8],
  ["Cape Town", -33.9, 18.4],
  ["Dubai", 25.2, 55.3],
  ["Mumbai", 19.1, 72.9],
  ["Singapore", 1.35, 103.8],
  ["Jakarta", -6.2, 106.8],
  ["Tokyo", 35.7, 139.7],
  ["Seoul", 37.6, 127],
  ["Sydney", -33.9, 151.2],
  ["Toronto", 43.7, -79.4],
  ["Chicago", 41.9, -87.6],
  ["Los Angeles", 34, -118.2],
  ["Mexico City", 19.4, -99.1],
  ["São Paulo", -23.5, -46.6],
  ["Buenos Aires", -34.6, -58.4],
  ["Lisbon", 38.7, -9.1],
];

const GREEN = "22, 196, 127";
const INK = "10, 10, 10";
const TILT = 0.38; // radians: north pole leans toward the viewer
const SPIN = 0.09; // radians per second
const ARC_MS = 1700;
const LAND_MS = 2600;

type V3 = [number, number, number];
type Arc = { a: V3; b: V3; to: string; t0: number; h: number; landed: boolean };
type Landing = { p: V3; city: string; t0: number };

const rad = (d: number) => (d * Math.PI) / 180;
const toVec = (lat: number, lon: number): V3 => [
  Math.cos(rad(lat)) * Math.sin(rad(lon)),
  Math.sin(rad(lat)),
  Math.cos(rad(lat)) * Math.cos(rad(lon)),
];

function slerp(a: V3, b: V3, t: number): V3 {
  const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const w = Math.acos(dot);
  if (w < 1e-4) return a;
  const s = Math.sin(w);
  const k1 = Math.sin((1 - t) * w) / s;
  const k2 = Math.sin(t * w) / s;
  return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
function spring(t: number) {
  if (t >= 1) return 1;
  return 1 - Math.exp(-7 * t) * Math.cos(10 * t);
}

export function Globe() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current!;
    const box = wrap.current!;
    const ctx = el.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Precompute land dots: sin/cos of lat and lon so rotation needs no trig per dot.
    const n = LAND.length / 2;
    const cosLat = new Float32Array(n);
    const sinLat = new Float32Array(n);
    const sinLon = new Float32Array(n);
    const cosLon = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const lat = rad(LAND[i * 2] / 10);
      const lon = rad(LAND[i * 2 + 1] / 10);
      cosLat[i] = Math.cos(lat);
      sinLat[i] = Math.sin(lat);
      sinLon[i] = Math.sin(lon);
      cosLon[i] = Math.cos(lon);
    }
    const cities = CITIES.map(([name, lat, lon]) => ({ name, v: toVec(lat, lon) }));

    let size = 0;
    let dpr = 1;
    let rot = rad(-20); // start with Europe/Africa facing us
    let vel = 0;
    let dragging = false;
    let lastX = 0;
    let visible = true;
    let raf = 0;
    let last = performance.now();
    let nextSpawn = last + 400;
    const arcs: Arc[] = [];
    const landings: Landing[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = box.clientWidth;
      el.width = size * dpr;
      el.height = size * dpr;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
    };

    // Rotate around Y by `rot`, then tilt around X.
    const cr = () => Math.cos(rot);
    const sr = () => Math.sin(rot);
    const ct = Math.cos(TILT);
    const st = Math.sin(TILT);
    function project(v: V3, c = cr(), s = sr()) {
      const x = v[0] * c + v[2] * s;
      const z0 = -v[0] * s + v[2] * c;
      const y = v[1] * ct - z0 * st;
      const z = v[1] * st + z0 * ct;
      return { x, y, z };
    }

    function spawn(now: number) {
      const c = cr();
      const s = sr();
      const front = cities.filter((k) => project(k.v, c, s).z > 0.3);
      if (front.length < 2) return;
      const to = front[Math.floor(Math.random() * front.length)];
      const options = front.filter((k) => {
        if (k === to) return false;
        const d = Math.acos(k.v[0] * to.v[0] + k.v[1] * to.v[1] + k.v[2] * to.v[2]);
        return d > rad(18) && d < rad(105);
      });
      if (!options.length) return;
      const from = options[Math.floor(Math.random() * options.length)];
      const d = Math.acos(from.v[0] * to.v[0] + from.v[1] * to.v[1] + from.v[2] * to.v[2]);
      arcs.push({ a: from.v, b: to.v, to: to.name, t0: now, h: 0.08 + 0.22 * (d / Math.PI), landed: false });
    }

    function drawNewspaper(x: number, y: number, k: number, alpha: number, city: string) {
      const u = dpr * k * 1.3;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      // stem
      ctx.strokeStyle = `rgba(${GREEN}, 0.9)`;
      ctx.lineWidth = 1.4 * dpr;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -12 * u);
      ctx.stroke();
      ctx.translate(0, -26 * u);
      // card
      ctx.shadowColor = "rgba(10,10,10,0.18)";
      ctx.shadowBlur = 10 * dpr;
      ctx.shadowOffsetY = 3 * dpr;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.roundRect(-15 * u, -13 * u, 30 * u, 26 * u, 5 * u);
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = `rgba(${INK}, 0.1)`;
      ctx.lineWidth = 1 * dpr;
      ctx.stroke();
      // masthead
      ctx.fillStyle = `rgb(${GREEN})`;
      ctx.beginPath();
      ctx.roundRect(-10 * u, -8.5 * u, 20 * u, 4 * u, 1.5 * u);
      ctx.fill();
      // photo + text lines
      ctx.fillStyle = `rgba(${GREEN}, 0.28)`;
      ctx.fillRect(-10 * u, -2 * u, 7 * u, 8 * u);
      ctx.fillStyle = `rgba(${INK}, 0.28)`;
      ctx.fillRect(-1 * u, -2 * u, 11 * u, 1.6 * u);
      ctx.fillRect(-1 * u, 1.3 * u, 11 * u, 1.6 * u);
      ctx.fillRect(-1 * u, 4.6 * u, 7 * u, 1.6 * u);
      // city label in a pill to the right of the card
      ctx.font = `600 ${11.5 * dpr}px ui-sans-serif, system-ui, sans-serif`;
      const tw = ctx.measureText(city).width;
      const pw = tw + 16 * dpr;
      // Flip the label to the left of the card when it would run off the canvas.
      const px = x + 19 * u + pw > size * dpr - 4 ? -19 * u - pw : 19 * u;
      const ph = 20 * dpr;
      ctx.fillStyle = "rgba(10,10,10,0.88)";
      ctx.beginPath();
      ctx.roundRect(px, -ph / 2, pw, ph, ph / 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.textBaseline = "middle";
      ctx.fillText(city, px + 8 * dpr, 0.5 * dpr);
      ctx.restore();
    }

    function frame(now: number) {
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      if (!dragging) {
        vel *= 0.95;
        rot += (reduce ? 0 : SPIN) * dt + vel;
      }
      if (!reduce && now > nextSpawn && arcs.length < 6) {
        spawn(now);
        nextSpawn = now + 650 + Math.random() * 600;
      }

      const W = size * dpr;
      const cx = W / 2;
      const cy = W / 2;
      const R = W * 0.42;
      const c = cr();
      const s = sr();
      ctx.clearRect(0, 0, W, W);

      // halo + ocean
      const halo = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.22);
      halo.addColorStop(0, `rgba(${GREEN}, 0.18)`);
      halo.addColorStop(1, `rgba(${GREEN}, 0)`);
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, W, W);
      const ocean = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
      ocean.addColorStop(0, "#ffffff");
      ocean.addColorStop(1, "#eef7f2");
      ctx.fillStyle = ocean;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(${GREEN}, 0.35)`;
      ctx.lineWidth = 1 * dpr;
      ctx.stroke();

      // land dots (back hemisphere faint, front by depth)
      const dot = Math.max(1.4 * dpr, 1.9 * (W / 560));
      for (let i = 0; i < n; i++) {
        const sl = sinLon[i] * c + cosLon[i] * s; // sin(lon + rot)
        const cl = cosLon[i] * c - sinLon[i] * s; // cos(lon + rot)
        const x = cosLat[i] * sl;
        const z0 = cosLat[i] * cl;
        const y = sinLat[i] * ct - z0 * st;
        const z = sinLat[i] * st + z0 * ct;
        if (z < 0) {
          if (z < -0.6) continue;
          ctx.fillStyle = `rgba(${INK}, 0.06)`;
        } else {
          ctx.fillStyle = `rgba(${INK}, ${0.22 + z * 0.6})`;
        }
        ctx.fillRect(cx + x * R - dot / 2, cy - y * R - dot / 2, dot, dot);
      }

      // city markers
      for (const k of cities) {
        const p = project(k.v, c, s);
        if (p.z <= 0.05) continue;
        ctx.fillStyle = `rgba(${GREEN}, ${0.35 + p.z * 0.5})`;
        ctx.beginPath();
        ctx.arc(cx + p.x * R, cy - p.y * R, 2 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      // arcs
      for (let i = arcs.length - 1; i >= 0; i--) {
        const arc = arcs[i];
        const t = (now - arc.t0) / ARC_MS;
        const head = reduce ? 1 : easeInOut(Math.min(1, t));
        const tail = reduce ? 0 : easeInOut(Math.max(0, Math.min(1, (t - 0.55) / 0.9)));
        if (head >= 1 && !arc.landed) {
          arc.landed = true;
          landings.push({ p: arc.b, city: arc.to, t0: now });
        }
        if (tail >= 1) {
          arcs.splice(i, 1);
          continue;
        }
        const steps = 48;
        let prev: { X: number; Y: number; hidden: boolean } | null = null;
        for (let j = 0; j <= steps; j++) {
          const u = tail + ((head - tail) * j) / steps;
          const v = slerp(arc.a, arc.b, u);
          const lift = 1 + arc.h * Math.sin(Math.PI * u);
          const p = project([v[0] * lift, v[1] * lift, v[2] * lift], c, s);
          const X = cx + p.x * R;
          const Y = cy - p.y * R;
          const hidden = p.z < 0 && Math.hypot(p.x, p.y) < 1;
          if (prev && !(hidden && prev.hidden)) {
            const fade = j / steps;
            ctx.strokeStyle = `rgba(${GREEN}, ${(hidden ? 0.15 : 0.95) * (0.15 + 0.85 * fade)})`;
            ctx.lineWidth = (1.2 + fade * 1.6) * dpr;
            ctx.beginPath();
            ctx.moveTo(prev.X, prev.Y);
            ctx.lineTo(X, Y);
            ctx.stroke();
          }
          prev = { X, Y, hidden };
        }
        // glowing head while travelling
        if (head < 1 && prev && !prev.hidden) {
          const g = ctx.createRadialGradient(prev.X, prev.Y, 0, prev.X, prev.Y, 9 * dpr);
          g.addColorStop(0, `rgba(${GREEN}, 0.9)`);
          g.addColorStop(1, `rgba(${GREEN}, 0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(prev.X, prev.Y, 9 * dpr, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(prev.X, prev.Y, 2 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // landings: ripple + newspaper card
      for (let i = landings.length - 1; i >= 0; i--) {
        const L = landings[i];
        const age = reduce ? 600 : now - L.t0;
        if (age > LAND_MS) {
          landings.splice(i, 1);
          continue;
        }
        const p = project(L.p, c, s);
        if (p.z < 0.05) continue;
        const X = cx + p.x * R;
        const Y = cy - p.y * R;
        for (const delay of [0, 280]) {
          const rt = (age - delay) / 1100;
          if (rt <= 0 || rt >= 1) continue;
          ctx.strokeStyle = `rgba(${GREEN}, ${0.7 * (1 - rt)})`;
          ctx.lineWidth = 1.5 * dpr;
          ctx.beginPath();
          ctx.arc(X, Y, (4 + 22 * easeOut(rt)) * dpr, 0, Math.PI * 2);
          ctx.stroke();
        }
        const pop = spring(Math.min(1, age / 520));
        const fadeOut = age > LAND_MS - 450 ? (LAND_MS - age) / 450 : 1;
        drawNewspaper(X, Y, Math.max(0.01, pop), Math.min(1, p.z * 3) * fadeOut, L.city);
      }

      if (visible && !reduce) raf = requestAnimationFrame(frame);
    }

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) frame(performance.now());
    });
    ro.observe(box);

    if (reduce) {
      // One still frame with a few finished deliveries.
      const now = performance.now();
      for (const [a, b] of [
        [1, 7],
        [10, 6],
        [3, 9],
      ]) {
        arcs.push({ a: cities[a].v, b: cities[b].v, to: cities[b].name, t0: now, h: 0.18, landed: true });
        landings.push({ p: cities[b].v, city: cities[b].name, t0: now });
      }
      frame(now);
    } else {
      raf = requestAnimationFrame(frame);
    }

    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting;
      if (visible && !was && !reduce) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(box);

    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      vel = (dx / size) * 1.2;
      rot += vel;
    };
    const up = () => {
      dragging = false;
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <div
      ref={wrap}
      className="globe"
      role="img"
      aria-label="Globe showing articles published on Guest Post Live sites reaching readers in cities around the world"
    >
      <canvas ref={canvas} />
    </div>
  );
}
