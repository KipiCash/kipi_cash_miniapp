import { cn } from "@/lib/utils";
import Script from "next/script";

interface SVGAnimatedProps {
  src: string; // Ruta del SVG
  width?: number | string;
  height?: number | string;
  className?: string;
  scriptSrc: string; // Ruta del script opcional
}

const SVGAnimated: React.FC<SVGAnimatedProps> = ({
  src,
  width = 200,
  height = 200,
  className = "",
  scriptSrc,
}) => {
  return (
    <>
      <object
        type="image/svg+xml"
        data={src}
        width={width}
        height={height}
        className={cn("w-full lg:w-1/2 h-full mx-auto", className)}
      />
      <Script src={scriptSrc} strategy="lazyOnload" />
    </>
  );
};

export default SVGAnimated;
