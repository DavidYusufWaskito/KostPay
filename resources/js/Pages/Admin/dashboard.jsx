import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from "react";
import Navbar from '@/Layouts/Navbar';
import { faWifi ,faShower, faBed} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LineChart,ResponsiveContainer,CartesianGrid,XAxis,YAxis,Tooltip,Legend,Line} from "recharts";

export default function AdminDashboard({ auth, Kamar, Transaksi}) {
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
    };

    // Check window width and set profile dropdown to false
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setProfileDropdownOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
            <Head title="Home" />
            <Navbar className={"bg-[#69a8ff] z-10"}>
                <Link className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2">
                    Dashboard
                </Link>
                <Link href={route('daftar')} className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2">
                    Manage kamar
                </Link>
                <Link className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2">
                    Manage penyewa
                </Link>
                <button onClick={toggleProfileDropdown} className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2 max-md:hidden" id="menu-button" aria-expanded={profileDropdownOpen} aria-haspopup="true">
                    Profil
                </button>
                <div className="max-md:border-t-[1px]">
                    <div className="max-md:text-slate-500/50 max-md:pt-1 max-md:ps-2 text-sm hidden max-md:block">
                        Profile
                    </div>
                    <Link className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2 hidden max-md:block ">
                        Account settings
                    </Link>
                    <Link className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2 hidden max-md:block " method="post" href={route('admin.logout')}>
                        Sign out
                    </Link>
                </div>
            </Navbar>

            {/* Dropdown profil */}
            {profileDropdownOpen && (
                <div className="absolute right-0 z-10 mt-20 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                    <div className="py-1" role="none">
                        <Link href="#" className="text-gray-700 block px-4 py-2 text-sm hover:text-[#EB5160]" role="menuitem" tabIndex="-1" id="menu-item-0">Account settings</Link>
                        <Link className="text-gray-700 block w-full px-4 py-2 text-left text-sm hover:text-[#EB5160]" method="post" href={route('admin.logout')} as="button">
                            Sign out
                        </Link>
                    </div>
                </div>
            )}

            <div className="pt-[6rem] pb-[2rem] bg-white overflow-y-auto">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded shadow p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                            <p className="text-sm text-gray-600">Selamat datang {' ' + auth.user.nama}</p>
                        </div>
                    </div>
                    
                    
                    <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                        <div className="bg-white rounded shadow p-4 hover:shadow-md hover:scale-105 transition-all duration-300">
                            <div className="text-xl font-semibold text-gray-900">Kamar</div>
                            <div className="text-2xl font-bold text-gray-900 mt-2">{Kamar.length}</div>
                            <div className="text-sm text-gray-600 mt-2">Kamar yang terisi: {Kamar.filter(kamar => kamar.StatusKamar === 1).length}</div>
                            <div className="text-sm text-gray-600 mt-2">Kelola Kamar</div>
                        </div>
                        <div className="bg-white rounded shadow p-4 hover:shadow-md hover:scale-105 transition-all duration-300">
                            <div className="text-xl font-semibold text-gray-900">Penyewa</div>
                            <Link href={route('admin.manage.penyewa')} className="text-sm text-gray-600 mt-2">Kelola Penyewa</Link>
                        </div>
                        <div className="bg-white rounded shadow p-4 hover:shadow-md hover:scale-105 transition-all duration-300">
                            <div className="text-xl font-semibold text-gray-900">Pendapatan</div>
                            <div className="text-sm text-gray-600 mt-2">Kelola Pendapatan</div>
                        </div>
                    </div>
                    <div className="mt-4 bg-white rounded shadow p-4">
                        <div className="text-xl font-semibold text-gray-900">Keuntungan bulanan</div>
                        <div className="w-full h-64">
                            <ResponsiveContainer>
                                <LineChart
                                    data={Array.from({length: 12}, (_, i) => {
                                        const date = new Date(new Date().getFullYear(), i, 1);
                                        const year = date.getFullYear();
                                        const month = date.toLocaleString('default', { month: 'short' });
                                        return {
                                            profit: Transaksi.reduce((acc, transaksi) => {
                                                const tDate = new Date(transaksi.TanggalBayar);
                                                if (tDate.getMonth() === i && tDate.getFullYear() === year) {
                                                    acc += transaksi.TotalBayar;
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
                                    <Line connectNulls type="monotone" dataKey="profit" stroke="#8884d8" name="Pendapatan" activeDot={{ r: 8 }} />
                                </LineChart>

                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )

}