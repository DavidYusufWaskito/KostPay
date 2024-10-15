export default ({ status }) => {
    const colors = {
        '0': 'bg-red-100 text-red-800',
        '1': 'bg-green-100 text-green-800',
        '2': 'bg-blue-100 text-blue-800',
        '3': 'bg-red-100 text-red-800',
        '4': 'bg-red-100 text-red-800',
        '5': 'bg-blue-100 text-blue-800',
    };
    return (
        <span className={`inline-flex items-center justify-center py-2 min-w-20 w-1/3 rounded-xl text-xs font-medium leading-5 ${colors[status] || ''}`}>
            {['Gagal', 'Sukses', 'Pending', 'Dibatalkan','Expired','Belum Bayar'][status] || ''}
        </span>
    );
};

