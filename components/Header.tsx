import { ThemeToggle } from "./ThemeToggle";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border py-4 px-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold">Chat with Your Transcript</h1>
      <ThemeToggle />
    </header>
  );
};