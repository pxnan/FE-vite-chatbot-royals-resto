import React, { useState, useEffect } from 'react';

const TrainModel = ({ apiBaseURL }) => {
    const [training, setTraining] = useState(false);
    const [trainingResult, setTrainingResult] = useState(null);
    const [modelInfo, setModelInfo] = useState(null);
    const [loadingInfo, setLoadingInfo] = useState(true);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState('');

    // Ambil informasi model saat ini
    useEffect(() => {
        fetchModelInfo();
    }, []);

    const fetchModelInfo = async () => {
        setLoadingInfo(true);
        try {
            const response = await fetch(`${apiBaseURL}/model-info`);
            const data = await response.json();
            if (response.ok) {
                setModelInfo(data);
            } else {
                setError(data.error || 'Gagal mengambil info model');
            }
        } catch (err) {
            setError('Terjadi kesalahan jaringan');
            console.error('Error:', err);
        } finally {
            setLoadingInfo(false);
        }
    };

    const handleTrainModel = async () => {
        setTraining(true);
        setError('');
        setTrainingResult(null);
        setProgress(10);
        setStatusMessage('Memulai proses training...');

        try {
            setProgress(30);
            setStatusMessage('Memuat dataset dan preprocessing...');
            
            const response = await fetch(`${apiBaseURL}/train-model`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            setProgress(80);
            setStatusMessage('Menyimpan model...');

            const data = await response.json();

            if (response.ok) {
                setProgress(100);
                setStatusMessage('Training selesai!');
                setTrainingResult(data);
                // Refresh model info setelah training
                await fetchModelInfo();
            } else {
                setError(data.error || 'Gagal melatih model');
                setStatusMessage('');
            }
        } catch (err) {
            setError('Terjadi kesalahan jaringan saat training');
            console.error('Error:', err);
            setStatusMessage('');
        } finally {
            setTraining(false);
            setTimeout(() => setProgress(0), 2000);
        }
    };

    if (loadingInfo) {
        return (
            <div className="flex justify-center items-center py-20">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Informasi Model Saat Ini */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl mb-4">
                        Informasi Model Saat Ini
                        <div className="badge badge-success ml-2">Active</div>
                    </h2>
                    
                    {modelInfo && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="stat bg-base-200 rounded-lg p-4">
                                <div className="stat-title">Total Pertanyaan</div>
                                <div className="stat-value text-primary text-3xl">{modelInfo.total_questions}</div>
                                <div className="stat-desc">Data yang sudah dilatih</div>
                            </div>
                            <div className="stat bg-base-200 rounded-lg p-4">
                                <div className="stat-title">Total Kategori</div>
                                <div className="stat-value text-secondary text-3xl">{modelInfo.categories?.length || 0}</div>
                                <div className="stat-desc">Kategori unik</div>
                            </div>
                        </div>
                    )}

                    {modelInfo?.categories && (
                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">Daftar Kategori:</h3>
                            <div className="flex flex-wrap gap-2">
                                {modelInfo.categories.map((cat, idx) => (
                                    <span key={idx} className="badge badge-outline badge-lg">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tombol Training */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl mb-4">Latih Ulang Model</h2>
                    
                    <p className="text-gray-600 mb-4">
                        Latih ulang model chatbot dengan data terbaru dari dataset CSV. 
                        Proses ini akan membaca semua pertanyaan dan jawaban dari file 
                        <code className="mx-1 px-2 py-0.5 bg-base-200 rounded">dataset.csv</code> 
                        dan memperbarui model AI chatbot.
                    </p>

                    <div className="alert alert-info shadow-lg mb-4">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>
                                Pastikan Anda sudah menambahkan semua data baru sebelum melakukan training.
                                Training akan memakan waktu tergantung jumlah data.
                            </span>
                        </div>
                    </div>

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

                    {trainingResult && (
                        <div className="alert alert-success shadow-lg mb-4">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="font-semibold">{trainingResult.message}</p>
                                    <p className="text-sm">Waktu training: {trainingResult.training_time}</p>
                                    <p className="text-sm">Total data: {trainingResult.total_data} pertanyaan</p>
                                    <p className="text-sm">Kategori: {trainingResult.categories_count} kategori</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Progress Bar */}
                    {training && (
                        <div className="mb-4">
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">{statusMessage}</span>
                                <span className="text-sm font-medium">{progress}%</span>
                            </div>
                            <div className="w-full bg-base-200 rounded-full h-2.5">
                                <div 
                                    className="bg-primary h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    <div className="card-actions justify-end">
                        <button
                            className={`btn btn-primary ${training ? 'loading' : ''}`}
                            onClick={handleTrainModel}
                            disabled={training}
                        >
                            {training ? 'Melatih Model...' : 'Latih Model Sekarang'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainModel;