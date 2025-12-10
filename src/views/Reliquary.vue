<template>
    <div>
        <nav class="top-bar">
            <div class="brand">
                <div class="brand-icon"></div>
                MIDNIGHT WATCH
            </div>
            <ul class="nav-links uppercase mono">
                <li><router-link to="/" class="nav-item" active-class="active">Command</router-link></li>
                <li><router-link to="/bestiary" class="nav-item" active-class="active">Bestiary</router-link></li>
                <li><a href="#" class="nav-item">Missions</a></li>
                <li><router-link to="/reliquary" class="nav-item" active-class="active">Reliquary</router-link></li>
                <li><a href="#" class="nav-item">Personnel</a></li>
            </ul>
            <div class="mono text-gold">SYS.ONLINE</div>
        </nav>

        <div class="main-stage">
            
            <!-- Main Widget Container -->
            <div class="acquisitionswidget">
                
                <!-- Left: Data -->
                <div class="info-panel">
                    <!-- User's Top Banner SVG (Simplified placement for layout) -->
                    <div class="top-banner-svg">
                       <!-- Paste the FIRST SVG from prompt here if desired, strictly decorative -->
                       <svg viewBox="0 0 259 32" fill="none" style="width:100%; height:32px; opacity:0.8;">
                           <path d="M0 0 H259 V32 H0 Z" fill="url(#grad1)" opacity="0.1"/>
                           <defs>
                               <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                 <stop offset="0%" style="stop-color:var(--accent-gold);stop-opacity:0" />
                                 <stop offset="50%" style="stop-color:var(--accent-gold);stop-opacity:0.5" />
                                 <stop offset="100%" style="stop-color:var(--accent-gold);stop-opacity:0" />
                               </linearGradient>
                           </defs>
                           <!-- Rectangles mimicking the user's SVG structure -->
                           <rect x="10" y="10" width="50" height="2" fill="#B9943D" />
                           <rect x="70" y="10" width="100" height="2" fill="#B9943D" />
                           <rect x="180" y="10" width="70" height="2" fill="#B9943D" />
                       </svg>
                    </div>

                    <div id="item-content">
                        <!-- Content injected via JS -->
                        <span class="item-type">Loading Database...</span>
                        <h1 class="item-name">INITIALIZING</h1>
                    </div>

                    <div class="stats-container" id="item-stats" style="margin-top: auto;">
                        <!-- Stats injected via JS -->
                    </div>

                </div>

                <!-- Right: 3D Visualizer -->
                <div class="visualizer-panel">
                    <canvas id="item-canvas"></canvas>
                    
                    <!-- User's Bottom/Mid SVG Overlay -->
                    <div class="mid-display-svg">
                        <!-- This is a placeholder for the massive SVG provided in prompt. 
                             Using a simplified version to ensure performance in preview, 
                             but maintaining the Gold/Cyberpunk aesthetic. -->
                        <svg viewBox="0 0 252 134" fill="none" style="width:100%;">
                            <path d="M1 1 H251 V133 H1 Z" stroke="#B9943D" stroke-width="1" fill="transparent" opacity="0.3"/>
                            <path d="M10 120 H240" stroke="#B9943D" stroke-width="2"/>
                            <rect x="20" y="100" width="10" height="10" fill="#B9943D" />
                            <rect x="35" y="100" width="10" height="10" fill="#B9943D" opacity="0.5"/>
                            <rect x="50" y="100" width="10" height="10" fill="#B9943D" opacity="0.2"/>
                            <text x="180" y="115" fill="#B9943D" font-family="monospace" font-size="10">SCANNING...</text>
                        </svg>
                    </div>
                </div>

            </div>

            <!-- Navigation -->
            <div style="width: 100%; max-width: 1000px; display: flex; margin-top: 10px;">
                <button class="nav-btn" id="btn-prev">< PREV ASSET</button>
                <div style="flex:2; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; color: var(--accent-gold);" class="mono" id="counter">01 / 04</div>
                <button class="nav-btn" id="btn-next">NEXT ASSET ></button>
            </div>

        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import * as THREE from 'three';

