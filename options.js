let editingProjectId = null;

document.addEventListener('DOMContentLoaded', () => {
  localizeUI();
  loadProjects();
  
  document.getElementById('addProject').addEventListener('click', saveProject);
  document.getElementById('cancelEdit').addEventListener('click', cancelEdit);
  
  document.getElementById('projectName').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('projectDomains').focus();
    }
  });
});

function localizeUI() {
  // Localize page title
  document.title = chrome.i18n.getMessage('optionsTitle');
  
  // Localize all elements with data-i18n
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    const message = chrome.i18n.getMessage(key);
    if (message) {
      element.textContent = message;
    }
  });
  
  // Localize placeholders
  const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
  placeholderElements.forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    const message = chrome.i18n.getMessage(key);
    if (message) {
      element.placeholder = message;
    }
  });
}

async function loadProjects() {
  try {
    const result = await chrome.storage.sync.get(['projects']);
    const projects = result.projects || [];
    
    const projectsList = document.getElementById('projectsList');
    
    if (projects.length === 0) {
      projectsList.innerHTML = `
        <div class="empty-state">
          <h3 data-i18n="noProjectsConfigured">${chrome.i18n.getMessage('noProjectsConfigured')}</h3>
          <p data-i18n="createFirstProject">${chrome.i18n.getMessage('createFirstProject')}</p>
        </div>
      `;
      return;
    }
    
    projectsList.innerHTML = '';
    
    projects.forEach((project, index) => {
      const projectCard = document.createElement('div');
      projectCard.className = 'project-card';
      
      projectCard.innerHTML = `
        <div class="project-header">
          <div class="project-name">${escapeHtml(project.name)}</div>
          <div class="project-actions">
            <button class="button secondary edit-btn" data-index="${index}">${chrome.i18n.getMessage('edit')}</button>
            <button class="button danger delete-btn" data-index="${index}">${chrome.i18n.getMessage('delete')}</button>
          </div>
        </div>
        <div class="project-domains">
          ${project.domains.map(domain => `<span class="domain-tag">${escapeHtml(domain)}</span>`).join('')}
        </div>
      `;
      
      // Ajouter les event listeners pour les boutons
      const editBtn = projectCard.querySelector('.edit-btn');
      const deleteBtn = projectCard.querySelector('.delete-btn');
      
      editBtn.addEventListener('click', () => editProject(index));
      deleteBtn.addEventListener('click', () => deleteProject(index));
      
      projectsList.appendChild(projectCard);
    });
  } catch (error) {
    console.error('Error loading projects:', error);
    showStatus(chrome.i18n.getMessage('errorLoading'), 'error');
  }
}

async function saveProject() {
  const name = document.getElementById('projectName').value.trim();
  const domainsText = document.getElementById('projectDomains').value.trim();
  
  if (!name) {
    showStatus(chrome.i18n.getMessage('projectNameRequired'), 'error');
    return;
  }
  
  if (!domainsText) {
    showStatus(chrome.i18n.getMessage('domainRequired'), 'error');
    return;
  }
  
  const domains = domainsText.split('\n')
    .map(domain => domain.trim())
    .filter(domain => domain.length > 0);
  
  if (domains.length === 0) {
    showStatus(chrome.i18n.getMessage('validDomainRequired'), 'error');
    return;
  }
  
  if (!validateDomains(domains)) {
    return;
  }
  
  try {
    const result = await chrome.storage.sync.get(['projects']);
    const projects = result.projects || [];
    
    const newProject = {
      id: editingProjectId || Date.now().toString(),
      name: name,
      domains: domains
    };
    
    if (editingProjectId) {
      const index = projects.findIndex(p => p.id === editingProjectId);
      if (index !== -1) {
        projects[index] = newProject;
      }
    } else {
      const existingProject = projects.find(p => p.name.toLowerCase() === name.toLowerCase());
      if (existingProject) {
        showStatus(chrome.i18n.getMessage('projectExists'), 'error');
        return;
      }
      projects.push(newProject);
    }
    
    await chrome.storage.sync.set({ projects: projects });
    
    showStatus(editingProjectId ? chrome.i18n.getMessage('projectUpdated') : chrome.i18n.getMessage('projectAdded'), 'success');
    clearForm();
    loadProjects();
  } catch (error) {
    console.error('Error saving project:', error);
    showStatus(chrome.i18n.getMessage('errorSaving'), 'error');
  }
}

function validateDomains(domains) {
  const invalidDomains = [];
  
  for (const domain of domains) {
    if (!isValidDomain(domain)) {
      invalidDomains.push(domain);
    }
  }
  
  if (invalidDomains.length > 0) {
    showStatus(chrome.i18n.getMessage('invalidDomains', [invalidDomains.join(', ')]), 'error');
    return false;
  }
  
  return true;
}

function isValidDomain(domain) {
  const domainRegex = /^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})?(\:[0-9]{1,5})?$/;
  const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
  const localhostRegex = /^localhost(:[0-9]{1,5})?$/;
  
  return domainRegex.test(domain) || urlRegex.test(domain) || localhostRegex.test(domain);
}

async function editProject(index) {
  try {
    const result = await chrome.storage.sync.get(['projects']);
    const projects = result.projects || [];
    
    if (index >= 0 && index < projects.length) {
      const project = projects[index];
      
      document.getElementById('projectName').value = project.name;
      document.getElementById('projectDomains').value = project.domains.join('\n');
      
      editingProjectId = project.id;
      document.getElementById('addProject').textContent = chrome.i18n.getMessage('updateProject');
      document.getElementById('cancelEdit').style.display = 'inline-block';
      
      document.getElementById('projectName').focus();
    }
  } catch (error) {
    console.error('Error editing project:', error);
    showStatus(chrome.i18n.getMessage('errorEditing'), 'error');
  }
}

async function deleteProject(index) {
  if (!confirm(chrome.i18n.getMessage('confirmDelete'))) {
    return;
  }
  
  try {
    const result = await chrome.storage.sync.get(['projects']);
    const projects = result.projects || [];
    
    if (index >= 0 && index < projects.length) {
      projects.splice(index, 1);
      await chrome.storage.sync.set({ projects: projects });
      
      showStatus(chrome.i18n.getMessage('projectDeleted'), 'success');
      loadProjects();
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    showStatus(chrome.i18n.getMessage('errorDeleting'), 'error');
  }
}

function cancelEdit() {
  editingProjectId = null;
  clearForm();
  document.getElementById('addProject').textContent = chrome.i18n.getMessage('createProject');
  document.getElementById('cancelEdit').style.display = 'none';
}

function clearForm() {
  document.getElementById('projectName').value = '';
  document.getElementById('projectDomains').value = '';
}

function showStatus(message, type) {
  const statusDiv = document.getElementById('statusMessage');
  statusDiv.textContent = message;
  statusDiv.className = `status-message ${type}`;
  statusDiv.style.display = 'block';
  
  setTimeout(() => {
    statusDiv.style.display = 'none';
  }, 5000);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

