/* ============================================
   MAIN.JS — Nirmeen Portfolio
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavbar();
    initTypingEffect();
    initScrollReveal();
    initCountUp();
    initSkillBars();
    initCharts();
});

/* ============================================
   PARTICLE BACKGROUND
   ============================================ */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 120 };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;

            // Mouse interaction
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= dx * force * 0.02;
                    this.y -= dy * force * 0.02;
                }
            }
        }

        draw() {
            ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function createParticles() {
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    createParticles();

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const opacity = 0.08 * (1 - dist / 150);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }
    animate();
}

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('nav-toggle');
    const links = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active link
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobile toggle
    toggle.addEventListener('click', () => {
        links.classList.toggle('open');
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('open');
        });
    });
}

/* ============================================
   TYPING EFFECT
   ============================================ */
function initTypingEffect() {
    const texts = [
        'Cloud Infrastructure Engineer',
        'VMware Specialist',
        'AWS Certified Architect',
        'DevOps Enthusiast',
        'Python Automation Expert'
    ];
    const el = document.getElementById('typed-text');
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = texts[textIndex];

        if (isDeleting) {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === current.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }
    type();
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));
}

/* ============================================
   COUNT UP ANIMATION
   ============================================ */
function initCountUp() {
    const counters = document.querySelectorAll('.hero-stat-number, .achievement-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    function update() {
        current += step;
        if (current >= target) {
            el.textContent = target;
            return;
        }
        el.textContent = Math.floor(current);
        requestAnimationFrame(update);
    }
    update();
}

/* ============================================
   SKILL BARS
   ============================================ */
function initSkillBars() {
    const fills = document.querySelectorAll('.skill-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    fills.forEach(f => observer.observe(f));
}

/* ============================================
   CHARTS (Chart.js)
   ============================================ */
function initCharts() {
    // Global Chart.js defaults
    Chart.defaults.color = '#8892b0';
    Chart.defaults.borderColor = 'rgba(99, 102, 241, 0.08)';
    Chart.defaults.font.family = "'Inter', sans-serif";

    initRadarChart();
    initDoughnutChart();
    initBarChart();
    initImpactChart();
}

/* Radar Chart - Competency Overview */
function initRadarChart() {
    const ctx = document.getElementById('radarChart');
    if (!ctx) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                createRadarChart(ctx);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    observer.observe(ctx);
}

function createRadarChart(ctx) {
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Virtualization', 'Cloud (AWS)', 'Networking', 'Monitoring', 'Automation', 'Containers', 'Security'],
            datasets: [{
                label: 'Proficiency',
                data: [92, 85, 78, 85, 82, 80, 75],
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                borderColor: '#6366f1',
                borderWidth: 2,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#fff',
                pointBorderWidth: 1,
                pointRadius: 4,
                pointHoverRadius: 6,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        display: false,
                        stepSize: 20
                    },
                    grid: {
                        color: 'rgba(99, 102, 241, 0.08)'
                    },
                    angleLines: {
                        color: 'rgba(99, 102, 241, 0.08)'
                    },
                    pointLabels: {
                        font: { size: 11, weight: 500 },
                        color: '#8892b0'
                    }
                }
            },
            plugins: {
                legend: { display: false }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
}

/* Doughnut Chart - Skill Distribution */
function initDoughnutChart() {
    const ctx = document.getElementById('doughnutChart');
    if (!ctx) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                createDoughnutChart(ctx);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    observer.observe(ctx);
}

function createDoughnutChart(ctx) {
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Virtualization', 'Cloud Platforms', 'Networking', 'Monitoring & DevOps', 'Scripting & Automation', 'Identity & Security'],
            datasets: [{
                data: [25, 22, 13, 15, 15, 10],
                backgroundColor: [
                    '#6366f1',
                    '#8b5cf6',
                    '#a78bfa',
                    '#c4b5fd',
                    '#818cf8',
                    '#e0e7ff'
                ],
                borderColor: '#141930',
                borderWidth: 3,
                hoverOffset: 12,
                hoverBorderWidth: 0,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '62%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 16,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: { size: 11, weight: 500 }
                    }
                }
            },
            animation: {
                animateRotate: true,
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
}

/* Bar Chart - Proficiency Levels */
function initBarChart() {
    const ctx = document.getElementById('barChart');
    if (!ctx) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                createBarChart(ctx);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    observer.observe(ctx);
}

function createBarChart(ctx) {
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, '#6366f1');
    gradient.addColorStop(1, '#8b5cf6');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['VMware', 'AD', 'AWS', 'Grafana', 'Python', 'Docker', 'PowerShell', 'CCNA', 'DevOps', 'OpenStack'],
            datasets: [{
                label: 'Proficiency %',
                data: [90, 88, 85, 85, 82, 80, 80, 78, 76, 75],
                backgroundColor: gradient,
                borderRadius: 6,
                borderSkipped: false,
                barThickness: 20,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: 'rgba(99, 102, 241, 0.06)' },
                    ticks: { font: { size: 10 } }
                },
                y: {
                    grid: { display: false },
                    ticks: { font: { size: 11, weight: 500 } }
                }
            },
            plugins: {
                legend: { display: false }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
}

/* Impact Chart - Resolution Time */
function initImpactChart() {
    const ctx = document.getElementById('impactChart');
    if (!ctx) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                createImpactChart(ctx);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    observer.observe(ctx);
}

function createImpactChart(ctx) {
    const context = ctx.getContext('2d');
    const gradientFill = context.createLinearGradient(0, 0, 0, 250);
    gradientFill.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
    gradientFill.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Before', 'Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'After'],
            datasets: [
                {
                    label: 'Avg Resolution Time (hours)',
                    data: [8, 6.5, 5, 4, 3, 2.5, 2],
                    borderColor: '#6366f1',
                    backgroundColor: gradientFill,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#6366f1',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                },
                {
                    label: 'Downtime %',
                    data: [100, 85, 72, 65, 58, 52, 50],
                    borderColor: '#10b981',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            scales: {
                x: {
                    grid: { color: 'rgba(99, 102, 241, 0.06)' },
                    ticks: { font: { size: 11 } }
                },
                y: {
                    beginAtZero: true,
                    max: 10,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Hours',
                        font: { size: 11 }
                    },
                    grid: { color: 'rgba(99, 102, 241, 0.06)' },
                    ticks: { font: { size: 10 } }
                },
                y1: {
                    beginAtZero: true,
                    max: 120,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Downtime Index %',
                        font: { size: 11 }
                    },
                    grid: { display: false },
                    ticks: { font: { size: 10 } }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 16,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: { size: 11 }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });
}
