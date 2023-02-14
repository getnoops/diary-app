import { useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import { motion, Variant, Variants } from "framer-motion";
import React from "react";
import Pencil from "./Pencil";

interface WriteTextProps {
  text: string;
  setText: (text: string) => void;
}

const sentence: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.007,
      delayChildren: 0.4,
    },
  },
};

const letter: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
};

const WriteText = ({ text, setText }: WriteTextProps) => {
  const queryClient = useQueryClient();

  var el = document.getElementById("example_text");

  if (el === null) return <></>;
  el.textContent = text;

  var divHeight = el.offsetHeight;
  var divWidth = el.offsetWidth;
  var lineHeight = 28;
  var lines = divHeight / lineHeight;

  const totalTime = (divWidth / 7.8) * 0.007 * lines;

  var topKeyframes = [];
  var leftKeyframes = [];
  var leftTimingKeyframes: number[] = [];
  var rotateKeyframes = [];

  topKeyframes.push(-74);
  for (var i = 0; i < lines; i++) {
    leftKeyframes.push("0%");
    leftKeyframes.push("100%");

    topKeyframes.push(-74 + i * lineHeight);
    topKeyframes.push(-74 + (i + 1) * lineHeight);

    // generate 10 random numbers between -5 and 5 and push to rotateKeyframes
    for (var j = 0; j < 10; j++) {
      rotateKeyframes.push(Math.random() * 10 - 5);
    }
  }

  topKeyframes[topKeyframes.length - 1] = topKeyframes[topKeyframes.length - 2];
  leftKeyframes.push("100%");

  // timings
  var timings_split = 1 / lines;
  var timingCount = 0;
  var lineChangeTime = 0.04;
  leftTimingKeyframes.push(0);
  for (var i = 0; i < lines; i++) {
    timingCount += timings_split - lineChangeTime;
    leftTimingKeyframes.push(timingCount);

    timingCount += lineChangeTime;
    leftTimingKeyframes.push(timingCount);
  }

  var write: Variant = {
    rotate: rotateKeyframes,
    top: topKeyframes,
    color: "#0f172a",
    left: leftKeyframes,
    originZ: "bottom left",
    transition: {
      duration: totalTime,
      delay: 0.5,
      //   times: leftTimingKeyframes,
      left: {
        type: "tween",
        times: leftTimingKeyframes,
        duration: totalTime,
        ease: "linear",
      },
      top: {
        type: "tween",
        times: leftTimingKeyframes,
        duration: totalTime,
        ease: "linear",
      },
    },
  };

  const animationComplete = async () => {
    setText("");
    await queryClient.invalidateQueries(["getEntries"]);
  };

  return (
    <div className="relative">
      <motion.div
        initial={{
          top: -74,
        }}
        animate={write}
        className="pointer-events-none absolute"
        style={{
          transformOrigin: "bottom left",
        }}
        layoutId="pencil"
        onAnimationComplete={animationComplete}
      >
        <Pencil className="h-24 w-24 " />
      </motion.div>
      <motion.h1
        className="relative z-50 justify-center tracking-tighter text-slate-800 last:font-extrabold"
        initial="hidden"
        animate="visible"
        variants={sentence}
      >
        <div id="text" className="w-fit leading-[1.65rem]">
          {text.split("").map((char, i) => (
            <motion.span
              className={classNames(
                char === " " ? "px-0.5" : "pl-px",
                "inline-block font-normal"
              )}
              key={char + "-" + i}
              variants={letter}
            >
              {char}
            </motion.span>
          ))}
        </div>
      </motion.h1>
    </div>
  );
};

export default WriteText;
