import React from "react";
import ListUnknownPertanyaan from "../../components/ListUnknownPertanyaan";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const AdminPage = () => {
    const getUnknownPertanyaan = "http://127.0.0.1:5000/pertanyaan-unknown";

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-black text-white">
                <div className="drawer-content flex flex-col md:pr-60 md:pl-60">
                    <div className="p-6">
                        <h2 className="text-3xl font-bold text-center mb-10 mt-5">Pertanyaan Tidak Dikenali</h2>
                        <div className="mb-10">
                            <ListUnknownPertanyaan apiURL={getUnknownPertanyaan} />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AdminPage;
