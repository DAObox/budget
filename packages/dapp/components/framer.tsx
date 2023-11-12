"use client";

import { MotionProps, motion } from "framer-motion";
import { FC, HTMLAttributes, PropsWithChildren } from "react";

type DivProps = PropsWithChildren<HTMLAttributes<HTMLDivElement> & MotionProps>;

export const LoadingDiv: FC<DivProps> = ({ children = null }) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1,
        repeatDelay: 1,
      }}
      className="flex flex-col items-center justify-center pb-8"
    >
      {children}
    </motion.div>
  );
};

export const EaseInDiv: FC<DivProps> = ({ children = null, ...rest }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
