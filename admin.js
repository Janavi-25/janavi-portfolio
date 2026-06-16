// ========================================
// Admin Dashboard JavaScript
// CRUD Operations for Portfolio Content - Firestore Version
// ========================================

import { FirestoreService } from "./firestoreService.js";
import { auth } from "./firestoreService.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Hide page until auth checked
document.body.style.display = "none";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.replace("login.html");
    return;
  }

  document.body.style.display = "block";

  initAdmin();
  initTabs();
  initModals();
  loadData();
});

import {
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

window.logout = async function () {
  await signOut(auth);
  window.location.href = "login.html";
};

// Make FirestoreService available globally
window.FirestoreService = FirestoreService;


// ========================================
// INITIALIZATION
// ========================================
function initAdmin() {
  document.querySelectorAll('.sidebar-nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (item.dataset.section) {
        document.querySelectorAll('.sidebar-nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      }
    });
  });
}

function initTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabGroup = tab.closest('.tabs');
      const contentContainer = tabGroup.parentElement;

      tabGroup.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      contentContainer.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetContent = contentContainer.querySelector(`#${tab.dataset.tab}`);
      if (targetContent) targetContent.classList.add('active');
    });
  });
}

function initModals() {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay.id);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(modal => {
        closeModal(modal.id);
      });
    }
  });
}

async function loadData() {
  // Check if Firebase is configured
  if (!FirestoreService.isReady()) {
    showConfigWarning();
  }

  await Promise.all([
    loadDashboardStats(),
    loadProjects(),
    loadExperiences(),
    loadSkills(),
    loadCertifications(),
    loadMessages(),
    loadContactInfo(),
    loadAboutContent()
  ]);
}

function showConfigWarning() {
  const mainContent = document.querySelector('.main-content') || document.querySelector('main');
  if (mainContent) {
    const warning = document.createElement('div');
    warning.className = 'config-warning';
    warning.innerHTML = `
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 16px 24px; border-radius: 12px; margin: 20px; display: flex; align-items: center; gap: 12px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        <div>
          <strong>Firebase Not Configured</strong>
          <p style="margin: 4px 0 0 0; opacity: 0.9;">Add your Firebase credentials in <code style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px;">js/firestoreService.js</code> to enable the database.</p>
        </div>
      </div>
    `;
    mainContent.insertBefore(warning, mainContent.firstChild);
    showToast('Firebase not configured. Check js/firestoreService.js', 'error');
  }
}

// ========================================
// MODAL HELPERS
// ========================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ========================================
// TOAST NOTIFICATIONS
// ========================================
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <span class="toast-close" onclick="this.parentElement.remove()">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ========================================
// DASHBOARD STATS
// ========================================
async function loadDashboardStats() {
  try {
    const [projects, experiences, certifications, skills] = await Promise.all([
      FirestoreService.getProjects(),
      FirestoreService.getExperiences(),
      FirestoreService.getCertifications(),
      FirestoreService.getSkills()
    ]);

    const totalSkills = skills.design.length + skills.tools.length + skills.development.length;

    updateStatCard('stat-projects', projects.length);
    updateStatCard('stat-experience', experiences.length);
    updateStatCard('stat-certifications', certifications.length);
    updateStatCard('stat-skills', totalSkills);
  } catch (error) {
    console.error("Error loading dashboard stats:", error);
  }
}

