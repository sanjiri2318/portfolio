/* ============================================
   SANJITHKUMAR S - Portfolio Scripts
   Smooth animations - Content always visible
   ============================================ */

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    init3DScene();
    initCustomCursor();
    initNavigation();
    initHeroAnimation();
    initScrollAnimations();
    initHorizontalScroll();
    initMobileMenu();
    initProjectCards();
    initActiveNavLinks();
    initSmoothScroll();
});

/* ============================================
   3D SCENE WITH THREE.JS
   ============================================ */
function init3DScene() {
    const container = document.getElementById('sceneContainer');
    if (!container) {
        console.warn('3D scene: container not found');
        return;
    }

    if (typeof THREE === 'undefined') {
        console.warn('3D scene: THREE not loaded yet');
        setTimeout(() => {
            if (typeof THREE !== 'undefined') {
                init3DSceneCore(container);
            } else {
                console.error('3D scene: THREE library not available');
            }
        }, 500);
        return;
    }

    init3DSceneCore(container);
}

function init3DSceneCore(container) {
    try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const accentColor = 0x64ffda;
        const secondaryColor = 0x00f5d4;
        const tertiaryColor = 0xff64b0;
        const shapes = [];
        let particles = [];

        // Lighting
        const ambientLight = new THREE.AmbientLight(accentColor, 0.4);
        scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(accentColor, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Main icosahedron
        const icoGeometry = new THREE.IcosahedronGeometry(1.5, 2);
        const icoMaterial = new THREE.MeshPhongMaterial({ 
            color: accentColor, 
            wireframe: false, 
            emissive: accentColor, 
            emissiveIntensity: 0.3,
            transparent: true, 
            opacity: 0.8
        });
        const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
        icosahedron.position.set(0, 0, -4);
        scene.add(icosahedron);
        shapes.push({ mesh: icosahedron, rotSpeed: { x: 0.002, y: 0.004, z: 0.001 }, floatSpeed: { x: 0.4, y: 0.25 }, floatPhase: 0, initialPos: { x: 0, y: 0, z: -4 } });

        // Octahedrons
        const octaGeometry = new THREE.OctahedronGeometry(0.5, 1);
        const octaPositions = [
            { x: -4, y: 1, z: -5 },
            { x: 3, y: -1, z: -4 },
            { x: -3, y: -1, z: -5 },
            { x: 4, y: 2, z: -6 }
        ];

        octaPositions.forEach((pos) => {
            const mat = new THREE.MeshPhongMaterial({ 
                color: secondaryColor, 
                wireframe: false, 
                emissive: secondaryColor, 
                emissiveIntensity: 0.2,
                transparent: true, 
                opacity: 0.6 
            });
            const octa = new THREE.Mesh(octaGeometry, mat);
            octa.position.set(pos.x, pos.y, pos.z);
            scene.add(octa);
            shapes.push({ mesh: octa, rotSpeed: { x: 0.003, y: 0.002, z: 0.004 }, floatSpeed: { x: 0.25, y: 0.15 }, floatPhase: Math.random() * Math.PI * 2, initialPos: pos });
        });

        // Tetrahedrons
        const tetraGeometry = new THREE.TetrahedronGeometry(0.4, 1);
        const tetraPositions = [
            { x: 2, y: -2, z: -4 },
            { x: -3, y: 2, z: -3 },
            { x: 3, y: 1, z: -5 }
        ];

        tetraPositions.forEach((pos) => {
            const mat = new THREE.MeshPhongMaterial({ 
                color: accentColor, 
                wireframe: false, 
                emissive: accentColor, 
                emissiveIntensity: 0.25,
                transparent: true, 
                opacity: 0.7 
            });
            const tetra = new THREE.Mesh(tetraGeometry, mat);
            tetra.position.set(pos.x, pos.y, pos.z);
            scene.add(tetra);
            shapes.push({ mesh: tetra, rotSpeed: { x: 0.005, y: 0.003, z: 0.002 }, floatSpeed: { x: 0.3, y: 0.2 }, floatPhase: Math.random() * Math.PI * 2, initialPos: pos });
        });

        // Dodecahedron
        const dodecaGeometry = new THREE.DodecahedronGeometry(0.6, 0);
        const dodecaMat = new THREE.MeshPhongMaterial({ 
            color: tertiaryColor, 
            wireframe: false, 
            emissive: tertiaryColor, 
            emissiveIntensity: 0.3,
            transparent: true, 
            opacity: 0.7 
        });
        const dodeca = new THREE.Mesh(dodecaGeometry, dodecaMat);
        dodeca.position.set(-2, 3, -5);
        scene.add(dodeca);
        shapes.push({ mesh: dodeca, rotSpeed: { x: 0.004, y: 0.005, z: 0.002 }, floatSpeed: { x: 0.35, y: 0.2 }, floatPhase: Math.random() * Math.PI * 2, initialPos: { x: -2, y: 3, z: -5 } });

        // Torus (ring)
        const torusGeometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
        const torusMat = new THREE.MeshPhongMaterial({ 
            color: secondaryColor, 
            wireframe: false, 
            emissive: secondaryColor, 
            emissiveIntensity: 0.2,
            transparent: true, 
            opacity: 0.5 
        });
        const torus = new THREE.Mesh(torusGeometry, torusMat);
        torus.position.set(2, -1, -3.5);
        scene.add(torus);
        shapes.push({ mesh: torus, rotSpeed: { x: 0.001, y: 0.003, z: 0.006 }, floatSpeed: { x: 0.2, y: 0.15 }, floatPhase: Math.random() * Math.PI * 2, initialPos: { x: 2, y: -1, z: -3.5 } });

        // Particle system
        function createParticles() {
            const particlesGeometry = new THREE.BufferGeometry();
            const particleCount = 100;
            const positions = new Float32Array(particleCount * 3);
            const velocities = new Float32Array(particleCount * 3);

            for (let i = 0; i < particleCount * 3; i += 3) {
                positions[i] = (Math.random() - 0.5) * 20;
                positions[i + 1] = (Math.random() - 0.5) * 20;
                positions[i + 2] = (Math.random() - 0.5) * 20 - 5;
                velocities[i] = (Math.random() - 0.5) * 0.02;
                velocities[i + 1] = (Math.random() - 0.5) * 0.02;
                velocities[i + 2] = (Math.random() - 0.5) * 0.02;
            }

            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particlesGeometry.userData.velocities = velocities;

            const particlesMaterial = new THREE.PointsMaterial({
                color: accentColor,
                size: 0.05,
                sizeAttenuation: true,
                transparent: true,
                opacity: 0.5
            });

            particles = new THREE.Points(particlesGeometry, particlesMaterial);
            scene.add(particles);
        }
        createParticles();

        camera.position.z = 3;

        // Section-specific 3D animations
        let currentSection = 'hero';
        let sectionAnimationState = {};

        const sectionConfigs = {
            hero: { rotSpeedMultiplier: 1, floatAmplitude: 0.3, particleSpeed: 0.05, shapeScale: 1 },
            about: { rotSpeedMultiplier: 1.5, floatAmplitude: 0.5, particleSpeed: 0.08, shapeScale: 1.2 },
            showcase: { rotSpeedMultiplier: 2, floatAmplitude: 0.7, particleSpeed: 0.12, shapeScale: 1.4 },
            skills: { rotSpeedMultiplier: 0.8, floatAmplitude: 0.2, particleSpeed: 0.03, shapeScale: 0.8 },
            projects: { rotSpeedMultiplier: 1.8, floatAmplitude: 0.6, particleSpeed: 0.1, shapeScale: 1.3 },
            contact: { rotSpeedMultiplier: 1.2, floatAmplitude: 0.4, particleSpeed: 0.06, shapeScale: 1.1 }
        };

        // Detect current section using IntersectionObserver
        const sections = document.querySelectorAll('section[id]');
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    currentSection = entry.target.id;
                }
            });
        }, { threshold: 0.3 });
        sections.forEach(section => sectionObserver.observe(section));

        // Mouse tracking - EXTENDED DISTANCE
        let mouseX = 0, mouseY = 0;
        let scrollSpeed = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            scrollSpeed = window.scrollY - lastScrollY;
            lastScrollY = window.scrollY;
        });

        // Animation
        let time = 0;
        function animate() {
            requestAnimationFrame(animate);
            time += 0.01;

            const config = sectionConfigs[currentSection] || sectionConfigs.hero;

            shapes.forEach((shape) => {
                shape.mesh.rotation.x += shape.rotSpeed.x * config.rotSpeedMultiplier;
                shape.mesh.rotation.y += shape.rotSpeed.y * config.rotSpeedMultiplier;
                shape.mesh.rotation.z += shape.rotSpeed.z * config.rotSpeedMultiplier;

                if (shape.initialPos) {
                    shape.mesh.position.x = shape.initialPos.x + Math.sin(time * shape.floatSpeed.x + shape.floatPhase) * config.floatAmplitude;
                    shape.mesh.position.y = shape.initialPos.y + Math.cos(time * shape.floatSpeed.y + shape.floatPhase) * config.floatAmplitude;
                }

                shape.mesh.scale.set(config.shapeScale, config.shapeScale, config.shapeScale);
            });

            // Particle animation with section-based speed
            if (particles) {
                const positions = particles.geometry.attributes.position.array;
                const velocities = particles.geometry.userData.velocities;
                for (let i = 0; i < positions.length; i += 3) {
                    positions[i] += velocities[i] * config.particleSpeed;
                    positions[i + 1] += velocities[i + 1] * config.particleSpeed;
                    positions[i + 2] += velocities[i + 2] * config.particleSpeed;

                    if (Math.abs(positions[i]) > 10) { positions[i] = -positions[i]; velocities[i] = -velocities[i]; }
                    if (Math.abs(positions[i + 1]) > 10) { positions[i + 1] = -positions[i + 1]; velocities[i + 1] = -velocities[i + 1]; }
                    if (Math.abs(positions[i + 2]) > 5) { positions[i + 2] = -positions[i + 2]; velocities[i + 2] = -velocities[i + 2]; }
                }
                particles.geometry.attributes.position.needsUpdate = true;
            }

            // Scroll-based zoom
            const scrollProgress = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight), 1);
            camera.position.z = 3 + scrollProgress * 2;

            // EXTENDED cursor tracking - smooth lerp with increased response speed
            camera.position.x += (mouseX * 1.0 - camera.position.x) * 0.06;
            camera.position.y += (-mouseY * 1.0 - camera.position.y) * 0.06;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        console.log('3D scene initialized with enhanced animations');
    } catch (error) {
        console.error('3D scene error:', error);
    }
}

