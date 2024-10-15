import { Link } from '@inertiajs/react';
import { useState,useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome,faBell,faArrowLeft} from '@fortawesome/free-solid-svg-icons';

export default function PenyewaFooter({auth,prevRoute = null}) {
    console.log(prevRoute);
    return (
        <div className="flex justify-center fixed bottom-0 bg-gray-200 p-4 w-screen md:hidden">
            <div className='flex items-center justify-between w-4/5'>
                <Link href={route('penyewa.dashboard')} className='flex flex-col items-center select-none'>
                    <FontAwesomeIcon icon={faHome} className="text-3xl"/>
                    <p className='text-sm font-semibold'>Dashboard</p>
                </Link>
                <Link className='flex flex-col items-center select-none'>
                    <FontAwesomeIcon icon={faBell} className="text-3xl"/>
                    <p className='text-sm font-semibold'>Notifikasi</p>
                </Link>
                <Link href={prevRoute ? prevRoute : undefined} onClick={prevRoute ? undefined : () => window.history.back()} className='flex flex-col items-center select-none'>
                    <FontAwesomeIcon icon={faArrowLeft} className="text-3xl"/>
                    <p className='text-sm font-semibold'>Kembali</p>
                </Link>
            </div>
        </div>
    );
}