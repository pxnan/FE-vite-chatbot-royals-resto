import React from 'react';
import SidebarAdmin from '../../components/SidebarAdmin';
import NavbarAdmin from '../../components/NavbarAdmin';

const KelolaAdmin = () => {
    return (
        <>
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <NavbarAdmin title="Kelola Admin" />
                    
                    {/* Page content here */}
                    <div className="min-h-screen bg-base-200">
                        <div className="drawer-content flex flex-col md:pr-60 md:pl-60">
                            <div className="p-4 md:p-6">
                                <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 mt-5">
                                    Kelola Admin
                                </h1>
                                <p className="text-center text-gray-600 text-sm md:text-base mb-10">
                                    Kelola akun administrator sistem
                                </p>
                                
                                <div className="card bg-base-100 shadow-xl">
                                    <div className="card-body">
                                        <h2 className="card-title text-xl mb-4">
                                            Daftar Administrator
                                            <div className="badge badge-info ml-2">Coming Soon</div>
                                        </h2>
                                        <p className="text-gray-500 text-center py-8">
                                            Fitur kelola admin sedang dalam pengembangan
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <SidebarAdmin />
            </div>
        </>
    );
}

export default KelolaAdmin;