lucide.createIcons();

// ==========================================
// MOBILE MENU LOGIC
// ==========================================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('icon-menu');
const iconClose = document.getElementById('icon-close');
const mobileLinks = document.querySelectorAll('.mobile-link');

function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.contains('opacity-100');
    if (isOpen) {
        mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
        mobileMenu.classList.add('opacity-0', 'pointer-events-none');
        menuIcon.classList.remove('hidden');
        menuIcon.classList.add('block');
        iconClose.classList.remove('block');
        iconClose.classList.add('hidden');
    } else {
        mobileMenu.classList.add('opacity-100', 'pointer-events-auto');
        mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
        menuIcon.classList.remove('block');
        menuIcon.classList.add('hidden');
        iconClose.classList.remove('hidden');
        iconClose.classList.add('block');
    }
}

mobileMenuBtn.addEventListener('click', toggleMobileMenu);
mobileLinks.forEach(link => link.addEventListener('click', toggleMobileMenu));

// ==========================================
// GITHUB API INTEGRATION
// ==========================================
const GITHUB_USERNAME = "Dixon1323"; // <-- REPLACE WITH YOUR GITHUB USERNAME

const githubBtn = document.getElementById('github-toggle-btn');
const githubContainer = document.getElementById('github-container');
const githubChevron = document.getElementById('github-chevron');
let isGithubLoaded = false;

