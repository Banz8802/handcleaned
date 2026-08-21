import Image from "next/image";

// ---------------------------------------------------------------------------
// BubbleDecoration — renders one of the three custom bubble PNG assets
// with floating animation, size, and absolute positions.
// ---------------------------------------------------------------------------
interface BubbleProps {
  imageIndex: 1 | 2 | 3;
  className: string;
  size: number; // width & height in px
  animationIndex: 1 | 2 | 3 | 4;
}

export default function BubbleDecoration({
  imageIndex,
  className,
  size,
  animationIndex,
}: BubbleProps) {
  const imgSrc = `/images/bubble-${imageIndex}.png`;
  const animClass = `animate-bubble-float-${animationIndex}`;

  return (
    <div
      aria-hidden="true"
      className={`absolute pointer-events-none select-none ${animClass} ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={imgSrc}
        alt=""
        width={size}
        height={size}
        className="w-full h-full object-contain opacity-80"
        unoptimized
      />
    </div>
  );
}
