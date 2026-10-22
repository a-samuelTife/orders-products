const test = require("node:test");
const assert = require("node:assert");
const app = require("../src/app");

test("GET /health returns ok", async () => {
  const server = app.listen(0);
  const { port } = server.address();

  const res = await fetch(`http://localhost:${port}/health`);
  const body = await res.json();

  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.status, "ok");
  server.close();
});

test("POST /orders without body returns 400", async () => {
  const server = app.listen(0);
  const { port } = server.address();

  const res = await fetch(`http://localhost:${port}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  assert.strictEqual(res.status, 400);
  server.close();
});