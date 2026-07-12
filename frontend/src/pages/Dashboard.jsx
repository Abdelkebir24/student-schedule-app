import { useEffect, useState } from "react";
import api from "../api/axios";
import { CalendarClock } from "lucide-react";

export default function Dashboard() {

    const [todayClasses, setTodayClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    // for get today name like "Monday"
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

    // start useEffect 
    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                setLoading(true);
                const response = await api.get("/schedules");
                setTodayClasses(
                    response.data
                        .filter((schedule) => schedule.day === today)
                        .sort((a, b) => a.start_time.localeCompare(b.start_time))
                )
            } catch(error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchSchedules();
    }, [])
    // end useEffect 

    // ------ loiding ...
    if (loading) {
        return <p className="text-sm text-gray-400">Loading...</p>
    }

    return (
        <div>
            <h1 className="text-[15px] font-medium text-gray-900 mb-6">Dashboard</h1>

            <div className="bg-white border border-gray-200 rounded-lg p-5 max-w-md">
                <div className="flex items-center gap-2 mb-4">
                    <CalendarClock className="w-4 h-4 text-blue-500" />
                    <h2 className="text-[14px] font-medium text-gray-900">Today · {today}</h2>
                </div>

                {todayClasses.length === 0 ? (
                    <p className="text-[13px] text-gray-400">No classes today.</p>
                ) : (
                    <div className="space-y-2">
                        {todayClasses.map((schedule) => (
                            <div 
                                key={schedule.id} 
                                className="border-l-4 rounded-md bg-gray-50 px-3 py-2"
                                style={{ borderLeftColor: schedule.course.color }}
                            >
                                <p className="text-[13px] font-medium text-gray-900">{schedule.course.name}</p>
                                <p className="text-[12px] text-gray-500">{schedule.start_time} - {schedule.end_time} · {schedule.room}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}