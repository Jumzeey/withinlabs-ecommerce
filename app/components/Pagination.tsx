"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function Pagination({
    currentPage,
    totalPages
}: {
    currentPage: number;
    totalPages: number
}) {
    const searchParams = useSearchParams();

    // Preserve all existing search params except page
    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams?.toString() || '');
        params.set('page', page.toString());
        return `/?${params.toString()}`;
    };

    // Don't show pagination if there's only one page
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex justify-center gap-2 mt-8">
            {/* Previous Button */}
            {currentPage > 1 && (
                <Link
                    href={createPageUrl(currentPage - 1)}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                    Previous
                </Link>
            )}

            {/* Page Numbers */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                // Show pages around current page
                let pageNum;
                if (totalPages <= 5) {
                    pageNum = i + 1;
                } else if (currentPage <= 3) {
                    pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                } else {
                    pageNum = currentPage - 2 + i;
                }

                return (
                    <Link
                        key={pageNum}
                        href={createPageUrl(pageNum)}
                        className={`px-4 py-2 rounded ${currentPage === pageNum
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                    >
                        {pageNum}
                    </Link>
                );
            })}

            {/* Next Button */}
            {currentPage < totalPages && (
                <Link
                    href={createPageUrl(currentPage + 1)}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                    Next
                </Link>
            )}
        </div>
    );
}