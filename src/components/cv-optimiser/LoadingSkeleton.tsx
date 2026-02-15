import { motion } from "framer-motion";

/** Animated loading skeleton displayed while the API call is in progress */
const LoadingSkeleton = () => {
  // Create an array of 4 items to simulate the output sections
  const items = [1, 2, 3, 4];

  return (
    <div className="space-y-6">
      {items.map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Oat-style Skeleton: Box + Lines structure */}
          <div className="flex gap-4 p-4 border rounded-lg bg-card shadow-sm">
            <div className="h-12 w-12 bg-primary/20 rounded animate-pulse shrink-0" /> {/* Skeleton Box */}
            <div className="flex-1 space-y-3 py-1">
              <div className="h-4 bg-primary/20 rounded w-3/4 animate-pulse" /> {/* Skeleton Line */}
              <div className="h-4 bg-primary/20 rounded w-1/2 animate-pulse" /> {/* Skeleton Line */}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
