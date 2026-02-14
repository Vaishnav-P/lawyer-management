import React, { useState } from 'react';
import {
    Home,
    Users,
    Briefcase,
    Settings,
    LogOut,
    Bell,
    Search,
    Menu,
    X,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle,
    MoreVertical,
    ChevronRight
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');

    const stats = [
        { title: 'Total Clients', value: '1,248', change: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
        { title: 'Active Cases', value: '86', change: '+5%', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
        { title: 'Pending Tasks', value: '23', change: '-2%', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
        { title: 'Revenue (Monthly)', value: '$42,500', change: '+8%', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    ];

    const recentCases = [
        { id: '#CS-2024-001', client: 'Sarah Johnson', type: 'Corporate Litigation', status: 'Active', date: '2024-02-14' },
        { id: '#CS-2024-002', client: 'Michael Chen', type: 'Intellectual Property', status: 'Pending', date: '2024-02-13' },
        { id: '#CS-2024-003', client: 'Emma Davis', type: 'Family Law', status: 'Closed', date: '2024-02-12' },
        { id: '#CS-2024-004', client: 'Robert Wilson', type: 'Real Estate', status: 'Active', date: '2024-02-10' },
    ];

    const activities = [
        { user: 'Admin User', action: 'Updated case status for #CS-2024-001', time: '2 mins ago' },
        { user: 'John Doe', action: 'Uploaded new document for #CS-2024-002', time: '1 hour ago' },
        { user: 'Jane Smith', action: 'Scheduled a meeting with Client X', time: '3 hours ago' },
        { user: 'System', action: 'Automatic backup completed', time: '5 hours ago' },
    ];

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--primary)] font-sans transition-colors duration-300">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-64 bg-[var(--surface)] border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                            L
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-purple-600">
                            LegalSys
                        </span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[var(--secondary)] hover:text-[var(--primary)]">
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: Home },
                        { id: 'users', label: 'Users & Clients', icon: Users },
                        { id: 'cases', label: 'Case Management', icon: Briefcase },
                        { id: 'settings', label: 'Settings', icon: Settings },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                                    ? 'bg-[var(--accent)] text-white shadow-lg shadow-purple-500/20'
                                    : 'text-[var(--secondary)] hover:bg-[var(--surface-highlight)] hover:text-[var(--primary)]'
                                }`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                            {activeTab === item.id && <ChevronRight size={16} className="ml-auto opacity-70" />}
                        </button>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-800">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 min-h-screen transition-all duration-300">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-[var(--surface)]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[var(--secondary)] hover:text-[var(--primary)]">
                            <Menu size={24} />
                        </button>
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--secondary)]" size={18} />
                            <input
                                type="text"
                                placeholder="Search cases, clients..."
                                className="pl-10 pr-4 py-2 rounded-lg bg-[var(--background)] border-none focus:ring-2 focus:ring-[var(--accent)]/50 w-64 text-sm transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <button className="relative p-2 text-[var(--secondary)] hover:text-[var(--primary)] hover:bg-[var(--surface-highlight)] rounded-full transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--surface)]"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                                AD
                            </div>
                            <span className="hidden sm:block text-sm font-medium">Admin User</span>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                            <p className="text-[var(--secondary)]">Welcome back, here's what's happening today.</p>
                        </div>
                        <button className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20 text-sm font-medium">
                            + New Case
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div key={index} className="p-6 rounded-2xl bg-[var(--surface)] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-[var(--secondary)]">{stat.title}</p>
                                        <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                                    </div>
                                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                                        <stat.icon size={20} className={stat.color} />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-1 text-xs">
                                    <span className={stat.change.startsWith('+') ? 'text-green-500 font-medium' : 'text-red-500 font-medium'}>
                                        {stat.change}
                                    </span>
                                    <span className="text-[var(--secondary)]">from last month</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Cases */}
                        <div className="lg:col-span-2 bg-[var(--surface)] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                                <h3 className="font-bold text-lg">Recent Cases</h3>
                                <button className="text-sm text-[var(--accent)] hover:underline">View All</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-[var(--surface-highlight)] text-[var(--secondary)]">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Case ID</th>
                                            <th className="px-6 py-3 font-medium">Client</th>
                                            <th className="px-6 py-3 font-medium">Type</th>
                                            <th className="px-6 py-3 font-medium">Status</th>
                                            <th className="px-6 py-3 font-medium">Date</th>
                                            <th className="px-6 py-3 font-medium"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {recentCases.map((item, index) => (
                                            <tr key={index} className="hover:bg-[var(--surface-highlight)]/50 transition-colors">
                                                <td className="px-6 py-4 font-medium">{item.id}</td>
                                                <td className="px-6 py-4">{item.client}</td>
                                                <td className="px-6 py-4 text-[var(--secondary)]">{item.type}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                            item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                                'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-[var(--secondary)]">{item.date}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-[var(--secondary)] hover:text-[var(--primary)]">
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recent Activities */}
                        <div className="bg-[var(--surface)] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                            <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
                            <div className="space-y-6">
                                {activities.map((activity, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="w-2 h-2 rounded-full bg-[var(--accent)] ring-4 ring-[var(--surface-highlight)]"></div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{activity.action}</p>
                                            <p className="text-xs text-[var(--secondary)] mt-1">
                                                <span className="font-semibold text-[var(--primary)]">{activity.user}</span> • {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-2 text-sm text-[var(--secondary)] hover:text-[var(--primary)] border border-slate-200 dark:border-slate-700 rounded-lg transition-colors">
                                View History
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
