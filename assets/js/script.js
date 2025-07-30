
// Configuration globale
const CONFIG = {
    sounds: {
        enabled: true,
        volume: 0.3
    },
    intro: {
        skipOnRevisit: true,
        duration: 6000
    }
};

// Gestionnaire audio
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.enabled = CONFIG.sounds.enabled;
        this.init();
    }

    async init() {
        if (this.enabled) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.createSounds();
            } catch (error) {
                console.log('Audio non disponible:', error);
                this.enabled = false;
            }
        }
    }

    createSounds() {
        // Son de pulsation neuronale
        this.sounds.pulse = this.createTone(120, 0.1, 'sine');
        // Son de scan
        this.sounds.scan = this.createTone(800, 0.2, 'square');
        // Son de clic
        this.sounds.click = this.createTone(600, 0.1, 'triangle');
        // Son d'activation
        this.sounds.activate = this.createTone(400, 0.3, 'sawtooth');
    }

    createTone(frequency, duration, type = 'sine') {
        return () => {
            if (!this.enabled || !this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(CONFIG.sounds.volume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    play(soundName) {
        if (this.sounds[soundName] && this.enabled) {
            this.sounds[soundName]();
        }
    }
}

// Gestionnaire d'intro
class IntroSequence {
    constructor() {
        this.audioManager = new AudioManager();
        this.introElement = document.getElementById('intro-sequence');
        this.mainPortfolio = document.getElementById('main-portfolio');
        this.hasBeenShown = localStorage.getItem('intro-shown') === 'true';
        
        this.init();
    }

    init() {
        if (CONFIG.intro.skipOnRevisit && this.hasBeenShown) {
            this.skipIntro();
            return;
        }

        this.startSequence();
        this.bindEvents();
    }

    startSequence() {
        const messages = [
            "Initialisation de l'interface neuronale...",
            "Analyse des compétences techniques...",
            "Chargement du profil : Bahae Aouanet",
            "Statut : Ingénieur Full Stack confirmé",
            "Accès au portfolio autorisé"
        ];

        let messageIndex = 0;
        const typedElement = document.getElementById('typed-text');
        const progressLine = document.querySelector('.progress-line');

        const typeNextMessage = () => {
            if (messageIndex < messages.length) {
                this.typeText(typedElement, messages[messageIndex], 60, () => {
                    this.audioManager.play('pulse');
                    messageIndex++;
                    
                    // Mise à jour de la barre de progression
                    const progress = (messageIndex / messages.length) * 100;
                    progressLine.style.width = progress + '%';
                    
                    setTimeout(typeNextMessage, 800);
                });
            } else {
                setTimeout(() => {
                    this.showEnterButton();
                }, 1000);
            }
        };

        // Démarrage de la séquence
        setTimeout(() => {
            this.audioManager.play('activate');
            typeNextMessage();
        }, 1500);
    }

    typeText(element, text, speed = 50, callback) {
        let index = 0;
        element.textContent = '';
        
        const typeChar = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(typeChar, speed);
            } else if (callback) {
                setTimeout(callback, 300);
            }
        };
        
        typeChar();
    }

    showEnterButton() {
        const enterBtn = document.getElementById('enter-interface');
        const logoElement = document.querySelector('.intro-logo');
        
        logoElement.classList.add('show');
        enterBtn.style.display = 'flex';
        enterBtn.classList.add('show');
        
        this.audioManager.play('scan');
    }

    bindEvents() {
        const enterBtn = document.getElementById('enter-interface');
        const skipBtn = document.getElementById('skip-intro');

        enterBtn?.addEventListener('click', () => {
            this.audioManager.play('activate');
            this.enterPortfolio();
        });

        skipBtn?.addEventListener('click', () => {
            this.skipIntro();
        });
    }

    enterPortfolio() {
        this.introElement.classList.add('fade-out');
        
        setTimeout(() => {
            this.introElement.style.display = 'none';
            this.mainPortfolio.style.display = 'block';
            this.mainPortfolio.classList.add('fade-in');
            
            localStorage.setItem('intro-shown', 'true');
            this.initMainPortfolio();
        }, 1000);
    }

    skipIntro() {
        this.introElement.style.display = 'none';
        this.mainPortfolio.style.display = 'block';
        localStorage.setItem('intro-shown', 'true');
        this.initMainPortfolio();
    }

    initMainPortfolio() {
        // Initialisation du portfolio principal
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100
            });
        }
        
        new PortfolioManager();
    }
}

// Gestionnaire principal du portfolio
class PortfolioManager {
    constructor() {
        this.audioManager = new AudioManager();
        this.currentSection = 'accueil';
        
        this.init();
    }

    init() {
        this.initNavigation();
        this.initSkillsOrbit();
        this.initProjectCards();
        this.initTimeline();
        this.initContactForm();
        this.initParticles();
        this.initScrollEffects();
    }

    // Navigation intelligente
    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const navToggle = document.querySelector('.nav-toggle');
        const navLinksContainer = document.querySelector('.nav-links');

