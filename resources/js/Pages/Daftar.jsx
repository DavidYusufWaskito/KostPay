import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from '@/Layouts/Navbar';

import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
export default function Home({ auth }) {

    function onWaBtn(e)
    {
        e.preventDefault();
        window.location.href = "https://wa.me/+6285821535674";
    }
    return (
        <div className="overflow-y-auto h-full">
            <Head title="Home" />
            <Navbar className={"bg-[#FFBF69]"}>
                <Link href={route('home')} className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2 max-md:border">
                    Home
                </Link>
                <Link className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2 max-md:border">
                    Daftar
                </Link>
                <Link className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2 max-md:border">
                    Hubungi kami
                </Link>
            </Navbar>
            <div className="pt-[6rem] pb-[2rem] bg-white overflow-y-auto">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-10">
                    <h1 className="text-4xl mb-4 font-extrabold">
                        Daftar
                    </h1>
                    <p>
                        Untuk saat ini kami hanya menerima pendaftaran penyewa onsite atau di lokasi kost. Silahkan hubungi Whatsapp dibawah ini
                    </p>
                    <button className="p-2 flex items-center gap-2 text-center border border-transparent hover:border-green-500 rounded" onClick={(e)=>onWaBtn(e)}>
                        <FontAwesomeIcon className="text-4xl text-green-500" icon={faWhatsapp}/>
                        <p>
                            085821535674
                        </p>
                    </button>
                </div>
            </div>
        </div>
    )

}