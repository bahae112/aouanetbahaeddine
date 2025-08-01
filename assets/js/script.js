/**
 * NEURAL PORTFOLIO - SCRIPT PRINCIPAL
 * Interface neuronale immersive pour portfolio d'ingénieur
 */

// Variables globales
let isIntroPlayed = false;
let soundEnabled = true;

// Audio Context pour les effets sonores
let audioContext;
let soundEffects = {};

// Configuration des sons
const SOUNDS = {
    hover: { frequency: 800, duration: 0.1, type: 'sine' },
    click: { frequency: 1200, duration: 0.15, type: 'square' },
    scan: { frequency: 400, duration: 0.3, type: 'sawtooth' },
    notification: { frequency: 600, duration: 0.2, type: 'triangle' },
    typing: { frequency: 1000, duration: 0.05, type: 'sine' }
};

/**
 * INITIALISATION GÉNÉRALE
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeAudio();
    checkIntroStatus();
    initializeNavigation();
    initializeScrollAnimations();
    initializeHeroAnimations();
    initializeSkillsOrbit();
    initializeProjectFilters();
    initializeContactForm();
    initializeCounters();
    initializeParallax();
    initializeSoundEffects();
    
    // Initialisation des animations AOS
    AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
    });
});

/**
 * GESTION AUDIO
 */
function initializeAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('Audio context initialisé');
    } catch (error) {
        console.warn('Audio non supporté:', error);
        soundEnabled = false;
    }
}

function playSound(soundType, volume = 0.1) {
    if (!soundEnabled || !audioContext) return;
    
    try {
        const sound = SOUNDS[soundType];
        if (!sound) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(sound.frequency, audioContext.currentTime);
        oscillator.type = sound.type;
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + sound.duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + sound.duration);
        
    } catch (error) {
        console.warn('Erreur son:', error);
    }
}

/**
 * SÉQUENCE D'INTRODUCTION NEURONALE
 */
function checkIntroStatus() {
    // Vérifier si l'intro a déjà été vue
    const introSeen = localStorage.getItem('neural-intro-seen');
    
    if (introSeen === 'true') {
        skipIntro();
    } else {
        startNeuralIntro();
    }
}

function startNeuralIntro() {
    const neuralLoader = document.getElementById('neural-loader');
    const mainInterface = document.getElementById('main-interface');
    const enterButton = document.getElementById('enter-interface');
    const neuralTyped = document.getElementById('neural-typed');
    
    // Séquence de texte animé
    const introSequence = [
        'Lancement de la synchronisation neuronale...',
        'Analyse du réseau cognitif en cours...',
        'Profil détecté : Bahae Aouanet',
        'Statut : Ingénieur informatique full stack',
        'Ouverture de l\'archive mentale...',
        'Accès autorisé ✓'
    ];
    
    let currentStep = 0;
    
    function typeNextStep() {
        if (currentStep < introSequence.length) {
            neuralTyped.innerHTML = '';
            typeText(neuralTyped, introSequence[currentStep], 50, () => {
                playSound('notification');
                currentStep++;
                setTimeout(typeNextStep, 800);
            });
        } else {
            // Afficher le bouton d'entrée
            setTimeout(() => {
                enterButton.style.display = 'block';
                playSound('scan');
            }, 1000);
        }
    }
    
    // Démarrer la séquence après un délai
    setTimeout(() => {
        playSound('scan');
        typeNextStep();
    }, 2000);
    
    // Gérer le clic sur le bouton d'entrée
    enterButton.addEventListener('click', function() {
        playSound('click');
        enterInterface();
    });
}

function typeText(element, text, speed, callback) {
    let i = 0;
    element.innerHTML = '';
    
    function typeChar() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            playSound('typing', 0.05);
            i++;
            setTimeout(typeChar, speed);
        } else if (callback) {
            callback();
        }
    }
    
    typeChar();
}

