import { useEffect, useState } from "react"
import api from "../api/axios";


function Courses() {

    const [courses, setCourses] = useState([]);
    const [showFormCourse, setShowFormCourse] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        professor: "",
        // default color 
        color: "#fdfdfd",
    });

    // fetchCourses function 
    const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await api.get("/courses");
                setCourses(response.data);
                console.log("from courses api");
                console.log(response.data);
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false);
            }
    }

    // start useEffect 
    useEffect(() => {
        fetchCourses();
    }, [])
    // end useEffect 

    // handleDelete function 
    const handleDelete = async (id) => {
        try {
            if(confirm("Are you sure?")) {
                const response = await api.delete(`/courses/${id}`);
                fetchCourses();
            }
        } catch (error) {
            console.error(error);
        }
    }

    // handleChange function 
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    // resetForm Function
    const resetForm = () => {
        setFormData({
            name: "",
            code: "",
            professor: "",
            color: "#fdfdfd",
        })
    }

    // resetFormWithfetchCoursesAndSetShowFormCourseAndSetEditingId function 
    const resetAndRefresh = () => {
        fetchCourses();
        resetForm();
        setEditingId(null);
        setShowFormCourse(false);
    }

    // handleSubmit - name, code, professor, color 
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editingId) {
            try {
                const response = await api.put(`/courses/${editingId}`, formData);
                resetAndRefresh();
            } catch (error) {
                console.error(error);
            }
        }
        else {
            try {
                const response = await api.post("/courses", formData);
                resetAndRefresh();
            } catch (error) {
                console.log(error);
            }
        }
    }

    // handleEdit function 
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

    // handleCancelForm function 
    const handleCancelForm = () => {
        resetForm();
        setEditingId(null);
        setShowFormCourse(false);
    }

    // ----- loading
    if (loading) {
        return (
            <p>Loading ...</p>
        )
    }

    return (
        <div>

            {/* start courses cards  */}
            {!showFormCourse && ( courses.length === 0 ? 
                <div className="flex items-center space-x-3 mt-3">
                    <h3 className="text-lg font-bold text-gray-400">No courses yet — </h3>
                    <button 
                        className="text-blue-500 border-b-2 text-sm hover:text-blue-400 transition-colors"
                        onClick={() => setShowFormCourse(true)} 
                    >
                        add your first one!
                    </button>
                </div>
            :<div>
                <div className="flex justify-between items-center px-3">
                    <h3 className="text-lg font-bold text-gray-400">My Courses 📖📘</h3>
                    <button onClick={() => setShowFormCourse(true)} className="text-white bg-blue-500 px-3 py-2 rounded-lg text-sm hover:bg-blue-400 transition-colors">
                        Add new course
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-2 py-4 mt-4">
                    {
                        courses.map(((c) => (
                            <CoursesCards 
                                key={c.id} 
                                course={c} 
                                handleEdit={handleEdit} 
                                handleDelete={handleDelete} 
                            />))
                        ) 
                    }
                </div>
            </div>)}
            {/* end courses cards  */}
            

            {/* start add course form  */}
            {showFormCourse && <form onSubmit={handleSubmit}>
                <div className="rounded-lg px-5 py-4">
                    {/* <!-- title  --> */}
                    <h1 className="text-3xl font-bold text-gray-500 my-3">Course Form</h1>

                    <div className="my-4 grid grid-cols-1 gap-4">
                        {/* <!-- name  --> */}
                        <div className="mb-3">
                            <label className="text-sm text-gray-500 block mb-1" htmlFor="name">Course Name</label>
                            <input 
                                className="px-2 py-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                                type="text" 
                                name="name" 
                                id="name" 
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* <!-- code  --> */}
                        <div className="mb-3">
                            <label className="text-sm text-gray-500 block mb-1" htmlFor="code">Code</label>
                            <input 
                                className="px-2 py-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                                type="text" 
                                name="code" 
                                id="code"
                                value={formData.code}
                                onChange={handleChange} 
                                required
                            />
                        </div>

                        {/* <!-- professor  --> */}
                        <div className="mb-3">
                            <label className="text-sm text-gray-500 block mb-1" htmlFor="professor">Professor</label>
                            <input 
                                className="px-2 py-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                                type="text" 
                                name="professor" 
                                id="professor"
                                value={formData.professor}
                                onChange={handleChange} 
                                required
                            />
                        </div>

                        {/* <!-- color  --> */}
                        <div className="mb-3">
                            <label className="text-sm text-gray-500 block mb-1" htmlFor="color">Color</label>
                            <input 
                                className="border border-gray-300 w-16 h-8" 
                                type="color" 
                                name="color" 
                                id="color"
                                value={formData.color}
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
                            {editingId ? "Update" : "Add new course"}
                        </button>

                        <span 
                            className="text-red-500 hover:text-red-400 border-b-1 active:scale-95 transition-all mb-3 cursor-pointer"
                            onClick={handleCancelForm} 
                        >
                            Cancel
                        </span>
                    </div>
                </div>
            </form>}
            {/* end add course form  */}
        </div>
        
    )
}

// courses cards component 
const CoursesCards = ({course, handleEdit, handleDelete}) => {
    return (
        <div 
            className="py-4 px-4 rounded-lg shadow-sm hover:shadow-lg cursor-pointer transition-shadow"
            key={course.id}
        >
            <h3 className="text-center text-lg font-bold text-gray-600">{course.name}</h3>
            <p className="text-sm my-3 text-gray-500">{course.professor}</p>
            <div className="flex justify-around mt-4">
                <button 
                    className="text-sm px-3 py-1 text-white rounded-md bg-blue-500 hover:bg-blue-400 transition-colors"
                    onClick={() => handleEdit(course)}
                >
                    Edit
                </button>
                <button 
                    className="text-sm px-3 py-1 text-white rounded-md bg-red-500 hover:bg-red-400 transition-colors"
                    onClick={() => handleDelete(course.id)}
                >
                    Delete
                </button>
            </div>
        </div>
    )
}

export default Courses
