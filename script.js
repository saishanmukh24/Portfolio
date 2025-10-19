// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  hamburger.classList.toggle('active');
  
  // Prevent body scroll when menu is open
  if (navMenu.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Close mobile menu on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('active')) {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Handle window resize
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 100) {
    navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
    navbar.style.borderBottom = '1px solid var(--primary-color)';
  } else {
    navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    navbar.style.boxShadow = 'none';
    navbar.style.borderBottom = '1px solid var(--border-color)';
  }
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-up');
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.section, .project-card, .skill-category, .timeline-item, .testimonial-card');
  animatedElements.forEach(el => observer.observe(el));
});

// Contact form handling with EmailJS + fallback
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    if (!name || !email || !subject || !message) {
      alert('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    // EmailJS configuration from data attributes
    const serviceId = contactForm.getAttribute('data-emailjs-service');
    const templateId = contactForm.getAttribute('data-emailjs-template');
    const publicKey = contactForm.getAttribute('data-emailjs-public-key');

    const emailJsConfigured = serviceId && templateId && publicKey && window.emailjs;

    try {
      if (emailJsConfigured) {
        // Init and send via EmailJS
        emailjs.init(publicKey);
        await emailjs.send(serviceId, templateId, {
          from_name: name,
          from_email: email,
          subject,
          message,
        });
        alert('Thanks! Your message was sent successfully.');
        contactForm.reset();
      } else {
        // Fallback to mailto
        const mailtoLink = `mailto:saishanmukh484@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
        window.location.href = mailtoLink;
        alert('Your email app should open with a pre-filled message.');
      }
    } catch (err) {
      console.error('Email send failed:', err);
      alert('Sorry, there was an error sending your message. Please try again or email me directly at saishanmukh484@gmail.com');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    }
  });
}

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Helper to type only prefix and then append preserved name span
function typeHeroTitlePrefixThenName(heroTitleElement, speed = 50) {
  const existingNameSpan = heroTitleElement.querySelector('.highlight');
  const fallbackName = 'V.S.K.S Sai Shanmukh';
  const sourceNameText = existingNameSpan ? existingNameSpan.textContent : '';
  const nameText = (sourceNameText && sourceNameText.trim().length > 0) ? sourceNameText : fallbackName;
  const prefixText = "Hi, I'm ";

  // Clear and prepare
  heroTitleElement.innerHTML = '';
  const prefixSpan = document.createElement('span');
  heroTitleElement.appendChild(prefixSpan);

  let i = 0;
  function type() {
    if (i < prefixText.length) {
      // Use textContent to avoid injecting HTML
      prefixSpan.textContent += prefixText.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      // After typing prefix, animate the name per character
      const nameSpan = document.createElement('span');
      nameSpan.className = 'highlight animated';
      heroTitleElement.appendChild(nameSpan);

      // Create per-letter spans (preserve spaces using non-breaking spaces)
      Array.from(nameText).forEach((ch, idx) => {
        const span = document.createElement('span');
        span.className = 'name-char';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.animationDelay = `${idx * 60}ms`;
        nameSpan.appendChild(span);
      });
    }
  }

  type();
}

// Initialize typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    // Type only the prefix and then append the highlighted name to avoid typing HTML
    setTimeout(() => {
      typeHeroTitlePrefixThenName(heroTitle, 50);
    }, 500);
  }
  
  // Add floating animation to hero elements
  const heroElements = document.querySelectorAll('.hero-text > *');
  heroElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.2}s`;
    element.classList.add('fade-in-up');
  });
  
  // Add floating animation to profile placeholder
  const profilePlaceholder = document.querySelector('.profile-placeholder');
  if (profilePlaceholder) {
    profilePlaceholder.classList.add('float');
  }
  
  // Add pulse animation to buttons
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.classList.add('pulse');
    });
    button.addEventListener('mouseleave', () => {
      button.classList.remove('pulse');
    });
  });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  if (hero) {
    const rate = scrolled * -0.5;
    hero.style.transform = `translateY(${rate}px)`;
  }
});

// Skill items hover effect with glow
document.querySelectorAll('.skill-item').forEach(item => {
  item.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-2px) scale(1.05)';
    this.style.boxShadow = '0 0 15px rgba(0, 212, 255, 0.5)';
    this.style.borderColor = 'var(--primary-color)';
  });
  
  item.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
    this.style.boxShadow = '';
    this.style.borderColor = '';
  });
});

// Add glow effect to skill categories
document.querySelectorAll('.skill-category').forEach(category => {
  category.addEventListener('mouseenter', function() {
    this.style.boxShadow = 'var(--shadow-lg), var(--glow)';
  });
  
  category.addEventListener('mouseleave', function() {
    this.style.boxShadow = 'var(--shadow)';
  });
});

// Add rotating animation to skill category icons
document.querySelectorAll('.skill-category-title i').forEach(icon => {
  icon.addEventListener('mouseenter', function() {
    this.classList.add('rotate');
  });
  
  icon.addEventListener('mouseleave', function() {
    this.classList.remove('rotate');
  });
});

// Project cards 3D tilt effect
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
  });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  function updateCounter() {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start) + '+';
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target + '+';
    }
  }
  
  updateCounter();
}

