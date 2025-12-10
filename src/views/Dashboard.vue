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
        <li><router-link to="/missions" class="nav-item" active-class="active">Missions</router-link></li>
        <li><router-link to="/reliquary" class="nav-item" active-class="active">Reliquary</router-link></li>
        <li><router-link to="/personnel" class="nav-item" active-class="active">Personnel</router-link></li>
      </ul>
      <div class="mono text-gold">SYS.ONLINE</div>
    </nav>

    <div class="dashboard-grid">
        
        <!-- LEFT: DATA STREAM -->
        <div class="panel" style="grid-row: span 2;">
            <div class="panel-title uppercase">Encrypted Feed</div>
            <div class="hex-stream" id="hex-container">
                <!-- JS will populate this -->
            </div>
        </div>

        <!-- CENTER TOP: VISUALIZERS -->
        <div class="panel">
            <div class="panel-title uppercase">Spectral Analysis</div>
            
            <!-- USER PROVIDED SVG COMPONENT -->
            <div class="signal-scope-wrapper">
                <svg class="signal-scope-svg" viewBox="0 0 296 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <!-- Outer Frame -->
                    <path d="M285 1H11C5.47715 1 1 5.47715 1 11V109C1 114.523 5.47716 119 11 119H285C290.523 119 295 114.523 295 109V11C295 5.47715 290.523 1 285 1Z" stroke="#B9943D" stroke-width="0.25"></path>
                    
                    <!-- Inner Data Bars (Target for Animation) -->
                    <g opacity="0.5">
                         <!-- Truncated paths for brevity in preview, but in real code, paste full SVG content here -->
                         <!-- I have used a simplified path here to represent the complex data for the preview, 
                              Replace this <path> with the giant <g> block from your prompt for the full effect -->
                         <path d="M10 60 H290" stroke="#B9943D" stroke-width="2" stroke-dasharray="4 2" />
                         <path d="M20 30 V90 M30 40 V80 M40 20 V100 M50 35 V85 M60 45 V75 M70 25 V95 M80 30 V90 M90 40 V80 M100 20 V100 M110 35 V85 M120 45 V75 M130 25 V95 M140 30 V90 M150 40 V80 M160 20 V100 M170 35 V85 M180 45 V75 M190 25 V95 M200 30 V90 M210 40 V80 M220 20 V100 M230 35 V85 M240 45 V75 M250 25 V95 M260 30 V90 M270 40 V80" stroke="#B9943D" stroke-width="2" stroke-linecap="round" />
                    </g>
                </svg>
            </div>

            <!-- Live Canvas Waveform -->
            <div class="waveform-container">
                <div class="grid-overlay"></div>
                <canvas id="waveCanvas"></canvas>
            </div>
            <div class="mono" style="display:flex; justify-content:space-between; margin-top:0.5rem; color: var(--text-dim);">
                <span>FREQ: <span id="freq-val" class="text-gold">142.9</span> MHz</span>
                <span>GAIN: <span class="text-cyan">+12dB</span></span>
            </div>
        </div>

        <!-- RIGHT: STATUS -->
        <div class="panel" style="grid-row: span 2;">
            <div class="panel-title uppercase">Active Assets</div>
            <div id="assets-list">
                <div class="status-card">
                    <div>
                        <div class="text-light">AGENT GRAVES</div>
                        <div class="text-dim" style="font-size:0.7rem;">SECTOR 4 // RECON</div>
                    </div>
                    <div class="status-indicator active"></div>
                </div>
                <div class="status-card">
                    <div>
                        <div class="text-light">KEEPER VANCE</div>
                        <div class="text-dim" style="font-size:0.7rem;">ARCHIVES // RESEARCH</div>
                    </div>
                    <div class="status-indicator warning"></div>
                </div>
                <div class="status-card">
                    <div>
                        <div class="text-light">TEAM ECHO</div>
                        <div class="text-dim" style="font-size:0.7rem;">FIELD OPS // COMBAT</div>
                    </div>
                    <div class="status-indicator danger"></div>
                </div>
                 <div class="status-card">
                    <div>
                        <div class="text-light">DR. SATO</div>
                        <div class="text-dim" style="font-size:0.7rem;">MEDBAY // SURGERY</div>
                    </div>
                    <div class="status-indicator active"></div>
                </div>
            </div>
            
            <div style="margin-top: auto; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
                <div class="panel-title uppercase" style="font-size: 0.8rem;">Threat Meter</div>
                <div style="height: 4px; width: 100%; background: #333; margin-bottom: 0.5rem; position:relative;">
                    <div style="height: 100%; width: 65%; background: linear-gradient(90deg, var(--accent-cyan), var(--accent-danger)); position: relative;">
                        <div style="position: absolute; right: 0; top: -4px; width: 2px; height: 12px; background: #fff;"></div>
                    </div>
                </div>
                <div class="mono text-danger blink" style="text-align: right;">ELEVATED</div>
            </div>
        </div>

        <!-- CENTER BOTTOM: LOGS -->
        <div class="panel">
            <div class="panel-title uppercase">System Logs</div>
            <div class="mono text-dim" style="overflow: hidden;" id="sys-log">
                > [14:00:22] Connection established.<br>
                > [14:00:24] Handshake verified. Protocol Omega.<br>
                > [14:00:45] <span class="text-gold">WARNING:</span> Spectral spike detected in Grid 9.<br>
                > [14:01:02] Rerouting power to containment shields...
            </div>
        </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
    /* =============================
       1. Hex Stream Logic
       ============================= */
    const hexContainer = document.getElementById('hex-container');
    const hexChars = '0123456789ABCDEF';
    
    function generateHexLine() {
        let line = '';
        for(let i=0; i<8; i++) {
            line += hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)] + ' ';
        }
        const div = document.createElement('div');
        div.className = 'hex-line';
        div.innerHTML = `<span>0x${Math.floor(Math.random()*999)}</span> <span>${line}</span>`;
        
        hexContainer.prepend(div);
        
        if(hexContainer.children.length > 20) {
            hexContainer.removeChild(hexContainer.lastChild);
        }
    }
    setInterval(generateHexLine, 150);

    /* =============================
       2. Canvas Waveform Logic
       ============================= */
    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    
    function resize() {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    let offset = 0;
    function drawWave() {
        ctx.clearRect(0, 0, width, height);
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00f3ff';
        ctx.beginPath();
        
        const amplitude = height / 4;
        const frequency = 0.05;
        
        for (let x = 0; x < width; x++) {
            // Multiple sine waves for "noise" look
            const y = height / 2 + 
                      Math.sin(x * frequency + offset) * amplitude * Math.sin(offset * 0.1) +
                      Math.sin(x * 0.1 + offset * 2) * (amplitude / 2);
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Second line (Ghost)
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
        ctx.beginPath();
        for (let x = 0; x < width; x+=2) {
            const y = height / 2 + 
                      Math.sin(x * 0.02 - offset) * (amplitude * 0.8);
            ctx.lineTo(x, y);
        }
        ctx.stroke();

        offset += 0.2;
        
        // Update text randomly
        if(Math.random() > 0.95) {
            document.getElementById('freq-val').innerText = (100 + Math.random() * 50).toFixed(1);
        }
        
        requestAnimationFrame(drawWave);
    }
    drawWave();

    /* =============================
       3. Log Updater
       ============================= */
    const sysLog = document.getElementById('sys-log');
    const messages = [
        "Scanning frequency band...",
        "Packet loss detected in Sector 7.",
        "Decrypting transmission...",
        "Entity movement tracking: STABLE.",
        "Artifact resonance increasing.",
        "Upload complete."
    ];

    setInterval(() => {
        const msg = messages[Math.floor(Math.random() * messages.length)];
        const time = new Date().toLocaleTimeString();
        const div = document.createElement('div');
        div.innerHTML = `> [${time}] ${msg}`;
        sysLog.appendChild(div);
        sysLog.scrollTop = sysLog.scrollHeight;
    }, 3000);
});
</script>

