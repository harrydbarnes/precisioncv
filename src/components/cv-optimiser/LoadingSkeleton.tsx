import { motion } from "framer-motion";
import { useTheme } from "next-themes";

/** Animated loading skeleton displayed while the API call is in progress */
const LoadingSkeleton = () => {
  // Create an array of 4 items to simulate the output sections
  const items = [1, 2, 3, 4];
  const { theme, systemTheme } = useTheme();

  // Determine if dark mode is active
  const isDark = theme === "dark" || (theme === "system" && systemTheme === "dark");

  // Oat skeleton CSS relies on --muted and --radius-medium.
  // Our project defines --muted as HSL components, not a full color.
  // We need to shim these variables to make the library styles work correctly.
  // Values taken from src/index.css
  const lightStyles = {
    "--muted": "hsl(72 100% 42%)",
    "--foreground": "hsl(72 100% 8%)",
    "--radius-medium": "0.5rem",
    "--space-3": "0.75rem",
  } as React.CSSProperties;

  const darkStyles = {
    "--muted": "hsl(72 100% 17%)",
    "--foreground": "hsl(72 100% 50%)",
    "--radius-medium": "0.5rem",
    "--space-3": "0.75rem",
  } as React.CSSProperties;

  return (
    <div className="space-y-6" style={isDark ? darkStyles : lightStyles}>
      {items.map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Oat-style Skeleton: Box + Lines structure */}
          <div className="flex gap-4 p-4 border rounded-lg bg-card shadow-sm">
            <div role="status" className="skeleton box" />
            <div className="flex-1 space-y-3 py-1">
              <div role="status" className="skeleton line" style={{ width: "75%" }} />
              <div role="status" className="skeleton line" style={{ width: "50%" }} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
