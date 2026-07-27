"use client";

import React, { useState, useEffect } from "react";

const TAGLINES = [
  "for consumer benefits",
  "for users like you and me",
  "for smart investors",
  "for retail traders",
  "for finding the best deals",
  "for comparing stockbrokers",
  "for choosing credit cards",
  "for tracking live GMP",
  "for maximizing savings",
  "for financial transparency",
  "for everyday consumers",
  "for simpler banking"
];

export const DynamicTagline: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % TAGLINES.length);
        setFade(true);
      }, 300); // matches the opacity transition duration
    }, 3000); // rotates tagline every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`transition-opacity duration-300 inline-block ${
        fade ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      {TAGLINES[index]}
    </span>
  );
};
