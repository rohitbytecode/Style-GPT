                         Style-GPT
                             │
                             ▼
                       Orchestrator
                             │
              ┌──────────────┼──────────────┐
              │              │              │
           Context       Model Router    Policies
           Builder           │
                              ▼
                       Model Registry
                              │
          ┌───────────┬───────┼────────┬──────────┐
          ▼           ▼       ▼        ▼          ▼
        Groq       Gemini  Cerebras  Mistral  OpenRouter
          │           │       │        │          │
          │           │       │        │          │
       models      models   models   models     models
          │           │       │        │          │
          └───────────┴───────┴────────┴──────────┘
                              │
                           Ollama
                              │
                         local models
