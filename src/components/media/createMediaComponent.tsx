import { Media, MediaProps } from "./Media.tsx";

export const createMediaComponent: ({
  className,
  src,
}: MediaProps) => React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> =
  ({ className, src, style }) =>
  ({ className: newClassName, style: newStyle }) =>
    (
      <Media
        className={className ? `${className} ${newClassName}` : newClassName}
        src={src}
        style={
          style ? (newStyle ? { ...style, ...newStyle } : newStyle) : newStyle
        }
      />
    );
