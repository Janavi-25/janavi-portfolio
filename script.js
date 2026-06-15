// ========================================
// Janavi Parmar - UI/UX Designer Portfolio
// Main JavaScript File - Firestore Version
// ========================================

import { FirestoreService } from './firestoreService.js';

// Make FirestoreService available globally
window.FirestoreService = FirestoreService;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize UI components
  initLoader();
  initTheme();
  initNavbar();
  initSmoothScroll();
  initScrollProgress();
  initTypingAnimation();
  initProjectFilters();
  initCaseStudyModal();
  initContactForm();
  initBackToTop();

  // Initialize Firestore real-time subscriptions
  initFirestoreSubscriptions();
});

// ========================================
// FIRESTORE REAL-TIME SUBSCRIPTIONS
// ========================================
let currentProjects = [];
let currentCategory = 'All';
let searchQuery = '';

function initFirestoreSubscriptions() {
  // Subscribe to projects
  FirestoreService.subscribeToProjects((projects) => {
    currentProjects = projects;
    filterProjects();
  });

  // Subscribe to experiences
  FirestoreService.subscribeToExperiences((experiences) => {
    renderExperience(experiences);
  });

  // Subscribe to certifications
  FirestoreService.subscribeToCertifications((certifications) => {
    renderCertifications(certifications);
  });

  // Subscribe to skills
  FirestoreService.subscribeToSkills((skills) => {
    renderSkills(skills);
    initSkillBars();
  });

  // Load one-time data
  loadStaticData();

  // Show warning if Firebase not configured
  if (!FirestoreService.isReady()) {
    console.warn("Firebase not configured. Data will not persist.");
  }
}

async function loadStaticData() {
  try {
    const [aboutContent, contactInfo, personalInfo] = await Promise.all([
      FirestoreService.getAboutContent(),
      FirestoreService.getContactInfo(),
      FirestoreService.getPersonalInfo()
    ]);

    renderAboutSection(aboutContent);
    renderContactInfo(contactInfo, personalInfo);
    updateHeroLocation(personalInfo);
    updateResumeLink(personalInfo);
  } catch (error) {
    console.error("Error loading static data:", error);
  }
}


const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: contactForm.name.value,
      email: contactForm.email.value,
      subject: contactForm.subject.value,
      message: contactForm.message.value
    };

    try {
      await FirestoreService.saveContactMessage(formData);

      alert("Message Sent Successfully!");
      contactForm.reset();

    } catch (error) {
      console.error(error);
      alert("Failed to send message.");
    }
  });
}

// ========================================
// LOADER
// ========================================
function initLoader() {
  const loader = document.getElementById('loader');
  const loaderBar = document.querySelector('.loader-bar-inner');
  let progress = 0;

  const timer = setInterval(() => {
    progress += 2;
    if (loaderBar) {
      loaderBar.style.width = progress + '%';
    }

    if (progress >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        if (loader) {
          loader.style.opacity = '0';
          loader.style.pointerEvents = 'none';
          setTimeout(() => {
            loader.style.display = 'none';
          }, 300);
        }
      }, 300);
    }
  }, 30);
}

// ========================================
// THEME TOGGLE
// ========================================
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
  } else if (!savedTheme) {
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      document.body.classList.add('light-mode');
    }
  }

  if (themeToggle) {
    updateThemeIcon();
    themeToggle.addEventListener('click', toggleTheme);
  }
}

function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  updateThemeIcon();
}

function updateThemeIcon() {
  const themeToggle = document.getElementById('theme-toggle');
  const isLight = document.body.classList.contains('light-mode');

  if (themeToggle) {
    themeToggle.innerHTML = isLight
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
  }
}



// ========================================
// NAVBAR
// ========================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
    updateActiveSection();
  });

  mobileToggle?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('open');
    const isOpen = mobileMenu?.classList.contains('open');
    mobileToggle.innerHTML = isOpen
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>';
  });
}

function updateActiveSection() {
  const sections = ['home', 'about', 'skills', 'experience', 'projects', 'certifications', 'contact'];
  let currentSection = 'home';

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = document.getElementById(sections[i]);
    if (section) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 150) {
        currentSection = sections[i];
        break;
      }
    }
  }

  document.querySelectorAll('.navbar-menu-item, .mobile-menu-item').forEach(link => {
    const href = link.getAttribute('href')?.replace('#', '') || link.getAttribute('data-section');
    if (href === currentSection) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ========================================
// SMOOTH SCROLL
// ========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"], [data-section]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href')?.substring(1) || this.getAttribute('data-section');
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ========================================
// SCROLL PROGRESS
// ========================================
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress-inner');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = progress + '%';
    }
  });
}

