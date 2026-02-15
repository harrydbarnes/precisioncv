import { motion } from "framer-motion";

/** Animated loading skeleton displayed while the API call is in progress */
const LoadingSkeleton = () => {
  // Create an array of 4 items to simulate the output sections
  const items = [1, 2, 3, 4];

  // Oat skeleton CSS relies on --muted and --radius-medium.
  // Our project defines --muted as HSL components, not a full color.
  // We need to shim these variables to make the library styles work correctly.
  // These variables are defined in src/index.css and automatically switch with the theme.
  const skeletonStyles = {
    "--muted": "var(--muted-color)",
    "--foreground": "var(--foreground-color)",
    "--radius-medium": "0.5rem",
    "--space-3": "0.75rem",
  } as React.CSSProperties;

  return (
    <div className="space-y-6" style={skeletonStyles}>
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
