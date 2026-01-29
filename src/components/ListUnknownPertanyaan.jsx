import React, { useState, useEffect, useRef, useCallback } from "react";

const ListUnknownPertanyaan = ({ apiURL }) => {
    const [unknownPertanyaan, setUnknownPertanyaan] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);
    const perPage = 10;

    const loadMoreRef = useRef(null);
    const observerRef = useRef(null);

    const fetchData = useCallback(async (pageNum = 1, isInitial = false) => {
        if (loading || pageNum > totalPages) return;
        
        setLoading(true);
        try {
            const response = await fetch(
                `${apiURL}?page=${pageNum}&limit=${perPage}`, 
                { 
                    cache: "no-store",
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                }
            );
            
            if (!response.ok) throw new Error("Failed to fetch data");
            
            const data = await response.json();
            
            setUnknownPertanyaan(prev => {
                if (isInitial) {
                    return data.data; // Replace untuk initial load
                }
                // Cegah duplikasi dengan filter
                const existingIds = new Set(prev.map(item => item.id));
                const newItems = data.data.filter(item => !existingIds.has(item.id));
                return [...prev, ...newItems];
            });
            
            setPage(data.current_page || data.page);
            setTotalPages(data.total_pages || data.last_page);
            setHasMore((data.current_page || data.page) < (data.total_pages || data.last_page));
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
            if (isInitial) setInitialLoad(false);
        }
    }, [loading, totalPages, apiURL, perPage]);

    // Initial load
    useEffect(() => {
        setUnknownPertanyaan([]); // Reset data
        setPage(1);
        setInitialLoad(true);
        fetchData(1, true);
    }, [apiURL]);

    // Infinite scroll menggunakan Intersection Observer
    useEffect(() => {
        if (!hasMore || loading || initialLoad) return;

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    fetchData(page + 1, false);
                }
            },
            { 
                threshold: 0.5,
                rootMargin: '50px'
            }
        );

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [page, hasMore, loading, initialLoad, fetchData]);

    // Reset ketika apiURL berubah
    useEffect(() => {
        setUnknownPertanyaan([]);
        setPage(1);
        setTotalPages(1);
        setHasMore(true);
    }, [apiURL]);

    // Debug: log data untuk memastikan tidak ada duplikat
    useEffect(() => {
        console.log("Current items:", unknownPertanyaan.length);
        const ids = unknownPertanyaan.map(item => item.id);
        const uniqueIds = [...new Set(ids)];
        if (ids.length !== uniqueIds.length) {
            console.warn("Duplicate IDs detected!", ids.length, uniqueIds.length);
        }
    }, [unknownPertanyaan]);

    return (
        <div className="list rounded-box">
            {initialLoad ? (
                <p className="text-white text-center">Memuat data...</p>
            ) : unknownPertanyaan.length === 0 ? (
                <p className="text-white text-center">Tidak ada pertanyaan.</p>
            ) : (
                <ul className="space-y-3">
                    {unknownPertanyaan.map((item) => (
                        <li
                            key={item.id}
                            className="list-row border border-gray-300 p-3 rounded-md flex gap-3 shadow-md bg-white"
                        >
                            <div className="flex justify-center items-center bg-blue-500 text-white w-14 p-3 rounded-md text-lg font-semibold">
                                {item.id}
                            </div>
                            <div className="bg-blue-500 p-3 rounded-md text-white text-lg font-semibold flex-1">
                                {item.pertanyaan}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Loader */}
            {loading && page > 1 && (
                <p className="text-white mt-3 text-center">Memuat lebih banyak...</p>
            )}

            {/* Trigger untuk infinite scroll */}
            {hasMore && !initialLoad && (
                <div ref={loadMoreRef} className="h-5" />
            )}

            {!hasMore && unknownPertanyaan.length > 0 && (
                <p className="text-white mt-3 text-center">
                    Semua pertanyaan telah dimuat. Total: {unknownPertanyaan.length} pertanyaan.
                </p>
            )}
        </div>
    );
};

export default ListUnknownPertanyaan;