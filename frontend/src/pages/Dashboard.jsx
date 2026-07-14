import { useEffect, useState } from "react";
import api from "../api/axios";
import { CalendarClock, ClipboardList } from "lucide-react";

export default function Dashboard() {

    const [todayClasses, setTodayClasses] = useState([]);
    const [upcomingAssignments, setUpcomingAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [schedulesRes, assignmentsRes] = await Promise.all([
                    api.get("/schedules"),
                    api.get("/assignments/upcoming"),
                ]);

                setTodayClasses(
                    schedulesRes.data
                        .filter((s) => s.day === today)
                        .sort((a, b) => a.start_time.localeCompare(b.start_time))
                );
                setUpcomingAssignments(assignmentsRes.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, [])

    if (loading) {
        return <p className="text-sm text-gray-400">Loading...</p>
    }

    return (
        <div>
            <h1 className="text-[15px] font-medium text-gray-900 mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* today's classes */}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <CalendarClock className="w-4 h-4 text-blue-500" />
                        <h2 className="text-[14px] font-medium text-gray-900">Today · {today}</h2>
                    </div>

                    {todayClasses.length === 0 ? (
                        <p className="text-[13px] text-gray-400">No classes today.</p>
                    ) : (
                        <div className="space-y-2">
                            {todayClasses.map((c) => (
                                <div 
                                    key={c.id} 
                                    className="border-l-4 rounded-md bg-gray-50 px-3 py-2"
                                    style={{ borderLeftColor: c.course.color }}
                                >
                                    <p className="text-[13px] font-medium text-gray-900">{c.course.name}</p>
                                    <p className="text-[12px] text-gray-500">{c.start_time} - {c.end_time} · {c.room}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* upcoming assignments */}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <ClipboardList className="w-4 h-4 text-blue-500" />
                        <h2 className="text-[14px] font-medium text-gray-900">Upcoming assignments</h2>
                    </div>

                    {upcomingAssignments.length === 0 ? (
                        <p className="text-[13px] text-gray-400">Nothing due soon.</p>
                    ) : (
                        <div className="space-y-2">
                            {upcomingAssignments.map((assignment) => (
                                <div key={assignment.id} className="flex items-center justify-between px-3 py-2 rounded-md bg-gray-50">
                                    <div>
                                        <p className="text-[13px] font-medium text-gray-900">{assignment.title}</p>
                                        <p className="text-[12px] text-gray-500">{assignment.course.name}</p>
                                    </div>
                                    <span className="text-[12px] text-gray-500">{assignment.due_date}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}