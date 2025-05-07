'use client';

import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    className="space-y-4"
                >
                    <Skeleton className="aspect-square rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-6 w-[100px]" />
                            <Skeleton className="h-8 w-[120px] rounded-full" />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
} 