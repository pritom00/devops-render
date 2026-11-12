# CI/CD Pipeline with Security Scanning on Render

A production-style Node.js API deployment project demonstrating **automated CI/CD, container security scanning, GitHub Container Registry (GHCR), and staged deployments to Render**.

Every push to `main` triggers a GitHub Actions pipeline that validates the code, builds and scans a Docker image, publishes the image to GHCR, and deploys it to staging before production.

## 🚀 Live Demo

| Environment | Application | Health Check | Metrics |
|---|---|---|---|
| **Staging** | [Open Staging](https://devops-demo-staging-wwz4.onrender.com) | [Health](https://devops-demo-staging-wwz4.onrender.com/health) | [Metrics](https://devops-demo-staging-wwz4.onrender.com/metrics) |
| **Production** | [Open Production](https://devops-demo-production.onrender.com) | [Health](https://devops-demo-production.onrender.com/health) | [Metrics](https://devops-demo-production.onrender.com/metrics) |

**Project resources**

- **GitHub Repository:** [pritom00/devops-render](https://github.com/pritom00/devops-render)
- **Container Registry:** [GitHub Packages — GHCR](https://github.com/pritom00/devops-render/pkgs/container/devops-render)
- **CI/CD Pipeline:** [GitHub Actions Workflow Runs](https://github.com/pritom00/devops-render/actions/workflows/ci-cd.yml)

> Note: Live URLs are configured for this project. Availability depends on the Render services being active and healthy.

## ✨ Key Features

- Automated CI/CD using GitHub Actions
- ESLint code quality checks
- Automated testing with Jest and Supertest
- Multi-stage Docker image builds
- Container vulnerability scanning with Trivy
- Pipeline failure on detected critical vulnerabilities
- Container image publishing to GitHub Container Registry
- Commit-specific image tags and a `latest` tag
- Staged deployment: staging → production
- Automated deployment smoke tests
- Application health checks and version reporting
- Prometheus-compatible metrics
- Static application security analysis with CodeQL
- Dependency update automation using Dependabot
- Non-root container execution

## 🏗️ Architecture

```text
                 Developer
                     |
                     | git push
                     v
                GitHub Repository
                     |
                     v
              GitHub Actions CI/CD
                     |
             +-------+-------+
             |               |
             v               v
          ESLint          Jest Tests
             |               |
             +-------+-------+
                     |
                     v
               Docker Build
                     |
                     v
                Trivy Scan
                     |
              Critical Issues?
                /         \
              Yes          No
               |            |
               v            v
          Fail Pipeline   Push to GHCR
                              |
                              v
                       Deploy Staging
                              |
                              v
                       Smoke Test /health
                              |
                              v
                      Deploy Production
                              |
                              v
                       Smoke Test /health
```

The pipeline validates the application before deployment. Production deployment proceeds only after the preceding pipeline stages succeed.

## ⚙️ Technology Stack

| Category | Technology |
|---|---|
| Runtime | Node.js 22 (Alpine) |
| Backend Framework | Express.js |
| Testing | Jest, Supertest |
| Linting | ESLint |
| Containerization | Docker, multi-stage build |
| Container Registry | GitHub Container Registry (GHCR) |
| CI/CD | GitHub Actions |
| Container Security | Trivy |
| Static Code Analysis | GitHub CodeQL |
| Metrics | prom-client, Prometheus format |
| Hosting | Render |
| Dependency Updates | Dependabot |

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health status, application version, and uptime |
| `GET` | `/items` | Retrieve items stored in memory |
| `POST` | `/items` | Create an item |
| `GET` | `/metrics` | Expose Prometheus-compatible metrics |

### Health Check Response

The `/health` endpoint provides a simple way to verify application availability and identify the deployed version using `GIT_SHA`.

Example request:

```bash
curl https://devops-demo-production.onrender.com/health
```

### Create an Item

```bash
curl -X POST https://devops-demo-production.onrender.com/items \
  -H "Content-Type: application/json" \
  -d '{"name":"demo"}'
```

### List Items

```bash
curl https://devops-demo-production.onrender.com/items
```

### Retrieve Metrics

```bash
curl https://devops-demo-production.onrender.com/metrics
```

**Note:** Items are stored in memory, so they are not persistent across application restarts or redeployments.

## 🔄 CI/CD Workflow

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) automates the following stages.

1. **Trigger:** A push to `main` starts the pipeline.
2. **Lint:** ESLint checks the source code.
3. **Test:** Jest and Supertest execute the automated test suite.
4. **Build:** Docker builds the application image and injects the Git commit SHA.
5. **Security Scan:** Trivy scans the image and fails the pipeline when critical vulnerabilities meet the configured failure policy.
6. **Publish:** The validated image is pushed to GHCR.
7. **Deploy Staging:** The pipeline triggers the Render staging deployment.
8. **Smoke Test:** The staging health endpoint is checked.
9. **Deploy Production:** The production deployment is triggered after staging succeeds.
10. **Production Verification:** The production health endpoint is checked.

### Container Image Tags

Images are published using commit-specific and rolling tags.

```text
ghcr.io/pritom00/devops-render:<commit-sha>
ghcr.io/pritom00/devops-render:latest
```

The commit-specific tag makes it easier to identify the image associated with a particular revision.

## 📁 Project Structure

```text
devops-render/
├── .github/
│   ├── workflows/
│   │   ├── ci-cd.yml
│   │   └── codeql.yml
│   └── dependabot.yml
├── src/
│   ├── app.js
│   └── index.js
├── test/
│   └── app.test.js
├── Dockerfile
├── render.yaml
├── package.json
└── README.md
```

| File | Purpose |
|---|---|
| `src/app.js` | Express application, API routes, and metrics |
| `src/index.js` | Server entry point |
| `test/app.test.js` | Automated API tests |
| `Dockerfile` | Multi-stage container build |
| `render.yaml` | Render service and deployment configuration |
| `.github/workflows/ci-cd.yml` | CI/CD automation |
| `.github/workflows/codeql.yml` | Static code security analysis |
| `.github/dependabot.yml` | Dependency update configuration |

## 💻 Local Development

### Prerequisites

- Node.js 22 or later
- npm
- Git
- Docker (optional)

### 1. Clone the Repository

```bash
git clone https://github.com/pritom00/devops-render.git
cd devops-render
```

### 2. Install Dependencies

```bash
npm ci
```

### 3. Run Linting and Tests

```bash
npm run lint
npm test
```

### 4. Start the Application

```bash
npm start
```

The API should be available at:

```text
http://localhost:3000
```

Verify it with:

```bash
curl http://localhost:3000/health
```

## 🐳 Run with Docker

Build the Docker image:

```bash
docker build -t devops-render .
```

Run the container:

```bash
docker run --rm -p 3000:3000 devops-render
```

Test the health endpoint:

```bash
curl http://localhost:3000/health
```

The container is configured to run as a non-root user to reduce unnecessary privileges.

## ☁️ Deployment Configuration

### Render

The `render.yaml` Blueprint defines the staging and production services.

Expected configuration:

- Staging service: `devops-demo-staging`
- Production service: `devops-demo-production`
- Health check path: `/health`
- Automatic deployment: disabled (`autoDeploy: false`)
- Deployment initiated through GitHub Actions and Render Deploy Hooks

### GitHub Actions Environments

Create the following environments in your GitHub repository:

- `staging`
- `production`

Optionally, configure required reviewers for the production environment if manual approval is part of your release policy.

### Required Secrets and Variables

| Environment | Type | Name | Purpose |
|---|---|---|---|
| Staging | Secret | `RENDER_STAGING_HOOK` | Render staging deployment hook |
| Staging | Variable | `STAGING_URL` | Staging application base URL |
| Production | Secret | `RENDER_PROD_HOOK` | Render production deployment hook |
| Production | Variable | `PROD_URL` | Production application base URL |

Configure these values in **GitHub → Settings → Secrets and variables → Actions** or in the corresponding environment settings, according to how the workflow references them.

Example commands using GitHub CLI:

```bash
gh secret set RENDER_STAGING_HOOK \
  --env staging \
  --body "YOUR_STAGING_DEPLOY_HOOK_URL"

gh variable set STAGING_URL \
  --env staging \
  --body "https://devops-demo-staging-wwz4.onrender.com"

gh secret set RENDER_PROD_HOOK \
  --env production \
  --body "YOUR_PRODUCTION_DEPLOY_HOOK_URL"

gh variable set PROD_URL \
  --env production \
  --body "https://devops-demo-production.onrender.com"
```

Replace the example values with your actual configuration. Never commit deploy-hook URLs, tokens, or other secrets to the repository.

### GitHub Container Registry

The image is published to:

```text
ghcr.io/pritom00/devops-render
```

Render must be able to pull the image. Configure the package visibility or registry credentials as appropriate for your deployment.

## 🔐 Security Practices

This project demonstrates several useful DevSecOps practices:

- **Trivy:** Scans the built container image for vulnerabilities.
- **CodeQL:** Performs static analysis to identify potential security issues.
- **Non-root container:** Reduces the privileges used by the running application.
- **Multi-stage Docker build:** Separates build-time dependencies from the final runtime image where configured.
- **Automated testing:** Helps catch regressions before deployment.
- **GitHub Secrets:** Keeps deployment credentials outside source control.
- **Dependabot:** Helps identify and update outdated dependencies.

A passing scan does not guarantee that an application is completely secure. Review vulnerability reports, dependency updates, workflow permissions, and secret-handling practices regularly.

## 📊 Monitoring and Observability

### Health Monitoring

Use `/health` to check whether the service is responding and to inspect its reported version and uptime.

### Prometheus Metrics

The `/metrics` endpoint exposes application metrics in Prometheus-compatible format, including configured request and runtime metrics.

Example:

```bash
curl https://devops-demo-production.onrender.com/metrics
```

Potential next steps include:

- Configure uptime monitoring with UptimeRobot or a similar service.
- Connect metrics to a Prometheus-compatible monitoring platform.
- Build dashboards and alerts in Grafana Cloud.
- Monitor deployment failures and application error rates.

## ↩️ Rollback Strategy

If a deployment introduces a problem:

1. Open the relevant service in the Render Dashboard.
2. Navigate to its deployment history.
3. Select a previously successful deployment.
4. Use Render's available rollback functionality, if supported for that service and deployment type.
5. Verify the `/health` endpoint and application behavior.

Alternatively, redeploy a known-good commit through the pipeline, provided the workflow supports that deployment process.

Commit-specific image tags help identify earlier versions. Ensure the desired image remains available in GHCR before attempting an image-based rollback.

## 🛠️ Useful Commands

List recent CI/CD runs:

```bash
gh run list \
  --branch main \
  --workflow "CI/CD" \
  --limit 5
```

Watch a workflow run:

```bash
gh run watch RUN_ID
```

Inspect failed logs:

```bash
gh run view RUN_ID --log-failed
```

Replace `RUN_ID` with the actual GitHub Actions run ID.

## 🎯 What This Project Demonstrates

This project is designed to demonstrate practical experience with:

- CI/CD pipeline design and implementation
- GitHub Actions workflow automation
- Docker image building and distribution
- Container vulnerability scanning
- Static application security analysis
- Environment-based deployment workflows
- Staging smoke tests and production verification
- Application health checks and metrics
- Deployment troubleshooting and rollback planning

It is a portfolio project for learning and demonstrating **DevOps, CI/CD, and DevSecOps fundamentals**.

## 👨‍💻 Author

**Estiaz Nur Pritom**  
Software Engineer | Full-Stack Developer

- GitHub: [@pritom00](https://github.com/pritom00)
- Project: [devops-render](https://github.com/pritom00/devops-render)

---

⭐ If you find this project useful, consider starring the repository.
