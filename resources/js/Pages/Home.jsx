import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState,useRef } from "react";
import Navbar from '@/Layouts/Navbar';
import { faWifi, faShower, faBed } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "@/Layouts/Footer";

export default function Home({ auth, kosImage , kosImageSmall}) {
    const scrollRef = useRef(null);
    const footerRef = useRef(null);
    console.log(kosImage);
    window.Echo.channel('messagechannel.').listen('MessageEvent', (e) => {
        console.log(e);
    })

    const onImgLoaded = (e) => {
        let imgElement = e.currentTarget;
        console.log('image loaded');

        imgElement.classList.remove('hidden');
    }

    return (
        <div className="overflow-y-auto h-full">
            <Head title="Home" />
            <Navbar className={" z-10"}>
                <Link className="text-gray-500 hover:text-[#FFBF69] font-sans font-extrabold max-md:text-slate-500 max-md:p-2">
                    Home
                </Link>
                
                {auth?.user ?
                    <Link href={route('admin.dashboard')} className="text-gray-500 hover:text-[#FFBF69] font-sans font-extrabold max-md:text-slate-500 max-md:p-2">
                        Dashboard
                    </Link>
                    :
                    <>
                        <Link href={route('daftar')} className="text-gray-500 hover:text-[#FFBF69] font-sans font-extrabold max-md:text-slate-500 max-md:p-2">
                            Daftar
                        </Link>
                        <Link href={route('login')} className="text-gray-500 hover:text-[#FFBF69] font-sans font-extrabold max-md:text-slate-500 max-md:p-2">
                            Masuk
                        </Link>
                    </>
                }
                <Link onClick={(e) => {
                    e.preventDefault();
                    footerRef.current.scrollIntoView({ behavior: 'smooth'});
                
                    }} className="text-gray-500 hover:text-[#FFBF69] font-sans font-extrabold max-md:text-slate-500 max-md:p-2">
                    Hubungi kami
                </Link>
            </Navbar>
            <div className="pt-[6rem] pb-[2rem] bg-white overflow-y-auto">
                <div className="relative w-full overflow-hidden">
                    <div className="h-[600px]">
                        <div className="h-full w-full">
                            {/* <img className="h-full w-full object-cover" src={kosImage} alt="Kost 1" /> */}
                            <section id="blur-load" style={{ backgroundImage: `url(${kosImageSmall})` }} className={`relative h-full w-full flex justify-center bg-cover bg-center bg-no-repeat bg-gray-600 bg-blend-multiply`}>
                                <div className="inset-0 bg-black opacity-50 absolute h-full w-full">
                                    <img src={kosImage} onLoad={onImgLoaded} alt="Kost 1" className="h-full w-full object-cover object-center hidden" />
                                </div>

                                <div className="text-center z-[5] p-4">
                                    <p className="lg:text-5xl sm:text-2xl mt-10 font-bold text-white">
                                        Selamat datang di kost Bu Yati
                                    </p>

                                    <p className="lg:text-2xl sm:text-xl text-balance mt-10 text-gray-300">
                                        Apakah Anda sedang mencari tempat yang nyaman dan aman untuk beristirahat? Kami menawarkan fasilitas terbaik untuk Anda. Datang dan rasakan beristirahat di kos yang selalu hadir untuk kebutuhan Anda. Mendaftar sekarang dan lihat apa yang kami tawarkan!
                                    </p>
                                    <div className="flex justify-center gap-5 mt-10">
                                        <Link href={route('daftar')} className="bg-blue-500 hover:bg-blue-600 rounded-lg py-3 px-5 text-white font-sans font-extrabold max-md:p-2">
                                            Daftar
                                        </Link>
                                        <button onClick={() => scrollRef.current.scrollIntoView({ behavior: 'smooth'})} className="ring-1 ring-white hover:bg-white hover:text-black rounded-lg py-3 px-5 text-white font-sans font-extrabold max-md:p-2">
                                            Pelajari lebih lanjut
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mt-10">
                        <div ref={scrollRef} className="text-center text-gray-600 lg:text-4xl sm:text-xl font-bold mb-10">
                            Fasilitas
                        </div>
                        <div className="flex items-center justify-evenly">
                            <div className="flex flex-row w-[64px] h-[64px] m-10 p-10 lg:m-0 lg:p-0 lg:w-[128px] lg:h-[128px] sm:w-[64px] sm:h-[64px] shadow-md items-center justify-center bg-blue-100 rounded-full">
                                <FontAwesomeIcon className="text-3xl lg:text-6xl sm:text-xl text-blue-500" icon={faWifi} />
                            </div>
                            <div>
                                <p className="text-balance lg:text-xl font-bold text-gray-600">
                                    Nikmati wifi nyaman, stabil, dan cepat seperti berada di rumah sendiri, tanpa batasan kapan saja.
                                </p>
                                <p className="text-balance lg:text-md text-gray-600 ">
                                    Dengan kecepatan 35 Mbps tanpa batas.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-evenly mt-32">
                            <div className="max-sm:ps-10">
                                <p className="text-balance lg:text-xl font-bold text-gray-600">
                                    Nikmati kenyamanan dengan kamar mandi dalam per kamar.
                                </p>
                                <p className="text-balance lg:text-md text-gray-600">
                                    Setiap kamar kami dilengkapi dengan kamar mandi dalam yang nyaman dan praktis.
                                </p>
                            </div>
                            <div className="flex flex-row w-[64px] h-[64px] m-10 p-10 lg:m-0 lg:p-0 lg:w-[128px] lg:h-[128px] sm:w-[64px] sm:h-[64px] shadow-md items-center justify-center bg-blue-100 rounded-full">
                                <FontAwesomeIcon className="text-3xl lg:text-6xl sm:text-xl text-blue-500" icon={faShower} />
                            </div>
                        </div>

                        <div className="flex items-center justify-evenly mt-32">
                            <div className="flex flex-row w-[64px] h-[64px] m-10 p-10 lg:m-0 lg:p-0 lg:w-[128px] lg:h-[128px] sm:w-[64px] sm:h-[64px] shadow-md items-center justify-center bg-blue-100 rounded-full">
                                <FontAwesomeIcon className="text-3xl lg:text-6xl sm:text-xl text-blue-500" icon={faBed} />
                            </div>
                            <div>
                                <p className="text-balance lg:text-xl font-bold text-gray-600">
                                    Nikmati kemudahan beristirahat dengan fasilitas lengkap kos.
                                </p>
                                <p className="text-balance lg:text-md text-gray-600 ">
                                    Setiap kamar kami dilengkapi dengan kasur yang nyaman, lemari untuk menyimpan barang pribadi, dan lain-lain.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div ref={footerRef}>

                <Footer/>
            </div>
        </div>
    )

}