function updateStatCard(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

// ========================================
// PROJECTS CRUD
// ========================================
async function loadProjects() {
  const container = document.getElementById('projects-table-body');
  if (!container) return;

  try {
    const projects = await FirestoreService.getProjects();

    if (projects.length === 0) {
      container.innerHTML = `
        <tr>
          <td colspan="4" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h6l6 18h6"/><path d="M14 3h7"/></svg>
            <p>No projects yet. Add your first project!</p>
          </td>
        </tr>
      `;
      return;
    }

    container.innerHTML = projects.map(project => `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="${project.thumbnail || ''}" alt="${project.title}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 6px;">
            <span>${project.title}</span>
          </div>
        </td>
        <td><span class="tag">${project.category || ''}</span></td>
        <td>${(project.tools || []).slice(0, 3).join(', ')}${(project.tools || []).length > 3 ? '...' : ''}</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-secondary btn-sm" onclick="editProject('${project.id}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
              Edit
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteProject('${project.id}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
              Delete
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error("Error loading projects:", error);
    showToast('Failed to load projects', 'error');
  }
}

function openAddProjectModal() {
  document.getElementById('project-form').reset();
  document.getElementById('project-id').value = '';
  document.getElementById('project-modal-title').textContent = 'Add New Project';
  document.getElementById('project-tools-list').innerHTML = '';
  document.getElementById('project-painpoints-list').innerHTML = '';
  addToolItem();
  addPainPointItem();
  openModal('project-modal');
}

async function editProject(id) {
  try {
    const projects = await FirestoreService.getProjects();
    const project = projects.find(p => p.id === id);
    if (!project) return;

    document.getElementById('project-id').value = id;
    document.getElementById('project-modal-title').textContent = 'Edit Project';
    document.getElementById('project-title').value = project.title || '';
    document.getElementById('project-category').value = project.category || 'Mobile App';
    document.getElementById('project-description').value = project.description || '';
    document.getElementById('project-thumbnail').value = project.thumbnail || '';
    document.getElementById('project-link').value = project.liveLink || '';

    if (project.caseStudy) {
      document.getElementById('project-problem').value = project.caseStudy.problem || '';
      document.getElementById('project-research').value = project.caseStudy.research || '';
      document.getElementById('project-solution').value = project.caseStudy.solution || '';
      document.getElementById('project-wireframes').value = project.caseStudy.wireframes || '';
      document.getElementById('project-finalui').value = project.caseStudy.finalUI || '';
      document.getElementById('project-learnings').value = project.caseStudy.learnings || '';

      const painPointsList = document.getElementById('project-painpoints-list');
      painPointsList.innerHTML = '';
      (project.caseStudy.painPoints || []).forEach(point => addPainPointItem(point));
      if (!project.caseStudy.painPoints || project.caseStudy.painPoints.length === 0) {
        addPainPointItem();
      }
    }

    const toolsList = document.getElementById('project-tools-list');
    toolsList.innerHTML = '';
    (project.tools || []).forEach(tool => addToolItem(tool));
    if (!project.tools || project.tools.length === 0) {
      addToolItem();
    }

    openModal('project-modal');
  } catch (error) {
    console.error("Error editing project:", error);
    showToast('Failed to load project', 'error');
  }
}

async function saveProject(e) {
  e.preventDefault();

  const id = document.getElementById('project-id').value;
  const projectData = {
    title: document.getElementById('project-title').value,
    category: document.getElementById('project-category').value,
    description: document.getElementById('project-description').value,
    thumbnail: document.getElementById('project-thumbnail').value,
    tools: getDynamicListValues('project-tools-list'),
    liveLink: document.getElementById('project-link').value,
    caseStudy: {
      problem: document.getElementById('project-problem').value,
      research: document.getElementById('project-research').value,
      solution: document.getElementById('project-solution').value,
      wireframes: document.getElementById('project-wireframes').value,
      finalUI: document.getElementById('project-finalui').value,
      learnings: document.getElementById('project-learnings').value,
      painPoints: getDynamicListValues('project-painpoints-list'),
    }
  };

  try {
    if (id) {
      await FirestoreService.updateProject(id, projectData);
      showToast('Project updated successfully!');
    } else {
      await FirestoreService.addProject(projectData);
      showToast('Project added successfully!');
    }

    closeModal('project-modal');
    await loadProjects();
    await loadDashboardStats();
  } catch (error) {
    console.error("Error saving project:", error);
    showToast(`Failed to save project: ${error?.message || 'Unknown error'}`, 'error');
  }
}

async function deleteProject(id) {
  if (confirm('Are you sure you want to delete this project?')) {
    try {
      await FirestoreService.deleteProject(id);
      showToast('Project deleted successfully!', 'error');
      await loadProjects();
      await loadDashboardStats();
    } catch (error) {
      console.error("Error deleting project:", error);
      showToast('Failed to delete project', 'error');
    }
  }
}

function addToolItem(value = '') {
  const container = document.getElementById('project-tools-list');
  const item = document.createElement('div');
  item.className = 'dynamic-list-item';
  item.innerHTML = `
    <input type="text" class="form-input dynamic-list-input" value="${value}" placeholder="Tool name">
    <button type="button" class="dynamic-list-remove" onclick="this.parentElement.remove()">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
  `;
  container.appendChild(item);
}

function addPainPointItem(value = '') {
  const container = document.getElementById('project-painpoints-list');
  const item = document.createElement('div');
  item.className = 'dynamic-list-item';
  item.innerHTML = `
    <input type="text" class="form-input dynamic-list-input" value="${value}" placeholder="Pain point">
    <button type="button" class="dynamic-list-remove" onclick="this.parentElement.remove()">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
  `;
  container.appendChild(item);
}

function getDynamicListValues(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return [];

  return Array.from(container.querySelectorAll('.dynamic-list-input'))
    .map(input => input.value.trim())
    .filter(value => value !== '');
}

// ========================================
// EXPERIENCE CRUD
// ========================================
async function loadExperiences() {
  const container = document.getElementById('experiences-list');
  if (!container) return;

  try {
    const experiences = await FirestoreService.getExperiences();

    if (experiences.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/></svg>
          <p>No experience added yet. Add your work experience!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = experiences.map(exp => `
      <div class="list-item">
        <div class="list-item-content">
          <div class="list-item-title">${exp.role || ''}</div>
          <div class="list-item-subtitle">${exp.company || ''} | ${exp.period || ''}</div>
        </div>
        <div class="list-item-actions">
          <button class="btn btn-secondary btn-sm" onclick="editExperience('${exp.id}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
            Edit
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteExperience('${exp.id}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
            Delete
          </button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error("Error loading experiences:", error);
    showToast('Failed to load experiences', 'error');
  }
}

function openAddExperienceModal() {
  document.getElementById('experience-form').reset();
  document.getElementById('experience-id').value = '';
  document.getElementById('experience-modal-title').textContent = 'Add Experience';
  document.getElementById('responsibilities-list').innerHTML = '';
  document.getElementById('achievements-list').innerHTML = '';
  document.getElementById('exp-tools-list').innerHTML = '';
  addResponsibilityItem();
  addAchievementItem();
  addExpToolItem();
  openModal('experience-modal');
}

async function editExperience(id) {
  try {
    const experiences = await FirestoreService.getExperiences();
    const exp = experiences.find(e => e.id === id);
    if (!exp) return;

    document.getElementById('experience-id').value = id;
    document.getElementById('experience-modal-title').textContent = 'Edit Experience';
    document.getElementById('exp-company').value = exp.company || '';
    document.getElementById('exp-role').value = exp.role || '';
    document.getElementById('exp-duration').value = exp.duration || '';
    document.getElementById('exp-period').value = exp.period || '';
    document.getElementById('exp-location').value = exp.location || '';
    document.getElementById('exp-type').value = exp.type || 'Internship';

    const respList = document.getElementById('responsibilities-list');
    respList.innerHTML = '';
    (exp.responsibilities || []).forEach(item => addResponsibilityItem(item));
    if (!exp.responsibilities || exp.responsibilities.length === 0) addResponsibilityItem();

    const achList = document.getElementById('achievements-list');
    achList.innerHTML = '';
    (exp.achievements || []).forEach(item => addAchievementItem(item));
    if (!exp.achievements || exp.achievements.length === 0) addAchievementItem();

    const toolsList = document.getElementById('exp-tools-list');
    toolsList.innerHTML = '';
    (exp.tools || []).forEach(item => addExpToolItem(item));
    if (!exp.tools || exp.tools.length === 0) addExpToolItem();

    openModal('experience-modal');
  } catch (error) {
    console.error("Error editing experience:", error);
    showToast('Failed to load experience', 'error');
  }
}

async function saveExperience(e) {
  e.preventDefault();

  const id = document.getElementById('experience-id').value;
  const expData = {
    company: document.getElementById('exp-company').value,
    role: document.getElementById('exp-role').value,
    duration: document.getElementById('exp-duration').value,
    period: document.getElementById('exp-period').value,
    location: document.getElementById('exp-location').value,
    type: document.getElementById('exp-type').value,
    responsibilities: getDynamicListValues('responsibilities-list'),
    achievements: getDynamicListValues('achievements-list'),
    tools: getDynamicListValues('exp-tools-list'),
  };

  try {
    if (id) {
      await FirestoreService.updateExperience(id, expData);
      showToast('Experience updated successfully!');
    } else {
      await FirestoreService.addExperience(expData);
      showToast('Experience added successfully!');
    }

    closeModal('experience-modal');
    await loadExperiences();
    await loadDashboardStats();
  } catch (error) {
    console.error("Error saving experience:", error);
    showToast(`Failed to save experience: ${error?.message || 'Unknown error'}`, 'error');
  }
}

async function deleteExperience(id) {
  if (confirm('Are you sure you want to delete this experience?')) {
    try {
      await FirestoreService.deleteExperience(id);
      showToast('Experience deleted successfully!', 'error');
      await loadExperiences();
      await loadDashboardStats();
    } catch (error) {
      console.error("Error deleting experience:", error);
      showToast('Failed to delete experience', 'error');
    }
  }
}

function addResponsibilityItem(value = '') {
  const container = document.getElementById('responsibilities-list');
  const item = document.createElement('div');
  item.className = 'dynamic-list-item';
  item.innerHTML = `
    <input type="text" class="form-input dynamic-list-input" value="${value}" placeholder="Responsibility">
    <button type="button" class="dynamic-list-remove" onclick="this.parentElement.remove()">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
  `;
  container.appendChild(item);
}

function addAchievementItem(value = '') {
  const container = document.getElementById('achievements-list');
  const item = document.createElement('div');
  item.className = 'dynamic-list-item';
  item.innerHTML = `
    <input type="text" class="form-input dynamic-list-input" value="${value}" placeholder="Achievement">
    <button type="button" class="dynamic-list-remove" onclick="this.parentElement.remove()">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
  `;
  container.appendChild(item);
}

function addExpToolItem(value = '') {
  const container = document.getElementById('exp-tools-list');
  const item = document.createElement('div');
  item.className = 'dynamic-list-item';
  item.innerHTML = `
    <input type="text" class="form-input dynamic-list-input" value="${value}" placeholder="Tool">
    <button type="button" class="dynamic-list-remove" onclick="this.parentElement.remove()">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
  `;
  container.appendChild(item);
}

// ========================================
// SKILLS MANAGEMENT
// ========================================
let currentSkills = { design: [], tools: [], development: [] };

async function loadSkills() {
  try {
    currentSkills = await FirestoreService.getSkills();
    renderSkillCategory('design-skills-list', currentSkills.design, 'design');
    renderSkillCategory('tools-skills-list', currentSkills.tools, 'tools');
    renderSkillCategory('dev-skills-list', currentSkills.development, 'development');
  } catch (error) {
    console.error("Error loading skills:", error);
    showToast('Failed to load skills', 'error');
  }
}

function renderSkillCategory(containerId, skillsList, category) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = skillsList.map((skill, index) => `
    <div class="list-item" data-category="${category}" data-index="${index}">
      <div class="list-item-content">
        <div class="list-item-title">${skill.name}</div>
        <div class="skill-slider-container">
          <input type="range" class="skill-slider" min="0" max="100" value="${skill.level}" onchange="updateSkillLevel('${category}', ${index}, this.value)">
          <span class="skill-slider-value">${skill.level}%</span>
        </div>
      </div>
      <div class="list-item-actions">
        <button class="btn btn-danger btn-sm" onclick="deleteSkill('${category}', ${index})">Delete</button>
      </div>
    </div>
  `).join('');
}

async function updateSkillLevel(category, index, value) {
  currentSkills[category][index].level = parseInt(value);

  const container = document.getElementById(`${category === 'development' ? 'dev' : category.split('')[0]}-skills-list`) ||
                    document.getElementById(`${category}-skills-list`);
  if (container) {
    const item = container.querySelector(`[data-index="${index}"]`);
    if (item) {
      item.querySelector('.skill-slider-value').textContent = value + '%';
    }
  }

  try {
    await FirestoreService.saveSkills(currentSkills);
  } catch (error) {
    console.error("Error updating skill level:", error);
  }
}

function openAddSkillModal() {
  document.getElementById('skill-form').reset();
  document.getElementById('skill-modal-title').textContent = 'Add Skill';
  document.getElementById('skill-level-display').textContent = '50';
  document.getElementById('skill-level').value = 50;
  openModal('skill-modal');
}

async function saveSkill(e) {
  e.preventDefault();

  const category = document.getElementById('skill-category').value;
  const name = document.getElementById('skill-name').value;
  const level = parseInt(document.getElementById('skill-level').value);

  currentSkills[category].push({ name, level });

  try {
    await FirestoreService.saveSkills(currentSkills);
    showToast('Skill added successfully!');
    closeModal('skill-modal');
    await loadSkills();
    await loadDashboardStats();
  } catch (error) {
    console.error("Error saving skill:", error);
    showToast(`Failed to save skill: ${error?.message || 'Unknown error'}`, 'error');
  }
}

async function deleteSkill(category, index) {
  if (confirm('Are you sure you want to delete this skill?')) {
    currentSkills[category].splice(index, 1);

    try {
      await FirestoreService.saveSkills(currentSkills);
      showToast('Skill deleted successfully!', 'error');
      await loadSkills();
      await loadDashboardStats();
    } catch (error) {
      console.error("Error deleting skill:", error);
      showToast('Failed to delete skill', 'error');
    }
  }
}

// ========================================
// CERTIFICATIONS CRUD
// ========================================
async function loadCertifications() {
  const container = document.getElementById('certifications-list');
  if (!container) return;

  try {
    const certifications = await FirestoreService.getCertifications();

    if (certifications.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.39 12 22l-3.477-9.61a8 8 0 0 1 6.954 0Z"/></svg>
          <p>No certifications added yet.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = certifications.map(cert => `
      <div class="list-item">
        <div class="list-item-content">
          <div class="list-item-title">${cert.title || ''}</div>
          <div class="list-item-subtitle">${cert.issuer || ''} | ${cert.date || ''}</div>
        </div>
        <div class="list-item-actions">
          <button class="btn btn-secondary btn-sm" onclick="editCertification('${cert.id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteCertification('${cert.id}')">Delete</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error("Error loading certifications:", error);
    showToast('Failed to load certifications', 'error');
  }
}

function openAddCertificationModal() {
  document.getElementById('certification-form').reset();
  document.getElementById('certification-id').value = '';
  document.getElementById('certification-modal-title').textContent = 'Add Certification';
  openModal('certification-modal');
}

async function editCertification(id) {
  try {
    const certifications = await FirestoreService.getCertifications();
    const cert = certifications.find(c => c.id === id);
    if (!cert) return;

    document.getElementById('certification-id').value = id;
    document.getElementById('certification-modal-title').textContent = 'Edit Certification';
    document.getElementById('cert-title').value = cert.title || '';
    document.getElementById('cert-issuer').value = cert.issuer || '';
    document.getElementById('cert-date').value = cert.date || '';
    document.getElementById('cert-image').value = cert.image || '';
    document.getElementById('cert-link').value = cert.credentialLink || '';

    openModal('certification-modal');
  } catch (error) {
    console.error("Error editing certification:", error);
    showToast('Failed to load certification', 'error');
  }
}

async function saveCertification(e) {
  e.preventDefault();

  const id = document.getElementById('certification-id').value;
  const certData = {
    title: document.getElementById('cert-title').value,
    issuer: document.getElementById('cert-issuer').value,
    date: document.getElementById('cert-date').value,
    image: document.getElementById('cert-image').value,
    credentialLink: document.getElementById('cert-link').value,
  };

  try {
    if (id) {
      await FirestoreService.updateCertification(id, certData);
      showToast('Certification updated successfully!');
    } else {
      await FirestoreService.addCertification(certData);
      showToast('Certification added successfully!');
    }

    closeModal('certification-modal');
    await loadCertifications();
    await loadDashboardStats();
  } catch (error) {
    console.error("Error saving certification:", error);
    showToast(`Failed to save certification: ${error?.message || 'Unknown error'}`, 'error');
  }
}

async function deleteCertification(id) {
  if (confirm('Are you sure you want to delete this certification?')) {
    try {
      await FirestoreService.deleteCertification(id);
      showToast('Certification deleted successfully!', 'error');
      await loadCertifications();
      await loadDashboardStats();
    } catch (error) {
      console.error("Error deleting certification:", error);
      showToast('Failed to delete certification', 'error');
    }
  }
}


async function loadMessages() {

  const messages =
    await FirestoreService.getContactMessages();

  const tbody = document.getElementById('messages-table-body');

  tbody.innerHTML = "";

  messages.forEach(msg => {

    tbody.innerHTML += `
      <tr>
        <td>${msg.name}</td>
        <td>${msg.email}</td>
        <td>${msg.subject}</td>
        <td>${msg.message}</td>
        <td>${msg.createdAt || ""}</td>
      </tr>
    `;
  });
}
// ========================================
// CONTACT & PERSONAL INFO
// ========================================
async function loadContactInfo() {
  try {
    const [contactInfo, personalInfo] = await Promise.all([
      FirestoreService.getContactInfo(),
      FirestoreService.getPersonalInfo()
    ]);

    document.getElementById('contact-email').value = contactInfo.email || '';
    document.getElementById('contact-phone').value = contactInfo.phone || '';
    document.getElementById('contact-location').value = contactInfo.location || '';
    document.getElementById('contact-availability').value = contactInfo.availability || '';
    document.getElementById('contact-name').value = personalInfo.name || '';
    document.getElementById('contact-role').value = personalInfo.role || '';
    document.getElementById('contact-resume').value = personalInfo.resumeLink || '';
  } catch (error) {
    console.error("Error loading contact info:", error);
  }
}

async function saveContactInfo(e) {
  e.preventDefault();

  const contactData = {
    email: document.getElementById('contact-email').value,
    phone: document.getElementById('contact-phone').value,
    location: document.getElementById('contact-location').value,
    availability: document.getElementById('contact-availability').value,
  };

  const personalData = {
    name: document.getElementById('contact-name').value,
    role: document.getElementById('contact-role').value,
    location: document.getElementById('contact-location').value,
    resumeLink: document.getElementById('contact-resume').value,
  };

  try {
    await Promise.all([
      FirestoreService.saveContactInfo(contactData),
      FirestoreService.savePersonalInfo(personalData)
    ]);
    showToast('Contact information saved!');
  } catch (error) {
    console.error("Error saving contact info:", error);
    showToast('Failed to save contact info', 'error');
  }
}

// ========================================
// ABOUT CONTENT
// ========================================
async function loadAboutContent() {
  try {
    const aboutContent = await FirestoreService.getAboutContent();

    document.getElementById('about-journey').value = aboutContent.journey || '';
    document.getElementById('about-goals').value = aboutContent.goals || '';
    document.getElementById('about-philosophy').value = aboutContent.philosophy || '';
  } catch (error) {
    console.error("Error loading about content:", error);
  }
}

async function saveAboutContent(e) {
  e.preventDefault();

  const aboutData = {
    journey: document.getElementById('about-journey').value,
    goals: document.getElementById('about-goals').value,
    philosophy: document.getElementById('about-philosophy').value,
  };

  try {
    await FirestoreService.saveAboutContent(aboutData);
    showToast('About content saved!');
  } catch (error) {
    console.error("Error saving about content:", error);
    showToast('Failed to save about content', 'error');
  }
}

// ========================================
// GLOBAL EXPORTS
// ========================================
window.openAddProjectModal = openAddProjectModal;
window.editProject = editProject;
window.saveProject = saveProject;
window.deleteProject = deleteProject;
window.addToolItem = addToolItem;
window.addPainPointItem = addPainPointItem;

window.openAddExperienceModal = openAddExperienceModal;
window.editExperience = editExperience;
window.saveExperience = saveExperience;
window.deleteExperience = deleteExperience;
window.addResponsibilityItem = addResponsibilityItem;
window.addAchievementItem = addAchievementItem;
window.addExpToolItem = addExpToolItem;

window.openAddSkillModal = openAddSkillModal;
window.saveSkill = saveSkill;
window.deleteSkill = deleteSkill;
window.updateSkillLevel = updateSkillLevel;

window.openAddCertificationModal = openAddCertificationModal;
window.editCertification = editCertification;
window.saveCertification = saveCertification;
window.deleteCertification = deleteCertification;

window.saveContactInfo = saveContactInfo;
window.saveAboutContent = saveAboutContent;

window.openModal = openModal;
window.closeModal = closeModal;
