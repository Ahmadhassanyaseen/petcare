"use client";

import React, { useEffect, useRef, useState } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number; // ms
  once?: boolean;
  direction?: Direction;
  as?: React.ElementType;
};

const getTransform = (dir: Direction) => {
  switch (dir) {
    case "up":
      return "translate-y-6";
    case "down":
      return "-translate-y-6";
    case "left":
      return "translate-x-6";
    case "right":
      return "-translate-x-6";
    default:
      return "";
  }
};

const Reveal: React.FC<RevealProps> = ({
  children,
  className = "",
  delay = 0,
  once = true,
  direction = "up",
  as = "div",
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) io.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.2 }
    );

    io.observe(node);
    return () => io.disconnect();
  }, [once]);

  const Comp = as || "div";

  return (
    <Comp
      ref={ref}
      className={[
        "transition-all duration-700 ease-out will-change-transform will-change-opacity",
        visible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${getTransform(direction)}`,
        className,
      ].join(" ")}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Comp>
  );
};

export default Reveal;
