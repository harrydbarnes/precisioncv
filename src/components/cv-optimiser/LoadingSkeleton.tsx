import { motion } from "framer-motion";
import { FileText, Mail, MessageSquare, TrendingUp, Target } from "lucide-react";

/** Animated loading skeleton displayed while the API call is in progress */
const LoadingSkeleton = () => {
  const sections = [
    { title: "Match Analysis", icon: Target },
    { title: "Tailored CV", icon: FileText },
    { title: "Cover Letter", icon: Mail },
    { title: "Interview Q&As", icon: MessageSquare },
    { title: "Industry Updates", icon: TrendingUp },
  ];

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
      {sections.map((section, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Oat-style Skeleton: Box + Lines structure */}
          <div className="flex flex-col gap-4 p-4 border rounded-lg bg-card shadow-sm">
            <div className="flex items-center gap-3">
              <section.icon className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold text-foreground">{section.title}</span>
            </div>
            <div className="flex gap-4">
              <div role="status" className="skeleton box" />
              <div className="flex-1 space-y-3 py-1">
                <div role="status" className="skeleton line" style={{ width: "75%" }} />
                <div role="status" className="skeleton line" style={{ width: "50%" }} />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
