import { useState, useMemo } from "react";

const Table = ({
    columns = [],
    data = [],
    enableSorting = false,
    actions = [],
    pagination = null,
    sortTable
}) => {
    const [sortConfig, setSortConfig] = useState(null);

    const handleSort = (key) => {
        if (!enableSorting) return;
        if (sortConfig?.key === key) {
            setSortConfig({ key, direction: sortConfig.direction === "asc" ? "desc" : "asc" });
        } else {
            setSortConfig({ key, direction: "asc" });
        }
        sortTable(sortConfig.key, sortConfig.direction);
    };

    const renderPagination = () => {
        if (!pagination) return null;

        const { page, limit, total, onPageChange } = pagination;
        const totalPages = Math.ceil(total / limit);

        return (
            <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                </div>
                <div className="space-x-2">
                    <button
                        disabled={page <= 1}
                        onClick={() => onPageChange(page - 1)}
                        className={`px-3 py-1 rounded ${page <= 1 ? "bg-gray-300" : "bg-blue-600 text-white"}`}
                    >
                        Prev
                    </button>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => onPageChange(page + 1)}
                        className={`px-3 py-1 rounded ${page >= totalPages ? "bg-gray-300" : "bg-blue-600 text-white"}`}
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full max-w-none overflow-x-auto">
            <table className="w-100 border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.accessor}
                                className="border px-4 py-2 text-left cursor-pointer"
                                onClick={() => handleSort(col.accessor)}
                            >
                                {col.header}
                                {enableSorting && (
                                    <span className="ml-1 text-xs">
                                        {sortConfig?.key === col.accessor ? sortConfig.direction === "asc" ? "🔼" : "🔽" : "⬍"}
                                    </span>
                                )}
                            </th>
                        ))}
                        {actions.length > 0 && <th className="border px-4 py-2">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="text-center py-4 text-gray-500">
                                No data available.
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                                {columns.map((col) => (
                                    <td key={col.accessor} className="border px-4 py-2">
                                        {row[col.accessor]}
                                    </td>
                                ))}
                                {actions.length > 0 && (
                                    <td className="border px-4 py-2 whitespace-nowrap">
                                        <div className="d-flex gap-2 flex-wrap">
                                            {actions.map((action, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => action.onClick(row)}
                                                    type="button"
                                                    className="btn btn-sm btn-light d-inline-flex align-items-center gap-1"
                                                >
                                                    {action.label(row)}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {renderPagination()}
        </div>
    );
};

export default Table;