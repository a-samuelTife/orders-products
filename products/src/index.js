const app = require("./app");

// Read the port from an environment variable, default to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Products service listening on port ${PORT}`);
});