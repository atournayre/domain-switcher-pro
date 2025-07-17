# Domain Switcher Pro

A modern Chrome extension that follows best practices and uses Manifest V3 to facilitate switching between different development environments.

## 🚀 Features

- **Quick domain switching**: Easily switch between your development, staging, and production environments
- **Path preservation**: The current URL path is automatically preserved when switching domains
- **Project organization**: Group your domains by project for better organization
- **Modern interface**: Clean and intuitive user interface
- **Manifest V3**: Compliant with the latest Chrome extension requirements
- **Multilingual support**: Available in English, French, and Spanish

## 📦 Installation

### Manual installation for development

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked extension"
5. Select the folder containing the extension files

## 🛠️ Configuration

1. Click the extension icon in the Chrome toolbar
2. Click "Options" to open the configuration page
3. Create a new project by entering:
   - **Project name**: A descriptive name (e.g., "My Website")
   - **Domains**: One domain per line (e.g., `localhost:3000`, `staging.mysite.com`, `mysite.com`)

### Configuration examples

**"E-commerce" project:**
```
localhost:3000
dev.mycommerce.com
staging.mycommerce.com
mycommerce.com
```

**"Blog" project:**
```
localhost:8080
https://dev-blog.example.com
https://staging-blog.example.com
https://blog.example.com
```

## 📱 Usage

1. Navigate to one of the domains configured in your projects
2. Click the Domain Switcher Pro icon in the toolbar
3. Select the target domain
4. The extension will automatically redirect you while preserving the current path

## 🌍 Language Support

The extension automatically adapts to your Chrome browser language:
- **English** (default)
- **French**
- **Spanish**

The language is automatically detected based on your browser settings. No manual selection needed!

## 🔧 Development

### Project structure

```
domain-switcher/
├── manifest.json          # Manifest V3 configuration
├── background.js          # Main service worker
├── popup.html            # Popup interface
├── popup.js              # Popup logic
├── options.html          # Options page
├── options.js            # Options logic
├── content.js            # Content script
├── _locales/             # Internationalization files
│   ├── en/
│   ├── fr/
│   └── es/
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

### Technologies used

- **Manifest V3**: Latest version of Chrome manifest format
- **Service Workers**: Replaces background scripts for better performance
- **Chrome Storage API**: Synchronized configuration storage
- **Chrome i18n API**: Internationalization support
- **Modern JavaScript**: ES6+ with async/await

## 🔒 Security and Privacy

- **Local data only**: All configurations are stored locally
- **Minimal permissions**: The extension only requests necessary permissions
- **No telemetry**: No data is sent to external servers
- **Open source**: Code is fully visible and auditable
- **Secure by design**: Follows Chrome extension security best practices

## 🎯 Differences from the original extension

### Improvements

- ✅ **Manifest V3**: Compliant with modern Chrome requirements
- ✅ **Modern interface**: Improved and more intuitive design
- ✅ **Better performance**: Uses Service Workers
- ✅ **Enhanced security**: Follows security best practices
- ✅ **Domain validation**: Verification of domain formats
- ✅ **Error handling**: Better error case management
- ✅ **Multilingual**: Support for multiple languages
- ✅ **Future-proof**: Ready for Chrome's upcoming changes

### Preserved features

- ✅ Quick switching between environments
- ✅ URL path preservation
- ✅ Project organization
- ✅ Port and protocol support

## 🤝 Contributing

Contributions are welcome! Please feel free to:

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

### Development setup

```bash
# Clone the repository
git clone https://github.com/atournayre/domain-switcher-pro.git

# Load the extension in Chrome
# 1. Go to chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select the project folder
```

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for more details.

## 🔄 Migration from the original extension

If you're using the original Domain Switcher extension:

1. Export your current configurations (if possible)
2. Install Domain Switcher Pro
3. Reconfigure your projects in the new extension
4. Uninstall the original extension

## 🆘 Support

If you encounter issues:

1. Make sure you're using the latest version of Chrome
2. Check the developer console for errors
3. Open an issue on the GitHub repository with problem details

## 📈 Roadmap

- [ ] Import/export configuration feature
- [ ] Keyboard shortcuts
- [ ] Custom themes
- [ ] Bulk domain management
- [ ] Chrome Web Store publication

## 🙏 Acknowledgments

This extension is inspired by the original Domain Switcher but has been completely rewritten to meet modern Chrome extension standards and best practices.