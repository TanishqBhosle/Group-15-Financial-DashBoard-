import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

// Colors for different risk levels
const RISK_COLORS = {
  low: ["#4ade80", "#86efac", "#bbf7d0"],
  medium: ["#fb923c", "#fdba74", "#fed7aa"],
  high: ["#f87171", "#fca5a5", "#fecaca"],
}

const InvestmentChart = ({ data, riskLevel }) => {
  // Get colors based on risk level
  const colors = RISK_COLORS[riskLevel] || RISK_COLORS.medium

  // Calculate total investment amount
  const totalInvestment = data.reduce((sum, item) => sum + item.value, 0)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-green-600 dark:text-green-400">
            ${data.value.toFixed(2)} ({((data.value / totalInvestment) * 100).toFixed(1)}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-80">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              animationDuration={750}
              animationBegin={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400">No investment data available</p>
        </div>
      )}
    </div>
  )
}

export default InvestmentChart
