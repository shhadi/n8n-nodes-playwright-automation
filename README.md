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
    <a href="https://github.com/shhadi/n8n-nodes-playwright-automation/blob/main/LICENSE.md">
      <img src="https://img.shields.io/github/license/shhadi/n8n-nodes-playwright-automation" alt="License" />
    </a>
  </p>
</div>

---

## 🚀 Features

This node allows you to control a headless browser to automate complex web tasks.

### Session

| Operation | Description |
|-----------|-------------|
| **Create** | Start a new browser session (Chromium/Firefox/WebKit) |
| **Close** | Close an active session |
| **Get Storage State** | Retrieve cookies and storage state (e.g., to save and reuse login sessions) |

### Page Interaction

| Operation | Description |
|-----------|-------------|
| **Navigate** | Go to a specific URL |
| **Click** | Click elements using smart selectors |
| **Type/Fill** | Fill forms and input fields |
| **Wait** | Wait for a specific duration or for elements to appear |
| **Get Text/HTML/Attribute** | Extract data from the page |
| **Count Elements** | Count occurrences of an element |
| **Upload File** | Upload files to input fields |

### Capture

| Operation | Description |
|-----------|-------------|
| **Screenshot** | Capture visible page or full page screenshots |
| **PDF** | Generate a PDF of the current page |

### Script (Advanced)

| Operation | Description |
|-----------|-------------|
| **Run Script** | Execute custom JavaScript code with full Playwright API access |

---

## 📜 Custom Script Feature

For advanced automation scenarios where predefined operations aren't sufficient, you can run custom Playwright scripts.

### How It Works

The **Script → Run Script** operation allows you to write JavaScript code that has direct access to:
- `page` - The Playwright [Page](https://playwright.dev/docs/api/class-page) object
- `context` - The Playwright [BrowserContext](https://playwright.dev/docs/api/class-browsercontext) object

### Example Usage

```javascript
// Get page information
const title = await page.title();
const url = page.url();

// Interact with elements
await page.click('button.submit');
await page.fill('#email', 'user@example.com');

// Wait for network requests
await page.waitForResponse(resp => resp.url().includes('/api/'));

// Extract data
const items = await page.$$eval('.product', els => 
  els.map(el => ({
    name: el.querySelector('.name').textContent,
    price: el.querySelector('.price').textContent
  }))
);

// Return data to the n8n workflow
return { title, url, items };
```

### Output

The script's return value is included in the node output:

```json
{
  "success": true,
  "action": "runScript",
  "returnValue": {
    "title": "Example Shop",
    "url": "https://example.com/products",
    "items": [ ]
  },
  "executionTimeMs": 142
}
```

> [!TIP]
> Use custom scripts for complex scenarios like multi-step login flows, infinite scroll handling, or interacting with dynamic SPAs.

---

## 📦 Installation

### n8n Community Nodes

1. Go to **Settings** → **Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-playwright-automation`
4. Agree to the risks and select **Install**

### Manual Installation

```bash
npm install n8n-nodes-playwright-automation
```

---

## 🐳 Docker Support

To run this node in Docker, we provide a `docker-compose.yml` file that:
1. Installs all required Playwright browser dependencies
2. Mounts the built node code into n8n
3. Persists n8n data

### Quick Start (Development Mode)

This project includes a Docker setup optimized for development, running `npm run dev` inside a Node.js container with all Playwright dependencies pre-installed.

1. **Start the Development Container**:
   Using Docker directly:
   ```bash
   docker compose up -d --build
   ```

   **Alternative (Shorthand)**:
   ```bash
   npm run dev:docker
   ```
   This will build the image, install dependencies, and start n8n in development watch mode.

2. **Access n8n**:
   Open [http://localhost:5678](http://localhost:5678) in your browser.

3. **Development**:
   The source code is mounted into the container. Changes to the code will automatically trigger a rebuild/restart of the node (handled by `n8n-node dev`).

### Configuration

The provided `docker-compose.yml` uses a custom `Dockerfile` based on `node:22-bookworm` to ensure Playwright and its system dependencies are available.


---

## 🛠️ Development

### Prerequisites

- **[Node.js](https://nodejs.org/)** (v22 or higher) and npm
- **[git](https://git-scm.com/downloads)**

### Getting Started

```bash
# Clone the repository
git clone https://github.com/shhadi/n8n-nodes-playwright-automation.git
cd n8n-nodes-playwright-automation

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start n8n with your node and watch for changes |
| `npm run build` | Compile TypeScript to JavaScript for production |
| `npm run lint` | Check your code for errors and style issues |
| `npm run lint:fix` | Automatically fix linting issues when possible |

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

<a href="https://github.com/shhadi/n8n-nodes-playwright-automation/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=shhadi/n8n-nodes-playwright-automation" alt="Contributors" />
</a>

---

## 👨‍💻 Maintainer

<div align="center">
  <h3>Shhadi Masarwa</h3>
  <p><i>A human who’s a dad and an engineer who loves making things work better.</i></p>
  
  <p>
    <a href="mailto:shhadi.masarwa@gmail.com">
      <img src="https://img.shields.io/badge/-Email-EA4335?style=for-the-badge&logo=Gmail&logoColor=white" alt="Email" />
    </a>
    <a href="https://il.linkedin.com/in/shhadim">
      <img src="https://img.shields.io/badge/-LinkedIn-0A66C2?style=for-the-badge&logo=Linkedin&logoColor=white" alt="LinkedIn" />
    </a>
    <a href="https://github.com/shhadi">
      <img src="https://img.shields.io/badge/-GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white" alt="GitHub" />
    </a>
  </p>
</div>

---