/* ============================================
   CUSTOM CURSOR
   ============================================ */
function initCustomCursor() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;
    if (window.innerWidth < 768) return;

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        dotX += (mouseX - dotX) * 0.2;
        dotY += (mouseY - dotY) * 0.2;
        ringX += (mouseX - ringX) * 0.08;
        ringY += (mouseY - ringY) * 0.08;

        dot.style.left = dotX + 'px';
        dot.style.top = dotY + 'px';
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-card, .contact-card, .showcase-card, .nav-cta');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.classList.add('hover');
            ring.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            dot.classList.remove('hover');
            ring.classList.remove('hover');
        });
    });
}

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

/* ============================================
   HERO ANIMATIONS
   ============================================ */
function initHeroAnimation() {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    tl.from('.hero-label', { opacity: 0, y: 20, duration: 0.6, delay: 0.3 });
    tl.from('.hero-title', { opacity: 0, y: 30, duration: 0.8 }, '-=0.3');
    tl.from('.hero-role', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4');
    tl.from('.hero-desc', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3');
    tl.from('.hero-actions', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3');
    tl.from('.scroll-indicator', { opacity: 0, duration: 0.5 }, '-=0.2');

    // Parallax on orbs
    if (window.innerWidth > 768) {
        gsap.to('.hero-orb--1', { y: -80, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 } });
        gsap.to('.hero-orb--2', { y: -50, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 } });
    }
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    // Fail-safe: ensure cards and text are visible even if ScrollTrigger timing fails.
    gsap.set('.showcase-card, .skill-card, .project-card, .contact-card, .about-text p, .stat-card', {
        opacity: 1,
        x: 0,
        y: 0
    });

    document.querySelectorAll('.section-header').forEach((header) => {
        gsap.from(header.children, { opacity: 0, y: 25, stagger: 0.1, duration: 0.7, ease: 'expo.out', scrollTrigger: { trigger: header, start: 'top 80%' } });
    });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({ top: targetPosition, behavior: 'smooth' });

                const navLinks = document.querySelector('.nav-links');
                const menuToggle = document.querySelector('.menu-toggle');
                if (navLinks?.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle?.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
}

/* ============================================
   HORIZONTAL SCROLL SHOWCASE
   ============================================ */
function initHorizontalScroll() {
    const wrapper = document.querySelector('.showcase-track-wrapper');
    const track = document.getElementById('showcaseTrack');
    if (!wrapper || !track) return;

    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let maxScroll = 0;

    const updateBounds = () => {
        maxScroll = Math.max(0, wrapper.scrollWidth - wrapper.clientWidth);
        wrapper.scrollLeft = Math.max(0, Math.min(wrapper.scrollLeft, maxScroll));
    };

    updateBounds();

    wrapper.style.cursor = 'grab';

    wrapper.addEventListener('mousedown', (e) => {
        isDown = true;
        wrapper.style.cursor = 'grabbing';
        wrapper.style.userSelect = 'none';
        startX = e.pageX;
        scrollStart = wrapper.scrollLeft;
    });

    wrapper.addEventListener('mouseleave', () => { isDown = false; wrapper.style.cursor = 'grab'; wrapper.style.userSelect = ''; });
    wrapper.addEventListener('mouseup', () => { isDown = false; wrapper.style.cursor = 'grab'; wrapper.style.userSelect = ''; });

    wrapper.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const deltaX = startX - e.pageX;
        wrapper.scrollLeft = Math.max(0, Math.min(scrollStart + deltaX, maxScroll));
    });

    let touchStartX = 0;
    let touchScrollStart = 0;
    wrapper.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].pageX; touchScrollStart = wrapper.scrollLeft; }, { passive: true });
    wrapper.addEventListener('touchmove', (e) => {
        const deltaX = touchStartX - e.touches[0].pageX;
        wrapper.scrollLeft = Math.max(0, Math.min(touchScrollStart + deltaX, maxScroll));
    }, { passive: true });

    wrapper.addEventListener('wheel', (e) => {
        if (maxScroll <= 0) return;
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

        const atStart = wrapper.scrollLeft <= 0;
        const atEnd = wrapper.scrollLeft >= maxScroll - 1;
        const scrollingLeft = e.deltaY < 0;
        const scrollingRight = e.deltaY > 0;

        // Let page scroll continue when user is at an edge of the horizontal track.
        if ((atStart && scrollingLeft) || (atEnd && scrollingRight)) {
            return;
        }

        e.preventDefault();
        wrapper.scrollLeft = Math.max(0, Math.min(wrapper.scrollLeft + e.deltaY, maxScroll));
    }, { passive: false });

    window.addEventListener('resize', () => {
        updateBounds();
    });
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* ============================================
   PROJECT CARDS - 3D Effect
   ============================================ */
function initProjectCards() {
    const cardSelectors = '.project-card, .showcase-card, .skill-card, .stat-card';

    document.querySelectorAll(cardSelectors).forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            gsap.to(card, { rotateX: rotateX, rotateY: rotateY, transformPerspective: 1000, duration: 0.15, ease: 'power2.out' });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.3, ease: 'expo.out' });
        });
    });
}

/* ============================================
   ACTIVE NAV LINKS ON SCROLL
   ============================================ */
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
}
