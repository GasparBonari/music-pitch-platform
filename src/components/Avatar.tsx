interface Props {
  initials: string;
  hue: number;
  size?: number;
  title?: string;
}

export function Avatar({ initials, hue, size = 32, title }: Props) {
  const style: React.CSSProperties = {
    width: size,
    height: size,
    fontSize: Math.round(size * 0.38),
    background: `linear-gradient(135deg, hsl(${hue} 80% 65%), hsl(${(hue + 40) % 360} 80% 50%))`,
  };
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-bold tracking-wide flex-shrink-0 select-none text-[rgba(0,0,0,0.78)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]"
      style={style}
      title={title}
      aria-label={title}
    >
      {initials}
    </span>
  );
}
