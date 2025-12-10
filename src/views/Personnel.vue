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

        <div class="container">
            
            <!-- Header / Logo -->
            <div class="header-section">
                <!-- THE USER PROVIDED SVG -->
                <div class="department-logo">
                    <svg viewBox="110 25 180 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="110" y="30" width="100" height="2" fill="#B9943D" opacity="0.5" />
                        <rect x="110" y="35" width="80" height="2" fill="#B9943D" opacity="0.3" />
                        <text x="110" y="60" fill="#B9943D" font-family="monospace" font-size="14" letter-spacing="2">PERSONNEL RECORDS</text>
                        <text x="110" y="75" fill="#B9943D" font-family="monospace" font-size="8" opacity="0.7">RESTRICTED ACCESS // EYES ONLY</text>
                    </svg>
                </div>
                <h1 style="font-size: 2.5rem; text-transform: uppercase; margin: 0;">Operative Dossier Builder</h1>
                <p class="mono text-dim">Create or update personnel files. Submit for encryption.</p>
            </div>

            <div class="builder-grid">
                
                <!-- LEFT: FORM -->
                <div class="panel">
                    <div class="input-group">
                        <label>CODENAME</label>
                        <input type="text" id="input-codename" v-model="codename">
                    </div>

                    <div class="input-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div>
                            <label>REAL NAME</label>
                            <input type="text" id="input-name" v-model="realName">
                        </div>
                        <div>
                            <label>CLEARANCE LEVEL</label>
                            <select id="input-clearance" v-model="clearance">
                                <option value="LEVEL 1">LEVEL 1</option>
                                <option value="LEVEL 2">LEVEL 2</option>
                                <option value="LEVEL 3">LEVEL 3</option>
                                <option value="LEVEL 4">LEVEL 4</option>
                                <option value="OMEGA">OMEGA</option>
                            </select>
                        </div>
                    </div>

                    <div class="input-group">
                        <label>DEPARTMENT</label>
                        <select id="input-dept" v-model="department">
                            <option value="FIELD OPERATIONS">FIELD OPERATIONS</option>
                            <option value="ARCHIVES & RESEARCH">ARCHIVES & RESEARCH</option>
                            <option value="CONTAINMENT">CONTAINMENT</option>
                            <option value="PSY-OPS">PSY-OPS</option>
                            <option value="INTERNAL AFFAIRS">INTERNAL AFFAIRS</option>
                        </select>
                    </div>

                    <div class="input-group">
                        <label>STATUS</label>
                        <select id="input-status" v-model="status">
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="M.I.A.">M.I.A.</option>
                            <option value="K.I.A.">K.I.A.</option>
                            <option value="RETIRED">RETIRED</option>
                        </select>
                    </div>

                    <div class="input-group">
                        <label>SERVICE RECORD / NOTES</label>
                        <textarea id="input-bio" rows="4" v-model="bio"></textarea>
                    </div>
                </div>

                <!-- RIGHT: PREVIEW -->
                <div class="id-card-container">
                    <div class="id-card" id="id-card">
                        <div class="holo-overlay"></div>
                        
                        <!-- Photo Column -->
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <div class="card-photo">
                                <i class="fa-solid fa-user-secret"></i>
                            </div>
                            <div style="text-align: center;">
                                <div class="mono" style="font-size: 0.5rem; color: var(--accent-gold);">CLEARANCE</div>
                                <div class="card-title" id="card-clearance" style="font-size: 1rem; color: var(--accent-cyan);">{{clearance}}</div>
                            </div>
                        </div>

                        <!-- Info Column -->
                        <div style="display: flex; flex-direction: column;">
                            <div class="card-header">
                                <div>
                                    <div class="card-title" id="card-codename">{{codename}}</div>
                                    <div class="card-rank" id="card-dept">{{department}}</div>
                                </div>
                                <i class="fa-solid fa-shield-halved text-gold" style="font-size: 1.5rem;"></i>
                            </div>

                            <div class="card-details">
                                ID: <span id="card-id">{{id}}</span><br>
                                NAME: <span id="card-realname">{{realName}}</span><br>
                                STATUS: <span id="card-status" style="color: var(--accent-gold);">{{status}}</span><br>
                                <br>
                                <div id="card-bio" style="height: 50px; overflow: hidden; text-overflow: ellipsis;">
                                    {{bio}}
                                </div>
                            </div>

                            <div class="card-footer">
                                <div class="barcode"></div>
                                <div>AUTH: VALID</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const codename = ref('AGENT GHOST');
const realName = ref('[REDACTED]');
const clearance = ref('LEVEL 1');
const department = ref('FIELD OPERATIONS');
const status = ref('ACTIVE');
const bio = ref('Specializes in spectral containment. Last sighting: Sector 7 during the Blackout Event.');
const id = ref('');

function generateID() {
    const num = Math.floor(Math.random() * 9000) + 1000;
    return `MW-${num}-X`;
}

