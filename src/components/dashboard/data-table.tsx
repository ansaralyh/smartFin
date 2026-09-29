import { formatCurrency, formatDate } from "@/lib/utils";

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: TableColumn<T>[];
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  emptyMessage = "No records found",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="portal-card py-20 text-center">
        <p className="text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="portal-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brand-light/50 bg-brand-subtle/40">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr
                key={item.id}
                className={`transition-colors hover:bg-brand-subtle/30 ${
                  i !== data.length - 1 ? "border-b border-brand-light/30" : ""
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="px-6 py-4 text-sm font-medium text-brand-darker"
                  >
                    {col.render
                      ? col.render(item)
                      : String(item[col.key as keyof T] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { formatCurrency, formatDate };
