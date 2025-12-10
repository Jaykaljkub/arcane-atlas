<template>
  <section id="hero">
    <canvas id="hero-canvas"></canvas>
    <div class="container hero-content">
      <div class="label-tag text-cyan">SECURE TRANSMISSION // LVL 5</div>
      <h1 class="hero-title">The Night Sees Everything.</h1>
      <p class="hero-sub mono">> In the darkness, we watch. In the silence, we act. Protocol 77-Omega is in effect.</p>
      <a href="#access" class="btn btn-gold" @click="showLoginModal = true">Access Secure Channel</a>
    </div>
  </section>

  <div v-if="showLoginModal" class="modal-overlay" @click.self="showLoginModal = false">
    <div class="titan-card" id="login-card">
      <h3 class="uppercase text-cyan" style="margin-bottom: 1.5rem;">Operative Login</h3>
      <div class="input-group">
        <div class="label-tag">CODENAME</div>
        <input type="text" v-model="codename" placeholder="ENTER CALLSIGN">
      </div>
      <div class="input-group">
        <div class="label-tag">PASSPHRASE</div>
        <input type="password" v-model="passphrase" @keyup.enter="handleLogin" placeholder="ENTER CLEARANCE PHRASE">
      </div>
      <button @click="handleLogin" class="btn" style="width: 100%; margin-top: 1rem;">AUTHENTICATE</button>
      <div class="mono" style="margin-top: 1rem; height: 1.5rem;" :class="loginMessageColor">{{ loginMessage }}</div>
    </div>
  </div>

  <section class="section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">The Directive</h2>
        <span class="mono text-dim">EST. 1982 // CLASSIFIED</span>
      </div>
      <div class="directive-grid">
        <div class="reveal-text">
          <p class="text-light" style="font-size: 1.2rem; margin-bottom: 1.5rem;">
            Humanity exists in a fragile bubble of ignorance. Outside that bubble, in the chaotic void, entities of impossible geometry and ancient hunger wait.
          </p>
          <p class="text-dim">
            Midnight Watch is the shield. We are the thin line of static between the signal and the noise. We categorize the unexplained, contain the unstoppable, and erase the evidence.
          </p>
        </div>
        <div class="titan-card">
          <div class="label-tag">CURRENT THREAT LEVEL</div>
          <h3 class="text-danger" style="font-size: 4rem; line-height: 1;">MIDNIGHT</h3>
          <p class="mono text-dim" style="margin-top: 1rem;">
            > SECTOR 4: ACTIVE<br>
            > SECTOR 7: SILENT<br>
            > SECTOR 9: COMPROMISED
          </p>
        </div>
      </div>
    </div>
  </section>

  <section id="access" class="section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Recruitment Protocol</h2>
      </div>

      <div class="access-grid">
        <div class="titan-card">
          <div class="label-tag text-gold">LATEST INTEL</div>
          <ul class="mono" style="margin-top: 1rem;">
            <li style="padding: 1rem 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <span class="text-cyan">[NEW]</span> CASE 402: The Echo in the Metro
              <br><span class="text-dim">Status: UNRESOLVED</span>
            </li>
            <li style="padding: 1rem 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <span classs="text-gold">[UPD]</span> ARTIFACT 09: The Weeping Mirror
              <br><span class="text-dim">Status: SECURED</span>
            </li>
            <li style="padding: 1rem 0;">
              <span class="text-dim">[ARC]</span> ENTITY 77: "The Pale Walker"
              <br><span class="text-dim">Status: TERMINATED</span>
            </li>
          </ul>
        </div>
        
        <div class="titan-card" id="signup-card">
            <h3 class="uppercase text-gold" style="margin-bottom: 1.5rem;">Enlistment</h3>
            <div class="input-group">
              <div class="label-tag">CODENAME</div>
              <input type="text" id="signup-codename" placeholder="CHOOSE YOUR CALLSIGN">
            </div>
            <div class="input-group">
              <div class="label-tag">PASSPHRASE</div>
              <input type="password" id="signup-passphrase" placeholder="CREATE A SECURE PHRASE">
            </div>
            <div class="input-group">
              <div class="label-tag">CONFIRM PASSPHRASE</div>
              <input type="password" id="signup-confirm" placeholder="REPEAT YOUR SECURE PHRASE">
            </div>
            <button id="signup-btn" class="btn btn-secondary" style="width: 100%; margin-top: 1rem;">REGISTER</button>
            <div id="signup-msg" class="mono" style="margin-top: 1rem; height: 1.5rem; color: var(--accent-danger);"></div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container" style="text-align: center; max-width: 600px;">
      <h2 class="section-title" style="display: inline-block; border: none; padding: 0;">Make Contact</h2>
      <p class="text-dim mono" style="margin: 1rem 0 2rem;">Secure channels are open for 04:00 mins.</p>
      
      <div class="titan-card" style="text-align: left;">
        <div class="input-group">
          <div class="label-tag">FREQUENCY (EMAIL)</div>
          <input type="text" placeholder="ENCRYPTED FREQUENCY">
        </div>
        <div class="input-group">
          <div class="label-tag">INTEL</div>
          <textarea rows="4" placeholder="TRANSMIT DATA..."></textarea>
        </div>
        <button class="btn btn-gold" style="width: 100%;">TRANSMIT</button>
      </div>
    </div>
  </section>

  <footer>
    <div class="container mono text-dim" style="font-size: 0.7rem;">
      <p>MIDNIGHT WATCH INTRANET // PROPERTY OF [REDACTED]</p>
      <p>UNAUTHORIZED ACCESS IS A TERMINAL OFFENSE.</p>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import * as THREE from 'three';