onMounted(() => {
    // --- 1. Data Loading ---
    let items = [];
    let currentIndex = 0;

    async function init() {
        try {
            // Fetch data (simulated for preview if file missing)
            try {
                const res = await fetch('data/acquisitions.json');
                if(!res.ok) throw new Error('File not found');
                items = await res.json();
            } catch(e) {
                // Fallback data
                items = [
                    { name: "Void Repeater", type: "Weaponry", description: "Experimental rail weapon.", stats: [{label:"Power", value:90}, {label:"Rate", value:40}] },
                    { name: "Obsidian Shard", type: "Artifact", description: "Unknown crystalline structure.", stats: [{label:"Radiation", value:80}, {label:"Stability", value:20}] },
                    { name: "Spectral Visor", type: "Gear", description: "See the unseen.", stats: [{label:"Range", value:60}, {label:"Battery", value:90}] }
                ];
            }
            
            init3D();
            updateDisplay(0);
            
            // Event Listeners
            document.getElementById('btn-next').addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % items.length;
                updateDisplay(currentIndex);
            });
            document.getElementById('btn-prev').addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + items.length) % items.length;
                updateDisplay(currentIndex);
            });

        } catch(err) {
            console.error(err);
        }
    }

    // --- 2. UI Logic ---
    function updateDisplay(index) {
        const item = items[index];
        const container = document.getElementById('item-content');
        const statsContainer = document.getElementById('item-stats');
        const counter = document.getElementById('counter');

        // Animate Text Out
        container.style.opacity = 0;
        statsContainer.innerHTML = ''; // Clear stats immediately

        setTimeout(() => {
            // Update Text
            container.innerHTML = `
                <span class="item-type mono fade-in-up" style="animation-delay:0.1s">[ID: ${item.id || 'UNK'}] ${item.type}</span>
                <h1 class="item-name fade-in-up" style="animation-delay:0.2s">${item.name}</h1>
                <div class="mono text-gold fade-in-up" style="margin: 0.5rem 0; font-size: 0.7rem; animation-delay:0.25s">ORIGIN: ${item.origin || 'CLASSIFIED'} // STATUS: ${item.status || 'UNKNOWN'}</div>
                <p class="item-desc fade-in-up" style="animation-delay:0.3s">${item.description}</p>
            `;
            
            // Render Stats
            if(item.stats) {
                item.stats.forEach((stat, i) => {
                    const row = document.createElement('div');
                    row.className = 'stat-row fade-in-up';
                    row.style.animationDelay = (0.4 + (i * 0.1)) + 's';
                    row.innerHTML = `
                        <div class="stat-label"><span>${stat.label}</span> <span>${stat.value}%</span></div>
                        <div class="stat-track">
                            <div class="stat-fill" style="width: 0%"></div>
                        </div>
                    `;
                    statsContainer.appendChild(row);
                    
                    // Trigger bar animation after render
                    setTimeout(() => {
                        row.querySelector('.stat-fill').style.width = stat.value + '%';
                    }, 100);
                });
            }

            // Animate In
            container.style.opacity = 1;
            
            // Update Counter
            counter.innerText = `0${index + 1} / 0${items.length}`;

            // Update 3D Model
            update3DModel(index);

        }, 300);
    }

    // --- 3. Three.js Logic ---
    let scene, camera, renderer, currentMesh;
    const geometries = [];

    function init3D() {
        const canvas = document.getElementById('item-canvas');
        const width = canvas.parentElement.offsetWidth;
        const height = canvas.parentElement.offsetHeight;

        scene = new THREE.Scene();
        
        // Camera
        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.z = 5;

        // Renderer
        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xd4af37, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);
        const blueLight = new THREE.PointLight(0x00f3ff, 0.8);
        blueLight.position.set(-5, -5, 5);
        scene.add(blueLight);

        // Pre-generate some geometries to swap between
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x111111, 
            wireframe: true,
            emissive: 0x00f3ff,
            emissiveIntensity: 0.5
        });
        
        geometries.push(new THREE.IcosahedronGeometry(1.5, 1)); // Shape 0
        geometries.push(new THREE.TorusKnotGeometry(0.8, 0.2, 100, 16)); // Shape 1
        geometries.push(new THREE.OctahedronGeometry(1.5)); // Shape 2
        geometries.push(new THREE.ConeGeometry(1, 2, 8)); // Shape 3

        // Initial Mesh
        update3DModel(0);

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);
            if (currentMesh) {
                currentMesh.rotation.y += 0.005;
                currentMesh.rotation.x += 0.002;
            }
            renderer.render(scene, camera);
        };
        animate();

        // Handle Resize
        window.addEventListener('resize', () => {
            const w = canvas.parentElement.offsetWidth;
            const h = canvas.parentElement.offsetHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        });
    }

    function update3DModel(index) {
        if (currentMesh) {
            scene.remove(currentMesh);
        }
        
        // Pick a geometry based on index (cycle through the 4 we made)
        const geoIndex = index % geometries.length;
        const geometry = geometries[geoIndex];
        
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x050a14,
            wireframe: true,
            emissive: index % 2 === 0 ? 0x00f3ff : 0xd4af37, // Alternate colors
            emissiveIntensity: 0.8
        });

        currentMesh = new THREE.Mesh(geometry, material);
        scene.add(currentMesh);
        
        // Reset rotation
        currentMesh.rotation.set(0,0,0);
        
        // GSAP-like pop in (manual)
        currentMesh.scale.set(0,0,0);
        let s = 0;
        const popIn = setInterval(() => {
            s += 0.1;
            currentMesh.scale.set(s, s, s);
            if(s >= 1) clearInterval(popIn);
        }, 16);
    }

    init();
});
</script>

