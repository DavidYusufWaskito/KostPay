import { Head, Link } from "@inertiajs/react";
import AdminHeader from "@/Layouts/Admin/AdminHeader";
import { useEffect, useState } from "react";
import AdminWelcome from "@/Layouts/Admin/AdminWelcome";
import { faWifi ,faShower, faBed} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LineChart,ResponsiveContainer,CartesianGrid,XAxis,YAxis,Tooltip,Legend,Line,AreaChart,Area} from "recharts";

export default function AdminDashboard({ auth, Kamar, Transaksi}) {

    function CustomizedTooltip(props) {
        const { active } = props;

        if (active) {
            const { payload } = props;
            const pendapatan = payload[0]?.value;

            return (
                <div className="custom-tooltip">
                    <p className="label">{`Pendapatan: ${new Intl.NumberFormat('id-ID').format(pendapatan)}`}</p>
                </div>
            );
        }

        return null;
    }

    return (
        <div className="overflow-y-auto h-full">
            <AdminHeader auth={auth}/>

            <div className="pt-[6rem] pb-[2rem] bg-white overflow-y-auto">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mt-4">
                        <h1 className="text-4xl font-semibold text-gray-900">Dashboard</h1>
                        <div className="flex">
                            <AdminWelcome auth={auth} className={`w-1/2 mt-4`}/>
                        </div>
                    </div>
                    
                    
                    <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                        <div className="bg-white border border-gray-200 p-4">
                            <p className="text-sm md:text-lg text-gray-500">
                                Total Keuntungan
                            </p>
                            <div className="text-2xl font-bold text-green-500 mt-2">
                                Rp{new Intl.NumberFormat('id-ID').format(Transaksi.filter(item => item.StatusPembayaran === 1).reduce((total, item) => total + item.TotalBayar, 0))}
                            </div>
                            <Link href={route('admin.manage.transaksi')} className="text-sm text-gray-600 mt-2">Lihat Transaksi</Link>
                        </div>
                        <div className="bg-white border border-gray-200 p-4">
                            <p className="text-sm md:text-lg text-gray-500">
                                Total Keuntungan Bulan Ini
                            </p>
                            <div className="text-2xl font-bold text-green-500 mt-2">
                                Rp{new Intl.NumberFormat('id-ID').format(
                                    Transaksi.filter(item => item.StatusPembayaran === 1 && new Date(item.TanggalBayar).getMonth() === new Date().getMonth())
                                        .reduce((total, item) => total + item.TotalBayar, 0)
                                )}
                            </div>
                            <Link href={route('admin.manage.transaksi')} className="text-sm text-gray-600 mt-2">Lihat Transaksi</Link>
                        </div>
                        {/* <div className="bg-white rounded border border-gray-200 p-4 hover:shadow-md hover:scale-105 transition-all duration-300">
                            <div className="text-xl font-semibold text-gray-600">Kamar</div>
                            <div className="text-2xl font-bold text-gray-600 mt-2">{Kamar.length}</div>
                            <div className="text-sm text-gray-600 mt-2">Kamar yang terisi: {Kamar.filter(kamar => kamar.StatusKamar === 1).length}</div>
                            <Link href={route('admin.manage.kamar')} className="text-sm text-gray-600 mt-2">Kelola Kamar</Link>
                        </div>
                        <div className="bg-white rounded border border-gray-200 p-4 hover:shadow-md hover:scale-105 transition-all duration-300">
                            <div className="text-xl font-semibold text-gray-600">Penyewa</div>
                            <Link href={route('admin.manage.penyewa')} className="text-sm text-gray-600 mt-2">Kelola Penyewa</Link>
                        </div>
                        <div className="bg-white rounded border border-gray-200 p-4 hover:shadow-md hover:scale-105 transition-all duration-300">
                            <div className="text-xl font-semibold text-gray-600">Transaksi</div>
                            <Link href={route('admin.manage.transaksi')} className="text-sm text-gray-600 mt-2">Kelola Transaksi</Link>
                        </div> */}
                    </div>
                    <div className="mt-4 bg-white rounded border border-gray-200 p-4">
                        <div className="text-xl font-semibold text-blue-500">Keuntungan bulanan</div>
                        <div className="w-full h-64">
                            <ResponsiveContainer>
                                <AreaChart
                                    data={Array.from({length: 12}, (_, i) => {
                                        const date = new Date(new Date().getFullYear(), i, 1);
                                        const year = date.getFullYear();
                                        const month = date.toLocaleString('default', { month: 'short' });
                                        return {
                                            profit: Transaksi.reduce((acc, transaksi) => {
                                                if (transaksi.StatusPembayaran === 1) {
                                                    const tDate = new Date(transaksi.TanggalBayar);
                                                    if (tDate.getMonth() === i && tDate.getFullYear() === year) {
                                                        acc += transaksi.TotalBayar;
                                                    }
                                                }
                                                return acc;
                                            }, null),
                                            year,
                                            month,
                                        };
                                    })}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    
                                    <XAxis dataKey="month" />
                                    <YAxis tickFormatter={(value) => new Intl.NumberFormat('id-ID').format(value)} />
                                    <Tooltip content={<CustomizedTooltip />} />
                                    <Area type="monotone" dataKey="profit" stroke="#2ecc71" fill="#2ecc71" name="Pendapatan" activeDot={{ r: 8 }} />
                                </AreaChart>

                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )

}