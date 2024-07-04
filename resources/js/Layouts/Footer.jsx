import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
export default function Footer() {
    return (
        <footer className={"bg-gray-700 mt-10 "}>
            <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
                <div className="text-center text-gray-500">
                        Hubungi kami di
                </div>
                <nav className="mx-5 my-2 flex flex-wrap justify-center" aria-label="Footer">

                    <div className="px-5 py-2">
                        <a
                            href="https://wa.me/+6285821535674"
                            className="text-base text-gray-500 hover:text-gray-200"
                            target="_blank"
                        >
                            <FontAwesomeIcon icon={faWhatsapp} className="mr-2"/> WhatsApp
                        </a>
                    </div>
                    <div className="px-5 py-2">
                        <a
                            href="mailto:davidyusufwaskito@gmail.com"
                            className="text-base text-gray-500 hover:text-gray-200"
                        >
                            <FontAwesomeIcon icon={faEnvelope} className="mr-2"/> Email
                        </a>
                    </div>
                </nav>
                <p className="mt-8 text-center text-base text-gray-400">
                    &copy; {new Date().getFullYear()} KostPay. David Yusuf De Waskito - Seluruh hak cipta.
                </p>
            </div>
        </footer>
    )
}