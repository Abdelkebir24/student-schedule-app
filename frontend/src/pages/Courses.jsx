import { useEffect, useState } from "react"
import api from "../api/axios";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";

function Courses() {

    const [courses, setCourses] = useState([]);
    const [showFormCourse, setShowFormCourse] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        professor: "",
        color: "#3B82F6",
    });

    const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await api.get("/courses");
                setCourses(response.data);
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false);
            }
    }

    useEffect(() => {
        fetchCourses();
    }, [])

    const handleDelete = async (id) => {
        try {
            if(confirm("Delete this course?")) {
                await api.delete(`/courses/${id}`);
                fetchCourses();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const resetForm = () => {
        setFormData({ name: "", code: "", professor: "", color: "#3B82F6" })
    }

    const resetAndRefresh = () => {
        fetchCourses();
        resetForm();
        setEditingId(null);
        setShowFormCourse(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/courses/${editingId}`, formData);
            } else {
                await api.post("/courses", formData);
            }
            resetAndRefresh();
        } catch (error) {
            console.error(error);
        }
    }

    const handleEdit = (course) => {
        setEditingId(course.id);
        setFormData({
            name: course.name,
            code: course.code,
            professor: course.professor,
            color: course.color
        })
        setShowFormCourse(true);
    }

    const handleCancelForm = () => {
        resetForm();
        setEditingId(null);
        setShowFormCourse(false);
    }

    if (loading) {
        return <p className="text-sm text-gray-400">Loading...</p>
    }

    return (
        <div>

            {!showFormCourse && ( courses.length === 0 ? 
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <BookOpen className="w-8 h-8 text-gray-300 mb-3" />
                    <h3 className="text-[15px] font-medium text-gray-900 mb-1">No courses yet</h3>
                    <p className="text-[13px] text-gray-500 mb-4">Add your courses to start building your schedule.</p>
                    <button 
                        className="flex items-center gap-1.5 text-sm text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                        onClick={() => setShowFormCourse(true)} 
                    >
                        <Plus className="w-4 h-4" /> Add course
                    </button>
                </div>
            :<div>
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-[15px] font-medium text-gray-900">My courses</h3>
                    <button 
                        onClick={() => setShowFormCourse(true)} 
                        className="flex items-center gap-1.5 text-sm text-white bg-blue-500 px-3.5 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add course
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {
                        courses.map((c) => (
                            <CoursesCards 
                                key={c.id} 
                                course={c} 
                                handleEdit={handleEdit} 
                                handleDelete={handleDelete} 
                            />
                        ))
                    }
                </div>
            </div>)}
            

            {showFormCourse && <form onSubmit={handleSubmit} className="max-w-md">
                <h1 className="text-[15px] font-medium text-gray-900 mb-5">{editingId ? "Edit course" : "New course"}</h1>

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="text-[13px] text-gray-500 block mb-1" htmlFor="name">Course name</label>
                        <input 
                            className="px-3 py-2 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                            type="text" name="name" id="name" placeholder="Mathematics"
                            value={formData.name} onChange={handleChange} required
                        />
                    </div>

                    <div>
                        <label className="text-[13px] text-gray-500 block mb-1" htmlFor="code">Code</label>
                        <input 
                            className="px-3 py-2 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                            type="text" name="code" id="code" placeholder="MATH101"
                            value={formData.code} onChange={handleChange} required
                        />
                    </div>

                    <div>
                        <label className="text-[13px] text-gray-500 block mb-1" htmlFor="professor">Professor</label>
                        <input 
                            className="px-3 py-2 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                            type="text" name="professor" id="professor" placeholder="Dr. Smith"
                            value={formData.professor} onChange={handleChange} required
                        />
                    </div>

                    <div>
                        <label className="text-[13px] text-gray-500 block mb-1" htmlFor="color">Color</label>
                        <input 
                            className="border border-gray-300 rounded-md w-14 h-9" 
                            type="color" name="color" id="color"
                            value={formData.color} onChange={handleChange} required
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        className="px-4 rounded-md bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all py-2 text-sm font-medium text-white"
                        type="submit"
                    >
                        {editingId ? "Save changes" : "Add course"}
                    </button>

                    <button 
                        type="button"
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={handleCancelForm} 
                    >
                        Cancel
                    </button>
                </div>
            </form>}
        </div>
        
    )
}

const CoursesCards = ({course, handleEdit, handleDelete}) => {
    return (
        <div 
            className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors border-l-4"
            style={{ borderLeftColor: course.color }}
        >
            <h3 className="text-[14px] font-medium text-gray-900">{course.name}</h3>
            <p className="text-[13px] text-gray-500 mb-4">{course.professor}</p>
            <div className="flex items-center gap-4">
                <button 
                    className="flex items-center gap-1 text-[13px] text-gray-500 hover:text-blue-600 transition-colors"
                    onClick={() => handleEdit(course)}
                >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button 
                    className="flex items-center gap-1 text-[13px] text-gray-500 hover:text-red-600 transition-colors"
                    onClick={() => handleDelete(course.id)}
                >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
            </div>
        </div>
    )
}

export default Courses