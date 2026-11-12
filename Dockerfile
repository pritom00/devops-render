# ---- Build stage ----
FROM node:25-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ---- Runtime stage ----
FROM node:25-alpine
WORKDIR /app
ENV NODE_ENV=production
ARG GIT_SHA=dev
ENV GIT_SHA=$GIT_SHA
COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
COPY package.json ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "src/index.js"]
