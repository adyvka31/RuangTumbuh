import React, { useEffect, useRef } from "react";
import { motion, useTransform } from "framer-motion";
import Matter from "matter-js";
import { useSequentialScroll } from "@/hooks/useSequentialScroll";
import { FEATURES_DATA } from "@/constants/stackData";
import { FALLEN_SHAPES_CONFIG } from "@/constants/fallenShapesData";
import styles from "./StackLayout.module.css";

export default function StackSection() {
  const { scrollRef, scrollYProgress } = useSequentialScroll();

  const sceneRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    const engine = Matter.Engine.create();
    const world = engine.world;
    engineRef.current = engine;

    const width = window.innerWidth;
    const height = 400;

    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        background: "transparent",
        wireframes: false,
        pixelRatio: window.devicePixelRatio,
      },
    });

    const floor = Matter.Bodies.rectangle(width / 2, height + 25, width, 50, {
      isStatic: true,
      render: { visible: false },
    });
    const leftWall = Matter.Bodies.rectangle(-25, height / 2, 50, height, {
      isStatic: true,
      render: { visible: false },
    });
    const rightWall = Matter.Bodies.rectangle(
      width + 25,
      height / 2,
      50,
      height,
      {
        isStatic: true,
        render: { visible: false },
      },
    );
    

    Matter.World.add(world, [floor, leftWall, rightWall]);

    const shapes = FALLEN_SHAPES_CONFIG.map((shapeData) => {
      const randomX = Math.random() * (width - 100) + 50;
      const startY = Math.random() * -500 - 100;

      return Matter.Bodies.circle(randomX, startY, 35, {
        restitution: 0.4,
        friction: 0.8,
        angle: (shapeData.rot * Math.PI) / 180,
        render: {
          sprite: {
            texture: shapeData.src,
            xScale: 0.8,
            yScale: 0.8,
          },
        },
      });
    });

    Matter.World.add(world, shapes);

    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    Matter.World.add(world, mouseConstraint);
    render.mouse = mouse;

    Matter.Events.on(engine, "beforeUpdate", () => {
      const mousePos = mouse.position;
      
      // Abaikan jika kursor sedang berada di luar canvas (0,0)
      if (mousePos.x === 0 && mousePos.y === 0) return;

      shapes.forEach((body) => {
        const dx = body.position.x - mousePos.x;
        const dy = body.position.y - mousePos.y;
        
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Jika kursor masuk ke radius 100px dari shape
        if (distance < 100) {
          const kickSpeed = 10; 
          
          Matter.Body.setVelocity(body, {
            x: (dx / distance) * kickSpeed, 
            y: (dy / distance) * kickSpeed - 3, 
          });
        }
      });
    });

    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.World.clear(world);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  return (
    <section className={styles.stackSection} ref={scrollRef}>
      <div className={styles.stackWrapper}>
        {FEATURES_DATA.map((feat, i) => {
          const N = FEATURES_DATA.length;
          const tPhases = 2 * N - 1;
          const targetScale = 1.05 - (N - 1 - i) * 0.03;

          const sStart = (2 * i) / tPhases;
          const sEnd = (2 * i + 1) / tPhases;
          const eStart = (2 * i - 1) / tPhases;
          const eEnd = (2 * i) / tPhases;

          const scale = useTransform(
            scrollYProgress,
            [0, sStart, sEnd || 1, 1],
            i === 0
              ? [1.1, 1.1, targetScale, targetScale]
              : [1.1, 1.1, targetScale, targetScale],
          );
          const y = useTransform(
            scrollYProgress,
            [0, Math.max(0, eStart), eEnd || 1, 1],
            i === 0 ? [0, 0, 0, 0] : [50, 50, 0, 0],
          );

          return (
            <div className={styles.cardStickyContainer} key={feat.id}>
              <motion.div
                className={styles.cardContent}
                style={{
                  backgroundColor: feat.color,
                  scale,
                  y,
                  top: `${i * 35}px`,
                }}
              >
                <div className={styles.cardTextWrapper}>
                  <h3>{feat.title}</h3>
                  <p>{feat.desc}</p>
                </div>

                {feat.decorations.map((dec, idx) => (
                  <img
                    key={`dec-${idx}`}
                    src={dec.src}
                    alt=""
                    aria-hidden="true"
                    className={`${styles.cardShape} ${styles[dec.pos]}`}
                    style={{
                      animation: `floatDecorCSS ${4 + i * 0.5 + idx * 0.5}s ease-in-out infinite`,
                      transform: "translateZ(0)",
                      backfaceVisibility: "hidden",
                    }}
                  />
                ))}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Wadah Kanvas Fisika Matter.js */}
      <div
        ref={sceneRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "400px",
          zIndex: 5,
          pointerEvents: "auto",
          overflow: "hidden",
        }}
      />
    </section>
  );
}
