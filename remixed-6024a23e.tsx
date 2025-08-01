import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Moon, Sun, Download, Filter, TrendingUp, Users, DollarSign, Target, ArrowUp, ArrowDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock data generation
  const generateMockData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueData = months.map((month, index) => ({
      month,
      revenue: Math.floor(Math.random() * 50000) + 30000,
      users: Math.floor(Math.random() * 2000) + 1000,
      conversions: Math.floor(Math.random() * 500) + 200,
      growth: (Math.random() * 20) - 10
    }));

    const channelData = [
      { name: 'Google Ads', value: 45, color: '#4285F4' },
      { name: 'Facebook', value: 25, color: '#1877F2' },
      { name: 'Instagram', value: 15, color: '#E4405F' },
      { name: 'LinkedIn', value: 10, color: '#0077B5' },
      { name: 'Twitter', value: 5, color: '#1DA1F2' }
    ];

    const tableData = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      campaign: `Campaign ${i + 1}`,
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
      impressions: Math.floor(Math.random() * 100000) + 10000,
      clicks: Math.floor(Math.random() * 5000) + 500,
      conversions: Math.floor(Math.random() * 200) + 20,
      ctr: ((Math.random() * 5) + 1).toFixed(2) + '%',
      cost: '$' + (Math.random() * 1000 + 100).toFixed(2),
      status: Math.random() > 0.3 ? 'Active' : 'Paused'
    }));

    return { revenueData, channelData, tableData };
  };

  const [data, setData] = useState(generateMockData());

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateMockData());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const MetricCard = ({ title, value, change, icon: Icon, color, loading }) => (
    <div className={`${darkMode ? 'bg-gray-900/60 border-gray-700/30' : 'bg-white/60 border-white/30'} 
      border backdrop-blur-xl rounded-3xl p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:scale-105 
      transform cursor-pointer group relative overflow-hidden`}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {loading ? (
        <div className="animate-pulse relative z-10">
          <div className={`h-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full w-3/4 mb-6`}></div>
          <div className={`h-10 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full w-1/2 mb-3`}></div>
          <div className={`h-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full w-1/4`}></div>
        </div>
      ) : (
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-sm font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</h3>
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} shadow-lg transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-cyan-600 group-hover:bg-clip-text transition-all duration-300`}>{value}</p>
              <div className="flex items-center">
                <div className={`p-1 rounded-full ${change >= 0 ? 'bg-green-100' : 'bg-red-100'} mr-2`}>
                  {change >= 0 ? (
                    <ArrowUp className="w-3 h-3 text-green-600" />
                  ) : (
                    <ArrowDown className="w-3 h-3 text-red-600" />
                  )}
                </div>
                <span className={`text-sm font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(change)}%
                </span>
                <span className={`text-xs ml-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>vs last month</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const LoadingSkeleton = ({ height = "h-64" }) => (
    <div className={`${darkMode ? 'bg-gray-900/60' : 'bg-white/60'} border-0 rounded-3xl p-6 animate-pulse backdrop-blur-xl`}>
      <div className={`${height} bg-gradient-to-r ${darkMode ? 'from-gray-800 via-gray-700 to-gray-800' : 'from-gray-200 via-gray-100 to-gray-200'} rounded-2xl animate-pulse`}></div>
    </div>
  );

  // Filter and sort table data
  const filteredData = data.tableData.filter(item =>
    item.campaign.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (sortField === 'cost') {
      aVal = parseFloat(aVal.replace('$', ''));
      bVal = parseFloat(bVal.replace('$', ''));
    } else if (sortField === 'ctr') {
      aVal = parseFloat(aVal.replace('%', ''));
      bVal = parseFloat(bVal.replace('%', ''));
    }
    
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 relative overflow-hidden ${darkMode ? 'bg-black' : 'bg-gradient-to-br from-violet-50 via-cyan-50 to-fuchsia-50'}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl animate-pulse ${darkMode ? 'bg-purple-500' : 'bg-gradient-to-r from-purple-400 to-pink-400'}`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 blur-3xl animate-pulse delay-1000 ${darkMode ? 'bg-cyan-500' : 'bg-gradient-to-r from-cyan-400 to-blue-400'}`}></div>
        <div className={`absolute top-1/2 left-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl animate-spin duration-[20s] ${darkMode ? 'bg-emerald-500' : 'bg-gradient-to-r from-emerald-400 to-teal-400'}`}></div>
      </div>
      
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white/70 border-white/20'} 
        border-b backdrop-blur-xl sticky top-0 z-50 transition-all duration-300 shadow-lg shadow-black/5`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-3 rounded-2xl shadow-lg transform hover:scale-110 transition-all duration-300">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <h1 className={`text-3xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent animate-pulse`}>
                  ADmyBRAND Insights
                </h1>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  ✨ AI-Powered Analytics Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className={`group p-3 rounded-xl ${darkMode ? 'bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700/50' : 'bg-white/80 hover:bg-white border border-white/20'} 
                transition-all duration-300 hover:scale-110 backdrop-blur-sm shadow-lg hover:shadow-xl`}>
                <Download className={`w-5 h-5 ${darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-800'} transition-colors duration-200`} />
              </button>
              <button
                onClick={toggleDarkMode}
                className={`group p-3 rounded-xl ${darkMode ? 'bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700/50' : 'bg-white/80 hover:bg-white border border-white/20'} 
                  transition-all duration-300 hover:scale-110 backdrop-blur-sm shadow-lg hover:shadow-xl relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-200 relative z-10" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors duration-200 relative z-10" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value="$245,890"
            change={12.5}
            icon={DollarSign}
            color="from-green-500 to-emerald-600"
            loading={loading}
          />
          <MetricCard
            title="Active Users"
            value="18,432"
            change={8.2}
            icon={Users}
            color="from-blue-500 to-cyan-600"
            loading={loading}
          />
          <MetricCard
            title="Conversions"
            value="3,281"
            change={-2.1}
            icon={Target}
            color="from-purple-500 to-pink-600"
            loading={loading}
          />
          <MetricCard
            title="Growth Rate"
            value="15.8%"
            change={5.4}
            icon={TrendingUp}
            color="from-orange-500 to-red-600"
            loading={loading}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Line Chart */}
          <div className={`${darkMode ? 'bg-gray-900/60 border-gray-700/30' : 'bg-white/60 border-white/30'} 
            border backdrop-blur-xl rounded-3xl p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group relative overflow-hidden`}>
            {/* Animated corner accent */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300`}>
                  💹 Revenue Trend
                </h3>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse delay-200"></div>
                  <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse delay-500"></div>
                </div>
              </div>
              {loading ? (
                <LoadingSkeleton />
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={data.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} strokeOpacity={0.3} />
                    <XAxis 
                      dataKey="month" 
                      stroke={darkMode ? '#9ca3af' : '#6b7280'} 
                      fontSize={12}
                      fontWeight="600"
                    />
                    <YAxis 
                      stroke={darkMode ? '#9ca3af' : '#6b7280'} 
                      fontSize={12}
                      fontWeight="600"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '16px',
                        color: darkMode ? '#ffffff' : '#000000',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="url(#revenueGradient)" 
                      strokeWidth={4}
                      dot={{ fill: '#8b5cf6', r: 8, strokeWidth: 3, stroke: '#ffffff' }}
                      activeDot={{ r: 12, fill: '#7c3aed', strokeWidth: 4, stroke: '#ffffff' }}
                    />
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Bar Chart */}
          <div className={`${darkMode ? 'bg-gray-900/60 border-gray-700/30' : 'bg-white/60 border-white/30'} 
            border backdrop-blur-xl rounded-3xl p-8 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 group relative overflow-hidden`}>
            {/* Animated corner accent */}
            <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-gradient-to-tr from-emerald-400 to-teal-600 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-teal-600 group-hover:bg-clip-text transition-all duration-300`}>
                  📊 Monthly Conversions
                </h3>
                <div className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full">
                  <span className="text-xs font-bold text-white">LIVE</span>
                </div>
              </div>
              {loading ? (
                <LoadingSkeleton />
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={data.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} strokeOpacity={0.3} />
                    <XAxis 
                      dataKey="month" 
                      stroke={darkMode ? '#9ca3af' : '#6b7280'} 
                      fontSize={12}
                      fontWeight="600"
                    />
                    <YAxis 
                      stroke={darkMode ? '#9ca3af' : '#6b7280'} 
                      fontSize={12}
                      fontWeight="600"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '16px',
                        color: darkMode ? '#ffffff' : '#000000',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                      }}
                    />
                    <Bar dataKey="conversions" fill="url(#barGradient)" radius={[12, 12, 0, 0]} />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="50%" stopColor="#059669" />
                        <stop offset="100%" stopColor="#047857" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Channel Performance & Data Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pie Chart */}
          <div className={`${darkMode ? 'bg-gray-900/60 border-gray-700/30' : 'bg-white/60 border-white/30'} 
            border backdrop-blur-xl rounded-3xl p-8 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 group relative overflow-hidden`}>
            {/* Floating elements */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
            <div className="absolute bottom-4 left-4 w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-rose-600 group-hover:bg-clip-text transition-all duration-300`}>
                  🎯 Channel Performance
                </h3>
                <div className="relative">
                  <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-ping absolute"></div>
                  <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"></div>
                </div>
              </div>800 border-gray-700' : 'bg-white border-gray-200'} 
            border rounded-2xl p-6 hover:shadow-xl transition-all duration-300`}>
            <h3 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Channel Performance
            </h3>
            {loading ? (
              <LoadingSkeleton height="h-48" />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data.channelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                        borderRadius: '12px',
                        color: darkMode ? '#ffffff' : '#000000'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {data.channelData.map((channel, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: channel.color }}
                        ></div>
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {channel.name}
                        </span>
                      </div>
                      <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {channel.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Data Table */}
          <div className={`lg:col-span-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
            border rounded-2xl p-6 hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Campaign Performance
              </h3>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 pr-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  />
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-12 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b`}>
                        {['Campaign', 'Date', 'Impressions', 'Clicks', 'CTR', 'Cost', 'Status'].map((header) => (
                          <th
                            key={header}
                            onClick={() => handleSort(header.toLowerCase())}
                            className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80 transition-all duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedData.map((row, index) => (
                        <tr key={row.id} className={`hover:bg-opacity-50 transition-all duration-200 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                          <td className={`px-4 py-3 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {row.campaign}
                          </td>
                          <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {row.date}
                          </td>
                          <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {row.impressions.toLocaleString()}
                          </td>
                          <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {row.clicks.toLocaleString()}
                          </td>
                          <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {row.ctr}
                          </td>
                          <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {row.cost}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              row.status === 'Active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} results
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} 
                        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className={`px-4 py-2 text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} 
                        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;