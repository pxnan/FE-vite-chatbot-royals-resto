import React from 'react';

const Navbar = () => {
    return (
        <div className="navbar bg-black shadow-lg sticky top-0 z-50 border-b border-neutral-800">
            <div className="flex-1">
                <p className="p-2 ml-2 text-xl text-white font-semibold">
                    Royal's Resto <span className='text-blue-500 font-bold'>Bot</span>
                </p>
            </div>
        </div>
    );
};

export default Navbar;