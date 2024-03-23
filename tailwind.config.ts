import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
          ".text-icon-theme": {
            "color": "#ffffff",
          },
          ".bg-icon-theme": {
            "background-color": "rgba(0, 0, 0, 0.4)",
          },
        },
        dark: {
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          ".text-icon-theme": {
            "color": "#000000",
          },
          ".bg-icon-theme": {
            "background-color": "rgba(255, 255, 255, 0.4)",
          },
        },
      },
    ],
    styled: true,
    base: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: '',
    darkTheme: false,
  },
  plugins: [
    require('daisyui'),
  ],
}
export default config
