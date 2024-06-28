import { Head, Link } from '@inertiajs/react';
import Navbar from '../Navbar';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import Modal from '@/Components/Modal';

export default function PenyewaHeader({ children , auth}) {
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notificationsOpen,setNotificationsOpen] = useState(false);
    const [notificationData, setNotificationData] = useState([]);
    const [notifModalOpen, setNotifModalOpen] = useState({
        open: false,
        data: {}
    });
    
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

    const changeNotifStatus = async (idNotif) => {
        const token = document.head.querySelector('meta[name="csrf-token"]').content;
        const requestConfig = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token
          },
          body: JSON.stringify({
            idNotif: idNotif
          })
        }
        const response = await fetch('/notifikasi/change/status', requestConfig);
        const responseJSON = await response.json();
        console.log(responseJSON);
        fetchNotif();
    }

    const changeAllNotifStatus = async (idPenyewa) => {
        const token = document.head.querySelector('meta[name="csrf-token"]').content;
        const requestConfig = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token
          },
          body: JSON.stringify({
            idPenyewa: idPenyewa
          })
        }
        const response = await fetch('/notifikasi/change/status/all', requestConfig);
        const responseJSON = await response.json();
        console.log(responseJSON);
        fetchNotif();
    }

    return (
        <>
            <Head title="Home" />
            <Navbar className={"bg-[#FFBF69] z-10"}>
                <button onClick={toggleNotifications} className="relative text-[#FFFF] font-sans font-extrabold origin-center max-md:text-slate-500 max-md:p-2 me-5">
                    <FontAwesomeIcon className='scale-150 transition-all ease-in-out duration-75 active:scale-125' icon={faBell} />
                    {notificationData.data && notificationData.data.filter(item => item.status === 0).length > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center">
                            {notificationData.data.filter(item => item.status === 0).length}
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
                            <button onClick={() => setNotifModalOpen({open: true, data: notif})} className={`flex justify-between ${notif.status === 0 ? 'bg-gray-100' : ''} ${notif.status === 0 ? '' : 'border'} rounded px-4 py-2 text-sm text-gray-700 hover:text-blue-500 transition-colors duration-300`} role="menuitem" tabIndex="-1" id="menu-item-0" key={notif.id}>
                                <span key={notif.id} className="overflow-x-hidden whitespace-nowrap truncate">
                                    {notif.Pesan}
                                </span>
                                <p className=''>{new Date(notif.created_at).toLocaleDateString()}</p>
                            </button>
                        ))}
                        
                    </div>
                    <div className='flex justify-center'>
                        <button onClick={()=>changeAllNotifStatus(auth.user.id)} className='text-gray-700 hover:text-blue-500 transition-colors duration-300'>
                            Tandai semua sebagai terbaca
                        </button>
                    </div>
                </div>
            )}

            <Modal show={notifModalOpen.open} onClose={() => {
                changeNotifStatus(notifModalOpen.data.id);
                setNotifModalOpen({open: false, data: null});
                }}>
                <div className="rounded-lg shadow p-6">
                    <p className="text-lg font-semibold text-gray-900">Notifikasi</p>
                    <div className="mt-6">
                        {
                            notifModalOpen.data && (
                                <div key={notifModalOpen.data.id} className="flex justify-between py-4 ">
                                    <p className="text-balance text-gray-700">{notifModalOpen.data.Pesan}</p>
                                    <p className="text-gray-500">{new Date(notifModalOpen.data.created_at).toLocaleDateString()}</p>
                                </div>
                            )
                        }
                    </div>
                </div>
            </Modal>

        </>
    );
}