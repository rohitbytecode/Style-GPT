                    Style-GPT Orchestrator
                             │
                             ▼
                       Model Registry
                             │
                ┌────────────┴────────────┐
                │                         │
             Gemini                    Groq
                │                         │
          listModels()              listModels()
                │                         │
          ┌─────┴─────┐             ┌─────┴─────┐
          ▼           ▼             ▼           ▼
       Gemini 3.6   Gemini 3.7    model A     model B
          │           │
          └─────┬─────┘
                │
           chatStream()
                │
                ▼
             Gemini API
