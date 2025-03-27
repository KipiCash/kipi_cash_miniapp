import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DataTable, { TableColumn } from "react-data-table-component";
import { Calendar } from "lucide-react";
import { getTransactionsAdmin } from "@/db/transaction";
import { ImageViewButton } from "./ImageViewButton";
import { StatsAdminPanel } from "./StatsAdminPanel";
import { MultiSelect } from "./MultiSelect";

export interface TransactionInfo {
  id?: string;
  clientName: string;
  exchangerName: string;
  changeAmount: number;
  finalAmount: number;
  revenue: number;
  clientSSUrl: string;
  exchangerSSUrl: string;
  date: Date;
}

const columns: TableColumn<TransactionInfo>[] = [
  {
    name: "Fecha",
    selector: (row: TransactionInfo) => row.date.toISOString(),
    sortable: true,
    format: (row: TransactionInfo) =>
      row.date.toLocaleString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  {
    name: "Cliente",
    selector: (row: TransactionInfo) => row.clientName,
    sortable: true,
  },
  {
    name: "Cambista",
    selector: (row: TransactionInfo) => row.exchangerName,
    sortable: true,
  },
  {
    name: "Cantidad Cambiada",
    selector: (row: TransactionInfo) => row.changeAmount,
    format: (row: TransactionInfo) => `S/.${row.changeAmount.toFixed(2)}`,
    sortable: true,
  },
  {
    name: "Cantidad depositada",
    selector: (row: TransactionInfo) => row.finalAmount,
    format: (row: TransactionInfo) => `S/.${row.finalAmount.toFixed(2)}`,
    sortable: true,
  },
  {
    name: "Ganancia",
    selector: (row: TransactionInfo) => row.revenue,
    format: (row: TransactionInfo) => `S/.${row.revenue.toFixed(2)}`,
    sortable: true,
  },
  {
    name: "Comprobante de cliente",
    cell: (row: TransactionInfo) => (
      <ImageViewButton
        src={row.clientSSUrl}
        imageProps={{
          width: 300,
          height: 300,
        }}
        buttonClassName="bg-black text-white hover:bg-gray-800"
        title="Comprobante de cliente"
        alt="Comprobante de cliente"
        buttonText="Ver comprobante"
      />
    ),
  },
  {
    name: "Comprobante de cambista",
    cell: (row: TransactionInfo) => (
      <ImageViewButton
        src={row.exchangerSSUrl}
        imageProps={{
          width: 300,
          height: 300,
        }}
        buttonClassName="bg-black text-white hover:bg-gray-800"
        title="Comprobante del Cambista"
        alt="Comprobante de cambista"
        buttonText="Ver comprobante"
      />
    ),
  },
];

interface FilterState {
  cambista: string[];
  cliente: string[];
  startDate: Date | null;
  endDate: Date | null;
}

const DashboardAdminTable = () => {
  const [filters, setFilters] = useState<FilterState>({
    cambista: [],
    cliente: [],
    startDate: null,
    endDate: null,
  });
  const [dataTable, setDataTable] = useState<TransactionInfo[]>([]);
  const [orgData, setOrgData] = useState<TransactionInfo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const trasactions = await getTransactionsAdmin();
      setDataTable(trasactions);
      setOrgData(trasactions);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filteredData = orgData;
    if (filters.cambista && filters.cambista.length > 0) {
      filteredData = filteredData.filter((row) => {
        return filters.cambista.includes(row.exchangerName);
      });
    }

    if (filters.cliente && filters.cliente.length > 0) {
      filteredData = filteredData.filter((row) => {
        return filters.cliente.includes(row.clientName);
      });
    }

    if (filters.startDate && filters.endDate) {
      filteredData = filteredData.filter(
        (row) => row.date >= filters.startDate! && row.date <= filters.endDate!
      );
    }
    setDataTable(filteredData);
  }, [filters, orgData]);

  const resetFilters = () => {
    setFilters({
      cambista: [],
      cliente: [],
      startDate: null,
      endDate: null,
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Cambista Filter */}
          <MultiSelect
            options={orgData
              .filter(
                (v, i, a) =>
                  a.findIndex((t) => t.exchangerName === v.exchangerName) === i
              )
              .map((v) => ({ label: v.exchangerName, value: v.exchangerName }))}
            emptyMessage="No hay cambistas"
            placeholder="Filtrar por cambista"
            onChange={(values) => {
              setFilters((prev) => ({
                ...prev,
                cambista: values.map((v) => v.value),
              }));
            }}
          />

          {/* Cliente Filter */}
          <MultiSelect
            options={orgData
              .filter(
                (v, i, a) =>
                  a.findIndex((t) => t.clientName === v.clientName) === i
              )
              .map((v) => ({ label: v.clientName, value: v.clientName }))}
            onChange={(values) => {
              setFilters((prev) => ({
                ...prev,
                cliente: values.map((v) => v.value),
              }));
            }}
            emptyMessage="No hay clientes"
            placeholder="Filtrar por cliente"
          />

          {/* Date Range Filter */}
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <DatePicker
                selected={filters.startDate}
                onChange={(date) =>
                  setFilters((prev) => ({ ...prev, startDate: date }))
                }
                selectsStart
                startDate={filters.startDate}
                endDate={filters.endDate}
                placeholderText="Fecha inicial"
                dateFormat="dd/MM/yy"
                className="px-7 w-full h-10 rounded-md border border-gray-300 bg-white text-sm shadow-sm focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200"
              />
            </div>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <DatePicker
                selected={filters.endDate}
                onChange={(date) =>
                  setFilters((prev) => ({ ...prev, endDate: date }))
                }
                selectsEnd
                startDate={filters.startDate}
                endDate={filters.endDate}
                minDate={filters.startDate ?? undefined}
                placeholderText="Fecha final"
                dateFormat="dd/MM/yy"
                className="px-7 w-full h-10 rounded-md border border-gray-300 bg-white text-sm shadow-sm focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200"
              />
            </div>
          </div>

          {/* Reset Filters Button */}
          <button
            onClick={resetFilters}
            className="h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 rounded-md transition-colors duration-200"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={dataTable}
        pagination
        responsive
        highlightOnHover
        striped
      />

      <StatsAdminPanel transactions={dataTable} />
    </div>
  );
};

export default DashboardAdminTable;
