import ApplicationLogo from '@/Components/ApplicationLogo';
import CompanyLogo from '@/Components/CompanyLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <div>
                <Link href="/">
                    {/* <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" /> */}
                    <CompanyLogo className="w-[20rem] h-[5rem] sm:w-[20rem] sm:h-[5rem] lg:w-[40rem] lg:h-[10rem] fill-current text-gray-500 transition-all duration-500"/>
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
