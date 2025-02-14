import { useCallback } from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadConfettiPreset } from "tsparticles-preset-confetti";

export const Confetti = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadConfettiPreset(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        preset: "confetti",
        particles: {
          number: {
            value: 100
          },
          color: {
            value: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"]
          },
          shape: {
            type: "circle"
          },
          opacity: {
            value: 0.6,
            animation: {
              enable: true,
              speed: 0.3,
              minimumValue: 0.1,
              sync: false
            }
          },
          size: {
            value: 6,
            random: {
              enable: true,
              minimumValue: 3
            }
          },
          move: {
            enable: true,
            speed: 3,
            direction: "bottom",
            random: true,
            straight: false,
            outModes: {
              default: "out"
            }
          }
        },
        background: {
          opacity: 0
        }
      }}
    />
  );
};