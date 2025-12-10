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
        <header style="margin: 4rem 0 2rem;">
            <h1 style="font-size: 3rem; text-transform: uppercase; margin-bottom: 0.5rem;">Entity Index</h1>
            <p style="color: var(--text-dim); font-family: var(--font-mono);">> WARNING: Some entries require OMEGA clearance.</p>
        </header>

        <!-- Controls -->
        <div class="filter-bar">
            <input type="text" id="search" v-model="searchTerm" placeholder="SEARCH ENTITIES..." style="width: 300px;">
            <button id="omega-btn" @click="unlockOmega" style="margin-left: auto; background: transparent; border: 1px solid var(--accent-danger); color: var(--accent-danger); padding: 0.5rem 1rem; cursor: pointer; font-family: var(--font-mono);">UNLOCK OMEGA LEVEL</button>
        </div>

        <!-- Output Grid -->
        <div id="grid" class="entity-grid">
            <div v-if="loading" class="titan-card" style="display: flex; align-items: center; justify-content: center;">
                <span style="font-family: 'Fira Code'">LOADING DATABASE...</span>
            </div>
            <div v-else-if="error" class="titan-card" style="display: flex; align-items: center; justify-content: center;">
              <div style="color:red">FATAL ERROR: DATA CORRUPTION</div>
            </div>
            <div v-for="item in filteredEntities" :key="item.id" class="titan-card">
                 <div class="badge" :class="{ 'danger': item.threatLevel === 'Critical' || item.threatLevel === 'Existential', 'cyan': item.threatLevel !== 'Critical' && item.threatLevel !== 'Existential' }">THREAT: {{ item.threatLevel.toUpperCase() }}</div>
                    <h2 style="margin: 0 0 0.5rem; text-transform: uppercase;">{{ item.codename }}</h2>
                    <div style="font-family: 'Fira Code'; font-size: 0.8rem; color: var(--text-dim); margin-bottom: 1rem;">ID: {{ item.id }} // CAT: {{ item.category.toUpperCase() }}</div>
                    <p style="font-size: 0.9rem; line-height: 1.5;">{{ item.description }}</p>
                    <div style="margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 0.5rem; font-size: 0.7rem; color: var(--accent-gold); text-align: right;">
                        CLICK TO EXPAND >
                    </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const entities = ref([]);
const omegaUnlocked = ref(false);
const searchTerm = ref('');
const loading = ref(true);
const error = ref(false);

async function loadData() {
  try {
    const response = await fetch('/data/bestiary.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    entities.value = data;
  } catch (err) {
    console.error(err);
    error.value = true;
  } finally {
    loading.value = false;
  }
}

function unlockOmega() {
  if (omegaUnlocked.value) return;
  const pass = prompt("ENTER OMEGA CLEARANCE CODE:");
  if (pass && pass.toUpperCase() === 'OMEGA') {
    omegaUnlocked.value = true;
    const btn = document.getElementById('omega-btn');
    btn.textContent = "OMEGA UNLOCKED";
    btn.style.borderColor = "var(--accent-cyan)";
    btn.style.color = "var(--accent-cyan)";
    alert("RESTRICTED FILES DECRYPTED.");
  } else {
    alert("ACCESS DENIED. INCIDENT LOGGED.");
  }
}

const filteredEntities = computed(() => {
  return entities.value.filter(item => {
    const isRestricted = item.restricted && !omegaUnlocked.value;
    const matchesSearch = item.codename.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchTerm.value.toLowerCase());
    return !isRestricted && matchesSearch;
  });
});

onMounted(loadData);
</script>

<style scoped>
@import '../assets/styles.css';

/* Grid & Cards */
.entity-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.titan-card:hover {
    border-color: var(--accent-cyan);
    transform: translateY(-5px);
}

/* Utilities */
.badge {
    display: inline-block;
    font-size: 0.7rem;
    padding: 2px 6px;
    border: 1px solid var(--text-dim);
    margin-bottom: 1rem;
    text-transform: uppercase;
    font-family: var(--font-mono);
}

.badge.danger {
    color: var(--accent-danger);
    border-color: var(--accent-danger);
}

.badge.cyan {
    color: var(--accent-cyan);
    border-color: var(--accent-cyan);
}

/* Filter Bar */
.filter-bar {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

input {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid var(--text-dim);
    color: #fff;
    padding: 0.5rem;
    font-family: var(--font-mono);
}

/* Glitch for Locked Items */
.locked {
    filter: blur(4px);
    pointer-events: none;
    opacity: 0.5;
}

.redacted-bar {
    background: currentColor;
}
</style>
