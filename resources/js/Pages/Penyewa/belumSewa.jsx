import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import PenyewaHeader from "@/Layouts/Penyewa/PenyewaHeader";

export default function PenyewaDashboard({ auth }) {
    return (
        <div className="overflow-y-auto h-full">
            <PenyewaHeader auth={auth} />

            <div className="pt-[6rem] pb-[2rem] bg-white overflow-y-auto">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded shadow p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                            <p className="ps-5 sm:ps-0 text-sm text-gray-600">Selamat datang {' ' + auth.user.nama}</p>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="bg-white p-4">
                                <p className="text-center text-gray-500">Anda belum menyewa kamar, silahkan hubungi pemilik atau pengelola kost.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
