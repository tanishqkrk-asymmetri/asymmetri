"use client";

import SpecularButton, {
  type SpecularButtonProps,
} from "@/components/SpecularButton";

const defaults = {
  className: "font-chakra-petch",
  size: "lg",
  radius: 0,
  tint: "#ffffff",
  tintOpacity: 0,
  blur: 0,
  textColor: "#f5f5f5",
  lineColor: "#ff0000",
  baseColor: "#525252",
  intensity: 1,
  shineSize: 10,
  shineFade: 40,
  thickness: 2,
  speed: 0.35,
  followMouse: true,
  proximity: 100,
  autoAnimate: false,
  onClick: () => console.log("clicked"),
  children: "See open positions",
} as const satisfies SpecularButtonProps;

export function Button({
  className,
  size = defaults.size,
  radius = defaults.radius,
  tint = defaults.tint,
  tintOpacity = defaults.tintOpacity,
  blur = defaults.blur,
  textColor = defaults.textColor,
  lineColor = defaults.lineColor,
  baseColor = defaults.baseColor,
  intensity = defaults.intensity,
  shineSize = defaults.shineSize,
  shineFade = defaults.shineFade,
  thickness = defaults.thickness,
  speed = defaults.speed,
  followMouse = defaults.followMouse,
  proximity = defaults.proximity,
  autoAnimate = defaults.autoAnimate,
  onClick = defaults.onClick,
  children = defaults.children,
  ...rest
}: SpecularButtonProps) {
  return (
    <SpecularButton
      className={`${defaults.className} ${className ?? ""}`.trim()}
      size={size}
      radius={radius}
      tint={tint}
      tintOpacity={tintOpacity}
      blur={blur}
      textColor={textColor}
      lineColor={lineColor}
      baseColor={baseColor}
      intensity={intensity}
      shineSize={shineSize}
      shineFade={shineFade}
      thickness={thickness}
      speed={speed}
      followMouse={followMouse}
      proximity={proximity}
      autoAnimate={autoAnimate}
      onClick={onClick}
      {...rest}
    >
      {children}
    </SpecularButton>
  );
}