        // Navigation active
        const updateActiveNav = () => {
            const sections = document.querySelectorAll('section');
            const scrollPos = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    const activeLink = document.querySelector(`[href="#${sectionId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                        this.currentSection = sectionId;
                    }
                }
            });
        };

        window.addEventListener('scroll', updateActiveNav);

        // Clics navigation
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.audioManager.play('click');
                
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Menu mobile
        navToggle?.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Système orbital des compétences
    initSkillsOrbit() {
        const skillsData = [
            { name: 'JavaScript', level: 95, category: 'frontend' },
            { name: 'TypeScript', level: 90, category: 'frontend' },
            { name: 'React', level: 92, category: 'frontend' },
            { name: 'Vue.js', level: 85, category: 'frontend' },
            { name: 'Node.js', level: 88, category: 'backend' },
            { name: 'Python', level: 82, category: 'backend' },
            { name: 'PostgreSQL', level: 87, category: 'database' },
            { name: 'MongoDB', level: 83, category: 'database' },
            { name: 'AWS', level: 85, category: 'cloud' },
            { name: 'Docker', level: 88, category: 'devops' }
        ];

        const orbitContainer = document.querySelector('.skills-orbit');
        if (!orbitContainer) return;

        const centerNode = orbitContainer.querySelector('.orbit-center');
        
        skillsData.forEach((skill, index) => {
            const skillNode = document.createElement('div');
            skillNode.className = `skill-node ${skill.category}`;
            skillNode.innerHTML = `
                <div class="skill-icon">
                    <span>${skill.name.charAt(0)}</span>
                </div>
                <div class="skill-info">
                    <span class="skill-name">${skill.name}</span>
                    <div class="skill-level">
                        <div class="level-bar" style="width: ${skill.level}%"></div>
                    </div>
                </div>
            `;

            // Position orbitale
            const angle = (index / skillsData.length) * 360;
            const radius = 120 + (index % 3) * 20;
            const x = Math.cos(angle * Math.PI / 180) * radius;
            const y = Math.sin(angle * Math.PI / 180) * radius;

            skillNode.style.transform = `translate(${x}px, ${y}px)`;
            skillNode.style.animationDelay = `${index * 0.2}s`;

            orbitContainer.appendChild(skillNode);

            // Interaction hover
            skillNode.addEventListener('mouseenter', () => {
                this.audioManager.play('pulse');
                skillNode.classList.add('highlighted');
                centerNode.classList.add('active');
            });

            skillNode.addEventListener('mouseleave', () => {
                skillNode.classList.remove('highlighted');
                centerNode.classList.remove('active');
            });
        });
    }

    // Cartes projets interactives
    initProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');

        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.audioManager.play('scan');
                card.classList.add('elevated');
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('elevated');
            });

            const detailBtn = card.querySelector('.project-detail-btn');
            if (detailBtn) {
                detailBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.audioManager.play('activate');
                    this.showProjectDetail(card);
                });
            }
        });
    }

    showProjectDetail(card) {
        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${card.querySelector('.project-title').textContent}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${card.querySelector('.project-description').textContent}</p>
                    <div class="project-tech">
                        ${card.querySelector('.project-tech').innerHTML}
                    </div>
                    <div class="project-links">
                        <a href="#" class="btn-primary">Voir le projet</a>
                        <a href="#" class="btn-secondary">Code source</a>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);

        const closeModal = () => {
            modal.classList.remove('show');
            setTimeout(() => document.body.removeChild(modal), 300);
        };

        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Timeline animée
    initTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    this.audioManager.play('pulse');
                }
            });
        }, { threshold: 0.3 });

        timelineItems.forEach(item => {
            observer.observe(item);
        });
    }

    // Formulaire de contact
    initContactForm() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                this.audioManager.play('click');
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
                if (input.value.trim() !== '') {
                    input.parentElement.classList.add('filled');
                } else {
                    input.parentElement.classList.remove('filled');
                }
            });

            input.addEventListener('input', () => {
                this.validateField(input);
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(form);
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        switch (field.type) {
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                break;
            case 'tel':
                isValid = /^[\d\s\-\+\(\)]{8,}$/.test(value);
                break;
            default:
                isValid = value.length >= 2;
        }

        if (isValid) {
            field.parentElement.classList.add('valid');
            field.parentElement.classList.remove('invalid');
        } else {
            field.parentElement.classList.add('invalid');
            field.parentElement.classList.remove('valid');
        }

        return isValid;
    }

    handleFormSubmit(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;

        // Simulation d'envoi
        setTimeout(() => {
            this.audioManager.play('activate');
            this.showNotification('Message envoyé avec succès !', 'success');
            
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message envoyé';
            form.reset();
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 3000);
        }, 2000);
    }

    // Particules dynamiques
    initParticles() {
        const containers = document.querySelectorAll('.floating-particles');
        
        containers.forEach(container => {
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 10 + 's';
                particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
                container.appendChild(particle);
            }
        });
    }

    // Effets de scroll
    initScrollEffects() {
        let lastScrollY = window.scrollY;
        const navbar = document.querySelector('.neural-navbar');

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Navigation auto-hide
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                navbar.classList.add('hidden');
            } else {
                navbar.classList.remove('hidden');
            }
            
            lastScrollY = currentScrollY;

            // Parallax léger
            const parallaxElements = document.querySelectorAll('[data-parallax]');
            parallaxElements.forEach(element => {
                const speed = element.dataset.parallax || 0.5;
                const yPos = -(currentScrollY * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        });
    }

    // Notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 10);

        const closeNotification = () => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        };

        notification.querySelector('.notification-close').addEventListener('click', closeNotification);
        setTimeout(closeNotification, 5000);
    }
}

// Fonctions utilitaires globales
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function toggleTheme() {
    document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Vérification du thème sauvegardé
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }

    // Démarrage de l'application
    new IntroSequence();
});

// Gestion des erreurs
window.addEventListener('error', (e) => {
    console.log('Erreur capturée:', e.error);
});

// Performance monitoring
const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
        if (entry.entryType === 'measure') {
            console.log(`${entry.name}: ${entry.duration}ms`);
        }
    });
});

if ('observe' in observer) {
    observer.observe({ entryTypes: ['measure', 'navigation'] });
}
