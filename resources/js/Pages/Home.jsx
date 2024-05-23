import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from "react";
import Navbar from '@/Layouts/Navbar';
import { faWifi ,faShower, faBed} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Home({ auth }) {

    return (
        <div className="overflow-y-auto h-full">
            <Head title="Home" />
            <Navbar className={"bg-[#FFBF69] z-10"}>
                <Link className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2 max-md:border">
                    Home
                </Link>
                <Link href={route('daftar')} className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2 max-md:border">
                    Daftar
                </Link>
                <Link className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2 max-md:border">
                    Hubungi kami
                </Link>
            </Navbar>
            <div className="pt-[6rem] pb-[2rem] bg-white overflow-y-auto">
                <div className="bg-slate-500 h-[600px] w-[100vw] text-center">
                    Karausel
                </div>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div>
                        <div className="text-xl font-medium text-center pt-5">
                            Selamat datang di kost Bu Yati
                        </div>
                        <div className="mt-5 flex justify-center items-center gap-10">
                            <div className="w-[256px] h-[256px] drop-shadow bg-white p-5">
                                <div className="flex flex-row w-[64px] h-[64px] items-center justify-center bg-blue-100 rounded">
                                    <FontAwesomeIcon className="text-4xl text-blue-500" icon={faWifi}/>
                                </div>
                                <div>
                                    <div className="pt-2 text-xl font-extrabold">
                                        Free wifi
                                    </div>
                                    <p className="pt-2">
                                        Nikmati wifi berkecepatan 10 Mbps tanpa batas kapan saja 😱.
                                    </p>
                                </div>
                            </div>
                            <div className="w-[256px] h-[256px] drop-shadow bg-white p-5">
                                <div className="flex flex-row w-[64px] h-[64px] items-center justify-center bg-blue-100 rounded">
                                    <FontAwesomeIcon className="text-4xl text-blue-500" icon={faShower}/>
                                </div>
                                <div>
                                    <div className="pt-2 text-xl font-extrabold">
                                        Kamar mandi dalam
                                    </div>
                                    <p className="pt-2">
                                        Dijamin kenyamanan dan ketentraman. Tidak perlu mengantri 😁.
                                    </p>
                                </div>
                            </div>
                            <div className="w-[256px] h-[256px] drop-shadow bg-white p-5">
                                <div className="flex flex-row w-[64px] h-[64px] items-center justify-center bg-blue-100 rounded">
                                    <FontAwesomeIcon className="text-4xl text-blue-500" icon={faBed}/>
                                </div>
                                <div>
                                    <div className="pt-2 text-xl font-extrabold">
                                        Fasilitas lengkap
                                    </div>
                                    <p className="pt-2">
                                        Ada kasur, lemari, kipas dan cermin untuk melihat dirimu yang cakep 🗿.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}