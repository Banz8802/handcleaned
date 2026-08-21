'use client';

import BubbleDecoration from "./BubbleDecoration";

// ---------------------------------------------------------------------------
// FloatingBubblesBackground — renders drifting overlay bubble images.
// Placed fixed on the viewport, click-through (pointer-events-none) and
// layered on top of section backgrounds for a true 3D floating effect.
// ---------------------------------------------------------------------------
export default function FloatingBubblesBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden select-none">
      {/* ── Left Side Bubbles ─────────────────────────────────────────── */}
      {/* Top Left */}
      <BubbleDecoration
        imageIndex={1}
        size={80}
        className="top-[12%] left-[4%]"
        animationIndex={1}
      />
      <BubbleDecoration
        imageIndex={2}
        size={40}
        className="top-[28%] left-[10%]"
        animationIndex={2}
      />
      <BubbleDecoration
        imageIndex={3}
        size={110}
        className="top-[48%] left-[2%]"
        animationIndex={3}
      />

      {/* Middle Left */}
      <BubbleDecoration
        imageIndex={2}
        size={65}
        className="top-[68%] left-[6%]"
        animationIndex={4}
      />

      {/* Bottom Left */}
      <BubbleDecoration
        imageIndex={3}
        size={50}
        className="bottom-[20%] left-[8%]"
        animationIndex={1}
      />
      <BubbleDecoration
        imageIndex={1}
        size={95}
        className="bottom-[8%] left-[3%]"
        animationIndex={3}
      />

      {/* ── Right Side Bubbles ────────────────────────────────────────── */}
      {/* Top Right */}
      <BubbleDecoration
        imageIndex={2}
        size={90}
        className="top-[15%] right-[5%]"
        animationIndex={4}
      />
      <BubbleDecoration
        imageIndex={3}
        size={45}
        className="top-[32%] right-[8%]"
        animationIndex={1}
      />
      <BubbleDecoration
        imageIndex={1}
        size={75}
        className="top-[58%] right-[4%]"
        animationIndex={2}
      />

      {/* Middle Right */}
      <BubbleDecoration
        imageIndex={2}
        size={60}
        className="top-[72%] right-[9%]"
        animationIndex={3}
      />

      {/* Bottom Right */}
      <BubbleDecoration
        imageIndex={1}
        size={105}
        className="bottom-[28%] right-[6%]"
        animationIndex={1}
      />
      <BubbleDecoration
        imageIndex={3}
        size={55}
        className="bottom-[10%] right-[3%]"
        animationIndex={2}
      />
    </div>
  );
}