function enterInterface() {
    const neuralLoader = document.getElementById('neural-loader');
    const mainInterface = document.getElementById('main-interface');
    
    // Animation de transition
    neuralLoader.style.opacity = '0';
    neuralLoader.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        neuralLoader.style.display = 'none';
        mainInterface.style.display = 'block';
        mainInterface.style.opacity = '0';
        
        // Animation d'apparition de l'interface principale
        setTimeout(() => {
            mainInterface.style.opacity = '1';
            localStorage.setItem('neural-intro-seen', 'true');
            initializeMainInterface();
        }, 100);
    }, 500);
}

function skipIntro() {
    document.getElementById('neural-loader').style.display = 'none';
    document.getElementById('main-interface').style.display = 'block';
    initializeMainInterface();
}

function initializeMainInterface() {
    // Initialiser l'animation du héros
    initializeHeroTyping();
    
    // Démarrer les animations de fond
    animateNeuralNetwork();
    
    // Initialiser la navigation active
    updateActiveNavLink();
}

/**
 * NAVIGATION NEURONALE
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navToggle = document.querySelector('.nav-toggle');
    
    // Navigation smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            playSound('click');
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
        
        // Effets sonores sur hover
        link.addEventListener('mouseenter', () => playSound('hover'));
    });
    
    // Navigation mobile (à développer si nécessaire)
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            playSound('click');
            // Ajouter logique menu mobile
        });
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section, .hero-section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 200) {
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
}

/**
 * ANIMATIONS HERO
 */
function initializeHeroTyping() {
    const heroTyped = document.getElementById('hero-typed');
    
    if (heroTyped) {
        const heroTexts = [
            "Développeur Full Stack en formation",
  "Concepteur d’applications digitales",
  "Passionné par l’IA et l’innovation",
  "Créateur de solutions utiles et modernes"
        ];
        
        new Typed(heroTyped, {
            strings: heroTexts,
            typeSpeed: 80,
            backSpeed: 50,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '█',
            onStringTyped: () => playSound('notification', 0.05)
        });
    }
}

function initializeHeroAnimations() {
    // Animation des statistiques avec compteurs
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(counter);
            playSound('notification');
        }
        element.textContent = Math.floor(current);
    }, 16);
}

function animateNeuralNetwork() {
    // Animation du réseau de neurones en arrière-plan
    const nodes = document.querySelectorAll('.neural-node');
    
    nodes.forEach((node, index) => {
        const delay = index * 1000;
        
        setInterval(() => {
            node.style.animation = 'none';
            node.offsetHeight; // Trigger reflow
            node.style.animation = `nodeFloat 4s ease-in-out infinite`;
        }, 8000 + delay);
    });
}

/**
 * SYSTÈME ORBITAL DES COMPÉTENCES
 */
