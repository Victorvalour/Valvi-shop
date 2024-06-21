"use client";

import { MdArrowBackIos } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";

import Image from "next/image";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

const variants: Variants = {
  initial: (direction) => {
    return {
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0,
      // skewY: direction > 0 ? "90deg" : "-90deg",
    };
  },
  animate: {
    x: "0%",
    opacity: 1,
    scale: 1,
    transitionDuration: "0.1s",
    // skewY: "0deg",
  },
  exit: (direction) => {
    return {
      x: direction > 0 ? "-100%" : "100%",
      opacity: 1,
      transitionDuration: "0.8s",
      scale: 0,
      // skewY: direction > 0 ? "-90deg" : "90deg",
    };
  },
};

const HomeBanner = () => {
  const content = [
    {
      image: "/laptops.png",
      title1: "Sweet Deals",
      title2: "Free Delivery",
    },
    {
      image: "/phones.png",
      title1: "Amazing offers",
      title2: "Fast Delivery",
    },
  ];

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handlePrevious = useCallback(() => {
    setDirection(-1);
    if (index === 0) {
      return setIndex(content.length - 1);
    }
    setIndex(index - 1);
  }, [index]);

  const handleNext = useCallback(() => {
    setDirection(1);
    if (index === content.length - 1) {
      return setIndex(0);
    }
    setIndex(index + 1);
  }, [index]);

  useEffect(() => {
    let s = setInterval(() => {
      handleNext();
    }, 7000);

    return () => {
      clearInterval(s);
    };
  }, [handleNext]);

  return (
    <div className="relative bg-gradient-to-r from-primaryColor to-secondaryColor mb-8">
      <AnimatePresence initial={false} custom={direction}>
        <div className="mx-auto px-8 py-12 flex flex-col gap-2 md:flex-row items-center justify-evenly">
          <div className="mb-8 md:mb-0 text-center">
            <motion.h1
              key={content[index].title1}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              custom={direction}
              transition={{ type: "ease-in" }}
              className="text-4xl md:text-6xl font-bold text-white mb-4"
            >
              {content[index].title1}
            </motion.h1>
            <p className="text-lg md:text-xl text-white mb-2">
              Enjoy discounts on selected items
            </p>
            <p className="text-2xl md:text-5xl text-yellow-400 font-bold">
              UP TO 70% OFF
            </p>
            <motion.p
              key={content[index].title2}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              custom={direction}
              transition={{ type: "ease-in" }}
              className="text-xl md:text-2xl text-slate-300"
            >
              {content[index].title2}
            </motion.p>
          </div>
          <motion.div
            key={content[index].image}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            custom={direction}
            transition={{ type: "ease-in" }}
            className="w-1/3 relative aspect-video"
          >
            <Image
              src={content[index].image}
              fill
              alt="Banner Image"
              className="object-contain"
            />
          </motion.div>
        </div>
      </AnimatePresence>
    </div>
  );
};

export default HomeBanner;
