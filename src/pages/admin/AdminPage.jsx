import React from "react";
import ListUnknownPertanyaan from "../../components/ListUnknownPertanyaan";

const AdminPage = () => {
    const getUnknownPertanyaan = "http://127.0.0.1:5000/pertanyaan-unknown";

    return (
        <div className="drawer drawer-mobile min-h-screen bg-base-300">
            {/* Sidebar */}
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                {/* Main content */}
                <div className="p-6">
                    <h2 className="text-3xl font-bold text-center mb-10 mt-5">Pertanyaan Tidak Dikenali</h2>
                    <div className="rounded-lg">
                        <ListUnknownPertanyaan apiURL={getUnknownPertanyaan} />
                    </div>
                </div>
            </div>

            {/* Sidebar drawer */}
            <div className="drawer-side">
                <label htmlFor="my-drawer" className="drawer-overlay"></label>
                <ul className="menu p-4 w-60 bg-base-100 text-base-content">
                    <li className="mb-2">
                        <a className="active">Dashboard</a>
                    </li>
                    <li className="mb-2">
                        <a>Pertanyaan</a>
                    </li>
                    <li className="mb-2">
                        <a>Users</a>
                    </li>
                    <li className="mb-2">
                        <a>Settings</a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default AdminPage;
