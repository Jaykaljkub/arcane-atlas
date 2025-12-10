<template>
  <nav class="top-bar">
    <div class="brand" @click="toggleMenu">
      <div class="brand-icon"></div>
      MIDNIGHT WATCH
      <button class="menu-toggle">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
    </div>
    <ul class="nav-links uppercase mono" :class="{ 'is-open': isMenuOpen }">
      <li><router-link to="/" class="nav-item" active-class="active" @click="closeMenu">Command</router-link></li>
      <li><router-link to="/bestiary" class="nav-item" active-class="active" @click="closeMenu">Bestiary</router-link></li>
      <li><router-link to="/missions" class="nav-item" active-class="active" @click="closeMenu">Missions</router-link></li>
      <li><router-link to="/reliquary" class="nav-item" active-class="active" @click="closeMenu">Reliquary</router-link></li>
      <li><router-link to="/personnel" class="nav-item" active-class="active" @click="closeMenu">Personnel</router-link></li>
    </ul>
    <div class="mono text-gold desktop-only">SYS.ONLINE</div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
}
</script>

<style scoped>
/* Using existing styles from styles.css and adding mobile-specific logic */
@import '../assets/styles.css';

.menu-toggle {
  display: none; /* Hidden on desktop */
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.menu-toggle .bar {
  display: block;
  width: 25px;
  height: 3px;
  background-color: var(--text-light);
  margin: 5px 0;
  transition: 0.4s;
}

.desktop-only {
  display: block;
}

@media (max-width: 768px) {
  .top-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .brand {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
  }
  
  .menu-toggle {
    display: block; /* Show hamburger on mobile */
  }

  .nav-links {
    display: none; /* Hide links by default */
    flex-direction: column;
    width: 100%;
    background-color: rgba(10, 20, 30, 0.95);
    padding: 1rem 0;
  }

  .nav-links.is-open {
    display: flex; /* Show links when menu is open */
  }

  .nav-links li {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .nav-links li:last-child {
      border-bottom: none;
  }

  .desktop-only {
    display: none; /* Hide SYS.ONLINE on mobile nav bar*/
  }
}
</style>