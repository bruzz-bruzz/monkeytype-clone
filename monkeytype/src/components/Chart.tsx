import { useRef, useEffect, useMemo } from 'react'
import './App.css'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale, 
} from 'chart.js'
import type {ChartOptions} from 'chart.js'
ChartJS.register(Filler,CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale)

export default function Chart({data}: any){
    const chartRef = useRef<any>(null)

    const formatted = useMemo(() => {
        // Accept either a Chart.js-ready object or [labels, values]
        if(!data) return { labels: [], datasets: [] }
        if(data.labels && data.datasets) return data
        if(Array.isArray(data) && data.length === 2){
            return {
                labels: data[0],
                datasets: [{
                    label: 'Words typed',
                    data: data[1],
                    borderColor: '#7c3aed',
                    backgroundColor: 'rgba(124,58,237,0.15)',
                    tension: 0.35,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#fff',
                    borderWidth: 3,
                    fill: true
                }]
            }
        }
        return data
    },[data])

    useEffect(()=>{
        const chart = chartRef.current
        if(!chart) return
        try{
            const ctx = chart.ctx
            const gradient = ctx.createLinearGradient(0,0,0,220)
            gradient.addColorStop(0,'rgba(124,58,237,0.55)')
            gradient.addColorStop(1,'rgba(99,102,241,0.04)')
            if(chart.data && chart.data.datasets && chart.data.datasets[0]){
                chart.data.datasets[0].backgroundColor = gradient
                chart.data.datasets[0].borderColor = '#7c3aed'
                chart.update()
            }
        }catch(e){
            // ignore if ctx not ready
        }
    },[formatted])

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#0f172a',
                titleColor: '#ffffff',
                bodyColor: '#e2e8f0',
                padding: 10,
                cornerRadius: 8
            }
        },
        scales: {
            x: {
                type: 'category',
                grid: { display: false },
                ticks: { color: '#64748b', autoSkip: false, maxRotation: 0, minRotation: 0 }
            },
            y: {
                beginAtZero:true,
                grid: { color: 'rgba(15,23,42,0.06)' },
                ticks: { color: '#64748b'}
            }
        },
        animation: { duration: 700, easing: 'easeOutQuart' as const,}
    }

    return (
        <div className='w-full p-4'>
            <div className='bg-gradient-to-r from-indigo-50/40 via-white to-indigo-50/40 p-4 rounded-xl shadow-lg' style={{height:320}}>
                <Line ref={chartRef} data={formatted} options={options} />
            </div>
        </div>
    )
}