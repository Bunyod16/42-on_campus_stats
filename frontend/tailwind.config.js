/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'monospace', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-alt': 'var(--color-surface-alt)',
        'border-accent': 'var(--color-border)',
        'border-subtle': 'var(--color-border-subtle)',
        accent: 'var(--color-accent)',
        'accent-secondary': 'var(--color-accent-secondary)',
        'accent-tertiary': 'var(--color-accent-tertiary)',
        'text-primary': 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        'header-bg': 'var(--color-header-bg)',
      },
      keyframes: {
        "count-up": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "count-up": "count-up 0.6s ease-out",
      },
      screens: {
        "3xl": "2560px",
      },
    },
  },
  plugins: [],
};