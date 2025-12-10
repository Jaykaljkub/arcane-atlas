<template>
    <div>
        <div id="globeViz"></div>
        
        <div class="instructions">
            > CLICK POINTS FOR INTEL
        </div>
        
        <div class="controls">
            <button class="control-btn" @click="toggleRotation">Toggle Rotation</button>
            <button class="control-btn" @click="exitToMain">Exit to Main</button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import Globe from 'globe.gl';

const router = useRouter();

let world;
let autoRotate = true;

const exitToMain = () => {
  router.push('/');
};

const toggleRotation = () => {
    autoRotate = !autoRotate;
    if(world) world.controls().autoRotate = autoRotate;
};

function handleMissionClick(mission) {
    world.controls().autoRotate = false;
    autoRotate = false;
    world.pointOfView({ lat: mission.lat, lng: mission.lng, altitude: 1.5 }, 1000);
    
    closeAllMarkers();
    const marker = document.getElementById(`marker-${mission.id}`);
    if (marker) marker.classList.add('visible');
    document.querySelector('.instructions').style.display = 'none';
}

function closeAllMarkers() {
    document.querySelectorAll('.mission-marker').forEach(el => {
        el.classList.remove('visible');
    });
    document.querySelector('.instructions').style.display = 'block';
};

onMounted(async () => {
    const GLOBE_IMAGE_URL = 'https://unpkg.com/three-globe/example/img/earth-dark.jpg';
    const BACKGROUND_COLOR = '#050a14'; 
    const ATMOSPHERE_COLOR = '#b9943d'; 
    
    const TYPE_CONFIG = {
        'Mission':   { color: '#00f3ff', icon: 'fa-crosshairs' },
        'Alert':     { color: '#ff2a2a', icon: 'fa-triangle-exclamation' },
        'HQ':        { color: '#d4af37', icon: 'fa-shield-halved' },
        'Safehouse': { color: '#00ff9d', icon: 'fa-house-lock' } 
    };

    const DEFAULT_CONFIG = { color: '#ffffff', icon: 'fa-circle' };
    
    let missions = [];
    try {
        const res = await fetch('data/missions.json');
        if(!res.ok) throw new Error('No missions found');
        missions = await res.json();
    } catch (e) {
        console.warn("Using fallback data:", e);
        missions = [
            { id: "HQ-01", type: "HQ", codename: "Midnight Prime", location: "London", lat: 51.5074, lng: -0.1278, threat: "None", status: "Secure" },
            { id: "A-01", type: "Alert", codename: "Spectral Spike", location: "Cairo", lat: 30.0444, lng: 31.2357, threat: "High", status: "Active" },
            { id: "M-99", type: "Mission", codename: "Neon Rain", location: "Tokyo", lat: 35.6762, lng: 139.6503, threat: "Moderate", status: "Active" }
        ];
    }

    const getConfig = (type) => TYPE_CONFIG[type] || DEFAULT_CONFIG;

    const ringsData = missions.map(m => {
        const conf = getConfig(m.type);
        return {
            lat: m.lat,
            lng: m.lng,
            maxR: m.type === 'Alert' ? 15 : 8,
            propagationSpeed: m.type === 'Alert' ? 4 : 1,
            repeatPeriod: 1500,
            color: () => conf.color
        };
    });

    const globeDiv = document.getElementById('globeViz');
    
    world = Globe()(globeDiv)
        .globeImageUrl(GLOBE_IMAGE_URL)
        .backgroundColor(BACKGROUND_COLOR)
        .atmosphereColor(ATMOSPHERE_COLOR)
        .atmosphereAltitude(0.15)
        .showGraticules(true)
        .ringsData(ringsData)
        .ringColor(d => d.color)
        .ringMaxRadius('maxR')
        .ringPropagationSpeed('propagationSpeed')
        .ringRepeatPeriod('repeatPeriod')
        .pointsData(missions)
        .pointColor(d => getConfig(d.type).color)
        .pointAltitude(0)
        .pointRadius(0.6)
        .onPointClick(handleMissionClick)
        .htmlElementsData(missions)
        .htmlElement(d => {
            const conf = getConfig(d.type);
            const el = document.createElement('div');
            el.id = `marker-${d.id}`;
            el.className = 'mission-marker';
            el.style.borderColor = conf.color;
            el.style.color = '#e6f1ff'; 

            el.innerHTML = `
                <div class="mission-header" style="color:${conf.color}">
                    <div style="display:flex; align-items:center;">
                        <i class="${conf.icon} header-icon"></i>
                        <span>${d.type.toUpperCase()}</span>
                    </div>
                    <span>${d.id}</span>
                </div>
                <div class="mission-title">${d.codename}</div>
                <div class="mission-desc">${d.summary || 'No details available.'}</div>
                <div class="mission-meta" style="color:${conf.color}">
                    <span>${d.location ? d.location.split(',')[0] : 'UNK'}</span>
                    <span>${d.status}</span>
                </div>
                <i class="fa-solid fa-xmark close-hint"></i>
            `;
            el.style.borderTopColor = conf.color; 
            el.querySelector('.close-hint').addEventListener('click', (e) => {
                e.stopPropagation();
                closeAllMarkers();
            });
            return el;
        })
        .onGlobeClick(closeAllMarkers)
        .width(window.innerWidth)
        .height(window.innerHeight);

    world.pointOfView({ lat: 20, lng: 0, altitude: 2.5 });
    world.controls().autoRotate = true;
    world.controls().autoRotateSpeed = 0.5;

    const hq = missions.find(m => m.type === 'HQ');
    let arcsData = [];
    
    if(hq) {
        arcsData = missions
            .filter(m => m.id !== hq.id)
            .map(m => ({
                startLat: hq.lat,
                startLng: hq.lng,
                endLat: m.lat,
                endLng: m.lng,
                color: [getConfig('HQ').color, getConfig(m.type).color]
            }));
    }

    world
        .arcsData(arcsData)
        .arcColor('color')
        .arcDashLength(0.4)
        .arcDashGap(0.2)
        .arcDashAnimateTime(2000)
        .arcStroke(0.5);

    const resizeHandler = () => {
        world.width(window.innerWidth);
        world.height(window.innerHeight);
    };
    window.addEventListener('resize', resizeHandler);

    onBeforeUnmount(() => {
        window.removeEventListener('resize', resizeHandler);
    });
});
</script>

