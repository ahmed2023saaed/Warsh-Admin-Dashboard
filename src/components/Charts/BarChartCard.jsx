

// components/charts/BarChartCard.jsx

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function CustomTooltip({
  active,
  payload,
  label,
  valueFormatter,
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-md">
      <p className="mb-1 text-xs font-medium text-gray-500">
        {label}
      </p>

      <p className="text-sm font-bold text-[#15201F]">
        {valueFormatter(payload[0].value)}
      </p>
    </div>
  );
}


export default function BarChartCard({
    data,
    title,
    color = '#EF9D32',
    unit,
    valueFormater = (value) => value.toLocaleString('en-EG')
}) {
    return (
        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm '>
            <div className='flex align-center justify-between p-4 '>
                <h2 className='font-bold text-gray-400 text-sm '>
                    {title}
                </h2>

                {unit && (
                    <span className='font-semibold text-gray-600 text-xs'>
                        {unit}
                    </span>
                )}
            </div>

            <div className="h-[220px] w-full">


                <ResponsiveContainer width='100%' height='100%'>
                    <BarChart
                        data={data}
                        margin={{
                            top: 5,
                            bottom: 0,
                            right: 0,
                            left: 0
                        }}
                    >
                        <CartesianGrid vertical horizontal={false} fill='text-gray-400' />
                        <XAxis
                            dataKey='label'
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#ee42", fontSize: 11 }}
                            by={8}
                        />
                        <YAxis hide />

                        <Tooltip
                            cursor={{ fill: "rgba(44, 49, 45, 0.8)" }}
                            content={<CustomTooltip valueFormatter={valueFormater} />}
                        />

                        <Bar
                            dataKey='value'
                            maxBarSize={42}
                            fill={color}
                            radius={[5, 5, 0, 0]}
                        />



                    </BarChart>
                </ResponsiveContainer>


            </div>

        </div>
    )
}




