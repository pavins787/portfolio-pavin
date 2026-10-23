/**
 * PAVIN S - PORTFOLIO INTERACTION LOGIC
 * Pure Vanilla JavaScript: Typing effect, Theme switch, 3D Tilt, Canvas Particles, Gmail Toggle & Copy
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DYNAMIC ROTATING TYPING EFFECT
  const typingElement = document.getElementById('typing-text');
  const words = [
    'KGCAS Student • 2nd Year',
    'Java Software Developer',
    'Punjai Puliampatti, India',
    'Healthcare System Architect',
    'Problem Solver & Tech Explorer'
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function typeEffect() {
    if (!typingElement) return;
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typingElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 45;
    } else {
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 90;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typeSpeed = 1800; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 400; // Pause before new word
    }

    setTimeout(typeEffect, typeSpeed);
  }
  typeEffect();

  // 2. THEME ACCENT COLOR SWITCHER
  const colorBtns = document.querySelectorAll('.color-btn');
  const savedAccent = localStorage.getItem('pavin_portfolio_accent') || 'cyan';

  function setAccent(accentName) {
    document.body.setAttribute('data-accent', accentName);
    colorBtns.forEach(btn => {
      if (btn.dataset.color === accentName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    localStorage.setItem('pavin_portfolio_accent', accentName);
  }

  setAccent(savedAccent);

  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.dataset.color;
      setAccent(color);
      showToast(`Theme accent switched to ${color.toUpperCase()}`);
    });
  });

  // 3. GMAIL INTERACTIVE TOGGLE & COLLAPSIBLE PANEL
  const gmailToggle = document.getElementById('gmail-toggle-switch');
  const gmailPanel = document.getElementById('gmail-panel');

  if (gmailToggle && gmailPanel) {
    gmailToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        gmailPanel.classList.remove('collapsed');
        showToast('Gmail panel expanded');
      } else {
        gmailPanel.classList.add('collapsed');
        showToast('Gmail panel collapsed');
      }
    });
  }

  // 4. ONE-CLICK EMAIL COPY & TOAST NOTIFICATION
  const copyBtn = document.getElementById('copy-email-btn');
  const targetEmail = document.getElementById('target-email');

  if (copyBtn && targetEmail) {
    copyBtn.addEventListener('click', async () => {
      const email = targetEmail.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        const originalLabel = copyBtn.querySelector('.copy-label').textContent;
        copyBtn.querySelector('.copy-label').textContent = 'Copied!';
        copyBtn.style.background = 'var(--accent-color)';
        copyBtn.style.color = '#fff';
        showToast(`Copied ${email} to clipboard!`);

        setTimeout(() => {
          copyBtn.querySelector('.copy-label').textContent = originalLabel;
          copyBtn.style.background = '';
          copyBtn.style.color = '';
        }, 2200);
      } catch (err) {
        // Fallback copy method
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied ${email} to clipboard!`);
      }
    });
  }

  // 5. TOAST FEEDBACK SYSTEM
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  let toastTimeout;

  function showToast(message) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // 6. CONTACT FORM SUBMISSION TO GMAIL / MAILTO
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('sender-name').value.trim();
      const email = document.getElementById('sender-email').value.trim();
      const subject = document.getElementById('sender-subject').value.trim();
      const message = document.getElementById('sender-message').value.trim();

      const recipient = '25bit132@kgcas.com';
      const fullSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject} - from ${name}`);
      const bodyContent = encodeURIComponent(
        `Hi Pavin,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nSent via Pavin S Portfolio Website`
      );

      // Trigger user's email client
      const mailtoLink = `mailto:${recipient}?subject=${fullSubject}&body=${bodyContent}`;
      window.location.href = mailtoLink;

      showToast(`Opening mail client to send to ${recipient}...`);
      contactForm.reset();
    });
  }

  // 7. 3D TILT EFFECT ON AVATAR CARD
  const cardWrapper = document.getElementById('profile-card');
  if (cardWrapper && window.innerWidth > 992) {
    const card = cardWrapper.querySelector('.avatar-card');

    cardWrapper.addEventListener('mousemove', (e) => {
      const rect = cardWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    cardWrapper.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // 8. ACTIVE NAV LINK SCROLL SPY
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  function scrollSpy() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', scrollSpy);

  // 9. MOBILE MENU TOGGLE
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.style.display === 'block';
      mobileMenu.style.display = isOpen ? 'none' : 'block';
      mobileToggle.classList.toggle('open');
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.style.display = 'none';
        mobileToggle.classList.remove('open');
      });
    });
  }

  // 10. CURRENT YEAR IN FOOTER
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 11. SUBTLE AMBIENT CANVAS BACKGROUND PARTICLES
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 20), 55);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.6;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.alpha = Math.random() * 0.45 + 0.15;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles with subtle lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.strokeStyle = `rgba(148, 163, 184, ${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }
});
