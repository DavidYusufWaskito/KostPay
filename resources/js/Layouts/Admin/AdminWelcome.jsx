import { Link } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
export default function AdminWelcome({ auth, className}) {
    return (
        <div className={`p-6 border border-gray-200 ` + className}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-semibold">Selamat datang!</p>
                    <p className="text-sm text-gray-700">{auth.user.nama}</p>
                </div>
                <Link className="border border-gray-200 px-4 py-2 rounded flex items-center gap-2" method="post" href={route('admin.logout')} as="button">
                    <FontAwesomeIcon className="text-gray-500" icon={faSignOut} />
                    <p className="font-semibold">
                        Keluar
                    </p>
                </Link>
            </div>
        </div>
    );
}