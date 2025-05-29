"use client";

import { fireEvent, render, screen } from "@testing-library/react";
import { useTheme } from "next-themes";
import { DarkModeToggle } from "./dark-mode-toggle";

// Mock useTheme
jest.mock("next-themes", () => ({
	useTheme: jest.fn(),
}));

// Mock Button component as it's not relevant to this test
jest.mock("@/components/ui/button", () => ({
	Button: ({
		onClick,
		children,
		...props
	}: React.PropsWithChildren<{ onClick?: () => void }>) => (
		<button onClick={onClick} {...props}>
			{children}
		</button>
	),
}));

describe("DarkModeToggle", () => {
	let mockSetTheme: jest.Mock;

	beforeEach(() => {
		mockSetTheme = jest.fn();
		(useTheme as jest.Mock).mockReturnValue({
			theme: "light",
			setTheme: mockSetTheme,
		});
		// Clear console mocks if any previous test spied on it
		jest.clearAllMocks();
	});

	it("renders with the sun icon when in light mode", () => {
		render(<DarkModeToggle />);
		expect(screen.getByRole("button")).toBeInTheDocument();
		// Check for Moon icon as it represents the action to switch TO dark mode
		expect(document.querySelector(".lucide-moon")).toBeInTheDocument();
	});

	it("renders with the moon icon when in dark mode", () => {
		(useTheme as jest.Mock).mockReturnValue({
			theme: "dark",
			setTheme: mockSetTheme,
		});
		render(<DarkModeToggle />);
		expect(screen.getByRole("button")).toBeInTheDocument();
		// Check for Sun icon as it represents the action to switch TO light mode
		expect(document.querySelector(".lucide-sun")).toBeInTheDocument();
	});

	it('calls setTheme to "dark" when in light mode and clicked', () => {
		render(<DarkModeToggle />);
		fireEvent.click(screen.getByRole("button"));
		expect(mockSetTheme).toHaveBeenCalledWith("dark");
	});

	it('calls setTheme to "light" when in dark mode and clicked', () => {
		(useTheme as jest.Mock).mockReturnValue({
			theme: "dark",
			setTheme: mockSetTheme,
		});
		render(<DarkModeToggle />);
		fireEvent.click(screen.getByRole("button"));
		expect(mockSetTheme).toHaveBeenCalledWith("light");
	});

	it("updates the html class attribute (simulated via theme change)", () => {
		// This test is more conceptual for useTheme's behavior,
		// as direct html manipulation isn't easily testable here without a full browser env.
		// We ensure setTheme is called, which in turn should handle the class update.
		render(<DarkModeToggle />);
		fireEvent.click(screen.getByRole("button"));
		expect(mockSetTheme).toHaveBeenCalledWith("dark");

		// Simulate theme changing to dark
		(useTheme as jest.Mock).mockReturnValueOnce({
			theme: "dark", // current theme after click
			setTheme: mockSetTheme,
		});
		render(<DarkModeToggle />); // Re-render or update component state if needed
		fireEvent.click(screen.getByRole("button"));
		expect(mockSetTheme).toHaveBeenCalledWith("light");
	});

	it("logs to console when LOG_LEVEL is debug and theme is toggled", () => {
		process.env.LOG_LEVEL = "debug";
		const consoleSpy = jest.spyOn(console, "log");

		render(<DarkModeToggle />);
		fireEvent.click(screen.getByRole("button"));
		expect(consoleSpy).toHaveBeenCalledWith("Theme changed to dark");

		// Simulate theme changed to dark, then toggle back to light
		(useTheme as jest.Mock).mockReturnValue({
			theme: "dark",
			setTheme: mockSetTheme,
		});
		// Need to re-render or ensure the component picks up the new theme for the next toggle
		// For this test structure, re-rendering is simplest.
		render(<DarkModeToggle />);
		fireEvent.click(screen.getByRole("button"));
		expect(consoleSpy).toHaveBeenCalledWith("Theme changed to light");

		consoleSpy.mockRestore();
		process.env.LOG_LEVEL = undefined;
	});

	it("does not log to console when LOG_LEVEL is not debug", () => {
		// Ensure LOG_LEVEL is not 'debug'
		process.env.LOG_LEVEL = undefined;
		const consoleSpy = jest.spyOn(console, "log");

		render(<DarkModeToggle />);
		fireEvent.click(screen.getByRole("button"));
		expect(consoleSpy).not.toHaveBeenCalled();

		consoleSpy.mockRestore();
	});
});
