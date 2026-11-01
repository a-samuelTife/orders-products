const client = require("prom-client");

const SERVICE = "products"; // CHANGE to "orders" in the orders service

const register = new client.Registry();
client.collectDefaultMetrics({ register }); // CPU, memory, etc.

const httpRequests = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"],
  registers: [register],
});

const httpDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

// Structured log: one JSON object per line
function log(level, message, fields = {}) {
  console.log(
    JSON.stringify({
      time: new Date().toISOString(),
      level,
      service: SERVICE,
      message,
      ...fields,
    })
  );
}

// Middleware: measures every request
function observability(req, res, next) {
  const start = process.hrtime.bigint();
  res.on("finish", () => {
    const seconds = Number(process.hrtime.bigint() - start) / 1e9;
    const route = req.route ? req.route.path : "unmatched";
    const labels = { method: req.method, route, status: res.statusCode };
    httpRequests.inc(labels);
    httpDuration.observe(labels, seconds);

    if (req.path !== "/health" && req.path !== "/metrics") {
      log("info", "request", {
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        duration_ms: Math.round(seconds * 1000),
      });
    }
  });
  next();
}

async function metricsHandler(req, res) {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
}

module.exports = { observability, metricsHandler, log };