// ========================================
// TYPING ANIMATION
// ========================================
function initTypingAnimation() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const roles = ["UI/UX Designer", "Creative Thinker", "Problem Solver"];
  let currentRole = 0;
  let currentText = '';
  let isDeleting = false;

  function type() {
    const role = roles[currentRole];

    if (!isDeleting) {
      currentText = role.substring(0, currentText.length + 1);
      typingElement.textContent = currentText;

      if (currentText === role) {
        setTimeout(() => {
          isDeleting = true;
          setTimeout(type, 50);
        }, 2000);
        return;
      }
    } else {
      currentText = currentText.substring(0, currentText.length - 1);
      typingElement.textContent = currentText;

      if (currentText === '') {
        isDeleting = false;
        currentRole = (currentRole + 1) % roles.length;
      }
    }

    setTimeout(type, isDeleting ? 50 : 100);
  }

  type();
}

// ========================================
// PROJECT FILTERS
// ========================================
function initProjectFilters() {
  const searchInput = document.getElementById('project-search');
  const categoryBtns = document.querySelectorAll('.projects-category');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      filterProjects();
    });
  }

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.textContent;
      filterProjects();
    });
  });
}

function filterProjects() {
  const filteredProjects = currentProjects.filter(project => {
    const matchesSearch = project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = currentCategory === 'All' || project.category === currentCategory;
    return matchesSearch && matchesCategory;
  });

  renderProjects(filteredProjects);
}

