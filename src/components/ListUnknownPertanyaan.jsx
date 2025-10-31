import React, { useState, useEffect, useRef } from "react";

const ListUnknownPertanyaan = ({ apiURL }) => {
    const [unknownPertanyaan, setUnknownPertanyaan] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const perPage = 10;

    const loadMoreRef = useRef(null);

    const fetchData = async (pageNum = 1) => {
        if (loading || pageNum > totalPages) return;
        setLoading(true);
        try {
            const response = await fetch(`${apiURL}?page=${pageNum}`, { cache: "no-store" });
            if (!response.ok) throw new Error("Failed to fetch data");
            const data = await response.json();
            setUnknownPertanyaan(prev => [...prev, ...data.data]); // append data baru
            setPage(data.page);
            setTotalPages(data.total_pages);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(1); // load halaman pertama
    }, [apiURL]);

    // Infinite scroll menggunakan Intersection Observer
    useEffect(() => {
        if (!loadMoreRef.current) return;
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && page < totalPages) {
                    fetchData(page + 1);
                }
            },
            { threshold: 1 }
        );
        observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [page, totalPages]);

    return (
        <div className="list rounded-box shadow-md">
            {unknownPertanyaan.length === 0 ? (
                <p>Tidak ada pertanyaan.</p>
            ) : (
                <ul className="space-y-3">
                    {unknownPertanyaan.map((item, index) => (
                        <li
                            key={`${item.id}-${index}`} // key unik
                            className="list-row bg-black border border-neutral-800 p-3 rounded-md flex gap-3"
                        >
                            <div className="flex justify-center items-center bg-neutral-800 w-14 p-3 rounded-md text-lg font-semibold">
                                {index + 1}
                            </div>
                            <div className="bg-black border border-neutral-800 p-3 rounded-md text-lg font-semibold flex-1">
                                {item.pertanyaan}
                            </div>
                        </li>
                    ))}

                </ul>
            )}

            {/* Loader / Trigger untuk infinite scroll */}
            {loading && <p className="text-white mt-3 text-center">Memuat...</p>}
            <div ref={loadMoreRef} />

            {page >= totalPages && unknownPertanyaan.length > 0 && (
                <p className="text-white mt-3 text-center">Semua pertanyaan telah dimuat.</p>
            )}
        </div>
    );
};

export default ListUnknownPertanyaan;
