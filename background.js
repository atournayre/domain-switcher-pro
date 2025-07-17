chrome.runtime.onInstalled.addListener(() => {
  console.log('Domain Switcher Pro installé');
});

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.url) return;
  
  try {
    const url = new URL(tab.url);
    const currentDomain = url.hostname;
    const currentPath = url.pathname + url.search + url.hash;
    
    const result = await chrome.storage.sync.get(['projects']);
    const projects = result.projects || [];
    
    const matchingProject = projects.find(project => 
      project.domains.some(domain => {
        const domainHost = domain.replace(/^https?:\/\//, '').replace(/:\d+$/, '').split('/')[0];
        return domainHost === currentDomain || domain.includes(currentDomain);
      })
    );
    
    if (matchingProject) {
      await chrome.action.setPopup({ popup: 'popup.html' });
    } else {
      await chrome.action.setPopup({ popup: 'popup.html' });
    }
  } catch (error) {
    console.error('Erreur dans le service worker:', error);
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.projects) {
    console.log('Projets mis à jour');
  }
});

async function switchDomain(targetDomain, preservePath = true) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.url) return;
    
    const currentUrl = new URL(tab.url);
    let newUrl;
    
    if (preservePath) {
      const path = currentUrl.pathname + currentUrl.search + currentUrl.hash;
      newUrl = targetDomain.endsWith('/') ? targetDomain.slice(0, -1) + path : targetDomain + path;
    } else {
      newUrl = targetDomain;
    }
    
    if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
      newUrl = 'https://' + newUrl;
    }
    
    await chrome.tabs.update(tab.id, { url: newUrl });
  } catch (error) {
    console.error('Erreur lors du changement de domaine:', error);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'switchDomain') {
    switchDomain(message.domain, message.preservePath);
    sendResponse({ success: true });
  }
});