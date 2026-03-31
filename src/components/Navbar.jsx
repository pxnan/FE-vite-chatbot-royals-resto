import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    return (
        <div className="navbar bg-white shadow-lg sticky top-0 z-50 border-b border-gray-300">
            <div className="flex w-full justify-between px-5 items-center">
                <Link to={"/"} className="text-xl font-semibold">
                    Royal's Resto <span className='text-blue-500 font-bold'>Bot</span>
                </Link>
            </div>
        </div>
    );
};

export default Navbar;