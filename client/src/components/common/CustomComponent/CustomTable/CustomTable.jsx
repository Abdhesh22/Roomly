import { useState } from "react";

const CustomTable = ({
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
        let newConfig;
        if (sortConfig?.key === key) {
            newConfig = {
                key,
                direction: sortConfig.direction === "asc" ? "desc" : "asc"
            };
        } else {
            newConfig = { key, direction: "asc" };
        }
        setSortConfig(newConfig);
        sortTable?.(newConfig.key, newConfig.direction);
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
                                        {sortConfig?.key === col.accessor
                                            ? sortConfig.direction === "asc"
                                                ? "🔼"
                                                : "🔽"
                                            : "⬍"}
                                    </span>
                                )}
                            </th>
                        ))}
                        {actions && (Array.isArray(actions) ? actions.length > 0 : true) && (
                            <th className="border px-4 py-2">Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length + (actions ? 1 : 0)}
                                className="text-center py-4 text-gray-500"
                            >
                                No data available.
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => {
                            const rowActions = typeof actions === "function" ? actions(row) : actions;

                            return (
                                <tr key={rowIndex} className="hover:bg-gray-50">
                                    {columns.map((col) => (
                                        <td key={col.accessor} className="border px-4 py-2">
                                            {row[col.accessor]}
                                        </td>
                                    ))}
                                    {rowActions && rowActions.length > 0 && (
                                        <td className="border px-4 py-2 whitespace-nowrap">
                                            <div className="d-flex gap-2 flex-wrap">
                                                {rowActions.map((action, i) => {
                                                    if (typeof action.hidden === "function" && action.hidden(row)) {
                                                        return null;
                                                    }
                                                    return (
                                                        <button
                                                            key={i}
                                                            onClick={() => action.onClick?.(row)}
                                                            type="button"
                                                            className={`btn btn-sm btn-light d-inline-flex align-items-center gap-1 ${action.className || ""}`}
                                                        >
                                                            {typeof action.label === "function"
                                                                ? action.label(row)
                                                                : action.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
            {renderPagination()}
        </div>
    );
};

export default CustomTable;