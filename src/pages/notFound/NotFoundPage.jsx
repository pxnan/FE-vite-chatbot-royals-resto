import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div className="w-full h-screen flex justify-center items-center flex-col bg-white text-black gap-3">
            <h1 className="text-7xl text-blue-500 font-bold">404</h1>
            <p className="font-bold text-4xl">Page Not Found</p>
            <Link className=" bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 mt-2 rounded-md" to="/">Go to Home</Link>
        </div>
    );
};

export default NotFoundPage;