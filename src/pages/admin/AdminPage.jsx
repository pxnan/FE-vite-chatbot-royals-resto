import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../components/SidebarAdmin";
import NavbarAdmin from "../../components/NavbarAdmin";

const AdminPage = () => {
    const apiBaseURL = "http://127.0.0.1:5000";

    const [stats, setStats] = useState({
        totalQuestions: 0,
        totalCategories: 0,
        unknownQuestions: 0,
        modelStatus: 'Loading...',
        lastTraining: null
    });

    const [recentUnknown, setRecentUnknown] = useState([]);
    const [recentData, setRecentData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch semua data dashboard
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError('');

        try {
            // Fetch model info
            const modelResponse = await fetch(`${apiBaseURL}/model-info`);
            const modelData = await modelResponse.json();

            // Fetch unknown questions
            const unknownResponse = await fetch(`${apiBaseURL}/pertanyaan-unknown?page=1&per_page=5`);
            const unknownData = await unknownResponse.json();

            // Fetch categories
            const kategoriResponse = await fetch(`${apiBaseURL}/kategori`);
            const kategoriData = await kategoriResponse.json();

            // Fetch CSV info untuk recent data
            const csvResponse = await fetch(`${apiBaseURL}/cek-csv`);
            const csvData = await csvResponse.json();

            if (modelResponse.ok) {
                setStats(prev => ({
                    ...prev,
                    totalQuestions: modelData.total_questions || 0,
                    totalCategories: modelData.categories?.length || 0,
                    modelStatus: 'Active'
                }));
                setCategories(modelData.categories || []);
            }

            if (unknownResponse.ok && unknownData.data) {
                setStats(prev => ({
                    ...prev,
                    unknownQuestions: unknownData.total_data || 0
                }));
                setRecentUnknown(unknownData.data.slice(0, 5));
            }

            if (kategoriResponse.ok && kategoriData.kategori) {
                setCategories(kategoriData.kategori);
            }

            if (csvResponse.ok && csvData.last_5_rows) {
                // Parse recent data from CSV (skip header)
                const rows = csvData.last_5_rows || [];
                const recentRows = rows.slice(1).map(row => ({
                    pertanyaan: row[0] || '',
                    jawaban: row[1] ? (row[1].substring(0, 50) + (row[1].length > 50 ? '...' : '')) : '',
                    kategori: row[2] || ''
                }));
                setRecentData(recentRows);
            }

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Gagal memuat data dashboard');
        } finally {
            setLoading(false);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return date.toLocaleString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    };

    if (loading) {
        return (
            <>
                <div className="drawer lg:drawer-open">
                    <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content">
                        <NavbarAdmin title="Dashboard" />
                        <div className="min-h-screen flex justify-center items-center">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    </div>
                    <SidebarAdmin />
                </div>
            </>
        );
    }

    return (
        <>
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <NavbarAdmin title="Dashboard Admin" />
                    
                    {/* Page content here */}
                    <div className="min-h-screen bg-base-200">
                        <div className="drawer-content flex flex-col md:pr-60 md:pl-60">
                            <div className="p-4 md:p-6">
                                {/* Header */}
                                <div className="mb-6 md:mb-8">
                                    <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
                                        Dashboard Admin
                                    </h1>
                                    <p className="text-center text-gray-600 text-sm md:text-base">
                                        Selamat datang di panel admin Royal's Resto Chatbot
                                    </p>
                                </div>

                                {error && (
                                    <div className="alert alert-error shadow-lg mb-6">
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm">{error}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Stat Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                                    <div className="stat bg-base-100 rounded-xl shadow-md p-3 md:p-4">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className="text-primary shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="stat-title text-gray-500 text-xs md:text-sm truncate">Total Pertanyaan</div>
                                                <div className="stat-value text-primary text-xl md:text-2xl lg:text-3xl font-bold truncate">{stats.totalQuestions}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="stat bg-base-100 rounded-xl shadow-md p-3 md:p-4">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className="text-secondary shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="stat-title text-gray-500 text-xs md:text-sm truncate">Total Kategori</div>
                                                <div className="stat-value text-secondary text-xl md:text-2xl lg:text-3xl font-bold truncate">{stats.totalCategories}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="stat bg-base-100 rounded-xl shadow-md p-3 md:p-4">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className="text-warning shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="stat-title text-gray-500 text-xs md:text-sm truncate">Tidak Dikenali</div>
                                                <div className="stat-value text-warning text-xl md:text-2xl lg:text-3xl font-bold truncate">{stats.unknownQuestions}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="stat bg-base-100 rounded-xl shadow-md p-3 md:p-4">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className="text-success shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="stat-title text-gray-500 text-xs md:text-sm truncate">Status Model</div>
                                                <div className="stat-value text-success text-base md:text-lg lg:text-xl font-bold truncate">{stats.modelStatus}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Charts Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                                    {/* Kategori Distribution */}
                                    <div className="card bg-base-100 shadow-xl">
                                        <div className="card-body p-4 md:p-6">
                                            <h2 className="card-title text-lg md:text-xl mb-3 md:mb-4">
                                                Distribusi Kategori
                                                <div className="badge badge-info ml-2">{categories.length} Kategori</div>
                                            </h2>
                                            <div className="flex flex-wrap gap-2">
                                                {categories.slice(0, 10).map((cat, idx) => (
                                                    <span key={idx} className="badge badge-md badge-outline py-2 px-3 text-sm">
                                                        {cat}
                                                    </span>
                                                ))}
                                                {categories.length > 10 && (
                                                    <span className="badge badge-md badge-outline py-2 px-3 text-sm">
                                                        +{categories.length - 10} lainnya
                                                    </span>
                                                )}
                                            </div>
                                            {categories.length === 0 && (
                                                <p className="text-gray-500 text-center py-4">Belum ada kategori</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Model Info */}
                                    <div className="card bg-base-100 shadow-xl">
                                        <div className="card-body p-4 md:p-6">
                                            <h2 className="card-title text-lg md:text-xl mb-3 md:mb-4">
                                                Informasi Model
                                                <div className={`badge ${stats.modelStatus === 'Active' ? 'badge-success' : 'badge-warning'} ml-2`}>
                                                    {stats.modelStatus}
                                                </div>
                                            </h2>
                                            <div className="space-y-2">
                                                <div className="flex justify-between py-2 border-b border-base-200 text-sm md:text-base">
                                                    <span className="font-semibold">Total Data Terlatih:</span>
                                                    <span className="text-primary font-bold">{stats.totalQuestions} pertanyaan</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-base-200 text-sm md:text-base">
                                                    <span className="font-semibold">Total Kategori:</span>
                                                    <span className="text-secondary font-bold">{stats.totalCategories} kategori</span>
                                                </div>
                                                <div className="flex justify-between py-2 text-sm md:text-base">
                                                    <span className="font-semibold">Pertanyaan Belum Terlatih:</span>
                                                    <span className="text-warning font-bold">{stats.unknownQuestions} pertanyaan</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Unknown Questions */}
                                <div className="card bg-base-100 shadow-xl mb-6 md:mb-8">
                                    <div className="card-body p-4 md:p-6">
                                        <h2 className="card-title text-lg md:text-xl mb-3 md:mb-4">
                                            Pertanyaan Tidak Dikenali Terbaru
                                            <div className="badge badge-warning h-auto ml-2">{stats.unknownQuestions} Total</div>
                                        </h2>
                                        {recentUnknown.length === 0 ? (
                                            <p className="text-gray-500 text-center py-6 md:py-8 text-sm">
                                                Tidak ada pertanyaan tidak dikenal. Semua pertanyaan berhasil dijawab!
                                            </p>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="table table-zebra w-full text-sm">
                                                    <thead>
                                                        <tr className="text-xs md:text-sm">
                                                            <th className="w-16">ID</th>
                                                            <th>Pertanyaan</th>
                                                            <th className="w-40">Tanggal</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {recentUnknown.map((item) => (
                                                            <tr key={item.id}>
                                                                <td className="text-sm">{item.id}</td>
                                                                <td className="whitespace-normal break-words text-sm">{item.pertanyaan}</td>
                                                                <td className="text-xs whitespace-nowrap">{formatDate(item.created_at)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                        {stats.unknownQuestions > 0 && (
                                            <div className="card-actions justify-end mt-4">
                                                <a href="/admin/input-pertanyaan?tab=unknown" className="btn btn-sm btn-outline btn-warning">
                                                    Lihat Semua
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Recent Added Data */}
                                <div className="card bg-base-100 shadow-xl mb-6 md:mb-8">
                                    <div className="card-body p-4 md:p-6">
                                        <h2 className="card-title text-lg md:text-xl mb-3 md:mb-4">
                                            Data Terbaru yang Ditambahkan
                                            <div className="badge badge-info h-auto ml-2">5 Terakhir</div>
                                        </h2>
                                        {recentData.length === 0 ? (
                                            <p className="text-gray-500 text-center py-6 md:py-8 text-sm">
                                                Belum ada data yang ditambahkan. Mulai tambah data di menu "Tambah Pertanyaan"
                                            </p>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="table table-zebra w-full text-sm">
                                                    <thead>
                                                        <tr className="text-xs md:text-sm">
                                                            <th className="min-w-[150px]">Pertanyaan</th>
                                                            <th className="min-w-[200px]">Jawaban</th>
                                                            <th className="w-32">Kategori</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {recentData.map((item, idx) => (
                                                            <tr key={idx}>
                                                                <td className="text-sm whitespace-normal break-words">{item.pertanyaan}</td>
                                                                <td className="text-sm whitespace-normal break-words">{item.jawaban}</td>
                                                                <td>
                                                                    <span className="badge badge-outline badge-sm">{item.kategori || '-'}</span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                        <div className="card-actions justify-end mt-4">
                                            <a href="/admin/input-pertanyaan?tab=add" className="btn btn-sm btn-primary">
                                                + Tambah Pertanyaan Baru
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
                                    <div className="card bg-primary text-primary-content shadow-xl">
                                        <div className="card-body p-4 md:p-6">
                                            <h2 className="card-title text-base md:text-lg">Tambah Data</h2>
                                            <p className="text-sm">Tambah pertanyaan dan jawaban baru ke dataset</p>
                                            <div className="card-actions justify-end mt-2">
                                                <a href="/admin/input-pertanyaan?tab=add" className="btn btn-outline btn-sm text-white">
                                                    Tambah Sekarang
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card bg-secondary text-secondary-content shadow-xl">
                                        <div className="card-body p-4 md:p-6">
                                            <h2 className="card-title text-base md:text-lg">Latih Model</h2>
                                            <p className="text-sm">Latih ulang model chatbot dengan data terbaru</p>
                                            <div className="card-actions justify-end mt-2">
                                                <a href="/admin/latih-model" className="btn btn-outline btn-sm text-white">
                                                    Latih Sekarang
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card bg-accent text-accent-content shadow-xl">
                                        <div className="card-body p-4 md:p-6">
                                            <h2 className="card-title text-base md:text-lg">Kelola Dataset</h2>
                                            <p className="text-sm">Lihat, edit, atau hapus semua data pertanyaan</p>
                                            <div className="card-actions justify-end mt-2">
                                                <a href="/admin/input-pertanyaan?tab=dataset" className="btn btn-outline btn-sm text-white">
                                                    Kelola Data
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Refresh Button */}
                                <div className="flex justify-center mt-6 md:mt-8">
                                    <button
                                        onClick={fetchDashboardData}
                                        className="btn btn-outline btn-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Refresh Data
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <SidebarAdmin />
            </div>
        </>
    );
};

export default AdminPage;