function renderProjects(projectList) {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  if (projectList.length === 0) {
    container.innerHTML = `
      <div class="projects-empty">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <p>No projects found matching your criteria.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = projectList.map(project => `
    <div class="project-card" data-project-id="${project.id}">
      <div class="project-image">
        <img src="${project.thumbnail || ''}" alt="${project.title || ''}" loading="lazy">
        <div class="project-image-overlay"></div>
        <span class="project-category-badge">${project.category || ''}</span>
      </div>
      <div class="project-content">
        <h3 class="project-title">${project.title || ''}</h3>
        <p class="project-description">${project.description || ''}</p>
        <div class="project-tools">
          ${(project.tools || []).slice(0, 3).map(tool => `<span class="project-tool">${tool}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');

  attachProjectCardListeners();
}

function attachProjectCardListeners() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.dataset.projectId;
      openCaseStudyModal(projectId);
    });
  });
}

// ========================================
// CASE STUDY MODAL
// ========================================
function initCaseStudyModal() {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      closeCaseStudyModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCaseStudyModal();
    }
  });
}

function openCaseStudyModal(projectId) {
  const project = currentProjects.find(p => p.id === projectId);
  if (!project) return;

  const modal = document.getElementById('case-study-modal');
  const modalContent = document.getElementById('modal-content');

  if (!modal || !modalContent) return;

  const caseStudy = project.caseStudy || {};

  modalContent.innerHTML = `
    <button class="modal-close" onclick="closeCaseStudyModal()">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>

    <div class="modal-image">
      <img src="${project.thumbnail || ''}" alt="${project.title || ''}">
    </div>

    <div class="modal-body">
      <span class="modal-category">${project.category || ''}</span>
      <h2 class="modal-title">${project.title || ''}</h2>
      <p class="modal-description">${project.description || ''}</p>

      ${caseStudy.problem ? `
        <div class="modal-section">
          <h3 class="modal-section-title">Problem Statement</h3>
          <p class="modal-section-text">${caseStudy.problem}</p>
        </div>
      ` : ''}

      ${caseStudy.research ? `
        <div class="modal-section">
          <h3 class="modal-section-title">User Research</h3>
          <p class="modal-section-text">${caseStudy.research}</p>
        </div>
      ` : ''}

      ${caseStudy.painPoints && caseStudy.painPoints.length > 0 ? `
        <div class="modal-section">
          <h3 class="modal-section-title">Pain Points</h3>
          <ul class="modal-list">
            ${caseStudy.painPoints.map(point => `
              <li class="modal-list-item">
                <span class="modal-list-dot"></span>
                ${point}
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      ${caseStudy.solution ? `
        <div class="modal-section">
          <h3 class="modal-section-title">Solution</h3>
          <p class="modal-section-text">${caseStudy.solution}</p>
        </div>
      ` : ''}

      ${caseStudy.wireframes ? `
        <div class="modal-section">
          <h3 class="modal-section-title">Wireframes</h3>
          <p class="modal-section-text">${caseStudy.wireframes}</p>
        </div>
      ` : ''}

      ${caseStudy.finalUI ? `
        <div class="modal-section">
          <h3 class="modal-section-title">Final UI</h3>
          <p class="modal-section-text">${caseStudy.finalUI}</p>
        </div>
      ` : ''}

      ${caseStudy.learnings ? `
        <div class="modal-section">
          <h3 class="modal-section-title">Key Learnings</h3>
          <p class="modal-section-text">${caseStudy.learnings}</p>
        </div>
      ` : ''}

      <div class="modal-tools">
        ${(project.tools || []).map(tool => `<span class="modal-tool">${tool}</span>`).join('')}
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeCaseStudyModal() {
  const modal = document.getElementById('case-study-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

window.closeCaseStudyModal = closeCaseStudyModal;

// ========================================
// CONTACT FORM
// ========================================
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const errors = validateForm(data);

    form.querySelectorAll('.form-error').forEach(el => el.remove());
    form.querySelectorAll('.form-input, .form-textarea').forEach(el => el.classList.remove('error'));

    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, message]) => {
        const input = form.querySelector(`[name="${field}"]`);
        if (input) {
          input.classList.add('error');
          const errorEl = document.createElement('p');
          errorEl.className = 'form-error';
          errorEl.textContent = message;
          input.parentNode.appendChild(errorEl);
        }
      });
      return;
    }

    const submitBtn = form.querySelector('.form-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<div class="form-spinner"></div> Sending...';
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    showFormSuccess();
  });
}

function validateForm(data) {
  const errors = {};

  if (!data.name || !data.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!data.email || !data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!data.subject || !data.subject.trim()) {
    errors.subject = 'Subject is required';
  }

  if (!data.message || !data.message.trim()) {
    errors.message = 'Message is required';
  }

  return errors;
}

function showFormSuccess() {
  const formWrapper = document.getElementById('form-wrapper');
  if (!formWrapper) return;

  formWrapper.innerHTML = `
    <div class="form-success">
      <div class="form-success-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
      </div>
      <h3 class="form-success-title">Message Sent!</h3>
      <p class="form-success-text">Thank you for reaching out. I'll get back to you soon!</p>
    </div>
  `;
}

// ========================================
// BACK TO TOP
// ========================================
function initBackToTop() {
  const backToTop = document.getElementById('back-to-top');
  if (!backToTop) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.remove('hidden');
    } else {
      backToTop.classList.add('hidden');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ========================================
// ANIMATED COUNTERS
// ========================================
function initCounters() {
  const counters = document.querySelectorAll('.about-stat-number[data-value]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.dataset.value);
  const suffix = element.dataset.suffix || '';
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const animate = () => {
    current += step;
    if (current < target) {
      element.textContent = Math.floor(current) + suffix;
      requestAnimationFrame(animate);
    } else {
      element.textContent = target + suffix;
    }
  };

  animate();
}

// ========================================
// SKILL BARS
// ========================================
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-bar-fill[data-level]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const level = entry.target.dataset.level;
        entry.target.style.width = level + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  skillBars.forEach(bar => observer.observe(bar));
}

// ========================================
// RENDER FUNCTIONS
// ========================================
function renderNavigation() {
  const desktopNav = document.getElementById('navbar-menu');
  const mobileNav = document.getElementById('mobile-menu-content');

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'contact', label: 'Contact' }
  ];

  const navHTML = navItems.map(item => `
    <a href="#${item.id}" class="navbar-menu-item" data-section="${item.id}">${item.label}</a>
  `).join('');

  const mobileHTML = navItems.map(item => `
    <a href="#${item.id}" class="mobile-menu-item" data-section="${item.id}">${item.label}</a>
  `).join('');

  if (desktopNav) desktopNav.innerHTML = navHTML;
  if (mobileNav) mobileNav.innerHTML = mobileHTML;
}

