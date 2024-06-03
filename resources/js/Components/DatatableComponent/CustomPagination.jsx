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
        <div className="flex justify-end gap-10 items-center pagination">
            <div className="rows-per-page">
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
            <div className="flex gap-5 pagination-controls">
                <button 
                    onClick={() => onChangePage(1)} 
                    disabled={currentPage === 1}
                >
                    {'<<'}
                </button>
                <button 
                    onClick={() => onChangePage(currentPage - 1)} 
                    disabled={currentPage === 1}
                >
                    {'<'}
                </button>
                <button 
                    onClick={() => onChangePage(currentPage + 1)} 
                    disabled={currentPage * currentRowsPerPage >= rowCount}
                >
                    {'>'}
                </button>
                <button 
                    onClick={() => onChangePage(Math.ceil(rowCount / currentRowsPerPage))} 
                    disabled={currentPage * currentRowsPerPage >= rowCount}
                >
                    {'>>'}
                </button>
            </div>
        </div>
    );
};

export default CustomPaginationComponent;