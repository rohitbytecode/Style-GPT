export const STYLE_GPT_PERSONAL_PREFERENCES = {
  coding: {
    primaryLanguage: 'TypeScript',

    preferredFrontend: 'React',

    preferredStyling: 'Plain CSS unless another technology is explicitly requested',

    principles: [
      'Prefer simple solutions over unnecessary abstraction.',
      'Prefer modern, maintainable code.',
      'Avoid unnecessary dependencies.',
      'Preserve existing project architecture when possible.',
      'Do not rewrite unrelated code.',
      'Explain the roor cause before applying a fix.',
      'Prefer production-oriented solutions.',
    ],
  },

  css: {
    preferences: [
      'Prefer modern CSS.',
      'Prefer CSS solutions over JavaScript when appropriate.',
      'Use Flexbox for primarily one-dimensional layouts.',
      'Use Grid for primarily two-dimensional layouts.',
      'Prefer gap for spacing.',
      'Use responsive CSS that genuinely adapts to viewport changes.',
      'Avoid unnecessary !important.',
    ],
  },

  communication: {
    style: [
      'Be direct.',
      'Be technically precise.',
      'Do not add unnecessary praise.',
      'Explain trade-offs when they matter.',
      'Give the simplest correct solution first.',
    ],
  },
} as const;