<style scoped>
@import '../assets/styles.css';

/* Utility */
.mono { font-family: var(--font-mono); font-size: 0.8rem; letter-spacing: 0px; }
.uppercase { text-transform: uppercase; letter-spacing: 2px; }
.text-gold { color: var(--accent-gold); }
.text-cyan { color: var(--accent-cyan); }
.blink { animation: blink 1s infinite; }

@keyframes blink { 50% { opacity: 0; } }

/* Header */
header {
    padding: 1rem 2rem;
    border-bottom: 1px solid rgba(212, 175, 55, 0.3);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(10, 19, 34, 0.95);
}

/* Layout */
.dashboard-grid {
    display: grid;
    grid-template-columns: 300px 1fr 300px;
    grid-template-rows: 1fr 250px;
    gap: 1rem;
    padding: 1rem;
    height: calc(100vh - 70px);
}

.panel {
    background: var(--bg-panel);
    border: 1px solid rgba(212, 175, 55, 0.15);
    padding: 1rem;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* Panel Decoration */
.panel::before {
    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent-gold), transparent);
    opacity: 0.5;
}
.panel-title {
    font-size: 0.9rem;
    color: var(--accent-gold);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.panel-title::before {
    content: ''; display: block; width: 6px; height: 6px; background: var(--accent-gold); transform: rotate(45deg);
}

/* --- COMPONENT 1: The User's SVG (Signal Scope) --- */
.signal-scope-wrapper {
    position: relative;
    width: 100%;
    margin-bottom: 1rem;
    filter: drop-shadow(0 0 5px var(--accent-gold-dim));
}

/* SVG Styles */
.signal-scope-svg {
    width: 100%;
    height: auto;
    display: block;
}

/* Animate the inner bars of the SVG */
.signal-scope-svg g[opacity="0.5"] {
    animation: signalFlux 2s infinite alternate ease-in-out;
}

/* Add a scanline overlay */
.signal-scope-wrapper::after {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.1) 50%, transparent 100%);
    animation: scanHorizontal 3s infinite linear;
    pointer-events: none;
}

