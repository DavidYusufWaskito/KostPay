import { useEffect, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "../Navbar";
export default function AdminHeader({ children, auth }) {
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
    return (
        <>
            <Head title="Home" />
            <Navbar className={"z-10"} Admin={true}>
                <Link href={route('admin.dashboard')} className="text-gray-500 hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2">
                    Dashboard
                </Link>
                <Link href={route('admin.manage.kamar')} className="text-gray-500 hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2">
                    Manage kamar
                </Link>
                <Link href={route('admin.manage.penyewa')} className="text-gray-500 hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2">
                    Manage penyewa
                </Link>
                <Link href={route('admin.notifikasi')} className="text-gray-500 hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2">
                    Kirim notifikasi
                </Link>
                <button onClick={toggleProfileDropdown} className="text-gray-500 hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2 max-md:hidden" id="menu-button" aria-expanded={profileDropdownOpen} aria-haspopup="true">
                    Profil
                </button>
                <div className="max-md:border-t-[1px]">
                    <div className="max-md:text-slate-500/50 max-md:pt-1 max-md:ps-2 text-sm hidden max-md:block">
                        Profile
                    </div>
                    <Link className="text-gray-500 hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2 hidden max-md:block ">
                        Account settings
                    </Link>
                    <Link className="text-gray-500 hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2 hidden max-md:block " method="post" href={route('admin.logout')}>
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
        </>
    );
}