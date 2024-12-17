import express from "express";
import router from "./router/index.js";
import morgan from "morgan";
import cors from "cors";

const app = express()

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
morgan.token("body", (req) => {
    return JSON.stringify(req.body);
});

const customMorganFormat =
    ":method :url :status :response-time ms - Body: :body";


app.use(morgan(customMorganFormat));
app.use('/', router())

app.get('/', (req, res) => {
    res.send("Hello World")
})
app.get('*', (req, res) => res.status(404))
export default app