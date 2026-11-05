// Generates ORIGINAL placeholder audio (synthesized tones, no third-party material)
// so the custom player can be tested before real tracks are added.
// Usage: npm run audio:placeholder  → writes WAV files into public/audio/
import { writeFileSync, mkdirSync } from "node:fs";

const RATE = 22050;

function wav(samples) {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) => data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32767), i * 2));
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + data.length, 4); h.write("WAVE", 8);
  h.write("fmt ", 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(RATE, 24); h.writeUInt32LE(RATE * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write("data", 36); h.writeUInt32LE(data.length, 40);
  return Buffer.concat([h, data]);
}

function render(seconds, voice) {
  const n = seconds * RATE;
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    const fade = Math.min(1, t / 3, (seconds - t) / 4);
    out[i] = voice(t) * fade;
  }
  return out;
}

const TAU = Math.PI * 2;

// "Drone": detuned low pad with slow swells.
const drone = render(40, (t) => {
  const swell = 0.55 + 0.45 * Math.sin(TAU * 0.05 * t);
  const notes = [55, 82.4, 110.3, 164.8, 220.6];
  let s = 0;
  notes.forEach((f, k) => {
    s += Math.sin(TAU * f * t + Math.sin(TAU * 0.2 * t + k)) / (k + 1.6);
  });
  return s * 0.32 * swell;
});

// "Pulse": soft bell-like pulses over a quiet bed.
const pulse = render(32, (t) => {
  const beat = t % 1.6;
  const env = Math.exp(-beat * 3.2);
  const scale = [261.6, 311.1, 392, 466.2, 392, 311.1];
  const f = scale[Math.floor(t / 1.6) % scale.length];
  const bell = (Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * f * 2.01 * t)) * env;
  const bed = Math.sin(TAU * 65.4 * t) * 0.18 * (0.6 + 0.4 * Math.sin(TAU * 0.1 * t));
  return (bell * 0.35 + bed) * 0.8;
});

mkdirSync("public/audio", { recursive: true });
writeFileSync("public/audio/placeholder-drone.wav", wav(drone));
writeFileSync("public/audio/placeholder-pulse.wav", wav(pulse));
console.log("Wrote public/audio/placeholder-drone.wav and placeholder-pulse.wav");