// Animate counters when they come into view
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumber = entry.target.querySelector('h3');
      const target = parseInt(statNumber.textContent);
      animateCounter(statNumber, target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
  statsObserver.observe(stat);
});

// Add loading animation
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  
  // Add computer engineering specific animations
  addComputerEngineeringEffects();
});

// Computer Engineering specific effects (optimized for mobile)
function addComputerEngineeringEffects() {
  // Only add heavy effects on desktop
  if (window.innerWidth > 768 && !isMobileDevice()) {
    // Add circuit board pattern to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
      const circuitPattern = document.createElement('div');
      circuitPattern.className = 'circuit-pattern';
      circuitPattern.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="circuit" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="none" stroke="%2300d4ff" stroke-width="0.5" opacity="0.1"/><circle cx="10" cy="10" r="1" fill="%2300d4ff" opacity="0.2"/></pattern></defs><rect width="100" height="100" fill="url(%23circuit)"/></svg>');
        opacity: 0.3;
        z-index: 1;
        pointer-events: none;
      `;
      hero.appendChild(circuitPattern);
    }
    
    // Add binary code animation to hero text
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      const binaryOverlay = document.createElement('div');
      binaryOverlay.className = 'binary-overlay';
      binaryOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        color: var(--primary-color);
        font-family: 'Courier New', monospace;
        font-size: 12px;
        opacity: 0.1;
        overflow: hidden;
        pointer-events: none;
        z-index: 2;
      `;
      heroTitle.style.position = 'relative';
      heroTitle.appendChild(binaryOverlay);
      
      // Animate binary code
      animateBinaryCode(binaryOverlay);
    }
  }
  
  // Add tech stack animation to skills (optimized for mobile)
  const skillCategories = document.querySelectorAll('.skill-category');
  skillCategories.forEach((category, index) => {
    category.style.animationDelay = `${index * 0.1}s`;
    category.classList.add('slide-in-left');
  });
  
  // Add project cards staggered animation (optimized for mobile)
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
    card.classList.add('slide-in-right');
  });
}

// Binary code animation
function animateBinaryCode(element) {
  const binaryChars = '01';
  const rows = Math.floor(element.offsetHeight / 16);
  const cols = Math.floor(element.offsetWidth / 8);
  
  function generateBinary() {
    let binary = '';
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        binary += binaryChars[Math.floor(Math.random() * binaryChars.length)];
      }
      binary += '\n';
    }
    element.textContent = binary;
  }
  
  generateBinary();
  setInterval(generateBinary, 100);
}

// Back to top button
const backToTopButton = document.createElement('button');
backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopButton.className = 'back-to-top';
backToTopButton.style.cssText = `
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
  z-index: 1000;
`;

document.body.appendChild(backToTopButton);

// Show/hide back to top button
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopButton.style.display = 'flex';
  } else {
    backToTopButton.style.display = 'none';
  }
});

// Back to top functionality
backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Add hover effect to back to top button
backToTopButton.addEventListener('mouseenter', function() {
  this.style.transform = 'translateY(-2px) scale(1.1)';
});

backToTopButton.addEventListener('mouseleave', function() {
  this.style.transform = 'translateY(0) scale(1)';
});

// Particle System for Hero Section
class ParticleSystem {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    
    this.init();
  }
  
  init() {
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '1';
    this.canvas.style.opacity = '0.6';
    
    document.body.appendChild(this.canvas);
    
    this.resize();
    this.createParticles();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticles() {
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Wrap around screen
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
      
      // Mouse interaction
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        particle.x -= dx * 0.01;
        particle.y -= dy * 0.01;
      }
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
      this.ctx.fill();
    });
    
    // Draw connections
    this.particles.forEach((particle, i) => {
      this.particles.slice(i + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(otherParticle.x, otherParticle.y);
          this.ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - distance / 100)})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      });
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize particle system (only on desktop for performance)
let particleSystem;
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize particle system on desktop devices
  if (window.innerWidth > 768 && !isMobileDevice()) {
    particleSystem = new ParticleSystem();
  }
});

// Mobile device detection
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         window.innerWidth <= 768;
}

// Touch-friendly interactions
function addTouchInteractions() {
  // Add touch feedback to buttons
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.95)';
    });
    
    button.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
    });
  });
  
  // Add touch feedback to skill items
  document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.95)';
    });
    
    item.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
    });
  });
  
  // Add touch feedback to project cards
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.98)';
    });
    
    card.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
    });
  });
}

// Initialize touch interactions
document.addEventListener('DOMContentLoaded', () => {
  addTouchInteractions();
});

// Console welcome message
console.log(`
🚀 Welcome to V.S.K.S Sai Shanmukh's Portfolio!
💻 Computer Science Student & AI/ML Enthusiast
🎓 B.Tech CSE (AI & ML) at Raghu Institute of Technology
📍 Visakhapatnam, Andhra Pradesh
📧 Contact: saishanmukh484@gmail.com
📱 Phone: +91 7337408052
🔗 LinkedIn: https://www.linkedin.com/in/saishanmukh24/
`);

// Performance optimization: Lazy load images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}
