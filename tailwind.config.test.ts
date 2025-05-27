import resolveConfig from "tailwindcss/resolveConfig";
import config from "./tailwind.config";

const fullConfig = resolveConfig(config);

describe("Tailwind Config", () => {
	it("should have darkMode set to class", () => {
		expect(fullConfig.darkMode).toBe("class");
	});

	it("should include dark mode color definitions", () => {
		const colors = fullConfig.theme.colors as any;
		expect(colors.dark.background).toBeDefined();
		expect(colors.dark.foreground).toBeDefined();
		expect(colors.dark.card.DEFAULT).toBeDefined();
		expect(colors.dark.card.foreground).toBeDefined();
		expect(colors.dark.popover.DEFAULT).toBeDefined();
		expect(colors.dark.popover.foreground).toBeDefined();
		expect(colors.dark.primary).toBeDefined();
		expect(colors.dark.secondary).toBeDefined();
		expect(colors.dark.muted.DEFAULT).toBeDefined();
		expect(colors.dark.muted.foreground).toBeDefined();
		expect(colors.dark.accent.DEFAULT).toBeDefined();
		expect(colors.dark.accent.foreground).toBeDefined();
		expect(colors.dark.destructive.DEFAULT).toBeDefined();
		expect(colors.dark.destructive.foreground).toBeDefined();
		expect(colors.dark.border).toBeDefined();
		expect(colors.dark.input).toBeDefined();
		expect(colors.dark.ring).toBeDefined();
	});
});
