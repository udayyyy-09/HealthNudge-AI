"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";
import {
  Home,
  Package,
  Menu,
  BarChart3,
  Settings,
  CreditCard,
  Users,
  HelpCircle,
  Activity,
  Calendar,
  Target,
  TrendingUp,
  TrendingDown,
  Clock,
  Droplets,
  Utensils,
  Dumbbell,
  Zap,
  Upload,
  CloudUpload,
  Award,
  Heart,
  Moon,
  Sun,
  Laptop,
} from "lucide-react";
import { useRouter } from "next/navigation";
// Enhanced Vertical Navbar Component

const VerticalNavbar = ({ activeSection, setActiveSection }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [login, setLogin] = useState(false);
  const router = useRouter();

  const mainMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "health-entries", label: "Health Entries", icon: Activity },
    { id: "Upload Report", label: "Upload Report", icon: CloudUpload },
    { id: "Diet Plan", label: "Diet Plan", icon: Utensils },
    { id: "Home", label: "Home", icon: Laptop },
  ];

  const otherMenuItems = [
    { id: "settings", label: "Settings", icon: Settings },
    { id: "profile", label: "Profile", icon: Users },
    { id: "help", label: "Help", icon: HelpCircle },
  ];

  return (
    <div
      className={`bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } min-h-screen flex flex-col fixed left-0 top-0 z-40 border-r border-slate-700`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">HealthNudge</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-300" />
          </button>
        </div>
      </div>

      {/* Main Menu */}
      <div className="flex-1 py-4">
        <div className="px-4">
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
              MENU
            </h3>
          )}
          <nav className="space-y-2">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`cursor-pointer w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg transform scale-105"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-white" : "text-slate-400"
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Other Menu Items */}
        <div className="px-4 mt-8">
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
              OTHER
            </h3>
          )}
          <nav className="space-y-2">
            {otherMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-white" : "text-slate-400"
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Profile Section */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3 bg-slate-700 p-3 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">U</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">User</p>
              <p className="text-xs text-slate-400">user@example.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Statistics Card Component
const StatCard = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  gradient,
  bgColor,
}) => (
  <div
    className={`bg-gradient-to-br ${gradient} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20`}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-white/90 mb-2">{title}</h3>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        <p
          className={`text-sm flex items-center ${
            changeType === "up" ? "text-green-200" : "text-red-200"
          }`}
        >
          {changeType === "up" ? (
            <TrendingUp className="w-4 h-4 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 mr-1" />
          )}
          {change}
        </p>
      </div>
      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

// Circular Progress Component
const CircularProgress = ({ value, max, color, size = 80 }) => {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 28;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-gray-200"
        />
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`transition-all duration-1000 ease-out ${color}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800">
            {Math.round(percentage)}%
          </p>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const router = useRouter();

  const [activeSection, setActiveSection] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState({
    averageSleepHours: 0,
    averageWaterIntake: 0,
    mostFrequentMeal: "-",
    mostCommonExercise: "-",
    totalLogs: 0,
  });
  const [logs, setLogs] = useState([]);
  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState(false);
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/health/summary`,
          {
            withCredentials: true,
          }
        );

        setUser(res.data.user);
        setSummary(res.data.summary);
        setLogs(res.data.logs);
        setTip(res.data.tip);
        setLogin(true);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setLogin(true);
        }
      } finally {
        setLoading(false);
        // setLogin(false);
      }
    };

    fetchDashboard();
  }, []);

  // Enhanced chart data
  const chartData = logs.map((log) => ({
    date: new Date(log.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    sleep: log.sleepHours,
    water: log.waterIntake,
    exercise: log.exercise === "Running" ? 1 : log.exercise === "Gym" ? 2 : 0.5,
    meals: log.meals,
  }));

  const pieData = [
    { name: "Sleep", value: summary.averageSleepHours * 10, color: "#8B5CF6" },
    { name: "Water", value: summary.averageWaterIntake * 10, color: "#06B6D4" },
    { name: "Exercise", value: 25, color: "#10B981" },
    { name: "Nutrition", value: 20, color: "#F59E0B" },
  ];

  // Calculate health score
  const calculateHealthScore = () => {
    const sleepScore = Math.min((summary.averageSleepHours / 8) * 100, 100);
    const waterScore = Math.min((summary.averageWaterIntake / 10) * 100, 100);
    const activityScore = logs.length > 0 ? 85 : 0; // Default scoring

    return Math.round((sleepScore + waterScore + activityScore) / 3);
  };

  const healthScore = calculateHealthScore();

  if (!login && !loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-transparent backdrop-blur-md z-50">
        <div className="text-center bg-white shadow-lg rounded-xl p-8 max-w-md border">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Oops! 😕</h1>
          <p className="text-gray-700 text-lg">You are not logged in.</p>
          <p
            className="text-gray-600 cursor-pointer "
            onClick={() => {
              router.push("/login");
            }}
          >
            Please click to continue.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex">
        <VerticalNavbar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <div className="flex-1 ml-64 p-6 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="animate-pulse">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-64 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-gray-200 to-gray-300 h-32 rounded-2xl"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
            {/* Enhanced Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                  Health Dashboard
                </h1>
                <p className="text-slate-600 text-lg">
                  Welcome back, {user?.name || "User"}! Let's check your
                  progress.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                  <p className="text-sm font-semibold text-slate-700">
                    Goal: {user?.goal || "Not set"}
                  </p>
                  <p className="text-sm text-slate-600">
                    Age: {user?.age || "Not set"}
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced AI Tip */}
            {tip && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 mb-8 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-amber-800 text-lg">
                      💡 AI Health Insight
                    </p>
                    <p className="text-amber-700">{tip}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Health Score"
                value={`${healthScore}%`}
                change="+2.1% vs last week"
                changeType="up"
                icon={Award}
                gradient="from-violet-500 to-purple-600"
              />
              <StatCard
                title="Sleep Quality"
                value={`${summary.averageSleepHours}h`}
                change="+0.3h improvement"
                changeType="up"
                icon={Moon}
                gradient="from-blue-500 to-cyan-500"
              />
              <StatCard
                title="Water Intake"
                value={`${summary.averageWaterIntake}L`}
                change="+0.2L daily avg"
                changeType="up"
                icon={Droplets}
                gradient="from-cyan-500 to-teal-500"
              />
              <StatCard
                title="Active Days"
                value={`${logs.length}`}
                change="7 day streak"
                changeType="up"
                icon={Activity}
                gradient="from-green-500 to-emerald-500"
              />
            </div>

            {/* Enhanced Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
              {/* Advanced Line Chart */}
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-800">
                    Health Trends
                  </h3>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
                      <span className="text-sm text-slate-600 font-medium">
                        Sleep
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                      <span className="text-sm text-slate-600 font-medium">
                        Water
                      </span>
                    </div>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="sleepGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8B5CF6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8B5CF6"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="waterGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#06B6D4"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#06B6D4"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "#64748B", fontSize: 12 }}
                      />
                      <YAxis tick={{ fill: "#64748B", fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "none",
                          borderRadius: "12px",
                          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="sleep"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        fill="url(#sleepGradient)"
                      />
                      <Area
                        type="monotone"
                        dataKey="water"
                        stroke="#06B6D4"
                        strokeWidth={3}
                        fill="url(#waterGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Enhanced Pie Chart */}
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                <h3 className="text-xl font-bold text-slate-800 mb-6">
                  Health Score Breakdown
                </h3>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={50}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "none",
                          borderRadius: "12px",
                          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {pieData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm font-medium text-slate-700">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Metrics Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-800">
                    Sleep Quality
                  </h3>
                  <Moon className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex items-center justify-center mb-4">
                  <CircularProgress
                    value={summary.averageSleepHours}
                    max={8}
                    color="text-blue-500"
                    size={120}
                  />
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-800">
                    {summary.averageSleepHours}h
                  </p>
                  <p className="text-sm text-slate-600">Daily Average</p>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-800">
                    Hydration
                  </h3>
                  <Droplets className="w-6 h-6 text-cyan-500" />
                </div>
                <div className="flex items-center justify-center mb-4">
                  <CircularProgress
                    value={summary.averageWaterIntake}
                    max={3}
                    color="text-cyan-500"
                    size={120}
                  />
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-800">
                    {summary.averageWaterIntake}L
                  </p>
                  <p className="text-sm text-slate-600">Daily Average</p>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-800">Activity</h3>
                  <Activity className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex items-center justify-center mb-4">
                  <CircularProgress
                    value={85}
                    max={100}
                    color="text-green-500"
                    size={120}
                  />
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-800">85%</p>
                  <p className="text-sm text-slate-600">Weekly Goal</p>
                </div>
              </div>
            </div>

            {/* Enhanced Summary Insights */}
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                Health Patterns & Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                      <Utensils className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-orange-800">
                        Most Frequent Meal
                      </p>
                      <p className="text-orange-700 text-lg">
                        {summary.mostFrequentMeal}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                      <Dumbbell className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-green-800">
                        Favorite Exercise
                      </p>
                      <p className="text-green-700 text-lg">
                        {summary.mostCommonExercise}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">
              {activeSection.charAt(0).toUpperCase() +
                activeSection.slice(1).replace("-", " ")}
            </h1>
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
              <p className="text-slate-600">
                Content for {activeSection.replace("-", " ")} will be displayed
                here.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-100 to-blue-100">
      <VerticalNavbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="flex-1 ml-64 overflow-auto">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