function initializeSkillsOrbit() {
    const skillNodes = document.querySelectorAll('.skill-node');
    const skillDetails = document.getElementById('skill-details');
    const detailTitle = document.getElementById('detail-title');
    const detailDescription = document.getElementById('detail-description');
    const detailProjects = document.getElementById('detail-projects');
    
    // Données des compétences
    const skillsData = {
        react: {
            title: 'React.js',
            description: 'Framework JavaScript moderne pour le développement d\'interfaces utilisateur interactives et performantes.',
            projects: ['E-Learning Platform', 'Dashboard Analytics', 'E-commerce Mobile']
        },
        vue: {
            title: 'Vue.js',
            description: 'Framework progressif pour la création d\'applications web modernes avec une architecture composant.',
            projects: ['Marketplace B2B', 'CRM System', 'Portfolio Dynamique']
        },
        angular: {
            title: 'Angular',
            description: 'Plateforme de développement robuste pour applications web d\'entreprise avec TypeScript.',
            projects: ['ERP Enterprise', 'Banking Platform', 'Monitoring Dashboard']
        },
        nodejs: {
            title: 'Node.js',
            description: 'Runtime JavaScript côté serveur pour développer des applications scalables et performantes.',
            projects: ['API Microservices', 'Real-time Chat', 'IoT Data Processing']
        },
        python: {
            title: 'Python',
            description: 'Langage polyvalent excellent pour l\'IA, l\'automatisation et le développement backend.',
            projects: ['ML Algorithms', 'Data Pipeline', 'API REST Flask']
        },
        java: {
            title: 'Java',
            description: 'Langage robuste pour applications d\'entreprise et systèmes distribués haute performance.',
            projects: ['Banking System', 'Microservices Spring', 'Android App']
        },
        'react-native': {
            title: 'React Native',
            description: 'Framework pour développer des applications mobiles natives cross-platform avec JavaScript.',
            projects: ['Fintech App', 'Social Network', 'E-commerce Mobile']
        },
        flutter: {
            title: 'Flutter',
            description: 'SDK Google pour créer des applications natives iOS et Android avec Dart.',
            projects: ['Healthcare App', 'Food Delivery', 'Fitness Tracker']
        },
        tensorflow: {
            title: 'TensorFlow',
            description: 'Plateforme d\'apprentissage automatique pour développer et déployer des modèles IA.',
            projects: ['Image Recognition', 'NLP Chatbot', 'Recommendation Engine']
        },
        pytorch: {
            title: 'PyTorch',
            description: 'Framework de deep learning flexible pour la recherche et la production en IA.',
            projects: ['Computer Vision', 'Neural Networks', 'AI Research']
        },
        aws: {
            title: 'Amazon Web Services',
            description: 'Plateforme cloud complète pour héberger et gérer des applications à grande échelle.',
            projects: ['Serverless Architecture', 'Container Orchestration', 'Data Lake']
        },
        docker: {
            title: 'Docker',
            description: 'Plateforme de conteneurisation pour développer, tester et déployer des applications.',
            projects: ['Microservices Stack', 'CI/CD Pipeline', 'Development Environment']
        }
    };
    
    skillNodes.forEach(node => {
        node.addEventListener('click', function() {
            playSound('click');
            
            const skillKey = this.getAttribute('data-skill');
            const skillData = skillsData[skillKey];
            
            if (skillData) {
                detailTitle.textContent = skillData.title;
                detailDescription.textContent = skillData.description;
                
                detailProjects.innerHTML = '<h5>Projets réalisés :</h5><ul>' + 
                    skillData.projects.map(project => `<li>${project}</li>`).join('') + 
                    '</ul>';
                
                // Animation de mise à jour
                skillDetails.style.opacity = '0';
                setTimeout(() => {
                    skillDetails.style.opacity = '1';
                }, 150);
            }
        });
        
        node.addEventListener('mouseenter', () => playSound('hover'));
    });
    
    // Filtres des compétences
    const filterBtns = document.querySelectorAll('.skills-filter .filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            playSound('click');
            
            // Mise à jour des boutons actifs
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filtrage des compétences
            skillNodes.forEach(node => {
                if (filter === 'all' || node.classList.contains(filter)) {
                    node.style.opacity = '1';
                    node.style.transform = 'scale(1)';
                } else {
                    node.style.opacity = '0.3';
                    node.style.transform = 'scale(0.8)';
                }
            });
        });
        
        btn.addEventListener('mouseenter', () => playSound('hover'));
    });
}

/**
 * SYSTÈME DE FILTRAGE PROJETS
 */
function initializeProjectFilters() {
    const filterBtns = document.querySelectorAll('.projects-filter .filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            playSound('click');
            
            // Mise à jour des boutons actifs
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Animation de filtrage
            projectCards.forEach(card => {
                if (filter === 'all' || card.classList.contains(filter)) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-20px)';
                    
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
        
        btn.addEventListener('mouseenter', () => playSound('hover'));
    });
    
    // Effets sonores sur les cartes projet
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => playSound('hover'));
        card.addEventListener('click', () => playSound('click'));
    });
}

