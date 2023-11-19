import { useLayoutEffect, useRef, useState } from "react";
import useDimensions from "react-cool-dimensions";

import * as program from "../public/ascii-play/programs/basics/time_milliseconds";
import { run } from "../public/ascii-play/run";
import { Box } from "@chakra-ui/react";

function Canvas({
  width,
  height,
  dupe,
}: {
  width: number;
  height: number;
  dupe?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);
  useLayoutEffect(() => {
    if (loaded) return;
    if (!width || !height) return;
    if (!canvasRef.current) return;

    run(program, {
      element: canvasRef.current,
      renderer: "canvas",
      fps: 10,
      canvasSize: {
        width: width,
        height: height,
      },
    })
      .then(() => {
        setLoaded(true);
        return;
      })
      .catch((e) => {
        console.error(e);
      });
  }, [loaded, width, height]);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 opacity-40"></canvas>
  );
}

export default function AsciiCanvas() {
  const { observe, width, height } = useDimensions();
  return (
    <Box
      ref={observe}
      height={"100%"}
      width={"100%"}
      pointerEvents={"none"}
      zIndex={-1}
      overflow={"hidden"}
      inset={0}
      pos={"fixed"}
    >
      <Canvas width={width} height={height + 200} />
    </Box>
  );
}
