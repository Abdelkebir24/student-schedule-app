import { useEffect, useState } from "react"
import api from "../api/axios";
import { Plus, Trash2, ClipboardList } from "lucide-react";

function Assignments() {

    const [assignments, setAssignments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [showFormAssignment, setShowFormAssignment] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        course_id: "",
        title: "",
        description: "",
        due_date: "",
    })

    const fetchAssignmentsCourses = async () => {
        try {
            setLoading(true);
            const [assignmentsResponse, coursesResponse] = await Promise.all([
                api.get("/assignments"),
                api.get("/courses")
            ]);
            setAssignments(assignmentsResponse.data);
            setCourses(coursesResponse.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAssignmentsCourses();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/assignments", formData);
            fetchAssignmentsCourses();
            setShowFormAssignment(false);
            setFormData({ course_id: "", title: "", description: "", due_date: "" });
        } catch (error) {
            console.error(error);
        }
    }

    const handleDelete = async (assignmentId) => {
        try {
            if (confirm("Delete this assignment?")) {
                await api.delete(`/assignments/${assignmentId}`);
                fetchAssignmentsCourses();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleToggleStatus = async (assignmentId) => {
        const assignment = assignments.find((a) => a.id === assignmentId);
        const newStatus = assignment.status === "done" ? "pending" : "done";
        setAssignments(assignments.map((a) => 
            a.id === assignmentId ? {...a, status: newStatus} : a
        ));
        try {
            await api.put(`/assignments/${assignment.id}`, {status: newStatus});
        } catch (error) {
            console.error(error);
        }
    }

    if (loading) {
        return <p className="text-sm text-gray-400">Loading...</p>
    }

    const isOverdue = (dueDate, status) => status !== "done" && new Date(dueDate) < new Date().setHours(0,0,0,0);

    return (
        <div>
            { 
                !showFormAssignment && (
                    assignments.length === 0 ? 
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <ClipboardList className="w-8 h-8 text-gray-300 mb-3" />
                            <h3 className="text-[15px] font-medium text-gray-900 mb-1">No assignments yet</h3>
                            <p className="text-[13px] text-gray-500 mb-4">Keep track of homework and deadlines here.</p>
                            <button 
                                className="flex items-center gap-1.5 text-sm text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                onClick={() => setShowFormAssignment(true)}
                            >
                                <Plus className="w-4 h-4" /> Add assignment
                            </button>
                        </div> 
                : <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-[15px] font-medium text-gray-900">Assignments</h3>
                            <button 
                                className="flex items-center gap-1.5 text-sm text-white bg-blue-500 px-3.5 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                onClick={() => setShowFormAssignment(true)}
                            >
                                <Plus className="w-4 h-4" /> Add assignment
                            </button>
                        </div>
                        <div className="space-y-2">
                            {
                                assignments.map((assignment) => 
                                    <div 
                                        key={assignment.id}
                                        className={`flex items-center justify-between bg-white border rounded-lg px-4 py-3 ${
                                            isOverdue(assignment.due_date, assignment.status) ? "border-red-200" : "border-gray-200"
                                        } ${assignment.status === "done" ? "opacity-60" : ""}`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <input 
                                                type="checkbox" 
                                                className="w-4 h-4"
                                                checked={assignment.status === "done"}
                                                onChange={() => handleToggleStatus(assignment.id)}
                                            />
                                            <div className="min-w-0">
                                                <p className={`text-[14px] font-medium truncate ${assignment.status === "done" ? "text-gray-400 line-through" : "text-gray-900"}`}>
                                                    {assignment.title}
                                                </p>
                                                <p className={`text-[13px] ${isOverdue(assignment.due_date, assignment.status) ? "text-red-600" : "text-gray-500"}`}>
                                                    {assignment.course.name} · {isOverdue(assignment.due_date, assignment.status) ? "Overdue · " : ""}Due {assignment.due_date}
                                                </p>
                                            </div>
                                        </div>

                                        <button 
                                            className="flex items-center gap-1 text-[13px] text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                                            onClick={() => handleDelete(assignment.id)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Delete
                                        </button>
                                    </div>)
                            }
                        </div>
                  </div>)  
            }

            {showFormAssignment && <form onSubmit={handleSubmit} className="max-w-md">
                <h1 className="text-[15px] font-medium text-gray-900 mb-5">New assignment</h1>

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
                        <label className="text-[13px] text-gray-500 block mb-1" htmlFor="title">Title</label>
                        <input 
                            className="px-3 py-2 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                            type="text" name="title" id="title" placeholder="Chapter 5 exercises"
                            value={formData.title} onChange={handleChange} required
                        />
                    </div>

                    <div>
                        <label className="text-[13px] text-gray-500 block mb-1" htmlFor="description">Description</label>
                        <input 
                            className="px-3 py-2 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                            type="text" name="description" id="description" placeholder="Optional details"
                            value={formData.description} onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="text-[13px] text-gray-500 block mb-1" htmlFor="due_date">Due date</label>
                        <input 
                            className="px-3 py-2 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                            type="date" name="due_date" id="due_date"
                            value={formData.due_date} onChange={handleChange} required
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        className="px-4 rounded-md bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all py-2 text-sm font-medium text-white"
                        type="submit"
                    >
                        Add assignment
                    </button>
                    <button 
                        type="button"
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={() => setShowFormAssignment(false)} 
                    >
                        Cancel
                    </button>
                </div>
            </form>}
        </div>
    )
}

export default Assignments