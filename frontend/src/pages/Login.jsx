import { useState } from "react"
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { CalendarClock } from "lucide-react";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await login(email, password);
            navigate("/dashboard")
        } catch (err) {
            setError("Invalid email or password")
        }
    }

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="w-80 bg-white border border-gray-200 rounded-xl px-7 py-8">

                {/* logo + title */}
                <div className="flex items-center gap-2 mb-1">
                    <CalendarClock className="w-5 h-5 text-blue-500" />
                    <span className="text-[15px] font-medium text-gray-900">Schedule student</span>
                </div>
                <p className="text-[13px] text-gray-500 mb-7">Welcome back. Log in to see your week.</p>

                {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

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
                    className="px-3 py-2 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-6"  
                    type="password" 
                    name="password" 
                    id="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" className="w-full rounded-md bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all py-2.5 text-sm font-medium text-white mb-5">
                    Log in
                </button>

                <p className="text-[13px] text-center text-gray-500">
                    New here? <Link to="/register" className="text-blue-600 hover:text-blue-500 transition-colors">Create an account</Link>
                </p>
            </form>
        </div>
    )
}