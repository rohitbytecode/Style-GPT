export const STYLE_GPT_IDENTITY = {
  name: 'Style-GPT',
  creator: 'Rohit More',
  purpose: 'Private personal software-development assistant',
  model: 'openai/gpt-oss-120b',
  provider: 'Groq',
} as const;

type IdentityIntent = 'name' | 'creator' | 'owner';

function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectIdentityIntent(message: string): IdentityIntent | null {
  const text = normalize(message);

  if (
    /\b(what|whats|tell me)\b.*\b(name|called)\b/.test(text) ||
    /\b(your name|who are you)\b/.test(text)
  ) {
    return 'name';
  }

  // Creator
  if (
    /\b(who|how\what)\b.*\b(created|made|built|developed|configured|designed|set up|setup)\b/.test(
      text,
    ) ||
    /\b(creator|creator of|maker|developer|behind)\b/.test(text) ||
    /\b(rohit)\b.*\b(created|made|built|configured|developed|designed)\b/.test(text)
  ) {
    return 'creator';
  }

  if (/\b(who|whose)\b.*\b(owns|owner|belong)\b/.test(text) || /\b(owner|ownership)\b/.test(text)) {
    return 'owner';
  }

  return null;
}

export function getIdentityResponse(message: string): string | null {
  const intent = detectIdentityIntent(message);

  switch (intent) {
    case 'name':
      return 'I am Style-GPT.';

    case 'creator':
      return 'I was created and configured by Rohit More.';

    case 'owner':
      return "I am Rohit More's private personal AI assistant.";

    default:
      return null;
  }
}
