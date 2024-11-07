import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'

export default function Table({ columns, data, onEdit, onDelete }: { columns: { key: string; label: string }[]; data: any[]; onEdit: (item: any) => void; onDelete: (item: any) => void }) {
  return (
    <div className="bg-[#1E2023] rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-[#1A1C1E]">
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                {column.label}
              </th>
            ))}
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-t border-gray-700">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-sm">
                  {item[column.key]}
                </td>
              ))}
              <td className="px-4 py-3 text-sm">
                <button onClick={() => onEdit(item)} className="text-blue-500 hover:text-blue-600 mr-4">
                  <FontAwesomeIcon icon={faPencil} className="h-4 w-4" />
                </button>
                <button onClick={() => onDelete(item)} className="text-red-500 hover:text-red-600">
                  <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between px-4 py-3 bg-[#1A1C1E]">
        <div className="text-sm text-gray-400">
          Mostrando 1 a 10 de 100 resultados
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1 rounded-md bg-[#1E2023] text-gray-400 hover:bg-[#22c55e]/10 hover:text-[#22c55e]">
            <FontAwesomeIcon icon={faChevronLeft} className="h-5 w-5" />
          </button>
          <button className="p-1 rounded-md bg-[#1E2023] text-gray-400 hover:bg-[#22c55e]/10 hover:text-[#22c55e]">
            <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}