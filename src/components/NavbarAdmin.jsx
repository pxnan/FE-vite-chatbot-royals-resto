import React from 'react';

const NavbarAdmin = ({ title }) => {
    const handleLogout = () => {
        // Hapus token/session jika ada
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect ke halaman login
        window.location.href = '/login';
    };

    return (
        <nav className="navbar w-full bg-base-300 flex justify-between">
            <div className='flex items-center'>
                <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="size-5">
                        <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                        <path d="M9 4v16"></path>
                        <path d="M14 10l2 2l-2 2"></path>
                    </svg>
                </label>
                <div className="px-4 font-semibold">{title}</div>
            </div>
            <button 
                onClick={handleLogout}
                className='cursor-pointer text-red-700 py-1 px-2 rounded-md hover:bg-base-100 transition-colors'
            >
                Logout
            </button>
        </nav>
    );
};

export default NavbarAdmin;