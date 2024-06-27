import { Head, Link } from '@inertiajs/react';
import Navbar from '../Navbar';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

export default function PenyewaHeader({ children , auth}) {
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notificationsOpen,setNotificationsOpen] = useState(false);
    const [notificationData, setNotificationData] = useState([]);
    
    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
    };

    // Check window width and set profile dropdown to false
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setProfileDropdownOpen(false);
                setNotificationsOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        fetchNotif();
    }, [])

    // toggle open notification
    const toggleNotifications = () => {
        setNotificationsOpen(!notificationsOpen);
    }

    const fetchNotif = async () => {
        const token = document.head.querySelector('meta[name="csrf-token"]').content;
        const requestConfig = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token
          },
          body: JSON.stringify({
            idPenyewa: auth.user.id
          })
        }
        const response = await fetch('/notifikasi', requestConfig);
        const responseJSON = await response.json();
        console.log(responseJSON);
        if (response.ok)
        {
            setNotificationData(responseJSON);
            console.log("Notification: ", notificationData);
        }
      }

    return (
        <>
            <Head title="Home" />
            <Navbar className={"bg-[#FFBF69] z-10"}>
                <button onClick={toggleNotifications} className="relative text-[#FFFF] font-sans font-extrabold max-md:text-slate-500 max-md:p-2 me-5">
                    <FontAwesomeIcon icon={faBell} />
                    {notificationData.data && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center">
                            {notificationData.data.length}
                        </span>
                    )}
                </button>
                <Link className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2">
                    Dashboard
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
                    <Link className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2 hidden max-md:block " method="post" href={route('logout')}>
                        Sign out
                    </Link>
                </div>
            </Navbar>

            {/* Dropdown profil */}
            {profileDropdownOpen && (
                <div className="absolute right-0 z-10 mt-20 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                    <div className="py-1" role="none">
                        <Link href="#" className="text-gray-700 block px-4 py-2 text-sm hover:text-[#EB5160]" role="menuitem" tabIndex="-1" id="menu-item-0">Account settings</Link>
                        <Link className="text-gray-700 block w-full px-4 py-2 text-left text-sm hover:text-[#EB5160]" method="post" href={route('logout')} as="button">
                            Sign out
                        </Link>
                    </div>
                </div>
            )}

            {notificationData.data && notificationsOpen && (
                <div className="fixed top-[6.5rem] right-0 z-10 mb-4 mr-4 w-[32rem] h-80 rounded-md overflow-y-auto bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="notification-button" tabIndex="-1">
                    <div className="flex flex-col h-[80%] gap-2 mt-2 mb-2 px-2 overflow-auto" role="none">
                        {notificationData.data.map((notif) => (
                            <div className='flex justify-between border rounded bg-gray-200 border-gray-500 text-gray-700 px-4 py-2 text-sm'>
                                <p key={notif.id} className="">{notif.Pesan}</p>
                                <p className=''>{new Date(notif.created_at).toLocaleDateString()}</p>
                            </div>
                        ))}
                        
                    </div>
                    <div className='flex justify-center'>
                        <button className='text-gray-700 hover:text-blue-500 transition-colors duration-300'>
                            Tandai semua sebagai terbaca
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}