import React, { useMemo } from "react";

import {
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";
import { TransactionInfo } from "./DashboardAdminTable";

interface StatsAdminPanelProps {
  transactions: TransactionInfo[];
}

export function StatsAdminPanel({ transactions }: StatsAdminPanelProps) {
  const stats = useMemo(() => {
    const totalRevenue = transactions.reduce((sum, t) => sum + t.revenue, 0);
    const totalTransactions = transactions.length;
    const avgChangeAmount =
      transactions.reduce((sum, t) => sum + t.changeAmount, 0) /
      totalTransactions;
    const avgFinalAmount =
      transactions.reduce((sum, t) => sum + t.finalAmount, 0) /
      totalTransactions;

    // Get top exchangers by volume
    const exchangerStats = transactions.reduce((acc, t) => {
      acc[t.exchangerName] = (acc[t.exchangerName] || 0) + t.changeAmount;
      return acc;
    }, {} as Record<string, number>);

    const topExchangers = Object.entries(exchangerStats)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .slice(0, 3);

    // Calculate month-over-month growth
    const currentMonth = new Date().getMonth();
    const currentMonthTransactions = transactions.filter(
      (t) => new Date(t.date).getMonth() === currentMonth
    );
    const lastMonthTransactions = transactions.filter(
      (t) => new Date(t.date).getMonth() === currentMonth - 1
    );

    const growth =
      lastMonthTransactions.length > 0
        ? ((currentMonthTransactions.length - lastMonthTransactions.length) /
            lastMonthTransactions.length) *
          100
        : 0;

    return {
      totalRevenue,
      totalTransactions,
      avgChangeAmount,
      avgFinalAmount,
      topExchangers,
      growth,
    };
  }, [transactions]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Panel de Estadísticas
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ingresos Totales</p>
              <p className="text-2xl font-bold text-gray-800">
                S/. {stats.totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Total Transactions Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Transacciones</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.totalTransactions}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Average Change Amount */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Monto Promedio</p>
              <p className="text-2xl font-bold text-gray-800">
                S/. {stats.avgChangeAmount.toFixed(2)}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Growth Rate */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Crecimiento Mensual</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-800">
                  {Math.abs(stats.growth).toFixed(1)}%
                </p>
                {stats.growth >= 0 ? (
                  <ArrowUpRight className="w-5 h-5 text-green-500 ml-2" />
                ) : (
                  <ArrowDownRight className="w-5 h-5 text-red-500 ml-2" />
                )}
              </div>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Exchangers Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Top Exchangers por Volumen
        </h3>
        <div className="space-y-4">
          {stats.topExchangers.map(([name, volume], index) => (
            <div key={name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center 
                  ${
                    index === 0
                      ? "bg-yellow-100 text-yellow-600"
                      : index === 1
                      ? "bg-gray-100 text-gray-600"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  <Users className="w-4 h-4" />
                </div>
                <span className="ml-3 text-gray-700">{name}</span>
              </div>
              <span className="font-semibold text-gray-900">
                S/. {((volume ?? 0) as number).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
