import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, CalendarClock, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const {logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (confirm("Are you sure you want to logout?")) {
            await logout();
            navigate("/login");
        }
    }

    const linkClass = ({isActive}) =>
        `text-[13px] pb-0.5 transition-colors border-b-2 ${
            isActive ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-900'
        }`;

    return (
        <div className="relative">
            <nav className="flex justify-between items-center bg-white px-8 py-4 border-b border-gray-200">
                {/* logo */}
                <div className="flex items-center gap-2">
                    <CalendarClock className="w-5 h-5 text-blue-500" />
                    <span className="text-[15px] font-medium text-gray-900">Schedule student</span>
                </div>

                {/* nav links */}
                <div className="hidden md:flex items-center gap-8">
                    <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
                    <NavLink to="/courses" className={linkClass}>My courses</NavLink>
                    <NavLink to="/schedule" className={linkClass}>Schedule</NavLink>
                    <NavLink to="/assignments" className={linkClass}>Assignments</NavLink>
                </div>
                
                {/* logout button */}
                <button 
                    className="hidden md:flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-red-600 transition-colors"
                    onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4" />
                    Log out
                </button>

                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </nav>

            {/* mobile links */}
            <div className={`flex flex-col md:hidden bg-white gap-4 px-8 py-5 border-b border-gray-200 absolute left-0 right-0 z-50 duration-500 transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                <NavLink to="/dashboard" className={linkClass} onClick={() => setIsOpen(false)}>Dashboard</NavLink>
                <NavLink to="/courses" className={linkClass} onClick={() => setIsOpen(false)}>My courses</NavLink>
                <NavLink to="/schedule" className={linkClass} onClick={() => setIsOpen(false)}>Schedule</NavLink>
                <NavLink to="/assignments" className={linkClass} onClick={() => setIsOpen(false)}>Assignments</NavLink>

                <button 
                    className="flex items-center gap-1.5 text-[13px] text-red-600"
                    onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4" />
                    Log out
                </button>
            </div>
        </div>
    )
}