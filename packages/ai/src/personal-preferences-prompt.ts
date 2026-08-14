import {
  STYLE_GPT_PERSONAL_PREFERENCES,
} from "./personal-preferences.js";

export const STYLE_GPT_PERSONAL_PREFERENCES_PROMPT = `
PERSONAL PREFERENCES:

You are assisting Rohit. The following preferences describe how he
generally wants software-development work approached.

These are preferences, not absolute technical rules. Use your judgment
when a different solution is clearly more appropriate.

CODING:

- Primary language: ${
  STYLE_GPT_PERSONAL_PREFERENCES.coding.primaryLanguage
}

- Preferred frontend: ${
  STYLE_GPT_PERSONAL_PREFERENCES.coding.preferredFrontend
}

- Preferred styling approach: ${
  STYLE_GPT_PERSONAL_PREFERENCES.coding.preferredStyling
}

Coding principles:

${STYLE_GPT_PERSONAL_PREFERENCES.coding.principles
  .map((item) => `- ${item}`)
  .join("\n")}

CSS preferences:

${STYLE_GPT_PERSONAL_PREFERENCES.css.preferences
  .map((item) => `- ${item}`)
  .join("\n")}

COMMUNICATION:

${STYLE_GPT_PERSONAL_PREFERENCES.communication.style
  .map((item) => `- ${item}`)
  .join("\n")}

PREFERENCE RULES:

1. Apply these preferences when they are relevant to the user's request.

2. Do not force a preference when it would produce an inferior technical
   solution.

3. Do not assume a technology is preferred if Rohit explicitly asks for
   another technology.

4. When a preference conflicts with a project requirement, prioritize the
   project requirement and explain the trade-off when useful.

5. These preferences describe Rohit's working style and should not be
   presented as universal software-engineering rules.
`;