/**
 * FORMULAIRE DE CONTACT NEURONAL
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    const inputs = document.querySelectorAll('.neural-input, .neural-select, .neural-textarea');
    const downloadBtn = document.getElementById('download-cv');
    
    // Animations des champs de saisie
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            playSound('scan', 0.05);
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
        
        input.addEventListener('input', function() {
            playSound('typing', 0.02);
        });
    });
    
    // Soumission du formulaire
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            playSound('notification');
            
            // Animation de soumission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Transmission en cours...';
            submitBtn.disabled = true;
            
            // Simulation d'envoi
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message transmis !';
                submitBtn.style.background = 'var(--gradient-primary)';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    contactForm.reset();
                }, 3000);
            }, 2000);
        });
    }
    
    // Téléchargement CV
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            playSound('click');
            
            // Animation de téléchargement
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-download fa-spin"></i> Téléchargement...';
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check"></i> CV téléchargé !';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            }, 1500);
        });
    }
}

/**
 * ANIMATIONS DE SCROLL
 */
function initializeScrollAnimations() {
    // Parallax pour les éléments de fond
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.neural-background-main');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // Animation des éléments au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                playSound('notification', 0.03);
            }
        });
    }, observerOptions);
    
    // Observer les sections
    document.querySelectorAll('.section').forEach(section => {
        scrollObserver.observe(section);
    });
}

/**
 * COMPTEURS ANIMÉS
 */
function initializeCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

/**
 * EFFETS PARALLAX
 */
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-parallax') || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

/**
 * EFFETS SONORES GÉNÉRAUX
 */
function initializeSoundEffects() {
    // Boutons
    document.querySelectorAll('.neural-btn, .btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => playSound('hover'));
        btn.addEventListener('click', () => playSound('click'));
    });
    
    // Liens de navigation
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('mouseenter', () => playSound('hover', 0.05));
    });
    
    // Cartes interactives
    document.querySelectorAll('.identity-card, .timeline-card, .service-module').forEach(card => {
        card.addEventListener('mouseenter', () => playSound('hover', 0.03));
    });
    
    // Modules de service
    document.querySelectorAll('.module-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            playSound('click');
            
            // Animation d'activation
            const statusLight = this.closest('.service-module').querySelector('.status-light');
            statusLight.style.background = 'var(--accent-cyan)';
            statusLight.style.animation = 'statusBlink 0.5s ease-in-out 3';
            
            // Feedback visuel
            this.innerHTML = '<i class="fas fa-check"></i><span>Module Activé</span>';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-power-off"></i><span>Activer Module</span>';
            }, 2000);
        });
    });
}

/**
 * UTILITAIRES
 */

// Fonction pour redémarrer l'intro
function restartIntro() {
    localStorage.removeItem('neural-intro-seen');
    location.reload();
}

// Fonction pour basculer les sons
function toggleSound() {
    soundEnabled = !soundEnabled;
    playSound('click');
    console.log('Sons:', soundEnabled ? 'activés' : 'désactivés');
}

// Fonction pour smooth scroll personnalisé
function smoothScrollTo(targetId) {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Gestion des erreurs globales
window.addEventListener('error', function(e) {
    console.warn('Erreur détectée:', e.error);
});

// Console easter egg
console.log(`
╔══════════════════════════════════════════════════════════╗
║                 NEURAL INTERFACE ACTIVE                 ║
║              Portfolio de Bahae Aouanet                 ║
║                                                          ║
║  Commandes disponibles:                                  ║
║  - restartIntro() : Relancer la séquence d'intro        ║
║  - toggleSound()  : Activer/désactiver les sons         ║
║                                                          ║
║  Interface développée avec passion et technologie ❤️    ║
╚══════════════════════════════════════════════════════════╝
`);

// Exportation pour utilisation globale
window.neuralPortfolio = {
    restartIntro,
    toggleSound,
    smoothScrollTo,
    playSound
};
