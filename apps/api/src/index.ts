import express from 'express';
import { chat } from "@style-gpt/ai";

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

app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body as {
            message?: unknown;
        };

        if (typeof message !== "string" || message.trim().length === 0) {
            res.status(400).json({
                error: "message must be a non-empty string",
            });
            return;
        }

        const response = await chat([
            {
                role: "user",
                content: message,
            },
        ]);

        res.json({
            response,
        });
    } catch(err) {
        console.error("AI request failed: ", err);

        res.status(500).json({
            error: "Failed to generate AI response",
        });
    }
});

app.listen(PORT, ()=> {
    console.log(`Style GPT API running on Port Number: ${PORT}`);
});