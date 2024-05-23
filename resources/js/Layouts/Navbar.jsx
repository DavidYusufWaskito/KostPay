import { useState } from "react";

export default function Navbar({children, className})
{
    const [navIsOpen,OpenNav] = useState(false); 
    function OpenNavbar()
    {
        // let Navlink = document.querySelector(".nav-links");
        // Navlink.classList.toggle("max-md:hidden");
        OpenNav((val) => !val);
    }

    return(
        <>
            <div className={"flex fixed justify-between p-4 w-[100%] " + className}>
                <div className="nav-logo">
                    <div className="relative flex-col">
                        <div className="text-[#FFFF] font-extrabold text-2xl">
                            KOST
                        </div>
                        <div className="ms-4 font-extrabold text-md">
                            BU YATI
                        </div>
                    </div>
                </div>
                <div className={"nav-links flex flex-row md:items-center md:gap-5 w-100 font-sans select-none" + (navIsOpen? "" : " max-md:hidden") + " max-md:flex-col max-md:absolute max-md:bg-white max-md:w-[100%] max-md:left-0 max-md:mt-[4.5rem] max-md:overflow-y-auto max-md:h-[calc(100vh-5.5rem)]"}>
                    {children}
                </div>
                <div className="flex items-center md:hidden">
                    <button className={"text-white " + (navIsOpen ? "border border-white rounded bg-slate-950/5 bg-opacity-30": "border border-transparent") + " hover:bg-slate-950/10 hover:rounded"} onClick={()=>{OpenNavbar()}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
}