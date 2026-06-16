export interface MediaProps {
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
  src: string;
}

export const Media: React.FC<MediaProps> = ({ className, src, style, alt }) => (
  <img src={src} className={className} style={style} alt={alt} />
);
