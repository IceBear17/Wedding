// --- Global Initializers & Secure Canvas Bounds ---
const canvas = document.getElementById('ambient-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Safely execute layout metrics once DOM is perfectly compiled
document.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();
    // Re-verify positions to prevent initialization flicker
    setTimeout(resizeCanvas, 100); 
});

window.addEventListener('resize', resizeCanvas);

// --- Reveal Curtain System ---
const gateTrigger = document.getElementById('gate-trigger');
const curtain = document.getElementById('envelope-curtain');

gateTrigger.addEventListener('click', () => {
    curtain.classList.add('opened');
});

gateTrigger.addEventListener('touchstart', (e) => {
    e.preventDefault();
    curtain.classList.add('opened');
}, { passive: false });


// Track mouse position and status
const mouse = { x: null, y: null, radius: 120 }; // Radius of repulsion

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Parallax Effect for Background Pillars
window.addEventListener('mousemove', (e) => {
    const moveX = (window.innerWidth / 2 - e.clientX) * 0.008;
    const moveY = (window.innerHeight / 2 - e.clientY) * 0.008;
    const archBg = document.querySelector('.bg-architecture');
    if (archBg) {
        archBg.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
});

// Resize Canvas dynamically
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Petal Particle Class
class Petal {
    constructor() {
        this.reset();
        // Stagger initial Y positions so they don't all drop from the top at once
        this.y = Math.random() * canvas.height;
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.size = Math.random() * 8 + 6; // Distinct sizes for depth layers
        this.speedY = Math.random() * 1 + 0.7;
        this.speedX = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = Math.random() * 0.02 - 0.01;
        
        // Multi-layered depth assignment (closer petals move faster)
        this.layer = this.size > 10 ? 3 : (this.size > 8 ? 2 : 1);
        this.speedY *= (this.layer * 0.5);
    }

    update() {
        // Base natural drift
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.angle) * 0.2;
        this.angle += this.spin;

        // Mouse/Touch Interaction: Repulsion Physics
        if (mouse.x !== null && mouse.y !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const forceX = (dx / distance) * force * 5;
                const forceY = (dy / distance) * force * 5;
                
                this.x += forceX;
                this.y += forceY;
            }
        }

        // Reset if out of bounds
        if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        
        // Drawing an organic, beautiful leaf/petal shape using Bezier curves
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size, -this.size / 2, -this.size, this.size, 0, this.size * 1.5);
        ctx.bezierCurveTo(this.size, this.size, this.size, -this.size / 2, 0, 0);
        
        // Soft, romantic pink tones matching our --envelope color palette
        ctx.fillStyle = `rgba(224, 130, 152, ${this.opacity})`;
        ctx.fill();
        ctx.restore();
    }
}

// Instantiate Particle System
const petalCount = 45; 
const petalsArray = [];
for (let i = 0; i < petalCount; i++) {
    petalsArray.push(new Petal());
}

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < petalsArray.length; i++) {
        petalsArray[i].update();
        petalsArray[i].draw();
    }
    
    requestAnimationFrame(animate);
}
animate();

//Countdown
// --- Premium Wedding Countdown Logic ---
function initCountdown() {
    // Target: August 21 at 20:00 (8:00 PM)
    const targetDate = new Date("August 21, 2026 20:00:00").getTime();

    const timer = setInterval(() => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference < 0) {
            clearInterval(timer);
            document.getElementById("countdown-container").innerHTML = "<div class='celebrate-text'>The Celebration Has Begun</div>";
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = String(days).padStart(2, '0');
        document.getElementById("hours").innerText = String(hours).padStart(2, '0');
        document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
        document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
    }, 1000);
}

// Fire countdown setup safely
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCountdown);
} else {
    initCountdown();
}

// --- High-Performance Scroll Reveal Engine ---
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in-element');
    
    const observerOptions = {
        root: null, // Viewport standard tracking
        threshold: 0.12, // Element percentage visible before firing trigger
        rootMargin: "0px 0px -40px 0px" // Slight offset padding for cleaner appearance
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Once visible, decouple observation loop to optimize frame rates
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Safely configure observers on content mounting completion
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initScrollAnimations);
} else {
    initScrollAnimations();
}

// --- Interactive Blessings Footer Trigger System ---
const stampBtn = document.getElementById('blessings-stamp-btn');
const counterLabel = document.getElementById('blessings-counter');

if (stampBtn) {
    stampBtn.addEventListener('click', (e) => {
        // 1. Toggle Button Visual Stamp Class state
        stampBtn.classList.add('stamped');
        counterLabel.classList.add('show');
        
        // 2. Fetch stamp window location geometry metrics
        const btnRect = stampBtn.getBoundingClientRect();
        const emitX = btnRect.left + btnRect.width / 2;
        const emitY = btnRect.top + btnRect.height / 2;

        // 3. Inject customized golden burst particles straight into the running particle array
        if (typeof petalsArray !== 'undefined') {
            for (let i = 0; i < 18; i++) {
                const blessingParticle = new Petal();
                
                // Override standard top fall configuration vectors for a fountain burst effect
                blessingParticle.x = emitX;
                blessingParticle.y = emitY;
                blessingParticle.size = Math.random() * 6 + 4;
                blessingParticle.speedY = Math.random() * -4 - 2; // Shoot upwards violently
                blessingParticle.speedX = Math.random() * 6 - 3;  // Fan out wide left and right
                blessingParticle.opacity = 0.9;
                
                // Switch default color variable assignment temporarily into shimmering gold accents
                blessingParticle.draw = function() {
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.angle);
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.bezierCurveTo(-this.size, -this.size / 2, -this.size, this.size, 0, this.size * 1.5);
                    ctx.bezierCurveTo(this.size, this.size, this.size, -this.size / 2, 0, 0);
                    
                    // Premium sparkling gold color layer profile
                    ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
                    ctx.shadowBlur = 6;
                    ctx.shadowColor = "rgba(212, 175, 55, 0.4)";
                    ctx.fill();
                    ctx.restore();
                };
                
                petalsArray.push(blessingParticle);
            }
        }
    });
}