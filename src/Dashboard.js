import React from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter } from 'recharts';

const Dashboard = () => {
    const pieData = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
    ];

    const lineData = [
        { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
        { name: 'Page B', uv: 300, pv: 4567, amt: 2400 },
        { name: 'Page C', uv: 200, pv: 1398, amt: 2400 },
        { name: 'Page D', uv: 278, pv: 9800, amt: 2400 },
        { name: 'Page E', uv: 189, pv: 3908, amt: 2400 },
        { name: 'Page F', uv: 239, pv: 4800, amt: 2400 },
    ];

    const barData = [
        { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
        { name: 'Page B', uv: 3000, pv: 4567, amt: 2400 },
        { name: 'Page C', uv: 2000, pv: 1398, amt: 2400 },
        { name: 'Page D', uv: 2780, pv: 9800, amt: 2400 },
        { name: 'Page E', uv: 1890, pv: 3908, amt: 2400 },
        { name: 'Page F', uv: 2390, pv: 4800, amt: 2400 },
    ];

    const areaData = [
        { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
        { name: 'Page B', uv: 3000, pv: 4567, amt: 2400 },
        { name: 'Page C', uv: 2000, pv: 1398, amt: 2400 },
        { name: 'Page D', uv: 2780, pv: 9800, amt: 2400 },
        { name: 'Page E', uv: 1890, pv: 3908, amt: 2400 },
        { name: 'Page F', uv: 2390, pv: 4800, amt: 2400 },
    ];

    const radarData = [
        { subject: 'Attack1', A: 120, B: 110, fullMark: 150 },
        { subject: 'Attack2', A: 98, B: 130, fullMark: 150 },
        { subject: 'Attack3', A: 86, B: 130, fullMark: 150 },
        { subject: 'Attack4', A: 99, B: 100, fullMark: 150 },
        { subject: 'Attack5', A: 85, B: 90, fullMark: 150 },
        { subject: 'Attack6', A: 65, B: 85, fullMark: 150 },
    ];

    const scatterData = [
        { x: 100, y: 200 },
        { x: 120, y: 100 },
        { x: 170, y: 300 },
        { x: 140, y: 250 },
        { x: 150, y: 400 },
        { x: 110, y: 280 },
    ];

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', marginTop: '40px'}}>
            <div style={{ width: '30%', marginBottom: '20px' }}>
                <h3>Pie Chart</h3>
                <PieChart width={400} height={400}>
                    <Pie
                        data={pieData}
                        cx={200}
                        cy={200}
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#0088FE' : '#00C49F'} />
                        ))}
                    </Pie>
                </PieChart>
            </div>

            <div style={{ width: '30%', marginBottom: '20px' }}>
                <h3>Line Chart</h3>
                <LineChart width={400} height={400} data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                </LineChart>
            </div>

            <div style={{ width: '30%', marginBottom: '20px' }}>
                <h3>Bar Chart</h3>
                <BarChart width={400} height={400} data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="pv" fill="#8884d8" />
                </BarChart>
            </div>

            <div style={{ width: '30%', marginBottom: '20px' }}>
                <h3>Area Chart</h3>
                <AreaChart width={400} height={400} data={areaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
            </div>

            


      <div style={{ width: '30%', marginBottom: '20px' }}>
        <h3>Radar Chart</h3>
        <RadarChart outerRadius={90} width={400} height={400} data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis />
          <Radar name="Mike" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
      </div>
      
    

      <div style={{ width: '30%', marginBottom: '20px' }}>
      <h3>Scatter Chart</h3>
      <ScatterChart width={400} height={400}>
        <CartesianGrid />
        <XAxis type="number" dataKey="x" name="x-axis" />
        <YAxis type="number" dataKey="y" name="y-axis" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name="A scatter" data={scatterData} fill="#8884d8" />
      </ScatterChart>
    </div>
    
    </div>
  );
};

export default Dashboard;
