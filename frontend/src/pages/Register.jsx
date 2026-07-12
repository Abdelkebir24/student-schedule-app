import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { CalendarClock } from "lucide-react";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [password_confirmation, setPassword_confirmation] = useState("");
    const {register} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password, password_confirmation);
            navigate("/dashboard")
        } catch (err) {
            console.error(err);
            setError("Registration failed. Try a different email or password.");
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 py-10">
            <form onSubmit={handleSubmit} className="w-80 bg-white border border-gray-200 rounded-xl px-7 py-8">

                {/* logo + title */}
                <div className="flex items-center gap-2 mb-1">
                    <CalendarClock className="w-5 h-5 text-blue-500" />
                    <span className="text-[15px] font-medium text-gray-900">Schedule student</span>
                </div>
                <p className="text-[13px] text-gray-500 mb-7">Create an account to get started.</p>

                {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

                {/* name */}
                <label className="text-[13px] text-gray-500 block mb-1" htmlFor="name">Name</label>
                <input 
                    className="px-3 py-2 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4" 
                    type="text" 
                    name="name" 
                    id="name" 
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                {/* email */}
                <label className="text-[13px] text-gray-500 block mb-1" htmlFor="email">Email</label>
                <input 
                    className="px-3 py-2 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4" 
                    type="email" 
                    name="email" 
                    id="email" 
                    placeholder="name@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                {/* password */}
                <label className="text-[13px] text-gray-500 block mb-1" htmlFor="password">Password</label>
                <input 
                    className="px-3 py-2 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"  
                    type="password" 
                    name="password" 
                    id="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {/* password confirmation */}
                <label className="text-[13px] text-gray-500 block mb-1" htmlFor="password_confirmation">Confirm password</label>
                <input 
                    className="px-3 py-2 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-6"  
                    type="password" 
                    name="password_confirmation" 
                    id="password_confirmation" 
                    placeholder="••••••••"
                    value={password_confirmation}
                    onChange={(e) => setPassword_confirmation(e.target.value)}
                    required
                />

                <button type="submit" className="w-full rounded-md bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all py-2.5 text-sm font-medium text-white mb-5">
                    Create account
                </button>

                <p className="text-[13px] text-center text-gray-500">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-500 transition-colors">Log in</Link>
                </p>
            </form>
        </div>
    );
}

export default Register