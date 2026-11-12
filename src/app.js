const express = require("express");
const client = require("prom-client");

const app = express();
app.use(express.json());

// ---- Metrics (scraped by Grafana Alloy / Prometheus) ----
client.collectDefaultMetrics();
const httpDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request latency",
  labelNames: ["method", "route", "status"],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2],
});

app.use((req, res, next) => {
  const end = httpDuration.startTimer();
  res.on("finish", () => {
    end({ method: req.method, route: req.route ? req.route.path : req.path, status: res.statusCode });
  });
  next();
});

// ---- Routes ----
const items = [];

app.get("/health", (_req, res) => {
  res.json({ status: "ok", version: process.env.GIT_SHA || "dev", uptime: process.uptime() });
});

app.get("/items", (_req, res) => res.json(items));

app.post("/items", (req, res) => {
  const { name } = req.body || {};
  if (!name) return res.status(400).json({ error: "name is required" });
  const item = { id: items.length + 1, name };
  items.push(item);
  res.status(201).json(item);
});

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

module.exports = app;
