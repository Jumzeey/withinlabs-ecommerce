import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export function EmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-12 space-y-4"
        >
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
            >
                <Search className="w-16 h-16 text-gray-400" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-600">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
        </motion.div>
    );
} 