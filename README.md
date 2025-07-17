# Domain Switcher Pro

Une extension Chrome moderne qui respecte les bonnes pratiques et utilise Manifest V3 pour faciliter le passage entre différents environnements de développement.

## 🚀 Fonctionnalités

- **Commutation rapide entre domaines** : Basculez facilement entre vos environnements de développement, staging et production
- **Préservation du chemin** : Le chemin de l'URL actuelle est automatiquement préservé lors du changement de domaine
- **Organisation par projets** : Groupez vos domaines par projet pour une meilleure organisation
- **Interface moderne** : Interface utilisateur claire et intuitive
- **Manifest V3** : Conforme aux dernières exigences de Chrome pour les extensions

## 📦 Installation

### Installation manuelle pour le développement

1. Clonez ou téléchargez ce repository
2. Ouvrez Chrome et allez sur `chrome://extensions/`
3. Activez le "Mode développeur" en haut à droite
4. Cliquez sur "Charger l'extension non empaquetée"
5. Sélectionnez le dossier contenant les fichiers de l'extension

## 🛠️ Configuration

1. Cliquez sur l'icône de l'extension dans la barre d'outils Chrome
2. Cliquez sur "Options" pour ouvrir la page de configuration
3. Créez un nouveau projet en entrant :
   - **Nom du projet** : Un nom descriptif (ex: "Mon Site Web")
   - **Domaines** : Un domaine par ligne (ex: `localhost:3000`, `staging.monsite.com`, `monsite.com`)

### Exemples de configuration

**Projet "E-commerce":**
```
localhost:3000
dev.moncommerce.com
staging.moncommerce.com
moncommerce.com
```

**Projet "Blog":**
```
localhost:8080
https://dev-blog.example.com
https://staging-blog.example.com
https://blog.example.com
```

## 📱 Utilisation

1. Naviguez vers l'un des domaines configurés dans vos projets
2. Cliquez sur l'icône Domain Switcher Pro dans la barre d'outils
3. Sélectionnez le domaine de destination
4. L'extension vous redirigera automatiquement en préservant le chemin actuel

## 🔧 Développement

### Structure du projet

```
domain-switcher/
├── manifest.json          # Configuration Manifest V3
├── background.js          # Service worker principal
├── popup.html            # Interface popup
├── popup.js              # Logique du popup
├── options.html          # Page d'options
├── options.js            # Logique des options
├── content.js            # Script de contenu
├── icons/                # Icônes de l'extension
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

### Technologies utilisées

- **Manifest V3** : Dernière version du format de manifest Chrome
- **Service Workers** : Remplace les scripts de background pour de meilleures performances
- **Chrome Storage API** : Stockage synchronisé des configurations
- **Modern JavaScript** : ES6+ avec async/await

## 🔒 Sécurité et vie privée

- **Données locales uniquement** : Toutes les configurations sont stockées localement
- **Permissions minimales** : L'extension ne demande que les permissions nécessaires
- **Pas de télémétrie** : Aucune donnée n'est envoyée vers des serveurs externes
- **Code source ouvert** : Le code est entièrement visible et auditable

## 🎯 Différences avec l'ancienne extension

### Améliorations

- ✅ **Manifest V3** : Conforme aux exigences modernes de Chrome
- ✅ **Interface moderne** : Design amélioré et plus intuitif
- ✅ **Meilleure performance** : Utilisation des Service Workers
- ✅ **Sécurité renforcée** : Respect des bonnes pratiques de sécurité
- ✅ **Validation des domaines** : Vérification des formats de domaines
- ✅ **Gestion d'erreurs** : Meilleure gestion des cas d'erreur

### Fonctionnalités conservées

- ✅ Commutation rapide entre environnements
- ✅ Préservation du chemin de l'URL
- ✅ Organisation par projets
- ✅ Support des ports et protocoles

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Forker le projet
2. Créer une branche pour votre fonctionnalité
3. Committer vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 🔄 Migration depuis l'ancienne extension

Si vous utilisez l'ancienne extension Domain Switcher :

1. Exportez vos configurations actuelles (si possible)
2. Installez Domain Switcher Pro
3. Reconfigurez vos projets dans la nouvelle extension
4. Désinstallez l'ancienne extension

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez que vous utilisez la dernière version de Chrome
2. Consultez la console de développement pour les erreurs
3. Ouvrez une issue sur le repository GitHub avec les détails du problème