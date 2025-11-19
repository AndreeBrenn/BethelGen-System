import { useEffect, useRef, useState } from "react";
import lottie from "lottie-web";

const LottieAnimation = ({
  animationPath,
  loop = true,
  autoplay = true,
  style,
}) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const [animationData, setAnimationData] = useState(null);

  // Fetch the JSON file
  useEffect(() => {
    fetch(animationPath)
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error("Error loading animation:", error));
  }, [animationPath]);

  // Load animation once data is fetched
  useEffect(() => {
    if (containerRef.current && animationData) {
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop,
        autoplay,
        animationData,
      });
    }

    return () => {
      animationRef.current?.destroy();
    };
  }, [animationData, loop, autoplay]);

  return <div ref={containerRef} style={style} />;
};

export default LottieAnimation;
