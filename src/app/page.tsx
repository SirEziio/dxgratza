"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import DarkModeToggle from "../components/DarkModeToggle";  // Import the DarkModeToggle component

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  const [ballSize, setBallSize] = useState(600);
  const [speed, setSpeed] = useState(3); // Set speed state
  const lightBgColor = "#E1DFD8";
  const darkBgColor = "#242424";

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  const positionRef = useRef({ x: 0, y: 0 });
  const directionRef = useRef({ dx: 1, dy: 1 });

  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Ensure client-side execution
  useEffect(() => {
    setIsClient(true);

    const savedMode = localStorage.getItem("theme");
    setIsDarkMode(savedMode === "dark");
  }, []);

  // Apply the dark mode class to the root element (html)
  useEffect(() => {
    if (isClient) {
      document.documentElement.classList.toggle("dark", isDarkMode);
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }
  }, [isDarkMode, isClient]);

  // Toggle theme and store preference
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
  };

  // Handle resizing to update ball size, boundaries, and speed based on screen width
  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure this runs only on the client

    const updateSizes = () => {
      const screenWidth = window.innerWidth;
      setBallSize(screenWidth < 640 ? 320 : 600);
      setBounds({ width: screenWidth, height: window.innerHeight });

      // Adjust speed based on screen width
      if (screenWidth < 640) {
        setSpeed(1.4);  // Slow down speed for smaller screens
      } else {
        setSpeed(3);  // Default speed for larger screens
      }
    };

    updateSizes();
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  }, []);

  // Ball animation logic
  useEffect(() => {
    if (!isClient) return;

    const animateBall = () => {
      const pos = positionRef.current;
      const dir = directionRef.current;

      let newX = pos.x + dir.dx * speed;
      let newY = pos.y + dir.dy * speed;
      let newDx = dir.dx;
      let newDy = dir.dy;
      let changed = false;

      const maxX = bounds.width - ballSize;
      const maxY = bounds.height - ballSize;

      if (newX <= 0 || newX >= maxX) {
        newDx = -newDx;
        changed = true;
      }

      if (newY <= 0 || newY >= maxY) {
        newDy = -newDy;
        changed = true;
      }

      if (newX < 0) newX = 0;
      if (newX > maxX) newX = maxX;
      if (newY < 0) newY = 0;
      if (newY > maxY) newY = maxY;

      if (changed) {
        directionRef.current = { dx: newDx, dy: newDy };
      }

      positionRef.current = { x: newX, y: newY };
      setPosition({ x: newX, y: newY });

      requestAnimationFrame(animateBall);
    };

    requestAnimationFrame(animateBall);
  }, [isClient, bounds, ballSize, speed]); // Add speed dependency

  if (!isClient) return null;

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
      {/* Dark Mode Toggle */}
      <div style={{ position: "absolute", top: "20px", right: "20px", zIndex: 10 }}>
        <DarkModeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </div>

      {/* Background Grid */}
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
          animationDelay: "2s",
          maskImage: `radial-gradient(circle ${window.innerWidth < 640 ? "420px" : "850px"}, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))`,
        }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: Math.ceil(bounds.width / 75) * Math.ceil(bounds.height / 75) }).map((_, index) => {
            const cols = Math.ceil(bounds.width / 75);
            const x = (index % cols) * 75;
            const y = Math.floor(index / cols) * 75;
            return (
              <rect
                key={index}
                x={x}
                y={y}
                width="75"
                height="75"
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
          backgroundColor: "#2400AA",
          mixBlendMode: "difference",
          borderRadius: "50%",
          left: `${position.x}px`,
          top: `${position.y}px`,
          pointerEvents: "none",
          zIndex: 5,
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

        <motion.h2
          className="text-2xl mt-2 tracking-wide mb-[20vh] sm:mb-[0]"
          initial={{ x: "100vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 50, duration: 1, delay: 0.5 }}
          style={{
            fontFamily: "FuturaBook, sans-serif",
            fontSize: "5vw",
            letterSpacing: "0.02em",
            color: isDarkMode ? "#E1DFD8" : "#242424",
          }}
        >
          UX Designer
        </motion.h2>
      </div>

      {/* Bottom Message */}
      <motion.p
        className="absolute text-base sm:text-xl text-center px-6 sm:px-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
        style={{
          bottom: window.innerWidth < 640 ? "15vh" : "8vh",
          fontFamily: "FuturaBook, sans-serif",
          color: isDarkMode ? "#E1DFD8" : "#242424", // Color based on theme
          zIndex: 10,
        }}
      >
        This site is currently under construction and will be available soon. Thank you for your patience.
      </motion.p>
    </div>
  );
}