function renderAboutSection(aboutContent) {
  const aboutJourney = document.getElementById('about-journey');
  const aboutGoals = document.getElementById('about-goals');
  const aboutPhilosophy = document.getElementById('about-philosophy');

  if (aboutJourney) aboutJourney.textContent = aboutContent.journey || '';
  if (aboutGoals) aboutGoals.textContent = aboutContent.goals || '';
  if (aboutPhilosophy) aboutPhilosophy.textContent = aboutContent.philosophy || '';
}

function renderStats(highlights) {
  const container = document.getElementById('about-stats');
  if (!container) return;

  container.innerHTML = (highlights || []).map(highlight => `
    <div class="about-stat">
      <div class="about-stat-number" data-value="${(highlight.number || '0').replace(/\D/g, '')}" data-suffix="${(highlight.number || '').replace(/\d/g, '')}">${highlight.number || '0'}</div>
      <p class="about-stat-label">${highlight.label || ''}</p>
    </div>
  `).join('');
}

function renderSkills(skills) {
  const designSkills = document.getElementById('design-skills');
  const toolSkills = document.getElementById('tool-skills');
  const devSkills = document.getElementById('dev-skills');

  const skillHTML = (skillList) => (skillList || []).map(skill => `
    <div class="skill-item">
      <div class="skill-header">
        <span class="skill-name">${skill.name || ''}</span>
        <span class="skill-level">${skill.level || 0}%</span>
      </div>
      <div class="skill-bar">
        <div class="skill-bar-fill" data-level="${skill.level || 0}"></div>
      </div>
    </div>
  `).join('');

  if (designSkills) designSkills.innerHTML = skillHTML(skills.design);
  if (toolSkills) toolSkills.innerHTML = skillHTML(skills.tools);
  if (devSkills) devSkills.innerHTML = skillHTML(skills.development);
}