githubBtn.addEventListener('click', async () => {
    const isHidden = githubContainer.classList.contains('hidden');

    if (isHidden) {
        githubContainer.classList.remove('hidden');
        setTimeout(() => githubContainer.classList.remove('opacity-0'), 50);
        githubChevron.style.transform = "rotate(180deg)";
        githubBtn.innerHTML = `<i data-lucide="github" class="text-gray-400"></i> Close Archive <i data-lucide="chevron-up" id="github-chevron" class="text-blue-400 transition-transform duration-300"></i>`;
        lucide.createIcons();

        if (!isGithubLoaded) {
            githubContainer.innerHTML = `
                <div class="col-span-full flex flex-col items-center justify-center py-12 text-gray-400">
                    <i data-lucide="loader-2" class="w-8 h-8 animate-spin mb-4 text-blue-400"></i>
                    <p class="font-mono text-sm uppercase tracking-widest">Fetching Repositories from GitHub...</p>
                </div>
            `;
            lucide.createIcons();

            try {
                const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`);
                if (!response.ok) throw new Error("User not found");
                const repos = await response.json();
                
                githubContainer.innerHTML = ''; 

                const publicRepos = repos.filter(repo => !repo.fork);
                
                if(publicRepos.length === 0) {
                    githubContainer.innerHTML = `<p class="col-span-full text-center text-gray-500">No public repositories found.</p>`;
                } else {
                    publicRepos.forEach(repo => {
                        const card = document.createElement('a');
                        card.href = repo.html_url;
                        card.target = "_blank";
                        card.className = "glass-card p-6 rounded-2xl project-card group block flex flex-col justify-between hover-trigger h-full md:cursor-none";
                        card.innerHTML = `
                            <div>
                                <div class="flex items-start justify-between mb-3">
                                    <h3 class="font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">${repo.name}</h3>
                                    <i data-lucide="external-link" class="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-colors"></i>
                                </div>
                                <p class="text-sm text-gray-400 mb-6 line-clamp-2">${repo.description || 'No description provided.'}</p>
                            </div>
                            <div class="flex items-center justify-between text-xs font-mono pt-4 border-t border-white/5">
                                <span class="text-purple-300 flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-purple-400"></div>${repo.language || 'Code'}</span>
                                <span class="text-gray-500 flex items-center gap-1"><i data-lucide="star" class="w-3 h-3"></i> ${repo.stargazers_count}</span>
                            </div>
                        `;
                        githubContainer.appendChild(card);
                    });
                }
                
                lucide.createIcons();
                isGithubLoaded = true;

            } catch (error) {
                githubContainer.innerHTML = `
                    <div class="col-span-full text-center text-red-400 py-10 bg-red-500/10 rounded-2xl border border-red-500/20">
                        <i data-lucide="alert-triangle" class="w-8 h-8 mx-auto mb-3"></i>
                        <p>Failed to load GitHub projects.</p>
                        <p class="text-sm mt-2 text-red-300">Make sure you updated the GITHUB_USERNAME variable in the code.</p>
                    </div>
                `;
                lucide.createIcons();
            }
        }
    } else {
        githubContainer.classList.add('opacity-0');
        setTimeout(() => githubContainer.classList.add('hidden'), 500);
        githubBtn.innerHTML = `<i data-lucide="github" class="text-blue-400"></i> Open Full GitHub Archive <i data-lucide="chevron-down" id="github-chevron" class="text-gray-500 transition-transform duration-300"></i>`;
        lucide.createIcons();
    }
});

// ==========================================
// CUSTOM NEON CURSOR & HOVER EFFECTS
// ==========================================
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

const isTouchDevice = () => window.matchMedia("(pointer: coarse)").matches;

if (!isTouchDevice()) {
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if(cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });

    function animateCursor() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        if(cursorRing) {
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.body.addEventListener('mouseover', (e) => {
        if (e.target.closest('.hover-trigger') || e.target.closest('a') || e.target.closest('button')) {
            if(cursorRing) cursorRing.classList.add('hovering');
        }
    });
    document.body.addEventListener('mouseout', (e) => {
        if (e.target.closest('.hover-trigger') || e.target.closest('a') || e.target.closest('button')) {
            if(cursorRing) cursorRing.classList.remove('hovering');
        }
    });
}

// ==========================================
// SCROLL REVEAL ANIMATIONS
// ==========================================
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, observerOptions);
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ==========================================
// 3D CARD TILT EFFECT (Desktop Only)
// ==========================================
if (!isTouchDevice()) {
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}

// ==========================================
// HERO PARTICLE ENGINE
// ==========================================
const canvas = document.getElementById('particleCanvas');
const heroSection = document.getElementById('home');
const ctx = canvas.getContext('2d', { alpha: false });

let particles = [];
let particleMouse = { x: -1000, y: -1000 };
let globalSyncHue = 0;

const sequence = [
    { state: "GLOBE", duration: 120 },      
    { state: "DISPERSE", duration: 120 },   
    { state: "CONSTRUCT", duration: 300 },  
    { state: "DISPERSE", duration: 120 }    
];

let currentStageIndex = 0;
let stateTimer = 0;
let currentState = sequence[0].state;

const settings = {
    particleCount: 5000,
    mouseRadius: 150,
    particleSize: 1.8,
    friction: 0.94 
};

class Particle {
    constructor() {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const radius = Math.min(canvas.width, canvas.height) * 0.25;

        this.globeRadius = radius;
        this.phi = phi;
        this.angle = theta; 

        this.globeX = canvas.width / 2 + radius * Math.sin(phi) * Math.cos(theta);
        this.globeY = canvas.height / 2 + radius * Math.sin(phi) * Math.sin(theta);
        
        this.dixonX = canvas.width / 2;
        this.dixonY = canvas.height / 2;

        this.curX = this.globeX;
        this.curY = this.globeY;
        
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.speed = Math.random() * 0.05 + 0.02;

        this.wanderAngle = Math.random() * Math.PI * 2;
        this.wanderRadius = Math.random() * 3 + 1; 
        this.wanderSpeed = Math.random() * 0.1 + 0.05; 
    }

    burst() {
        const angle = Math.random() * Math.PI * 2;
        const burstSpeed = Math.random() * 20 + 10; 
        this.vx = Math.cos(angle) * burstSpeed;
        this.vy = Math.sin(angle) * burstSpeed;
    }

    update() {
        let dx = particleMouse.x - this.curX;
        let dy = particleMouse.y - this.curY;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < settings.mouseRadius) {
            let force = (settings.mouseRadius - dist) / settings.mouseRadius;
            this.vx -= dx * force * 0.4;
            this.vy -= dy * force * 0.4;
        }

        if (currentState === "GLOBE") {
            this.angle += 0.005;
            this.globeX = canvas.width / 2 + this.globeRadius * Math.sin(this.phi) * Math.cos(this.angle);
            this.globeY = canvas.height / 2 + this.globeRadius * Math.sin(this.phi) * Math.sin(this.angle);

            let tx = this.globeX - this.curX;
            let ty = this.globeY - this.curY;
            this.vx += tx * this.speed;
            this.vy += ty * this.speed;
            this.vx *= 0.85; 
            this.vy *= 0.85;
        } 
        else if (currentState === "CONSTRUCT") {
            this.wanderAngle += this.wanderSpeed;
            let targetX = this.dixonX + Math.cos(this.wanderAngle) * this.wanderRadius;
            let targetY = this.dixonY + Math.sin(this.wanderAngle) * this.wanderRadius;

            let tx = targetX - this.curX;
            let ty = targetY - this.curY;
            
            this.vx += tx * this.speed + (Math.random() - 0.5) * 0.5;
            this.vy += ty * this.speed + (Math.random() - 0.5) * 0.5;
            
            this.vx *= 0.82;
            this.vy *= 0.82;
        } 
        else { 
            this.vx += (Math.random() - 0.5) * 1.5;
            this.vy += (Math.random() - 0.5) * 1.5;
            this.vx *= settings.friction;
            this.vy *= settings.friction;
        }

        this.curX += this.vx;
        this.curY += this.vy;
    }

    draw() {
        ctx.fillStyle = `hsl(${globalSyncHue}, 100%, 50%)`;
        ctx.fillRect(this.curX, this.curY, settings.particleSize, settings.particleSize);
    }
}

function setupTextTargets() {
    const text = "DIXON";
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
    
    offCanvas.width = 3000;
    offCanvas.height = 1500;

    let fontSize = Math.floor(Math.min(canvas.width * 0.25, 400)); 
    if (fontSize > canvas.height * 0.35) fontSize = Math.floor(canvas.height * 0.35); 

    offCtx.font = `bold ${fontSize}px Arial, sans-serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillStyle = 'white';
    offCtx.fillText(text, offCanvas.width / 2, offCanvas.height / 2);

    const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
    const pixels = imgData.data;
    const bufferW = imgData.width;
    
    const targets = [];
    const step = fontSize < 150 ? 1 : 2; 

    const startY = Math.max(0, Math.floor(offCanvas.height / 2 - fontSize * 1.5));
    const endY = Math.min(offCanvas.height, Math.floor(offCanvas.height / 2 + fontSize * 1.5));
    const startX = Math.max(0, Math.floor(offCanvas.width / 2 - fontSize * text.length));
    const endX = Math.min(offCanvas.width, Math.floor(offCanvas.width / 2 + fontSize * text.length));

    for (let y = startY; y < endY; y += step) {
        for (let x = startX; x < endX; x += step) {
            if (pixels[(y * bufferW + x) * 4 + 3] > 128) targets.push({x, y});
        }
    }

    if (targets.length > 0) {
        const minX = Math.min(...targets.map(t => t.x));
        const maxX = Math.max(...targets.map(t => t.x));
        const minY = Math.min(...targets.map(t => t.y));
        const maxY = Math.max(...targets.map(t => t.y));

        const bufferCenterX = minX + (maxX - minX) / 2;
        const bufferCenterY = minY + (maxY - minY) / 2;

        const screenCenterX = canvas.width / 2;
        const screenCenterY = canvas.height / 2;

        for (let i = targets.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [targets[i], targets[j]] = [targets[j], targets[i]];
        }

        particles.forEach((p, i) => {
            const t = targets[i % targets.length];
            p.dixonX = (t.x - bufferCenterX) + screenCenterX;
            p.dixonY = (t.y - bufferCenterY) + screenCenterY;
        });
    }
}

function manageTimeline() {
    stateTimer++;
    const currentStage = sequence[currentStageIndex];
    
    if (stateTimer >= currentStage.duration) {
        stateTimer = 0;
        currentStageIndex++;
        if (currentStageIndex >= sequence.length) currentStageIndex = 2; 
        if (sequence[currentStageIndex].state === "DISPERSE") {
            particles.forEach(p => p.burst());
        }
    }
    currentState = sequence[currentStageIndex].state;
}

function animateParticles() {
    ctx.fillStyle = 'rgba(3, 3, 5, 0.25)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    globalSyncHue = (globalSyncHue + 15) % 360;

    manageTimeline();
    particles.forEach(p => { p.update(); p.draw(); });
    
    requestAnimationFrame(animateParticles);
}

function initParticles() {
    canvas.width = heroSection.clientWidth;
    canvas.height = heroSection.clientHeight;
    particles = [];
    for (let i = 0; i < settings.particleCount; i++) {
        particles.push(new Particle());
    }
    setupTextTargets();
    animateParticles();
}

canvas.addEventListener('mousemove', e => { 
    const rect = canvas.getBoundingClientRect();
    particleMouse.x = e.clientX - rect.left; 
    particleMouse.y = e.clientY - rect.top; 
});
canvas.addEventListener('mouseleave', () => { 
    particleMouse.x = -1000; particleMouse.y = -1000; 
});

canvas.addEventListener('touchmove', e => {
    if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        particleMouse.x = e.touches[0].clientX - rect.left;
        particleMouse.y = e.touches[0].clientY - rect.top;
    }
}, { passive: true });

canvas.addEventListener('touchend', () => {
    particleMouse.x = -1000;
    particleMouse.y = -1000;
});

window.addEventListener('resize', () => {
    canvas.width = heroSection.clientWidth;
    canvas.height = heroSection.clientHeight;
    setupTextTargets(); 
});

initParticles();