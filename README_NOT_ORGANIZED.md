<div align="center">
  <img src="./nodes/PlaywrightAutomation/playwright-automation.svg" width="120" alt="n8n-nodes-playwright-automation Logo" />
  <h1>n8n-nodes-playwright-automation</h1>

  <p>
    <b>Community Playwright integration for n8n.</b><br>
    Run reliable headless browser automations (scraping, form filling, login flows, PDF/screenshots, E2E checks) powered by Playwright — directly inside n8n workflows.
  </p>

  <p>
    <a href="https://www.npmjs.com/package/n8n-nodes-playwright-automation">
      <img src="https://img.shields.io/npm/v/n8n-nodes-playwright-automation?color=red&logo=npm" alt="npm version" />
    </a>
    <a href="https://github.com/shhadi/n8n-nodes-playwright-automation/actions/workflows/ci.yml">
      <img src="https://github.com/shhadi/n8n-nodes-playwright-automation/actions/workflows/ci.yml/badge.svg" alt="Build Status" />
    </a>
    <a href="https://github.com/shhadi/n8n-nodes-playwright-automation/blob/main/LICENSE">
      <img src="https://img.shields.io/npm/l/n8n-nodes-playwright-automation" alt="License" />
    </a>
    <a href="https://www.linkedin.com/in/shhadi-masarwa/">
      <img src="https://img.shields.io/badge/LinkedIn-Connect-blue?logo=linkedin" alt="LinkedIn" />
    </a>
  </p>
</div>

---

## 🚀 Features

This node allows you to control a headless browser to automate complex web tasks.

### Session
* **Create**: Start a new browser session (Chromium/Firefox/WebKit).
* **Close**: Close an active session.
* **Get Storage State**: Retrieve cookies and storage state (e.g., to save and reuse login sessions).

### Page Interaction
* **Navigate**: Go to a specific URL.
* **Click**: Click elements using smart selectors.
* **Type/Fill**: Fill forms and input fields.
* **Wait**: Wait for a specific duration or for elements to appear.
* **Get Text/HTML/Attribute**: Extract data from the page.
* **Count Elements**: Count occurrences of an element.
* **Upload File**: Upload files to input fields.

### Capture
* **Screenshot**: Capture visible page or full page screenshots.
* **PDF**: Generate a PDF of the current page.

---

## 📦 Docker Support

To run this node in Docker, you must ensure the Playwright browser dependencies are installed in your n8n container.

Add the following to your `Dockerfile`:

```dockerfile
FROM n8nio/n8n:latest

USER root
# Install Playwright and dependencies
RUN npm install -g playwright
RUN npx playwright install-deps
RUN npx playwright install chromium
USER node
```

---

## 🤝 Contributing

Contributions are welcome! We'd love to have you help improve this project.

Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started. This guide includes:

- Development setup instructions
- How to submit pull requests
- Coding standards and best practices
- Reporting issues

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

---


## ✨ Contributors

Thanks goes to these wonderful people:

<a href="https://github.com/shhadi/n8n-nodes-playwright-automation/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=shhadi/n8n-nodes-playwright-automation" alt="Contributors" />
</a>

---

## 👨‍💻 Developer

**Shhadi Masarwa**

<a href="https://www.linkedin.com/in/shhadi-masarwa/">
  <img src="https://img.shields.io/badge/Connect_on_LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="Connect on LinkedIn" />
</a>

## License

MIT
