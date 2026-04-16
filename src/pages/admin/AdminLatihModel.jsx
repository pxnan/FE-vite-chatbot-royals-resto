import React from 'react';
import SidebarAdmin from '../../components/SidebarAdmin';
import TrainModel from '../../components/TrainModel';
import NavbarAdmin from '../../components/NavbarAdmin';

const AdminLatihModel = () => {
    const apiBaseURL = "http://127.0.0.1:5000";

    return (
        <>
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <NavbarAdmin title="Latih Model Chatbot" />
                    
                    {/* Page content here */}
                    <div className="min-h-screen bg-base-200">
                        <div className="drawer-content flex flex-col md:pr-60 md:pl-60">
                            <div className="p-4 md:p-6">
                                <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 mt-5">
                                    Latih Model Chatbot
                                </h1>
                                <p className="text-center text-gray-600 text-sm md:text-base mb-10">
                                    Latih ulang model AI chatbot dengan data terbaru dari dataset
                                </p>
                                
                                <TrainModel apiBaseURL={apiBaseURL} />
                            </div>
                        </div>
                    </div>
                </div>
                <SidebarAdmin />
            </div>
        </>
    );
}

export default AdminLatihModel;