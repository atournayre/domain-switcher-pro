document.addEventListener('DOMContentLoaded', async () => {
  await loadCurrentTab();
  await loadProjects();
  
  document.getElementById('optionsLink').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
});

async function loadCurrentTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      const url = new URL(tab.url);
      const currentDomain = url.hostname;
      document.getElementById('currentUrl').textContent = currentDomain;
    }
  } catch (error) {
    console.error('Erreur lors du chargement de l\'onglet actuel:', error);
  }
}

async function loadProjects() {
  try {
    const result = await chrome.storage.sync.get(['projects']);
    const projects = result.projects || [];
    
    const projectsList = document.getElementById('projectsList');
    const noProjects = document.getElementById('noProjects');
    
    if (projects.length === 0) {
      noProjects.style.display = 'block';
      return;
    }
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentUrl = tab?.url ? new URL(tab.url) : null;
    const currentDomain = currentUrl?.hostname;
    
    projectsList.innerHTML = '';
    
    for (const project of projects) {
      const projectDiv = document.createElement('div');
      projectDiv.className = 'project-section';
      
      const isProjectMatch = project.domains.some(domain => {
        const domainHost = extractHostname(domain);
        return domainHost === currentDomain;
      });
      
      if (!isProjectMatch) continue;
      
      const projectName = document.createElement('div');
      projectName.className = 'project-name';
      projectName.textContent = project.name;
      projectDiv.appendChild(projectName);
      
      const domainList = document.createElement('ul');
      domainList.className = 'domain-list';
      
      for (const domain of project.domains) {
        const domainHost = extractHostname(domain);
        const listItem = document.createElement('li');
        listItem.className = 'domain-item';
        
        if (domainHost === currentDomain) {
          listItem.classList.add('current');
        }
        
        listItem.textContent = domain;
        listItem.addEventListener('click', () => switchToDomain(domain));
        
        domainList.appendChild(listItem);
      }
      
      projectDiv.appendChild(domainList);
      projectsList.appendChild(projectDiv);
    }
    
    if (projectsList.children.length === 0) {
      noProjects.style.display = 'block';
      noProjects.innerHTML = 'Aucun projet ne correspond au domaine actuel.<br>Configurez vos projets dans les options.';
    }
  } catch (error) {
    console.error('Erreur lors du chargement des projets:', error);
  }
}

function extractHostname(domain) {
  try {
    if (domain.startsWith('http://') || domain.startsWith('https://')) {
      return new URL(domain).hostname;
    }
    return domain.replace(/:\d+$/, '').split('/')[0];
  } catch (error) {
    return domain.replace(/:\d+$/, '').split('/')[0];
  }
}

async function switchToDomain(targetDomain) {
  try {
    await chrome.runtime.sendMessage({
      action: 'switchDomain',
      domain: targetDomain,
      preservePath: true
    });
    
    window.close();
  } catch (error) {
    console.error('Erreur lors du changement de domaine:', error);
  }
}