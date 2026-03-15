import { useEffect, useRef } from "react";
import Matter from "matter-js";
import { FALLEN_SHAPES_CONFIG } from "@/constants/fallenShapesData";

export const useMatterPhysics = (sceneRef) => {
  const engineRef = useRef(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    const engine = Matter.Engine.create();
    const world = engine.world;
    engineRef.current = engine;

    const width = window.innerWidth;
    const height = window.innerHeight;

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

    // Perbaikan atap agar shape yang muncul di Y: -500 tidak nyangkut
    const ceiling = Matter.Bodies.rectangle(width / 2, -800, width, 50, {
      isStatic: true,
      render: { visible: false },
    });

    Matter.World.add(world, [floor, leftWall, rightWall, ceiling]);

    const shapes = FALLEN_SHAPES_CONFIG.map((shapeData) => {
      const randomX = Math.random() * (width - 100) + 50;

      const startY = height - 100 - Math.random() * 200;

      return Matter.Bodies.circle(randomX, startY, 35, {
        restitution: 0.4,
        friction: 0.5,
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
          const kickSpeed = 10; // Sesuai kode Anda

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

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Jika section masuk layar, jalankan fisika. Jika keluar layar, pause (tidurkan).
        runner.enabled = entry.isIntersecting;
      });
    });

    if (sceneRef.current) {
      observer.observe(sceneRef.current);
    }

    return () => {
      observer.disconnect();
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.World.clear(world);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, [sceneRef]); // Tambahkan dependency sceneRef
};
