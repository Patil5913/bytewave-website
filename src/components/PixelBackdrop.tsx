type PixelBackdropProps = {
  seed: string;
  pixels?: number;
  className?: string;
  overlay?: boolean;
};

export default function PixelBackdrop({
  seed,
  pixels = 24,
  className = "opacity-30",
  overlay = true,
}: PixelBackdropProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <img
        src={`https://picsum.photos/seed/${seed}/${pixels}/${pixels}`}
        alt=""
        className={`pixel-bg h-full w-full object-cover ${className}`}
      />
      {overlay && <div className="absolute inset-0 bg-black/60" />}
    </div>
  );
}
