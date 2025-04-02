"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Home() {
  // Ball properties
  const [ballSize, setBallSize] = useState(window.innerWidth < 640 ? 320 : 600);
  const speed = 3;
  const lightBgColor = "#E1DFD8";
  const darkBgColor = "#242424";

  // State for tracking ball's position
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Refs for current position and direction
  const positionRef = useRef({ x: 0, y: 0 });
  const directionRef = useRef({ dx: 1, dy: 1 });

  // State for hovered square in grid
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);

  // State for dark/light mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Update mode on page load
  useEffect(() => {
    const savedMode = localStorage.getItem("theme");
    if (savedMode === "dark") {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, []);

  // Toggle theme and store preference in localStorage
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  // Detect screen resizing to adjust ball size
  useEffect(() => {
    const handleResize = () => {
      setBallSize(window.innerWidth < 640 ? 320 : 600);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animation logic for the bouncing ball
  useEffect(() => {
    const animateBall = () => {
      const pos = positionRef.current;
      const dir = directionRef.current;
      let newX = pos.x + dir.dx * speed;
      let newY = pos.y + dir.dy * speed;
      let newDx = dir.dx;
      let newDy = dir.dy;
      let changed = false;

      if (newX <= 0 || newX >= window.innerWidth - ballSize) {
        newDx = -newDx;
        changed = true;
      }

      if (newY <= 0 || newY >= window.innerHeight - ballSize) {
        newDy = -newDy;
        changed = true;
      }

      if (newX < 0) newX = 0;
      if (newX > window.innerWidth - ballSize) newX = window.innerWidth - ballSize;
      if (newY < 0) newY = 0;
      if (newY > window.innerHeight - ballSize) newY = window.innerHeight - ballSize;

      if (changed) {
        directionRef.current = { dx: newDx, dy: newDy };
      }
      positionRef.current = { x: newX, y: newY };
      setPosition({ x: newX, y: newY });

      requestAnimationFrame(animateBall);
    };

    requestAnimationFrame(animateBall);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        display: "flex",
        backgroundColor: isDarkMode ? darkBgColor : lightBgColor,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Interactive Grid */}
<div
  style={{
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: -1,
    opacity: 0.1,
    animation: "pulsate 7s infinite ease-in-out",
    animationDelay: "2s", // Adds a delay before starting
    maskImage: "radial-gradient(circle 1000px at center, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))",
  }}
>
  <svg
    width="100%"
    height="100%"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute inset-0 h-full w-full"
    style={{ position: "absolute", top: 0, left: 0 }}
  >
    {Array.from({ length: Math.ceil(window.innerWidth / 75) * Math.ceil(window.innerHeight / 75) }).map((_, index) => {
      const cols = Math.ceil(window.innerWidth / 75);
      const x = (index % cols) * 75;
      const y = Math.floor(index / cols) * 75;
      return (
        <rect
          key={index}
          x={x}
          y={y}
          width = "75"
          height = "75"
          fill={hoveredSquare === index ? (isDarkMode ? "#C3C3C3" : "#2400AA") : "transparent"}
          stroke={isDarkMode ? "#E1DFD8" : "#2400AA"}
          strokeWidth="0.2"
          onMouseEnter={() => setHoveredSquare(index)}
          onMouseLeave={() => setHoveredSquare(null)}
          style={{ transition: "fill 0.3s ease-in-out" }}
        />
      );
    })}
  </svg>
</div>


      {/* Bouncing Ball */}
      <div
        style={{
          position: "absolute",
          width: `${ballSize}px`,
          height: `${ballSize}px`,
          backgroundColor: isDarkMode ? "#2400AA" : "#2400AA",
          mixBlendMode: "difference",
          borderRadius: "50%",
          left: `${position.x}px`,
          top: `${position.y}px`,
          pointerEvents: "none", // Prevents it from interfering with anything
          zIndex: 5, // Ensures it is above text
        }}
      />

      {/* Text Content */}
      <div
        style={{
          position: "relative",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        {/* Main Heading */}
        <motion.h1
          className="font-bold italic tracking-wider"
          initial={{ x: "-100vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 50, duration: 1 }}
          style={{
            fontFamily: "CaslonBlackItalic, serif",
            fontSize: "10vw",
            letterSpacing: "0.05em",
            color: isDarkMode ? "#E1DFD8" : "#242424",
          }}
        >
          Daniel Gratza
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          className="text-2xl mt-2 tracking-wide"
          initial={{ x: "100vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 50,
            duration: 1,
            delay: 0.5,
          }}
          style={{
            fontFamily: "FuturaBook, sans-serif",
            fontSize: "5vw",
            letterSpacing: "0.02em",
            color: isDarkMode ? "#E1DFD8" : "#242424", // Color based on theme
          }}
        >
          UX Designer
        </motion.h2>
      </div>

      {/* Bottom Message */}
      <motion.p
        className="absolute bottom-8 text-base sm:text-xl text-center px-6 sm:px-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
        style={{
          fontFamily: "FuturaBook, sans-serif",
          color: isDarkMode ? "#E1DFD8" : "#242424", // Color based on theme
          zIndex: 10,
        }}
      >
        This site is currently under construction and will be available soon. Thank you for your patience.
      </motion.p>

      {/* Dark Mode / Light Mode Toggle */}
      <button
        onClick={toggleTheme}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "8px",
          width: "100px",
          borderRadius: "8px",
          backgroundColor: isDarkMode ? "#E1DFD8" : "#242424",
          color: isDarkMode ? "#242424" : "#E1DFD8",
          border: "none",
          fontSize: "20px",
          cursor: "pointer",
        }}
      >
        {isDarkMode ? "DARK " : "LIGHT"}
      </button>
    </div>
  );
}