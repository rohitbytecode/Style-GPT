import express from 'express';

const app = express();
const PORT = 7190;

app.use(express.json());

app.get("/", (_req, res) => {
    res.json({
        message: "Style GPT API",
        status: "running",
    });
});

app.get("/health", (_req, res) => {
    res.json({
        status: "ok",
        service: "style-gpt-api",
    });
});

app.listen(PORT, ()=> {
    console.log(`Style GPT API running on Port Number: ${PORT}`);
});