onMounted(() => {
    id.value = generateID();

    const cardContainer = document.querySelector('.id-card-container');
    const card = document.querySelector('.id-card');

    cardContainer.addEventListener('mousemove', (e) => {
        const rect = cardContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (centerY - y) / 20;
        const rotateY = (x - centerX) / 20;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    cardContainer.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0) rotateY(0)';
    });
});

watch(status, (newStatus) => {
    const card = document.getElementById('id-card');
    const cardStatus = document.getElementById('card-status');
    const cardClearance = document.getElementById('card-clearance');

    if (newStatus === 'K.I.A.') {
        card.style.borderColor = 'var(--accent-danger)';
        cardStatus.style.color = 'var(--accent-danger)';
        cardClearance.style.color = 'var(--accent-danger)';
    } else {
        card.style.borderColor = 'var(--text-dim)';
        cardStatus.style.color = 'var(--accent-gold)';
        cardClearance.style.color = 'var(--accent-cyan)';
    }
});
</script>

<style scoped>
.text-dim {
    color: var(--text-dim);
}

.mono {
    font-family: var(--font-mono);
}
/* --- Layout --- */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    width: 100%;
}
.header-section {
    text-align: center;
    margin-bottom: 3rem;
}
/* The Provided SVG Container */
.department-logo {
    width: 100%;
    max-width: 300px;
    margin: 0 auto 1rem;
    display: block;
}
/* Grid for Builder */
.builder-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: start;
}
/* --- Form Styling --- */
.panel {
    background: var(--bg-panel);
    border: 1px solid rgba(212, 175, 55, 0.2);
    padding: 2rem;
    position: relative;
}
.panel::after {
    content: ''; position: absolute; bottom: 0; right: 0; 
    width: 20px; height: 20px; 
    border-bottom: 2px solid var(--accent-gold); 
    border-right: 2px solid var(--accent-gold);
}
.input-group { margin-bottom: 1.5rem; }
label {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--accent-gold);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}
input, select, textarea {
    width: 100%;
    background: rgba(0,0,0,0.3);
    border: 1px solid var(--text-dim);
    color: #fff;
    padding: 0.8rem;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    transition: 0.3s;
}
input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: var(--accent-cyan);
    box-shadow: 0 0 10px rgba(0, 243, 255, 0.1);
}
/* --- ID Card Preview --- */
.id-card-container {
    perspective: 1000px;
    display: flex;
    justify-content: center;
}
.id-card {
    width: 400px;
    height: 250px;
    background: linear-gradient(135deg, #0a1322 0%, #02050a 100%);
    border: 1px solid var(--text-dim);
    border-left: 4px solid var(--accent-cyan);
    position: relative;
    padding: 1.5rem;
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 1.5rem;
    box-shadow: 0 0 30px rgba(0,0,0,0.5);
    overflow: hidden;
    transition: transform 0.3s ease;
}
.id-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 243, 255, 0.03) 2px,
        rgba(0, 243, 255, 0.03) 4px
    );
    pointer-events: none;
}
/* Holographic Shine */
.holo-overlay {
    position: absolute;
    top: -50%; left: -50%; width: 200%; height: 200%;
    background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%);
    transform: rotate(30deg);
    pointer-events: none;
    mix-blend-mode: overlay;
}
.card-photo {
    width: 100px;
    height: 100px;
    background: #111;
    border: 1px solid var(--accent-cyan);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}
.card-photo i { font-size: 3rem; color: #333; }
.card-photo img { width: 100%; height: 100%; object-fit: cover; }
.card-header {
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}
.card-title { font-size: 1.2rem; font-weight: 700; text-transform: uppercase; line-height: 1; }
.card-rank { font-family: var(--font-mono); font-size: 0.7rem; color: var(--accent-gold); }
.card-details { font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-dim); line-height: 1.6; }
.card-details span { color: #fff; }
.card-footer {
    grid-column: span 2;
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-family: var(--font-mono);
    font-size: 0.6rem;
    color: var(--accent-cyan);
}
.barcode {
    height: 20px;
    width: 100px;
    background: repeating-linear-gradient(90deg, #fff, #fff 2px, transparent 2px, transparent 4px);
}
@media(max-width: 900px) {
    .builder-grid { grid-template-columns: 1fr; }
    .id-card { width: 100%; max-width: 400px; }
}
.top-bar {
    position: sticky;
    top: 0;
    width: 100%;
    padding: 1rem 2rem;
    background: rgba(5, 10, 20, 0.95);
    border-bottom: 1px solid rgba(212, 175, 55, 0.3);
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    backdrop-filter: blur(10px);
}
.brand { 
    font-weight: 700; 
    letter-spacing: 2px; 
    font-size: 1.2rem; 
}
.nav-links { 
    display: flex; 
    gap: 20px; 
    font-family: var(--font-mono); 
    font-size: 0.8rem; 
}
.nav-links a { 
    color: var(--text-dim); 
    text-decoration: none; 
    transition: 0.3s; 
    text-transform: uppercase; 
}
.nav-links a:hover { 
    color: var(--accent-gold); 
}
.nav-links .active {
    color: var(--accent-cyan);
}
.uppercase {
    text-transform: uppercase;
}
</style>