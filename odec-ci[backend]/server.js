require("./config/environment.js");
const app = require("./app.js");

const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ODEC backend ready on port ${PORT}`);
});