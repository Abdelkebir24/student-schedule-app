import { cache, useEffect, useState } from "react";
import api from "../api/axios";


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

    // fetchSchedulesAndCourses function 
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
            console.error(error)
        } finally {
            setLoading(false);
        }
    }

    // start useEffect 
    useEffect(() => {
        fetchSchedulesAndCourses();
    }, []);
    // end useEffect 

    // handleChange 
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })

        console.log(e.target.value);
    }

    // handleSubmit function 
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await api.post("/schedules", formData);
            fetchSchedulesAndCourses();
            setShowFormSchedule(false);
            setFormData({
                course_id: "",
                day: "",
                start_time: "",
                end_time: "",
                room: "",
            })
        } catch (error) {
            console.error(error);
        }
    }

    // handleDelete function 
    const handeDelete = async (scheduleId) => {
        try {
            if (confirm("Are you sure?")) {
                await api.delete(`/schedules/${scheduleId}`);
                fetchSchedulesAndCourses();
            }
        } catch (error) {
            console.error(error)
        }
    }

    // ----- loading
    if (loading) {
        return <p>Loading ...</p>
    }

    return (
        <>

            {
                !showFormSchedule && (
                    schedules.length === 0 ? 
                    <div className="flex items-center space-x-3 mt-3">
                        <h3 className="text-lg font-bold text-gray-400">No schedules yet — </h3>
                        <button 
                            className="text-blue-500 border-b-2 text-sm hover:text-blue-400 transition-colors"
                            onClick={() => setShowFormSchedule(true)} 
                        >
                            add your first one!
                        </button>
                    </div> 
                    : <div>
                        <div className="flex justify-between items-center px-3 mb-4">
                            <h3 className="text-lg font-bold text-gray-400">My Schedule 📆</h3>
                            <button onClick={() => setShowFormSchedule(true)} className="text-white bg-blue-500 px-3 py-2 rounded-lg text-sm hover:bg-blue-400 transition-colors">
                                Add new schedule
                            </button>
                        </div>
                        {/* schedule  */}
                        <div className="grid grid-cols-6 border  border-gray-300">
                            {days.map((d, i) => 
                                <div key={i} className="border border-gray-300">
                                    <h2 className="bg-gray-500 text-center text-white font-lg py-2 ">{d}</h2>
                                    <div className="">
                                        {
                                            schedules.filter((schedule) => schedule.day === d)
                                                .map((schedule) => 
                                                    <div key={schedule.id} className="bg-gray-100 m-2 p-3 text-sm text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                                                        <h2 className="font-bold">{schedule.course.name}</h2>
                                                        <p>{schedule.course.professor}</p>
                                                        <p>{schedule.start_time} - {schedule.end_time}</p>
                                                        <p>{schedule.room}</p>
                                                        <div className="flex justify-end">
                                                            {/* delete button  */}
                                                            <button 
                                                                className="text-red-600 text-sm underline cursor-pointer hover:text-red-500 transition-colors"
                                                                onClick={() => handeDelete(schedule.id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>)
                                        }
                                    </div>
                                </div>)}
                        </div>
                      </div>

                      
                )
            }

            {/* start add schedule form  */}
            {showFormSchedule && <form onSubmit={handleSubmit}>
                <div className="rounded-lg px-5 py-4">
                    {/* <!-- title  --> */}
                    <h1 className="text-3xl font-bold text-gray-500 my-3">Schedule Form</h1>

                    <div className="my-4 grid grid-cols-1 gap-4">
                        {/* <!-- course id  --> */}
                        <div className="mb-3">
                            <label className="text-sm text-gray-500 block mb-1" htmlFor="course_id">Course name</label>
                            <select 
                                className="px-2 py-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                                name="course_id" 
                                id="course_id" 
                                value={formData.course_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select course name</option>
                                {
                                    courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)
                                }
                            </select>
                        </div>

                        {/* <!-- day  --> */}
                        <div className="mb-3">
                            <label className="text-sm text-gray-500 block mb-1" htmlFor="day">Day</label>
                            <select 
                                className="px-2 py-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                                name="day" 
                                id="day" 
                                value={formData.day}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select Day</option>
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                                <option value="Saturday">Saturday</option>
                            </select>
                        </div>

                        {/* <!-- start time  --> */}
                        <div className="mb-3">
                            <label className="text-sm text-gray-500 block mb-1" htmlFor="start-time">Start Time</label>
                            <input 
                                className="px-2 py-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                                type="time" 
                                name="start_time" 
                                id="start-time" 
                                value={formData.start_time}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* <!-- end time  --> */}
                        <div className="mb-3">
                            <label className="text-sm text-gray-500 block mb-1" htmlFor="end-time">End Time</label>
                            <input 
                                className="px-2 py-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                                type="time" 
                                name="end_time" 
                                id="end-time" 
                                value={formData.end_time}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* <!-- room  --> */}
                        <div className="mb-3">
                            <label className="text-sm text-gray-500 block mb-1" htmlFor="room">Room</label>
                            <input 
                                className="px-2 py-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                                type="text" 
                                name="room" 
                                id="room" 
                                value={formData.room}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* <!-- submit and cancel buttons  --> */}
                    <div className="flex justify-start items-center gap-10">
                        <button 
                            className="px-4 rounded-lg bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all py-2 text-white mb-3"
                            type="submit"
                        >
                            Add new Schedule
                        </button>

                        <span 
                            className="text-red-500 hover:text-red-400 border-b-1 active:scale-95 transition-all mb-3 cursor-pointer"
                            onClick={() => setShowFormSchedule(false)} 
                        >
                            Cancel
                        </span>
                    </div>
                </div>
            </form>}
            {/* end add schedule form  */}

            
        </>
    )
}

export default Schedule