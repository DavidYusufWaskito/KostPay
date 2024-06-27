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
                <Link className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2">
                    Home
                </Link>
                <Link href={route('daftar')} className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2">
                    Daftar
                </Link>
                <Link href={route('login')} className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2">
                    Login
                </Link>
                <Link className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2">
                    Hubungi kami
                </Link>
            </Navbar>
            <div className="pt-[6rem] pb-[2rem] bg-white overflow-y-auto">
                <div className="relative w-full overflow-hidden">
                    <div className="h-[600px]">
                        <div className="h-full w-full carousel">
                            <div className="w-full flex transition-transform duration-500 ease-in-out">
                                <div className="w-full">
                                    <img className="h-full w-full object-cover" src="https://via.placeholder.com/1920x600" alt="Kost 1" />
                                </div>
                                <div className="w-full">
                                    <img className="h-full w-full object-cover" src="https://via.placeholder.com/1920x600" alt="Kost 2" />
                                </div>
                                <div className="w-full">
                                    <img className="h-full w-full object-cover" src="https://via.placeholder.com/1920x600" alt="Kost 3" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-1/2 w-16 h-16 rounded-full bg-white text-gray-500 shadow-lg hover:bg-gray-500 hover:text-white" onClick={() => {
                        let carousel = document.querySelector('.carousel');
                        let children = carousel.children[0].children;
                        let index = Array.from(children).indexOf(children.find(elem => elem.classList.contains('translate-x-0')))
                        index = (index + 1) % children.length;
                        children[index].classList.add('translate-x-0');
                        children[index].classList.remove('-translate-x-full');
                        children[(index - 1 + children.length) % children.length].classList.add('-translate-x-full');
                        children[(index - 1 + children.length) % children.length].classList.remove('translate-x-0');
                    }}>
                        <FontAwesomeIcon className="text-2xl" icon={faShower}/>
                    </div>
                    <div className="absolute bottom-0 right-1/2 w-16 h-16 rounded-full bg-white text-gray-500 shadow-lg hover:bg-gray-500 hover:text-white" onClick={() => {
                        let carousel = document.querySelector('.carousel');
                        let children = carousel.children[0].children;
                        let index = Array.from(children).indexOf(children.find(elem => elem.classList.contains('translate-x-0')))
                        index = (index - 1 + children.length) % children.length;
                        children[index].classList.add('translate-x-0');
                        children[index].classList.remove('-translate-x-full');
                        children[(index + 1) % children.length].classList.add('-translate-x-full');
                        children[(index + 1) % children.length].classList.remove('translate-x-0');
                    }}>
                        <FontAwesomeIcon className="text-2xl" icon={faBed}/>
                    </div>
                    <div className="absolute bottom-0 left-1/2 w-full h-2 bg-gray-500" style={{ transform: 'translateX(calc(50% - 12px))' }}>
                        <div className="h-full bg-white w-2 transition-transform duration-300 ease-in-out" style={{ transform: 'translateX(calc(50% - 12px))' }}></div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div>
                        <div className="text-xl font-medium text-center pt-5">
                            Selamat datang di kost Bu Yati
                        </div>
                        <div className="mt-5 flex justify-center items-center gap-10 flex-col lg:flex-row xl:flex-row ">
                            <div className="w-[256px] h-[256px] drop-shadow bg-white p-5 rounded">
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
                            <div className="w-[256px] h-[256px] drop-shadow bg-white p-5 rounded">
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
                            <div className="w-[256px] h-[256px] drop-shadow bg-white p-5 rounded">
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