@keyframes signalFlux {
    0% { opacity: 0.3; }
    100% { opacity: 0.8; }
}
@keyframes scanHorizontal {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}


/* --- COMPONENT 2: Hex Stream --- */
.hex-stream {
    font-family: 'Fira Code', monospace;
    font-size: 0.7rem;
    color: var(--text-dim);
    overflow: hidden;
    height: 100%;
    position: relative;
    mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
}
.hex-line {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2px;
}
.hex-line span:first-child { color: var(--accent-gold); opacity: 0.7; }


/* --- COMPONENT 3: Live Waveform (Canvas) --- */
.waveform-container {
    flex: 1;
    position: relative;
    border: 1px solid rgba(0, 243, 255, 0.1);
    background: rgba(0,0,0,0.2);
}
canvas { width: 100%; height: 100%; display: block; }

/* Overlay Grid */
.grid-overlay {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background-image: 
        linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
}


/* --- COMPONENT 4: Entity Status Cards --- */
.status-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.8rem;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    font-family: var(--font-mono);
    font-size: 0.8rem;
}
.status-card:last-child { border-bottom: none; }

.status-indicator {
    width: 8px; height: 8px; border-radius: 50%;
    background: #333;
}
.status-indicator.active { background: var(--accent-cyan); box-shadow: 0 0 5px var(--accent-cyan); }
.status-indicator.warning { background: var(--accent-gold); box-shadow: 0 0 5px var(--accent-gold); }
.status-indicator.danger { background: var(--accent-danger); box-shadow: 0 0 5px var(--accent-danger); animation: blink 0.5s infinite; }


/* Responsiveness */
@media (max-width: 1024px) {
    .dashboard-grid {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
        height: auto;
        overflow-y: auto;
    }
}
</style>
