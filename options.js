let editingProjectId = null;

document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
  
  document.getElementById('addProject').addEventListener('click', saveProject);
  document.getElementById('cancelEdit').addEventListener('click', cancelEdit);
  
  document.getElementById('projectName').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('projectDomains').focus();
    }
  });
});

async function loadProjects() {
  try {
    const result = await chrome.storage.sync.get(['projects']);
    const projects = result.projects || [];
    
    const projectsList = document.getElementById('projectsList');
    
    if (projects.length === 0) {
      projectsList.innerHTML = `
        <div class="empty-state">
          <h3>Aucun projet configuré</h3>
          <p>Créez votre premier projet ci-dessus pour commencer</p>
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
            <button class="button secondary edit-btn" data-index="${index}">Modifier</button>
            <button class="button danger delete-btn" data-index="${index}">Supprimer</button>
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
    console.error('Erreur lors du chargement des projets:', error);
    showStatus('Erreur lors du chargement des projets', 'error');
  }
}

async function saveProject() {
  const name = document.getElementById('projectName').value.trim();
  const domainsText = document.getElementById('projectDomains').value.trim();
  
  if (!name) {
    showStatus('Le nom du projet est requis', 'error');
    return;
  }
  
  if (!domainsText) {
    showStatus('Au moins un domaine est requis', 'error');
    return;
  }
  
  const domains = domainsText.split('\n')
    .map(domain => domain.trim())
    .filter(domain => domain.length > 0);
  
  if (domains.length === 0) {
    showStatus('Au moins un domaine valide est requis', 'error');
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
        showStatus('Un projet avec ce nom existe déjà', 'error');
        return;
      }
      projects.push(newProject);
    }
    
    await chrome.storage.sync.set({ projects: projects });
    
    showStatus(editingProjectId ? 'Projet mis à jour avec succès' : 'Projet ajouté avec succès', 'success');
    clearForm();
    loadProjects();
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    showStatus('Erreur lors de la sauvegarde du projet', 'error');
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
    showStatus(`Domaines invalides: ${invalidDomains.join(', ')}`, 'error');
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
      document.getElementById('addProject').textContent = 'Mettre à jour le projet';
      document.getElementById('cancelEdit').style.display = 'inline-block';
      
      document.getElementById('projectName').focus();
    }
  } catch (error) {
    console.error('Erreur lors de l\'édition:', error);
    showStatus('Erreur lors de l\'édition du projet', 'error');
  }
}

async function deleteProject(index) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
    return;
  }
  
  try {
    const result = await chrome.storage.sync.get(['projects']);
    const projects = result.projects || [];
    
    if (index >= 0 && index < projects.length) {
      projects.splice(index, 1);
      await chrome.storage.sync.set({ projects: projects });
      
      showStatus('Projet supprimé avec succès', 'success');
      loadProjects();
    }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    showStatus('Erreur lors de la suppression du projet', 'error');
  }
}

function cancelEdit() {
  editingProjectId = null;
  clearForm();
  document.getElementById('addProject').textContent = 'Créer le projet';
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

