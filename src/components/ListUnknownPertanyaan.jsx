import React, { useState, useEffect } from "react";

const ListUnknownPertanyaan = ({ apiURL }) => {
    const [unknownPertanyaan, setUnknownPertanyaan] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(apiURL);
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                setUnknownPertanyaan(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [apiURL]);

    return (
        <div className="list rounded-box shadow-md">
            {unknownPertanyaan.length === 0 ? (
                <p>Tidak ada pertanyaan.</p>
            ) : (
                <ul className="space-y-3">
                    {unknownPertanyaan.map((item, index) => (
                        <li
                            className="list-row bg-base-200 p-3 rounded-md flex gap-3"
                            key={item.id}
                        >
                            <div className="bg-base-300 p-3 rounded-md text-lg font-semibold">
                                {index + 1}
                            </div>
                            <div className="bg-base-300 p-3 rounded-md text-lg font-semibold flex-1">
                                {item.pertanyaan}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ListUnknownPertanyaan;
