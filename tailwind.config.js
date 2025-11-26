/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Accessibility colors
        'high-contrast': {
          bg: '#000000',
          fg: '#ffffff',
          accent: '#ffff00'
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-accessibility": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.6 },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)", opacity: 0 },
          to: { transform: "translateX(0)", opacity: 1 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-accessibility": "pulse-accessibility 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-in-right": "slide-in-right 0.3s ease-out",
      },
      // Large text scaling
      fontSize: {
        'large-base': ['1.125rem', '1.75rem'],
        'large-lg': ['1.25rem', '1.875rem'],
        'large-xl': ['1.5rem', '2.25rem'],
      }
    },
  },
  plugins: [
    // Custom accessibility plugin
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.high-contrast': {
          backgroundColor: theme('colors.high-contrast.bg'),
          color: theme('colors.high-contrast.fg'),
          '& *': {
            borderColor: theme('colors.high-contrast.fg') + ' !important',
          },
          '& button, & a, & [role="button"]': {
            backgroundColor: theme('colors.high-contrast.fg'),
            color: theme('colors.high-contrast.bg'),
            '&:hover': {
              backgroundColor: theme('colors.high-contrast.accent'),
              color: theme('colors.high-contrast.bg'),
            }
          }
        },
        '.large-text': {
          fontSize: theme('fontSize.large-base[0]'),
          lineHeight: theme('fontSize.large-base[1]'),
          '& h1': {
            fontSize: theme('fontSize.large-xl[0]'),
            lineHeight: theme('fontSize.large-xl[1]'),
          },
          '& h2, & h3, & h4': {
            fontSize: theme('fontSize.large-lg[0]'),
            lineHeight: theme('fontSize.large-lg[1]'),
          }
        },
        '.focus-visible-enhanced': {
          '&:focus-visible': {
            outline: '3px solid #2563eb',
            outlineOffset: '2px',
            borderRadius: '4px'
          }
        }
      }
      addUtilities(newUtilities)
    }
  ],
}