<style>
    .mission-marker {
        position: absolute;
        background: rgba(5, 10, 20, 0.95);
        border: 1px solid var(--accent-gold);
        padding: 12px;
        border-radius: 2px;
        transform: translate(-50%, -130%);
        pointer-events: auto; /* Ensures you can click buttons inside the marker */
        width: 260px;
        box-shadow: 0 0 20px rgba(0,0,0,0.8);
        font-family: var(--font-display);
        
        /* Hiding logic */
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s, transform 0.3s, visibility 0.3s;
        z-index: 10; /* Ensure it sits above the canvas */
    }
    
    .mission-marker.visible {
        visibility: visible;
        opacity: 1;
        transform: translate(-50%, -130%);
    }
    
    .mission-marker::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 10px solid;
        border-top-color: inherit;
    }
    
    .mission-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        padding-bottom: 8px;
        margin-bottom: 8px;
        font-size: 0.7rem;
        font-family: var(--font-mono);
        letter-spacing: 1px;
    }
    
    .header-icon { font-size: 1rem; margin-right: 8px; }
    
    .mission-title {
        font-weight: 700;
        text-transform: uppercase;
        font-size: 1.1rem;
        line-height: 1;
        margin-bottom: 6px;
        color: #fff;
    }
    
    .mission-desc {
        font-size: 0.85rem;
        color: var(--text-dim);
        line-height: 1.4;
        margin-bottom: 10px;
    }
    
    .mission-meta {
        font-size: 0.75rem;
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 1px;
        display: flex;
        justify-content: space-between;
    }
    
    .close-hint {
        position: absolute;
        top: 12px;
        right: 12px;
        font-size: 0.8rem;
        color: var(--text-dim);
        cursor: pointer;
    }
    .close-hint:hover { color: #fff; }
    </style>
    
    <style scoped>
    @import '../assets/styles.css';
    
    body {
        margin: 0;
        overflow: hidden;
    }
    
    .top-bar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 100;
    }
    
    .controls {
        position: absolute;
        bottom: 2rem;
        right: 2rem;
        z-index: 10;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .control-btn {
        background: rgba(0,0,0,0.6);
        border: 1px solid var(--text-dim);
        color: var(--text-light);
        padding: 0.5rem 1rem;
        cursor: pointer;
        font-family: var(--font-mono);
        text-transform: uppercase;
        transition: 0.3s;
    }
    
    .control-btn:hover {
        border-color: var(--accent-cyan);
        color: var(--accent-cyan);
        background: rgba(0, 243, 255, 0.1);
    }
    
    .instructions {
        position: absolute;
        bottom: 2rem;
        left: 2rem;
        font-family: var(--font-mono);
        color: var(--accent-gold);
        font-size: 0.8rem;
        background: rgba(0,0,0,0.5);
        padding: 0.5rem;
        border-left: 2px solid var(--accent-gold);
        pointer-events: none;
    }
    </style>