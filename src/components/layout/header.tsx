
import { ThemeToggle } from '@/components/theme-toggle';

const KaizenLogo = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className="mr-2"
  >
    {/* Outer circle - Theme Secondary Color */}
    <circle cx="50" cy="50" r="48" fill="hsl(var(--secondary))" /> 
    {/* Middle rounded square - Theme Primary Color */}
    <rect x="15" y="15" width="70" height="70" rx="15" ry="15" fill="hsl(var(--primary))" /> 
    {/* Inner rounded square - card color (white in light, darker in dark) */}
    <rect x="22" y="22" width="56" height="56" rx="10" ry="10" fill="hsl(var(--card))" />
    {/* "Kaizen" Text - Theme Foreground Color */}
    <text
      x="50"
      y="50"
      dominantBaseline="central"
      textAnchor="middle"
      fontSize="24" // Adjusted font size for "Kaizen"
      fontFamily="Arial, sans-serif"
      fontWeight="bold"
      fill="hsl(var(--foreground))" 
      dy=".1em" // Slight vertical adjustment for centering
    >
      改善
    </text>
  </svg>
);


export function AppHeader() {
  return (
    <header className="py-4 px-4 md:px-6 border-b sticky top-0 bg-background/95 backdrop-blur z-50 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <KaizenLogo />
          <h1 className="text-2xl font-bold text-foreground">KAIZEN (Nihongo Vocabulary Flashcard App)</h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}

