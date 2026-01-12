import { useEffect, useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";
import * as THREE from "three";

interface Enemy {
  mesh: THREE.Group;
  velocity: THREE.Vector3;
  health: number;
}

interface Bullet {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  lifeTime: number;
}

export default function PlaneGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    plane: THREE.Group;
    enemies: Enemy[];
    bullets: Bullet[];
    keys: { [key: string]: boolean };
    lastTime: number;
    lastShot: number;
  }>();

  const score = useSignal(0);
  const health = useSignal(100);
  const gameOver = useSignal(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue
    scene.fog = new THREE.Fog(0x87CEEB, 50, 200); // Add fog for depth perception

    const camera = new THREE.PerspectiveCamera(
      75,
      globalThis.innerWidth / globalThis.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create player plane - much more detailed
    const planeGroup = new THREE.Group();

    // Plane body (fuselage) - larger and more visible
    const fuselageGeometry = new THREE.CylinderGeometry(0.4, 0.8, 6, 12);
    const fuselageMaterial = new THREE.MeshPhongMaterial({
      color: 0x0066cc,
      shininess: 100,
    });
    const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
    fuselage.rotation.z = Math.PI / 2;
    fuselage.castShadow = true;
    planeGroup.add(fuselage);

    // Main wings - larger and more prominent
    const wingGeometry = new THREE.BoxGeometry(8, 0.3, 2);
    const wingMaterial = new THREE.MeshPhongMaterial({
      color: 0x004499,
      shininess: 50,
    });
    const wings = new THREE.Mesh(wingGeometry, wingMaterial);
    wings.position.z = 0.4;
    wings.castShadow = true;
    planeGroup.add(wings);

    // Tail wings
    const tailWingGeometry = new THREE.BoxGeometry(3, 0.2, 1);
    const tailWings = new THREE.Mesh(tailWingGeometry, wingMaterial);
    tailWings.position.x = -2.5;
    tailWings.position.z = 0.2;
    tailWings.castShadow = true;
    planeGroup.add(tailWings);

    // Vertical tail
    const tailGeometry = new THREE.BoxGeometry(0.2, 2, 1.5);
    const tail = new THREE.Mesh(tailGeometry, wingMaterial);
    tail.position.x = -2.8;
    tail.position.y = 1;
    tail.castShadow = true;
    planeGroup.add(tail);

    // Propeller - larger and more visible
    const propGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
    const propMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const propeller = new THREE.Mesh(propGeometry, propMaterial);
    propeller.position.x = 3.5;
    propeller.rotation.z = Math.PI / 2;
    propeller.castShadow = true;
    planeGroup.add(propeller);

    // Cockpit
    const cockpitGeometry = new THREE.SphereGeometry(0.6, 8, 6);
    const cockpitMaterial = new THREE.MeshPhongMaterial({
      color: 0x222222,
      transparent: true,
      opacity: 0.7,
    });
    const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpit.position.x = 1;
    cockpit.position.y = 0.5;
    cockpit.scale.x = 1.5;
    cockpit.castShadow = true;
    planeGroup.add(cockpit);

    planeGroup.position.set(0, 0, 0);
    planeGroup.scale.set(1.5, 1.5, 1.5); // Make the plane bigger
    scene.add(planeGroup);

    // Create ground
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x3a5f3a });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -20;
    ground.receiveShadow = true;
    scene.add(ground);

    // Set camera position - closer and better angle
    camera.position.set(-15, 8, 5);
    camera.lookAt(planeGroup.position);

    // Game state
    const enemies: Enemy[] = [];
    const bullets: Bullet[] = [];
    const keys: { [key: string]: boolean } = {};

    // Input handling
    const handleKeyDown = (event: KeyboardEvent) => {
      keys[event.code] = true;
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keys[event.code] = false;
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // Create enemy function - much more detailed enemies
    const createEnemy = () => {
      const enemyGroup = new THREE.Group();

      // Enemy fuselage - larger and more visible
      const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.5, 4, 8);
      const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        shininess: 100,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.rotation.z = Math.PI / 2;
      body.castShadow = true;
      enemyGroup.add(body);

      // Enemy wings
      const enemyWingGeometry = new THREE.BoxGeometry(5, 0.2, 1.5);
      const enemyWingMaterial = new THREE.MeshPhongMaterial({
        color: 0xaa0000,
      });
      const enemyWings = new THREE.Mesh(enemyWingGeometry, enemyWingMaterial);
      enemyWings.position.z = 0.3;
      enemyWings.castShadow = true;
      enemyGroup.add(enemyWings);

      // Enemy propeller
      const enemyPropGeometry = new THREE.CylinderGeometry(0.08, 0.08, 2, 6);
      const enemyPropMaterial = new THREE.MeshPhongMaterial({
        color: 0x333333,
      });
      const enemyProp = new THREE.Mesh(enemyPropGeometry, enemyPropMaterial);
      enemyProp.position.x = 2.5;
      enemyProp.rotation.z = Math.PI / 2;
      enemyProp.castShadow = true;
      enemyGroup.add(enemyProp);

      // Random spawn position - closer to player and more visible
      const x = Math.random() * 60 + 40;
      const y = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 40;

      enemyGroup.position.set(x, y, z);
      enemyGroup.scale.set(1.2, 1.2, 1.2); // Make enemies bigger
      scene.add(enemyGroup);

      const enemy: Enemy = {
        mesh: enemyGroup,
        velocity: new THREE.Vector3(
          -1.5,
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
        ),
        health: 1,
      };

      enemies.push(enemy);
    };

    // Create bullet function - much more visible bullets
    const createBullet = () => {
      const bulletGeometry = new THREE.SphereGeometry(0.3);
      const bulletMaterial = new THREE.MeshPhongMaterial({
        color: 0xffff00,
        emissive: 0x444400,
        shininess: 100,
      });
      const bulletMesh = new THREE.Mesh(bulletGeometry, bulletMaterial);

      // Fire from the front of the plane
      bulletMesh.position.copy(planeGroup.position);
      bulletMesh.position.x += 5; // Fire from propeller area
      bulletMesh.castShadow = true;
      scene.add(bulletMesh);

      const bullet: Bullet = {
        mesh: bulletMesh,
        velocity: new THREE.Vector3(25, 0, 0), // Faster bullets
        lifeTime: 5000, // Longer lasting bullets
      };

      bullets.push(bullet);
    };

    // Animation loop
    let lastTime = 0;
    const animate = (currentTime: number) => {
      if (gameOver.value) return;

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Player movement
      const moveSpeed = 0.3;
      const rotateSpeed = 0.03;

      if (keys["ArrowUp"] || keys["KeyW"]) {
        planeGroup.position.y += moveSpeed;
      }
      if (keys["ArrowDown"] || keys["KeyS"]) {
        planeGroup.position.y -= moveSpeed;
      }
      if (keys["ArrowLeft"] || keys["KeyA"]) {
        planeGroup.position.z -= moveSpeed;
        planeGroup.rotation.z = Math.min(
          planeGroup.rotation.z + rotateSpeed,
          0.3,
        );
      }
      if (keys["ArrowRight"] || keys["KeyD"]) {
        planeGroup.position.z += moveSpeed;
        planeGroup.rotation.z = Math.max(
          planeGroup.rotation.z - rotateSpeed,
          -0.3,
        );
      }

      // Stabilize rotation when not turning
      if (
        !keys["ArrowLeft"] && !keys["KeyA"] && !keys["ArrowRight"] &&
        !keys["KeyD"]
      ) {
        planeGroup.rotation.z *= 0.9;
      }

      // Shooting - improved with proper fire rate control
      if (keys["Space"]) {
        const now = currentTime;
        if (now - gameRef.current!.lastShot > 200) { // Fire every 200ms max
          createBullet();
          gameRef.current!.lastShot = now;
        }
      }

      // Keep plane in bounds
      planeGroup.position.y = Math.max(
        -15,
        Math.min(15, planeGroup.position.y),
      );
      planeGroup.position.z = Math.max(
        -25,
        Math.min(25, planeGroup.position.z),
      );

      // Spawn enemies
      if (Math.random() < 0.015) { // Slightly more frequent spawning
        createEnemy();
      }

      // Update enemies
      enemies.forEach((enemy, index) => {
        enemy.mesh.position.add(enemy.velocity);
        enemy.mesh.rotation.y += 0.02;

        // Remove if too far
        if (enemy.mesh.position.x < -50) {
          scene.remove(enemy.mesh);
          enemies.splice(index, 1);
        }

        // Check collision with player - more forgiving collision
        if (enemy.mesh.position.distanceTo(planeGroup.position) < 4) {
          health.value -= 10;
          scene.remove(enemy.mesh);
          enemies.splice(index, 1);

          if (health.value <= 0) {
            gameOver.value = true;
          }
        }
      });

      // Update bullets
      bullets.forEach((bullet, bulletIndex) => {
        bullet.mesh.position.add(bullet.velocity);
        bullet.lifeTime -= deltaTime;

        // Remove if expired or too far
        if (bullet.lifeTime <= 0 || bullet.mesh.position.x > 100) {
          scene.remove(bullet.mesh);
          bullets.splice(bulletIndex, 1);
          return;
        }

        // Check collision with enemies - more generous hit detection
        enemies.forEach((enemy, enemyIndex) => {
          if (bullet.mesh.position.distanceTo(enemy.mesh.position) < 3) {
            // Hit! Create explosion effect
            const explosionGeometry = new THREE.SphereGeometry(1.5);
            const explosionMaterial = new THREE.MeshBasicMaterial({
              color: 0xff4400,
              transparent: true,
              opacity: 0.8,
            });
            const explosion = new THREE.Mesh(
              explosionGeometry,
              explosionMaterial,
            );
            explosion.position.copy(enemy.mesh.position);
            scene.add(explosion);

            // Remove explosion after a short time
            setTimeout(() => {
              scene.remove(explosion);
            }, 200);

            scene.remove(bullet.mesh);
            scene.remove(enemy.mesh);
            bullets.splice(bulletIndex, 1);
            enemies.splice(enemyIndex, 1);
            score.value += 10;
          }
        });
      });

      // Update camera to follow plane - improved smooth following
      const targetCameraX = planeGroup.position.x - 20;
      const targetCameraY = planeGroup.position.y + 8;
      const targetCameraZ = planeGroup.position.z + 10;

      // Smooth camera movement
      camera.position.x += (targetCameraX - camera.position.x) * 0.1;
      camera.position.y += (targetCameraY - camera.position.y) * 0.1;
      camera.position.z += (targetCameraZ - camera.position.z) * 0.1;

      // Always look at the plane
      camera.lookAt(planeGroup.position);

      // Rotate propeller
      if (propeller) {
        propeller.rotation.x += 0.5;
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    // Handle window resize
    const handleResize = () => {
      camera.aspect = globalThis.innerWidth / globalThis.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
    };

    globalThis.addEventListener("resize", handleResize);

    // Store references
    gameRef.current = {
      scene,
      camera,
      renderer,
      plane: planeGroup,
      enemies,
      bullets,
      keys,
      lastTime: 0,
      lastShot: 0,
    };

    // Start game loop
    animate(0);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      globalThis.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  const restartGame = () => {
    score.value = 0;
    health.value = 100;
    gameOver.value = false;

    // Clear existing enemies and bullets
    if (gameRef.current) {
      gameRef.current.enemies.forEach((enemy) => {
        gameRef.current!.scene.remove(enemy.mesh);
      });
      gameRef.current.bullets.forEach((bullet) => {
        gameRef.current!.scene.remove(bullet.mesh);
      });
      gameRef.current.enemies.length = 0;
      gameRef.current.bullets.length = 0;

      // Reset plane position
      gameRef.current.plane.position.set(0, 0, 0);
      gameRef.current.plane.rotation.set(0, 0, 0);
    }
  };

  return (
    <div class="relative h-full w-full">
      <canvas ref={canvasRef} class="block" />

      {/* UI Overlay */}
      <div class="absolute top-4 left-4 text-white text-xl font-bold bg-black bg-opacity-70 p-4 rounded-lg border-2 border-blue-400">
        <div class="text-green-400">Score: {score.value}</div>
        <div
          class={`${
            health.value > 50
              ? "text-green-400"
              : health.value > 25
              ? "text-yellow-400"
              : "text-red-400"
          }`}
        >
          Health: {health.value}
        </div>
        <div class="text-gray-300 text-sm mt-2">
          Enemies Destroyed: {Math.floor(score.value / 10)}
        </div>
      </div>

      {/* Controls */}
      <div class="absolute top-4 right-4 text-white text-sm bg-black bg-opacity-70 p-4 rounded-lg border-2 border-green-400">
        <div class="text-green-400 font-bold mb-2">FLIGHT CONTROLS:</div>
        <div>🎮 WASD / Arrow Keys: Move Plane</div>
        <div>🔥 SPACEBAR: Fire Bullets</div>
        <div class="text-yellow-400 mt-2 text-xs">
          💡 Tip: Lead your targets!
        </div>
      </div>

      {/* Crosshair */}
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="text-green-400 text-4xl font-bold opacity-70">+</div>
      </div>

      {/* Game Over Screen */}
      {gameOver.value && (
        <div class="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div class="text-white text-center">
            <h2 class="text-4xl font-bold mb-4">Game Over!</h2>
            <p class="text-xl mb-4">Final Score: {score.value}</p>
            <button
              type="button"
              onClick={restartGame}
              class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Restart Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
