// Flight Simulator using Phaser
class FlightScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FlightScene' });
        this.airplane = {
            x: 0,
            y: 100, // altitude
            z: 0,
            pitch: 0,
            yaw: 0,
            roll: 0,
            speed: 5,
            verticalSpeed: 0
        };
        this.camera = {
            x: 0,
            y: 150,
            z: -50,
            lookX: 0,
            lookY: 100,
            lookZ: 0
        };
        this.cursors = null;
        this.wasd = null;
        this.terrain = [];
        this.clouds = [];
        this.particles = [];
    }

    preload() {
        // Create textures for different terrain types
        this.createTerrainTextures();
        this.createCloudTextures();
        this.createAirplaneTexture();
    }

    createTerrainTextures() {
        // Ocean texture
        const oceanGraphics = this.add.graphics();
        oceanGraphics.fillGradientStyle(0x0066CC, 0x0066CC, 0x004499, 0x004499, 1);
        oceanGraphics.fillRect(0, 0, 100, 100);
        oceanGraphics.generateTexture('ocean', 100, 100);
        oceanGraphics.destroy();

        // Forest texture
        const forestGraphics = this.add.graphics();
        forestGraphics.fillStyle(0x228B22);
        forestGraphics.fillRect(0, 0, 100, 100);
        // Add some tree-like details
        forestGraphics.fillStyle(0x006400);
        for (let i = 0; i < 20; i++) {
            forestGraphics.fillCircle(
                Phaser.Math.Between(0, 100),
                Phaser.Math.Between(0, 100),
                Phaser.Math.Between(3, 8)
            );
        }
        forestGraphics.generateTexture('forest', 100, 100);
        forestGraphics.destroy();

        // Mountain texture
        const mountainGraphics = this.add.graphics();
        mountainGraphics.fillGradientStyle(0x8B7355, 0x8B7355, 0x654321, 0x654321, 1);
        mountainGraphics.fillRect(0, 0, 100, 100);
        mountainGraphics.generateTexture('mountain', 100, 100);
        mountainGraphics.destroy();
    }

    createCloudTextures() {
        const cloudGraphics = this.add.graphics();
        cloudGraphics.fillStyle(0xFFFFFF, 0.8);
        cloudGraphics.fillCircle(25, 25, 20);
        cloudGraphics.fillCircle(15, 25, 15);
        cloudGraphics.fillCircle(35, 25, 15);
        cloudGraphics.fillCircle(25, 15, 12);
        cloudGraphics.generateTexture('cloud', 50, 50);
        cloudGraphics.destroy();
    }

    createAirplaneTexture() {
        const airplaneGraphics = this.add.graphics();
        airplaneGraphics.fillStyle(0xC0C0C0); // Silver
        // Fuselage
        airplaneGraphics.fillEllipse(0, 0, 40, 8);
        // Wings
        airplaneGraphics.fillRect(-15, -2, 30, 4);
        airplaneGraphics.fillRect(-8, 8, 16, 3);
        // Tail
        airplaneGraphics.fillTriangle(-20, 0, -25, -5, -25, 5);
        airplaneGraphics.generateTexture('airplane', 50, 30);
        airplaneGraphics.destroy();
    }

    create() {
        // Create sky gradient background
        this.createSky();
        
        // Generate world terrain
        this.generateTerrain();
        
        // Generate clouds
        this.generateClouds();
        
        // Create airplane sprite
        this.airplaneSprite = this.add.image(400, 300, 'airplane');
        this.airplaneSprite.setScale(1.5);
        
        // Setup controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D,Q,E');
        
        // Create HUD
        this.createHUD();
        
        // Mouse look for camera
        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                this.airplane.yaw += (pointer.x - pointer.prevPosition.x) * 0.002;
                this.airplane.pitch += (pointer.y - pointer.prevPosition.y) * 0.002;
                this.airplane.pitch = Phaser.Math.Clamp(this.airplane.pitch, -0.5, 0.5);
            }
        });
        
        // Start engine sound simulation
        this.time.addEvent({
            delay: 100,
            callback: this.updateEngineEffect,
            callbackScope: this,
            loop: true
        });
    }

    createSky() {
        // Create gradient sky
        const skyGraphics = this.add.graphics();
        skyGraphics.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xE0F6FF, 0xE0F6FF, 1);
        skyGraphics.fillRect(0, 0, 800, 600);
        skyGraphics.generateTexture('sky', 800, 600);
        this.sky = this.add.image(400, 300, 'sky');
        skyGraphics.destroy();
    }

    generateTerrain() {
        this.terrainChunks = [];
        
        // Generate a grid of terrain chunks
        for (let x = -20; x <= 20; x++) {
            for (let z = -20; z <= 20; z++) {
                const chunkX = x * 200;
                const chunkZ = z * 200;
                
                // Determine terrain type based on position
                let terrainType = 'ocean';
                const distanceFromCenter = Math.sqrt(x * x + z * z);
                
                if (distanceFromCenter > 15) {
                    terrainType = 'ocean';
                } else if (distanceFromCenter > 8) {
                    terrainType = Math.random() > 0.3 ? 'forest' : 'ocean';
                } else {
                    terrainType = Math.random() > 0.5 ? 'forest' : 'mountain';
                }
                
                this.terrainChunks.push({
                    worldX: chunkX,
                    worldZ: chunkZ,
                    type: terrainType,
                    height: terrainType === 'mountain' ? 30 : 0,
                    sprite: null
                });
            }
        }
    }

    generateClouds() {
        this.cloudObjects = [];
        
        // Generate random clouds at different altitudes
        for (let i = 0; i < 50; i++) {
            this.cloudObjects.push({
                worldX: Phaser.Math.Between(-2000, 2000),
                worldY: Phaser.Math.Between(50, 200),
                worldZ: Phaser.Math.Between(-2000, 2000),
                scale: Phaser.Math.FloatBetween(0.5, 2.0),
                sprite: null
            });
        }
    }

    createHUD() {
        this.hudGraphics = this.add.graphics();
        
        // Altitude meter
        this.altitudeText = this.add.text(10, 10, '', {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 5, y: 5 }
        });
        
        // Speed meter
        this.speedText = this.add.text(10, 40, '', {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 5, y: 5 }
        });
        
        // Controls info
        this.add.text(10, 550, 'WASD: Pitch/Yaw | Q/E: Roll | Arrow Keys: Fine Control\nMouse: Look Around | Hold for camera control', {
            fontSize: '12px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 5, y: 5 }
        });
        
        // Debug info for key presses
        this.debugText = this.add.text(10, 70, '', {
            fontSize: '12px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 5, y: 5 }
        });
        
        // Crosshair
        this.hudGraphics.lineStyle(2, 0xFFFFFF);
        this.hudGraphics.strokeCircle(400, 300, 20);
        this.hudGraphics.lineBetween(390, 300, 410, 300);
        this.hudGraphics.lineBetween(400, 290, 400, 310);
    }

    project3DToScreen(worldX, worldY, worldZ) {
        // Transform world coordinates relative to airplane
        const relX = worldX - this.airplane.x;
        const relY = worldY - this.airplane.y;
        const relZ = worldZ - this.airplane.z;
        
        // Apply airplane rotation
        const cosYaw = Math.cos(this.airplane.yaw);
        const sinYaw = Math.sin(this.airplane.yaw);
        const cosPitch = Math.cos(this.airplane.pitch);
        const sinPitch = Math.sin(this.airplane.pitch);
        
        // Rotate around Y axis (yaw)
        const rotX = relX * cosYaw - relZ * sinYaw;
        const rotZ = relX * sinYaw + relZ * cosYaw;
        
        // Rotate around X axis (pitch)
        const finalY = relY * cosPitch - rotZ * sinPitch;
        const finalZ = relY * sinPitch + rotZ * cosPitch;
        
        if (finalZ <= 0) return null; // Behind camera
        
        // Project to screen
        const fov = 60;
        const scale = (400 / Math.tan(fov * Math.PI / 180 / 2)) / finalZ;
        
        return {
            x: 400 + rotX * scale,
            y: 300 - finalY * scale,
            scale: scale,
            distance: finalZ
        };
    }

    updateTerrain() {
        // Clear old terrain sprites
        this.terrainChunks.forEach(chunk => {
            if (chunk.sprite) {
                chunk.sprite.destroy();
                chunk.sprite = null;
            }
        });
        
        // Render visible terrain chunks
        this.terrainChunks.forEach(chunk => {
            const projected = this.project3DToScreen(chunk.worldX, chunk.height, chunk.worldZ);
            
            if (projected && projected.distance < 1000) {
                const size = 100 * projected.scale;
                if (size > 1) { // Only render if big enough
                    chunk.sprite = this.add.image(projected.x, projected.y, chunk.type);
                    chunk.sprite.setScale(size / 100);
                    chunk.sprite.setAlpha(Math.max(0.3, 1 - projected.distance / 1000));
                }
            }
        });
    }

    updateClouds() {
        // Clear old cloud sprites
        this.cloudObjects.forEach(cloud => {
            if (cloud.sprite) {
                cloud.sprite.destroy();
                cloud.sprite = null;
            }
        });
        
        // Render visible clouds
        this.cloudObjects.forEach(cloud => {
            const projected = this.project3DToScreen(cloud.worldX, cloud.worldY, cloud.worldZ);
            
            if (projected && projected.distance < 500) {
                const size = 50 * cloud.scale * projected.scale;
                if (size > 2) {
                    cloud.sprite = this.add.image(projected.x, projected.y, 'cloud');
                    cloud.sprite.setScale(size / 50);
                    cloud.sprite.setAlpha(Math.max(0.2, 0.8 - projected.distance / 500));
                }
            }
        });
    }

    updateEngineEffect() {
        // Add some visual engine effects
        if (this.airplane.speed > 3) {
            // Create speed lines effect
            for (let i = 0; i < 3; i++) {
                const line = this.add.line(
                    Phaser.Math.Between(0, 800),
                    Phaser.Math.Between(0, 600),
                    0, 0, 20, 0,
                    0xFFFFFF, 0.3
                );
                line.setOrigin(0, 0.5);
                
                this.time.delayedCall(100, () => {
                    if (line) line.destroy();
                });
            }
        }
    }

    update() {
        // Flight controls
        if (this.cursors.up.isDown || this.wasd.W.isDown) {
            this.airplane.pitch -= 0.02;
        }
        if (this.cursors.down.isDown || this.wasd.S.isDown) {
            this.airplane.pitch += 0.02;
        }
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            this.airplane.yaw -= 0.02;
        }
        if (this.cursors.right.isDown || this.wasd.D.isDown) {
            this.airplane.yaw += 0.02;
        }
        if (this.wasd.Q && this.wasd.Q.isDown) {
            this.airplane.roll -= 0.02;
        }
        if (this.wasd.E && this.wasd.E.isDown) {
            this.airplane.roll += 0.02;
        }
        
        // Limit pitch and roll
        this.airplane.pitch = Phaser.Math.Clamp(this.airplane.pitch, -0.8, 0.8);
        this.airplane.roll = Phaser.Math.Clamp(this.airplane.roll, -0.5, 0.5);
        
        // Calculate movement based on airplane orientation
        const speed = this.airplane.speed;
        this.airplane.x += Math.sin(this.airplane.yaw) * speed;
        this.airplane.z += Math.cos(this.airplane.yaw) * speed;
        this.airplane.y += Math.sin(this.airplane.pitch) * speed * 0.5;
        
        // Keep airplane above ground
        this.airplane.y = Math.max(5, this.airplane.y);
        
        // Gradually return to level flight
        this.airplane.roll *= 0.98;
        this.airplane.pitch *= 0.995;
        
        // Update airplane sprite rotation
        this.airplaneSprite.setRotation(this.airplane.roll);
        
        // Update world rendering
        this.updateTerrain();
        this.updateClouds();
        
        // Update HUD
        this.altitudeText.setText(`Altitude: ${Math.round(this.airplane.y)}m`);
        this.speedText.setText(`Speed: ${Math.round(this.airplane.speed * 20)} km/h`);
        
        // Debug key presses
        let pressedKeys = [];
        if (this.wasd.W && this.wasd.W.isDown) pressedKeys.push('W');
        if (this.wasd.A && this.wasd.A.isDown) pressedKeys.push('A');
        if (this.wasd.S && this.wasd.S.isDown) pressedKeys.push('S');
        if (this.wasd.D && this.wasd.D.isDown) pressedKeys.push('D');
        if (this.wasd.Q && this.wasd.Q.isDown) pressedKeys.push('Q');
        if (this.wasd.E && this.wasd.E.isDown) pressedKeys.push('E');
        if (this.cursors.left.isDown) pressedKeys.push('←');
        if (this.cursors.right.isDown) pressedKeys.push('→');
        if (this.cursors.up.isDown) pressedKeys.push('↑');
        if (this.cursors.down.isDown) pressedKeys.push('↓');
        
        this.debugText.setText(`Keys: ${pressedKeys.join(', ')} | Yaw: ${this.airplane.yaw.toFixed(2)}`);
        
        // Update sky color based on altitude
        const skyTint = Math.max(0.3, 1 - this.airplane.y / 300);
        this.sky.setTint(
            Phaser.Display.Color.GetColor(
                Math.round(135 * skyTint),
                Math.round(206 * skyTint),
                Math.round(235 * skyTint)
            )
        );
    }
}

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-game',
    backgroundColor: '#87CEEB',
    scene: FlightScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

// Initialize the game
const game = new Phaser.Game(config);