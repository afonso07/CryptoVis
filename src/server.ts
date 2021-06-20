import helmet from "helmet";
import express from "express";
import cors from "cors"; // This is Cross Origin Resource Sharing also middlware https://www.npmjs.com/package/cors
const app = express();
const corsOptions = {
  //For production: origin: "https://nplfn.azurewebsites.net"
  origin: process.env["ORIGIN"],
};
app.use(cors(corsOptions)); //Mounting middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.get("/", (req, res) => {
  res.json({ message: "Welcome Crypto Vis" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
