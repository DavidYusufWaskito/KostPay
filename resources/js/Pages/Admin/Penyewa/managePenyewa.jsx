import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Navbar from '@/Layouts/Navbar';
import {faEdit,faTrash} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from "react-data-table-component";
import CustomPaginationComponent from "@/Components/DatatableComponent/CustomPagination";

export default function ManagePenyewa({ auth, Penyewa, DetailKamar}) {
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
    };



    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleChangeRowsPerPage = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(1);
    };

    const handleChangePage = (newPage) => {
        setCurrentPage(newPage);
    };

    const filteredData = Penyewa.filter((item) => {
        return (
            item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.tunggakan.toString().includes(searchQuery.toLowerCase())
        );
    });

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
        <div className="overflow-y-auto h-full">
            <Head title="Home" />
            <Navbar className={"bg-[#69a8ff] z-10"}>
                <Link className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2">
                    Dashboard
                </Link>
                <Link href={route('daftar')} className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2">
                    Manage kamar
                </Link>
                <Link className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2">
                    Manage penyewa
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
                    <Link className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2 hidden max-md:block " method="post" href={route('admin.logout')}>
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

            <div className="pt-[6rem] pb-[2rem] bg-white overflow-y-auto">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded shadow p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-semibold text-gray-900">Manage Penyewa</h1>
                            <p className="text-sm text-gray-600">Selamat datang {' ' + auth.user.nama}</p>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded shadow p-4 mt-4">
                        <input
                            type="text"
                            placeholder="Cari penyewa..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="mb-4 p-2 border border-gray-300 rounded"
                        />
                        <DataTable
                            columns={[
                                {
                                    name: 'No.',
                                    selector: (row, index) => index + 1,
                                },
                                {
                                    name: 'Id Penyewa',
                                    selector: (row) => row.id,
                                    sortable: true,
                                },
                                {
                                    name: 'Nama',
                                    selector: (row) => row.nama,
                                    sortable: true,
                                },
                                {
                                    name: 'Email',
                                    selector: (row) => row.email,
                                    sortable: true,
                                },
                                {
                                    name: 'Tunggakan',
                                    selector: (row) => row.tunggakan,
                                    sortable:true,
                                },
                                {
                                    name: 'Id kamar',
                                    selector: (row) => {
                                        const detailKamar = DetailKamar.find(detail => detail.idPenyewa === row.id);
                                        return detailKamar ? detailKamar.idKamar : "Belum menyewa kamar";
                                    },
                                },
                                {
                                    name: 'Aksi',
                                    cell: (row) => (
                                        <div className="flex justify-center gap-5">
                                            <Link className="text-xl text-indigo-600 hover:text-indigo-900">
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Link>
                                            <Link method="delete" as="button" className="text-xl text-red-600 hover:text-red-900">
                                                <FontAwesomeIcon icon={faTrash} />
                                            </Link>
                                        </div>
                                    ),
                                },
                            ]}
                            data={filteredData}
                            pagination
                            highlightOnHover
                            striped
                            pointerOnHover
                            paginationRowsPerPageOptions={[10, 20, 30, 40]}
                            paginationComponent={() => (
                                <CustomPaginationComponent
                                    rowsPerPageText="Baris per halaman:"
                                    rangeSeparatorText="Dari"
                                    selectAllRowsItem={true}
                                    selectAllRowsItemText="Semua"
                                    rowsPerPageOptions={[10, 20, 30, 40]}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                    currentRowsPerPage={rowsPerPage}
                                    rowCount={filteredData.length}
                                    currentPage={currentPage}
                                    onChangePage={handleChangePage}
                                />
                            )}
                            paginationTotalRows={filteredData?.length}
                            noDataComponent="No data found"
                        />
                    </div>
                   
                    
                    

                </div>
            </div>
        </div>
    )

}