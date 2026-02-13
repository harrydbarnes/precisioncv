import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

/** Animated loading skeleton displayed while the API call is in progress */
const LoadingSkeleton = () => {
  const cards = [
    "Tailoring your CV...",
    "Crafting your cover letter...",
    "Preparing interview questions...",
    "Gathering industry insights...",
  ];

  return (
    <div className="space-y-6">
      {cards.map((label, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="overflow-hidden">
            <div className="absolute left-0 right-0 top-0 h-1 animate-pulse gradient-neon opacity-60" />
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <p className="text-xs text-muted-foreground animate-pulse">{label}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/6" />
              <Skeleton className="h-3 w-3/4" />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
