import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				primary: "rgb(0 0 0)",
				"primary-foreground": "rgb(255 255 255)",
				secondary: "rgb(var(--secondary))",
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				dark: {
					background: "hsl(var(--dark-background))",
					foreground: "hsl(var(--dark-foreground))",
					card: {
						DEFAULT: "hsl(var(--dark-card))",
						foreground: "hsl(var(--dark-card-foreground))",
					},
					popover: {
						DEFAULT: "hsl(var(--dark-popover))",
						foreground: "hsl(var(--dark-popover-foreground))",
					},
					primary: "rgb(255 255 255)",
					"primary-foreground": "rgb(0 0 0)",
					secondary: "rgb(var(--dark-secondary))",
					muted: {
						DEFAULT: "hsl(var(--dark-muted))",
						foreground: "hsl(var(--dark-muted-foreground))",
					},
					accent: {
						DEFAULT: "hsl(var(--dark-accent))",
						foreground: "hsl(var(--dark-accent-foreground))",
					},
					destructive: {
						DEFAULT: "hsl(var(--dark-destructive))",
						foreground: "hsl(var(--dark-destructive-foreground))",
					},
					border: "hsl(var(--dark-border))",
					input: "hsl(var(--dark-input))",
					ring: "hsl(var(--dark-ring))",
				},
				chart: {
					"1": "hsl(var(--chart-1))",
					"2": "hsl(var(--chart-2))",
					"3": "hsl(var(--chart-3))",
					"4": "hsl(var(--chart-4))",
					"5": "hsl(var(--chart-5))",
				},
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: {
						height: "0",
					},
					to: {
						height: "var(--radix-accordion-content-height)",
					},
				},
				"accordion-up": {
					from: {
						height: "var(--radix-accordion-content-height)",
					},
					to: {
						height: "0",
					},
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [],
};
export default config;
