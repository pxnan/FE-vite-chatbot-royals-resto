import React, { useState, useEffect } from 'react';

const TambahPertanyaan = ({ apiBaseURL, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        pertanyaan: '',
        jawaban: '',
        kategori: ''
    });
    const [kategoriList, setKategoriList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingKategori, setLoadingKategori] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [newKategori, setNewKategori] = useState('');
    const [showNewKategori, setShowNewKategori] = useState(false);

    // Ambil daftar kategori dari API
    useEffect(() => {
        fetchKategori();
    }, []);

    const fetchKategori = async () => {
        try {
            const response = await fetch(`${apiBaseURL}/kategori`);
            const data = await response.json();
            if (data.kategori) {
                setKategoriList(data.kategori);
            }
        } catch (err) {
            console.error('Gagal mengambil kategori:', err);
        } finally {
            setLoadingKategori(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error saat user mengetik
        if (error) setError('');
        if (success) setSuccess('');
    };

    const handleKategoriChange = (e) => {
        const value = e.target.value;
        if (value === 'new') {
            setShowNewKategori(true);
            setFormData(prev => ({ ...prev, kategori: '' }));
        } else {
            setShowNewKategori(false);
            setFormData(prev => ({ ...prev, kategori: value }));
        }
    };

    const handleNewKategoriChange = (e) => {
        const value = e.target.value;
        setNewKategori(value);
        setFormData(prev => ({ ...prev, kategori: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validasi
        if (!formData.pertanyaan.trim()) {
            setError('Pertanyaan tidak boleh kosong');
            return;
        }
        if (!formData.jawaban.trim()) {
            setError('Jawaban tidak boleh kosong');
            return;
        }
        if (!formData.kategori.trim()) {
            setError('Kategori tidak boleh kosong');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${apiBaseURL}/tambah-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Data berhasil ditambahkan!');
                // Reset form
                setFormData({
                    pertanyaan: '',
                    jawaban: '',
                    kategori: ''
                });
                setNewKategori('');
                setShowNewKategori(false);
                // Refresh kategori list
                fetchKategori();
                // Panggil callback jika ada
                if (onSuccess) onSuccess(data);
                
                // Optional: Refresh halaman setelah 2 detik untuk melihat perubahan
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                setError(data.error || 'Gagal menambahkan data');
            }
        } catch (err) {
            setError('Terjadi kesalahan jaringan. Silakan coba lagi.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Tambah Data Pertanyaan Baru</h2>
                
                {error && (
                    <div className="alert alert-error shadow-lg mb-4">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    </div>
                )}
                
                {success && (
                    <div className="alert alert-success shadow-lg mb-4">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{success}</span>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Input Pertanyaan */}
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text font-semibold">Pertanyaan *</span>
                        </label>
                        <textarea
                            name="pertanyaan"
                            value={formData.pertanyaan}
                            onChange={handleChange}
                            className="textarea textarea-bordered h-24"
                            placeholder="Masukkan pertanyaan baru..."
                            disabled={loading}
                        />
                    </div>

                    {/* Input Jawaban */}
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text font-semibold">Jawaban *</span>
                        </label>
                        <textarea
                            name="jawaban"
                            value={formData.jawaban}
                            onChange={handleChange}
                            className="textarea textarea-bordered h-32"
                            placeholder="Masukkan jawaban untuk pertanyaan tersebut..."
                            disabled={loading}
                        />
                    </div>

                    {/* Pilih Kategori */}
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text font-semibold">Kategori *</span>
                        </label>
                        {loadingKategori ? (
                            <div className="skeleton h-12 w-full"></div>
                        ) : (
                            <select
                                className="select select-bordered w-full"
                                onChange={handleKategoriChange}
                                value={showNewKategori ? 'new' : formData.kategori}
                                disabled={loading}
                            >
                                <option value="">Pilih Kategori</option>
                                {kategoriList.map(kat => (
                                    <option key={kat} value={kat}>{kat}</option>
                                ))}
                                <option value="new">+ Tambah Kategori Baru</option>
                            </select>
                        )}
                    </div>

                    {/* Input Kategori Baru */}
                    {showNewKategori && (
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text font-semibold">Kategori Baru *</span>
                            </label>
                            <input
                                type="text"
                                value={newKategori}
                                onChange={handleNewKategoriChange}
                                className="input input-bordered"
                                placeholder="Masukkan nama kategori baru"
                                disabled={loading}
                            />
                        </div>
                    )}

                    {/* Tombol Aksi */}
                    <div className="card-actions justify-end mt-6 gap-3">
                        {onCancel && (
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                Batal
                            </button>
                        )}
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner"></span>
                                    Menyimpan...
                                </>
                            ) : (
                                'Simpan Data'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TambahPertanyaan;