<style scoped>
/* --- Quick Styles for Preview (Merge into theme.css later) --- */
:root {
    --bg-dark: #050a14;
    --bg-panel: #0a1322;
    --accent-gold: #d4af37;
    --accent-cyan: #00f3ff;
    --text-dim: #8892b0;
    --text-light: #e6f1ff;
    --font-display: 'Rajdhani', sans-serif;
    --font-mono: 'Fira Code', monospace;
}
body {
    background: var(--bg-dark);
    color: var(--text-light);
    font-family: var(--font-display);
    margin: 0;
    overflow-x: hidden;
}

/* --- Layout --- */
.top-bar {
    position: fixed;
    top: 0;
    width: 100%;
    padding: 1rem 2rem;
    background: rgba(5, 10, 20, 0.95);
    border-bottom: 1px solid #333;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.brand {
    font-weight: 700;
    letter-spacing: 2px;
}

.main-stage {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    padding-top: 60px;
}

/* --- The User's Acquisition Widget --- */
.acquisitionswidget {
    position: relative;
    width: 100%;
    max-width: 1000px;
    height: 600px;
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 0;
    border: 1px solid rgba(212, 175, 55, 0.3);
    background: rgba(10, 19, 34, 0.8);
    backdrop-filter: blur(10px);
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
}

/* Left Panel: Info */
.info-panel {
    padding: 2rem;
    border-right: 1px solid rgba(212, 175, 55, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;
}

.info-header {
    margin-bottom: 2rem;
}

.item-type {
    font-family: var(--font-mono);
    color: var(--accent-cyan);
    font-size: 0.8rem;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    display: block;
}

.item-name {
    font-size: 2.5rem;
    line-height: 1;
    text-transform: uppercase;
    margin: 0;
    color: #fff;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.item-desc {
    color: var(--text-dim);
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    border-left: 2px solid var(--accent-gold);
    padding-left: 1rem;
}

/* Stats Bars */
.stat-row {
    margin-bottom: 1rem;
}
.stat-label {
    display: flex;
    justify-content: space-between;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--accent-gold);
    margin-bottom: 0.3rem;
}
.stat-track {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    position: relative;
}
.stat-fill {
    height: 100%;
    background: var(--accent-cyan);
    width: 0%;
    transition: width 1s cubic-bezier(0.22, 1, 0.36, 1);
    box-shadow: 0 0 10px var(--accent-cyan);
}

/* Right Panel: Visualizer */
.visualizer-panel {
    position: relative;
    background: radial-gradient(circle at center, #111b29 0%, #000 100%);
    overflow: hidden;
}

/* The SVG Frame (Top Banner) */
.top-banner-svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    pointer-events: none;
    z-index: 10;
}

/* The "Mid Display" SVG overlay from user */
.mid-display-svg {
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 200px;
    opacity: 0.5;
    pointer-events: none;
    z-index: 10;
}

/* 3D Canvas */
#item-canvas {
    width: 100%;
    height: 100%;
    display: block;
}

/* Controls */
.controls {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 1rem;
    display: flex;
    gap: 1px;
    background: rgba(0, 0, 0, 0.5);
}

.nav-btn {
    flex: 1;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--text-dim);
    padding: 1rem;
    cursor: pointer;
    font-family: var(--font-mono);
    text-transform: uppercase;
    transition: 0.3s;
}
.nav-btn:hover {
    background: rgba(212, 175, 55, 0.1);
    color: var(--accent-gold);
    border-color: var(--accent-gold);
}

/* Animation Classes */
.glitch-text {
    animation: glitch-anim 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
}
@keyframes glitch-anim {
    0% { transform: translate(0) }
    20% { transform: translate(-2px, 2px) }
    40% { transform: translate(-2px, -2px) }
    60% { transform: translate(2px, 2px) }
    80% { transform: translate(2px, -2px) }
    100% { transform: translate(0) }
}

.fade-in-up {
    animation: fadeInUp 0.5s forwards;
    opacity: 0;
    transform: translateY(10px);
}
@keyframes fadeInUp {
    to { opacity: 1; transform: translateY(0); }
}

@media(max-width: 900px) {
    .acquisitionswidget { grid-template-columns: 1fr; height: auto; }
    .visualizer-panel { height: 300px; order: -1; }
    .controls { position: relative; }
}
</style>