function renderExperience(experiences) {
  const container = document.getElementById('experience-list');
  if (!container) return;

  container.innerHTML = (experiences || []).map(exp => `
    <div class="experience-item">
      <div class="experience-dot"></div>
      <div class="experience-card">
        <div class="experience-header">
          <div>
            <h3 class="experience-title">${exp.role || ''}</h3>
            <div class="experience-company">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
              <span>${exp.company || ''}</span>
            </div>
          </div>
          <div class="experience-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            ${exp.period || ''}
          </div>
        </div>

        <div class="experience-meta">
          <span class="experience-type">${exp.type || ''}</span>
          <span class="experience-location">${exp.location || ''}</span>
        </div>

        ${exp.responsibilities && exp.responsibilities.length > 0 ? `
          <div class="experience-section">
            <h4 class="experience-section-title">Responsibilities</h4>
            <ul class="experience-list">
              ${exp.responsibilities.map(item => `
                <li class="experience-list-item check">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                  <span>${item}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        ${exp.achievements && exp.achievements.length > 0 ? `
          <div class="experience-section">
            <h4 class="experience-section-title">Achievements</h4>
            <ul class="experience-list">
              ${exp.achievements.map(item => `
                <li class="experience-list-item star">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <span>${item}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        ${exp.tools && exp.tools.length > 0 ? `
          <div class="experience-tools">
            ${exp.tools.map(tool => `<span class="experience-tool">${tool}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');
}

function renderCertifications(certifications) {
  const container = document.getElementById('certifications-grid');
  if (!container) return;

  container.innerHTML = (certifications || []).map(cert => `
    <div class="certification-card">
      <div class="certification-image">
        <img src="${cert.image || ''}" alt="${cert.title || ''}" loading="lazy">
        <div class="certification-image-overlay"></div>
      </div>
      <div class="certification-content">
        <div class="certification-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.39 12 22l-3.477-9.61a8 8 0 0 1 6.954 0Z"/></svg>
        </div>
        <div>
          <h3 class="certification-title">${cert.title || ''}</h3>
          <p class="certification-issuer">${cert.issuer || ''}</p>
          <p class="certification-date">${cert.date || ''}</p>
        </div>
      </div>
    </div>
  `).join('');
}

function renderContactInfo(contactInfo, personalInfo) {
  const container = document.getElementById('contact-info');
  if (!container) return;

  const socialLinks = {
    linkedin: "https://linkedin.com/in/janaviparmar",
    instagram: "https://instagram.com/janaviparmar",
    github: "https://github.com/janaviparmar"
  };

  container.innerHTML = `
    <div class="contact-card">
      <h3 class="contact-card-title">Contact Information</h3>

      <div class="contact-item">
        <div class="contact-icon primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        </div>
        <div>
          <p class="contact-label">Email</p>
          <a href="mailto:${contactInfo.email || ''}" class="contact-value">${contactInfo.email || ''}</a>
        </div>
      </div>

      <div class="contact-item">
        <div class="contact-icon accent">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        </div>
        <div>
          <p class="contact-label">Phone</p>
          <a href="tel:${contactInfo.phone || ''}" class="contact-value">${contactInfo.phone || ''}</a>
        </div>
      </div>

      <div class="contact-item">
        <div class="contact-icon green">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
        <div>
          <p class="contact-label">Location</p>
          <p class="contact-value">${contactInfo.location || ''}</p>
        </div>
      </div>

      <div class="contact-availability">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 13V8l-3-3 3-3"/><path d="M12 13V8l3-3-3-3"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 17v4"/><path d="M8 21h8"/></svg>
        <span>${contactInfo.availability || ''}</span>
      </div>
    </div>

    <div class="contact-card">
      <h3 class="contact-social-title">Follow Me</h3>
      <div class="contact-social-links">
        <a href="${socialLinks.linkedin}" target="_blank" rel="noopener noreferrer" class="contact-social-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
        </a>
        <a href="${socialLinks.instagram}" target="_blank" rel="noopener noreferrer" class="contact-social-link instagram">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M19 9h.01"/></svg>
        </a>
        <a href="${socialLinks.github}" target="_blank" rel="noopener noreferrer" class="contact-social-link github">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3-1 4-4 4-7.5 0-1.25-.5-2.5-1.5-3.5.5-1.5 0-3 0-3s-1.5.5-2.5 1c-1.5-.5-3-.5-4.5 0-1-.5-2.5-1-2.5-1s-.5 1.5 0 3c-1 1-1.5 2.25-1.5 3.5 0 3.5 1 6.5 4 7.5a4.8 4.8 0 0 0-1 3.5v4"/><path d="M9 22c-2.5 0-4-1-4-1"/></svg>
        </a>
      </div>
    </div>
  `;
}

function updateHeroLocation(personalInfo) {
  const badgeText = document.querySelector('.hero-badge-text');
  if (badgeText && personalInfo && personalInfo.location) {
    badgeText.textContent = personalInfo.location;
  }
}

function updateResumeLink(personalInfo) {
  const resumeLink = document.getElementById('resume-link');
  if (resumeLink && personalInfo) {
    resumeLink.href = personalInfo.resumeLink || '#';
    resumeLink.style.display = personalInfo.resumeLink && personalInfo.resumeLink !== '#' ? 'inline-flex' : 'none';
  }
}

function renderProjectCategories() {
  const container = document.getElementById('project-categories');
  if (!container) return;

  const categories = ['All', 'Mobile App', 'Dashboard', 'Web App'];

  container.innerHTML = categories.map((cat, index) => `
    <button class="projects-category ${index === 0 ? 'active' : ''}">${cat}</button>
  `).join('');
}

function renderFooter(personalInfo) {
  const copyright = document.getElementById('footer-copyright');
  if (copyright && personalInfo) {
    const year = new Date().getFullYear();
    copyright.textContent = `© ${year} ${personalInfo.name || ''}. All rights reserved.`;
  }
}

const designProcess = [
  {
    number: "01",
    title: "Research",
    description: "Understanding users, business goals, and project requirements."
  },
  {
    number: "02",
    title: "Wireframing",
    description: "Creating low-fidelity layouts to plan the user journey."
  },
  {
    number: "03",
    title: "UI Design",
    description: "Designing visually appealing and user-friendly interfaces."
  },
  {
    number: "04",
    title: "Prototype",
    description: "Building interactive prototypes for testing."
  },
  {
    number: "05",
    title: "Testing",
    description: "Collecting feedback and improving usability."
  },
  {
    number: "06",
    title: "Launch",
    description: "Delivering final designs ready for development."
  }
];

const processGrid = document.getElementById("process-grid");

if (processGrid) {
  processGrid.innerHTML = designProcess.map(step => `
    <div class="process-card">
      <div class="process-number">${step.number}</div>
      <h3>${step.title}</h3>
      <p>${step.description}</p>
    </div>
  `).join("");
}
// Initialize navigation and categories
renderNavigation();
renderProjectCategories();

