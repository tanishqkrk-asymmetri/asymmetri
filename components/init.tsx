"use client";

import { art } from "@/lib/art";
import playSoundOnHover from "@/lib/sound";
import chalk from "chalk";
import { memo, useEffect } from "react";

function InitFunction() {
  useEffect(() => {
    document
      .querySelectorAll(".sound")
      .forEach((x) => x.addEventListener("mouseenter", playSoundOnHover));
    console.log(chalk.redBright("Property of", art));
  }, []);

  return <></>;
}

export const Init = memo(InitFunction);