const router = useRouter();

const showLoginModal = ref(false);
const codename = ref('');
const passphrase = ref('');
const loginMessage = ref('');
const loginStatus = ref(''); // 'success' or 'error'

const loginMessageColor = computed(() => {
  if (loginStatus.value === 'success') {
    return 'text-cyan';
  } else if (loginStatus.value === 'error') {
    return 'text-danger';
  }
  return '';
});

const handleLogin = () => {
  if (passphrase.value.toUpperCase().trim() === 'SPECTRAL-ACCESS') {
    loginMessage.value = '> IDENTITY CONFIRMED. WELCOME, AGENT.';
    loginStatus.value = 'success';
    // Add success glow effect
    const loginCard = document.getElementById('login-card');
    if (loginCard) {
      loginCard.classList.add('success-glow');
    }
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  } else {
    loginMessage.value = '> ERROR: INVALID CREDENTIALS.';
    loginStatus.value = 'error';
    // Add error indication
    const loginCard = document.getElementById('login-card');
    if (loginCard) {
      loginCard.style.borderColor = 'var(--accent-danger)';
      setTimeout(() => {
          loginCard.style.borderColor = '';
      }, 1000);
    }
  }
};

onMounted(() => {
  const initHero = () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.03,
        color: 0x00f3ff,
        transparent: true,
        opacity: 0.8,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    camera.position.z = 3;

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
    });

    const clock = new THREE.Clock();

    const animate = () => {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = mouseY * 0.5;
        particlesMesh.rotation.y += mouseX * 0.5;

        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
  };

  const initScrollReveal = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-text').forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
  };

  const initSignup = () => {
        const btn = document.getElementById('signup-btn');
        const codenameInput = document.getElementById('signup-codename');
        const passInput = document.getElementById('signup-passphrase');
        const confirmInput = document.getElementById('signup-confirm');
        const msg = document.getElementById('signup-msg');
        const card = document.getElementById('signup-card');
        
        if(!btn) return;
  
        btn.addEventListener('click', () => {
            const codename = codenameInput.value.trim();
            const pass = passInput.value.trim();
            const confirm = confirmInput.value.trim();
  
            if (!codename || !pass || !confirm) {
                msg.textContent = '> ERROR: ALL FIELDS ARE REQUIRED.';
                return;
            }
  
            if (pass !== confirm) {
                msg.textContent = '> ERROR: PASSPHRASES DO NOT MATCH.';
                card.style.borderColor = 'var(--accent-danger)';
                setTimeout(() => {
                    card.style.borderColor = '';
                }, 1000);
                return;
            }
  
            msg.textContent = '> REGISTRATION SUCCESSFUL. PROCEED TO LOGIN.';
            msg.style.color = 'var(--accent-cyan)';
            card.classList.add('success-glow');
            
            // Clear fields after a delay
            setTimeout(() => {
                codenameInput.value = '';
                passInput.value = '';
                confirmInput.value = '';
                msg.textContent = '';
                msg.style.color = 'var(--accent-danger)';
                card.classList.remove('success-glow');
            }, 3000);
        });
    };

  initHero();
  initScrollReveal();
  initSignup();
  console.log("MIDNIGHT WATCH // SYSTEM READY");
});
</script>

<style scoped>
@import '../assets/styles.css';

.directive-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}


@media (max-width: 768px) {
  .directive-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
