# CI/CD Pipeline with Security Scanning on Render

Node.js API deployed to Render through a GitHub Actions pipeline.

```
git push -> lint + test -> build image -> Trivy scan -> push to GHCR
         -> deploy staging (Render hook) -> smoke test
         -> manual approval -> deploy production -> smoke test
```

## Setup

1. Push this repo to GitHub.
2. Replace `OWNER/REPO` in `render.yaml` (lowercase). In Render: New > Blueprint, pick the repo.
3. Make the GHCR package public after the first push (or add registry credentials in Render).
4. In each Render service, copy the **Deploy Hook URL**.
5. GitHub repo > Settings > Environments:
   - `staging`: secret `RENDER_STAGING_HOOK`, variable `STAGING_URL`
   - `production`: secret `RENDER_PROD_HOOK`, variable `PROD_URL`, plus **Required reviewers**
6. Push to `main` and watch the Actions tab.

## Local

```
npm ci && npm test && npm run lint
docker build -t demo . && docker run -p 3000:3000 demo
curl localhost:3000/health
```

## Rollback

Render dashboard > service > Deploys > pick an earlier deploy > Rollback.
Or re-run the pipeline for an older commit: images are tagged by commit SHA.

## Monitoring

- `/metrics` exposes Prometheus metrics (request latency histogram + Node defaults).
- Add an UptimeRobot check on `/health`, and optionally send `/metrics` to Grafana Cloud.
