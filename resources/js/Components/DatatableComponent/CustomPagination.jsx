const CustomPaginationComponent = ({ 
    rowsPerPageText, 
    rangeSeparatorText,
    selectAllRowsItem,
    selectAllRowsItemText, 
    rowsPerPageOptions, 
    onChangeRowsPerPage, 
    currentRowsPerPage, 
    rowCount, 
    currentPage, 
    onChangePage 
}) => {

    const handleRowsPerPageChange = (e) => {
        const value = e.target.value === selectAllRowsItemText ? rowCount : Number(e.target.value);
        onChangeRowsPerPage(value);
    };


    return (
        <div className="flex justify-end gap-10 items-center mt-2 pagination">
            <div className="flex gap-2 items-center rows-per-page">
                <span>{rowsPerPageText}</span>
                <select
                    className="rounded border hover:border-blue-400 transition duration-300"
                    value={currentRowsPerPage === rowCount ? selectAllRowsItemText : currentRowsPerPage}
                    onChange={handleRowsPerPageChange}
                >
                    {rowsPerPageOptions.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                    {selectAllRowsItem && <option value={selectAllRowsItemText}>{selectAllRowsItemText}</option>}
                </select>
            </div>
            <div className="pagination-info">
                <span>{`${currentPage * currentRowsPerPage - currentRowsPerPage + 1}-${Math.min(currentPage * currentRowsPerPage, rowCount)} ${rangeSeparatorText} ${rowCount}`}</span>
            </div>
            <div className="flex pagination-controls border border-blue-500 rounded-lg">
                <button 
                    onClick={() => onChangePage(1)} 
                    disabled={currentPage === 1}
                    className={"p-1 bg-blue-500 text-white rounded-l-lg " + (currentPage > 1? "transition-all duration-300 hover:bg-blue-500/80" : "")}
                >
                    {'<<'}
                </button>
                <button 
                    onClick={() => onChangePage(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="p-1 border-s-[1px] border-e-[1px] border-slate-400"
                >
                    {'<'}
                </button>
                <div className="px-5 py-1">
                    {currentPage}
                </div>
                <button 
                    onClick={() => onChangePage(currentPage + 1)} 
                    disabled={currentPage * currentRowsPerPage >= rowCount}
                    className="p-1 border-s-[1px] border-e-[1px] border-slate-400"
                >
                    {'>'}
                </button>
                <button 
                    onClick={() => onChangePage(Math.ceil(rowCount / currentRowsPerPage))} 
                    disabled={currentPage * currentRowsPerPage >= rowCount}
                    className={"p-1 bg-blue-500 text-white rounded-r-lg " + (currentPage * currentRowsPerPage != rowCount? "transition-all duration-300 hover:bg-blue-500/80" : "")}
                >
                    {'>>'}
                </button>
            </div>
        </div>
    );
};

export default CustomPaginationComponent;