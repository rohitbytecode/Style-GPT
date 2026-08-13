import express from 'express';
import { chatStream } from "@style-gpt/ai";

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

        if(typeof message !== "string" || message.trim().length === 0) {
            res.status(400).json({
                error: "message must be a non-empty string",
            });
            return;
        }

        res.status(200);
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Transfer-Encoding", "chunked");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        for await (const chunk of chatStream([
            {
                role: "user",
                content: message,
            },
        ])) {
            res.write(chunk);
        }

        res.end();
    } catch (err) {
        console.error("AI request failed: ", err);

        if(!res.headersSent) {
            res.status(500).json({
                error: "Failed to generate AI response",
            });
        } else {
            res.end();
        }
    }
});

app.listen(PORT, ()=> {
    console.log(`Style GPT API running on Port Number: ${PORT}`);
});