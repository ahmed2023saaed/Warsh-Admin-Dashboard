


export default function DataTable(
{    columns,
    data,
    emptyMessage,
    minWidth,
    cellClassName}
){
    
    return (

    <div className='h-full overflow-y-auto border border-gray-200 rounded-2xl'>
        <table className="w-full" style={{ minWidth }}>
            <thead className="border-b border-gray-100 bg-gray-50/50">
                <tr>
                    {columns.map((column)=>
                        <th 
                         key={column.key}
                         className='py-4 px-0.5 uppercase text-center text-xs font-semibold tracking-wide text-[#5A6968]'
                         >
                            {column.header}
                        </th>
                    )}
                </tr>

            </thead>

            <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td 
                                colSpan={columns.length}
                                className="px-4 py-16  text-center text-sm text-gray-400"
                            >
                            {emptyMessage}
                            </td>
                        </tr>
                    ):(
                        data.map((row, index)=>(
                            <tr 
                                key={row.id}
                                className='border-b border-gray-100 bg-white hover:bg-gray-50/50'
                            >
                                {columns.map((column) =>(
                                    <td className= {` ${cellClassName} ${column.cellClassName ?? ''} px-3 py-3.5 text-center`}
                                        key={column.key}

                                    >
                                        {column.render ? column.render(row): row[column.key]}
                                    </td>
                                ))}

                            </tr>
                        ))
                    )}
            </tbody>

        </table>

    </div>
    )

}