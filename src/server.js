import app from "./app.js";
import "./database/index.js"

app.listen(3000, () => {
  console.log("🚀Servidor rodando na porta 3000");
});