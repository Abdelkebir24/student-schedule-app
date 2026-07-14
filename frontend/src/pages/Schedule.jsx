import { useEffect, useState } from "react";
import api from "../api/axios";
import { Plus, Trash2, CalendarDays } from "lucide-react";

function Schedule() {
    const [schedules, setSchedules] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFormSchedule, setShowFormSchedule] = useState(false);
    const [formData, setFormData] = useState({
        course_id: "",
        day: "",
        start_time: "08:30",
        end_time: "13:30",
        room: "",
    })

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const fetchSchedulesAndCourses = async () => {
        try {
            setLoading(true);
            const [schedulesResponse, coursesResponse] = await Promise.all([
                api.get("/schedules"),
                api.get("/courses")
            ]);
            setSchedules(schedulesResponse.data);
            setCourses(coursesResponse.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSchedulesAndCourses();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/schedules", formData);
            fetchSchedulesAndCourses();
            setShowFormSchedule(false);
            setFormData({ course_id: "", day: "", start_time: "08:30", end_time: "13:30", room: "" })
        } catch (error) {
            console.error(error);
        }
    }

    const handleDelete = async (scheduleId) => {
        try {
            if (confirm("Delete this class?")) {
                await api.delete(`/schedules/${scheduleId}`);
                fetchSchedulesAndCourses();
            }
        } catch (error) {
            console.error(error)
        }
    }

    if (loading) {
        return <p className="text-sm text-gray-400">Loading...</p>
    }

    return (
        <>
            {
                !showFormSchedule && (
                    schedules.length === 0 ? 
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <CalendarDays className="w-8 h-8 text-gray-300 mb-3" />
                        <h3 className="text-[15px] font-medium text-gray-900 mb-1">No classes scheduled</h3>
                        <p className="text-[13px] text-gray-500 mb-4">Build your weekly timetable, one class at a time.</p>
                        <button 
                            className="flex items-center gap-1.5 text-sm text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                            onClick={() => setShowFormSchedule(true)} 
                        >
                            <Plus className="w-4 h-4" /> Add class
                        </button>
                    </div> 
                    : <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-[15px] font-medium text-gray-900">My schedule</h3>
                            <button 
                                onClick={() => setShowFormSchedule(true)} 
                                className="flex items-center gap-1.5 text-sm text-white bg-blue-500 px-3.5 py-2 rounded-md hover:bg-blue-600 transition-colors"
                            >
                                <Plus className="w-4 h-4" /> Add class
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-6 border border-gray-200 rounded-lg overflow-hidden">
                            {days.map((d, i) => 
                                <div key={i} className={`border-gray-200 ${i !== 0 ? "border-t md:border-t-0 md:border-l" : ""}`}>
                                    <h2 className="bg-gray-50 text-center text-gray-700 text-[13px] font-medium py-2.5 border-b border-gray-200">{d}</h2>
                                    <div className="p-2 min-h-[60px]">
                                        {
                                            schedules.filter((schedule) => schedule.day === d)
                                                .map((schedule) => 
                                                    <div 
                                                        key={schedule.id} 
                                                        className="bg-white border-l-4 border border-gray-200 rounded-md p-2.5 text-[12px] text-gray-600 mb-2 hover:border-gray-300 transition-colors"
                                                        style={{ borderLeftColor: schedule.course.color }}
                                                    >
                                                        <p className="font-medium text-gray-900 text-[13px]">{schedule.course.name}</p>
                                                        <p>{schedule.course.professor}</p>
                                                        <p>{schedule.start_time} - {schedule.end_time}</p>
                                                        <p className="mb-1.5">{schedule.room}</p>
                                                        <button 
                                                            className="flex items-center gap-1 text-gray-400 hover:text-red-600 transition-colors"
                                                            onClick={() => handleDelete(schedule.id)}
                                                        >
                                                            <Trash2 className="w-3 h-3" /> Delete
                                                        </button>
                                                    </div>)
                                        }
                                    </div>
                                </div>)}
                        </div>
                      </div>
                )
            }

            {showFormSchedule && <form onSubmit={handleSubmit} className="max-w-md">
                <h1 className="text-[15px] font-medium text-gray-900 mb-5">New class</h1>

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="text-[13px] text-gray-500 block mb-1" htmlFor="course_id">Course</label>
                        <select 
                            className="px-3 py-2 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                            name="course_id" id="course_id"
                            value={formData.course_id} onChange={handleChange} required
                        >
                            <option value="" disabled>Select course</option>
                            {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-[13px] text-gray-500 block mb-1" htmlFor="day">Day</label>
                        <select 
                            className="px-3 py-2 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                            name="day" id="day"
                            value={formData.day} onChange={handleChange} required
                        >
                            <option value="" disabled>Select day</option>
                            {days.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[13px] text-gray-500 block mb-1" htmlFor="start-time">Start</label>
                            <input 
                                className="px-3 py-2 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                                type="time" name="start_time" id="start-time"
                                value={formData.start_time} onChange={handleChange} required
                            />
                        </div>
                        <div>
                            <label className="text-[13px] text-gray-500 block mb-1" htmlFor="end-time">End</label>
                            <input 
                                className="px-3 py-2 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                                type="time" name="end_time" id="end-time"
                                value={formData.end_time} onChange={handleChange} required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[13px] text-gray-500 block mb-1" htmlFor="room">Room</label>
                        <input 
                            className="px-3 py-2 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                            type="text" name="room" id="room" placeholder="Room 12"
                            value={formData.room} onChange={handleChange} required
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        className="px-4 rounded-md bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all py-2 text-sm font-medium text-white"
                        type="submit"
                    >
                        Add class
                    </button>
                    <button 
                        type="button"
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={() => setShowFormSchedule(false)} 
                    >
                        Cancel
                    </button>
                </div>
            </form>}
        </>
    )
}

export default Schedule