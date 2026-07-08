import { useEffect, useState } from "react"
import api from "../api/axios";

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

    // --------- fetchAssignmentsCourses function
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

    // start useEffect 
    useEffect(() => {
        fetchAssignmentsCourses();
    }, []);
    // end useEffect 

    // function handleChange
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    // handleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/assignments", formData);
            fetchAssignmentsCourses();
            setShowFormAssignment(false);
            setFormData({
                course_id: "",
                title: "",
                description: "",
                due_date: ""
            });
        } catch (error) {
            console.error(error);
        }
    }

    //------- handleDelete function 
    const handleDelete = async (assignmentId) => {
        try {
            if (confirm("Are you sure?")) {
                await api.delete(`/assignments/${assignmentId}`);
                fetchAssignmentsCourses();
            }
        } catch (error) {
            console.error(error);
        }
    }

    // ------ handleToggleStatus function
    const handleToggleStatus = async (assignment) => {
        try {
            setLoading(true);
            if (assignment.status === "pending") {
                await api.put(`/assignments/${assignment.id}`, {status: "done"});
            } else if (assignment.status === "done") {
                await api.put(`/assignments/${assignment.id}`, {status: "pending"});
            }
            fetchAssignmentsCourses();
            console.log(assignment.status);
        } catch (error) {
            console.error(error);
        }
    }

    // ------ loading
    if (loading) {
        return (
            <p>Loading...</p>
        )
    }

    return (
        <div>

            {/* start assignments list  */}
            { 
                !showFormAssignment && (
                    assignments.length === 0 ? 
                        <div className="flex items-center space-x-3 mt-3">
                            <h3 className="text-lg font-bold text-gray-400">No Assignments yet — </h3>
                            <button 
                                className="text-blue-500 border-b-2 text-sm hover:text-blue-400 transition-colors"
                                onClick={() => setShowFormAssignment(true)}
                            >
                                add your first one!
                            </button>
                        </div> 
                : <div>
                        <div className="flex justify-between items-center px-4">
                            <h1 className="text-lg font-bold text-gray-400">Assignments ✔</h1>
                            <button 
                                className="text-white bg-blue-500 px-3 py-2 rounded-lg text-sm hover:bg-blue-400 transition-colors"
                                onClick={() => setShowFormAssignment(true)}
                            >
                                + Add new Assignments
                            </button>
                        </div>
                        <div className="mt-6">
                            {
                                assignments.map((assignment) => 
                                    <div 
                                        key={assignment.id}
                                        className="flex justify-between px-6 border border-gray-300 rounded-lg py-5 mt-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <input 
                                                type="checkbox" 
                                                checked={assignment.status === "done"}
                                                onClick={() => handleToggleStatus(assignment)}
                                            />
                                            <div>
                                                <h2 className="font-bold text-lg">{assignment.title}</h2>
                                                <p className="text-sm text-gray-500">{assignment.course.name} . {assignment.due_date}</p>
                                            </div>
                                        </div>

                                        <div className="flex itmes-center gap-3">
                                            <button className="text-sm text-blue-600 underline cursor-pointer">
                                                Edit
                                            </button>
                                            <button 
                                                className="text-sm text-red-600 underline cursor-pointer"
                                                onClick={() => handleDelete(assignment.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>)
                            }
                        </div>
                  </div>)  
            }
            {/* end assignments list  */}

            {/* start add assignment form  */}
            {showFormAssignment && <form onSubmit={handleSubmit}>
                <div className="rounded-lg px-5 py-4">
                    {/* <!-- title  --> */}
                    <h1 className="text-3xl font-bold text-gray-500 my-3">Assignment Form</h1>

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

                        {/* <!-- title  --> */}
                        <div className="mb-3">
                            <label className="text-sm text-gray-500 block mb-1" htmlFor="title">Title</label>
                            <input 
                                className="px-2 py-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                                type="text" 
                                name="title" 
                                id="title" 
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* <!-- description  --> */}
                        <div className="mb-3">
                            <label className="text-sm text-gray-500 block mb-1" htmlFor="title">Description</label>
                            <input 
                                className="px-2 py-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                                type="text" 
                                name="description" 
                                id="description" 
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* <!-- due date  --> */}
                        <div className="mb-3">
                            <label className="text-sm text-gray-500 block mb-1" htmlFor="title">Due Date</label>
                            <input 
                                className="px-2 py-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                                type="date" 
                                name="due_date" 
                                id="due_date" 
                                value={formData.due_date}
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
                            Add new Assignment
                        </button>

                        <span 
                            className="text-red-500 hover:text-red-400 border-b-1 active:scale-95 transition-all mb-3 cursor-pointer"
                            onClick={() => setShowFormAssignment(false)} 
                        >
                            Cancel
                        </span>
                    </div>
                </div>
            </form>}
            {/* end add schedule form  */}
        </div>
    )
}

export default Assignments 





