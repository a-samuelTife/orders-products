const test = require("node:test");
const assert = require("node:assert");
const app = require("../src/app");

test("GET /products returns a list", async () => {
  const server = app.listen(0); // port 0 = pick any free port
  const { port } = server.address();

  const res = await fetch(`http://localhost:${port}/products`);
  const body = await res.json();

  assert.strictEqual(res.status, 200);
  assert.ok(body.length > 0);
  server.close();
});

test("GET /products/999 returns 404", async () => {
  const server = app.listen(0);
  const { port } = server.address();

  const res = await fetch(`http://localhost:${port}/products/999`);

  assert.strictEqual(res.status, 404);
  server.close();
});