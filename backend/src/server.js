const app = require("./app");
const port = process.env.PORT || 80;

app.listen(port, () => {
  console.log(`Server is running on ${process.env.BACKEND_URL}`);
});
