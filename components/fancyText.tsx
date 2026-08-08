import { motion, useTransform } from "motion/react";

export default function RotatingText({
  items,
  pageScroll,
}: {
  items: string[];
  pageScroll: any;
}) {
  return (
    <div className="max-h-15 overflow-hidden  flex justify-start items-center flex-col">
      {items.map((x, i) => {
        return (
          <motion.div
            style={{
              y: useTransform(pageScroll, [0, 0.5], ["0px", "-65px"]),
              opacity: useTransform(
                pageScroll,
                i === 0 ? [0.1, 0.3] : i === 1 ? [0.2, 0.3] : [0.1, 0.3],
                i === 0 ? [1, 0.3] : i === 1 ? [0.3, 1] : [1, 0],
              ),
              // color: useTransform(
              //   pageScroll,
              //   [0.3, 0.35],
              //   ["#ffffff", "#ff0000"],
              // ),
            }}
            className="text-white text-center font-chakra-petch text-6xl"
            key={x}
          >
            {x}
          </motion.div>
        );
      })}
    </div>
  );
}
