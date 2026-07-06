import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const {logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (confirm("Are you sue you want to logout ?")) {
            await logout();
            navigate("/login");
        }
    }

    return (
            <div className="relative">
                <nav className="flex justify-between items-center bg-white px-8 py-4 border-b border-gray-200 ">
                    {/* logo  */}
                    <span className="text-xl font-bold text-gray-900">Student Schedule 📖</span>

                    {/* nav links  */}
                    <div className="hidden md:flex items-center gap-8">
                        <NavLink 
                            to="/dashboard" 
                            className={({isActive}) => 
                                `text-sm text-gray-500 pb-0.5 hover:text-gray-900 transition-colors border-b-2 ${isActive ? 'border-gray-500 ' : 'border-transparent'}`
                            }
                        >
                            Dashboard
                        </NavLink>

                        <NavLink 
                            to="/courses" 
                            className={({isActive}) => 
                                `text-sm text-gray-500 pb-0.5 hover:text-gray-900 transition-colors border-b-2 ${isActive ? 'border-gray-500 ' : 'border-transparent'}`
                            }
                        >
                            My courses
                        </NavLink>

                        <NavLink 
                            to="/schedule" 
                            className={({isActive}) => 
                                `text-sm text-gray-500 pb-0.5 hover:text-gray-900 transition-colors border-b-2 ${isActive ? 'border-gray-500 ' : 'border-transparent'}`
                            }
                        >
                            Schedule
                        </NavLink>
                    </div>
                    
                    {/* logout button  */}
                    <button 
                        className="hidden md:block text-sm text-white bg-red-500 px-4 py-2 rounded-lg font-meduim hover:bg-red-400 active:scale-95 transition-all"
                        onClick={handleLogout}
                    >
                            Logout
                    </button>

                    <button 
                        className="md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </nav>

                {/* mobile links  */}
                <div className={`flex flex-col md:hidden bg-white gap-4 px-8 py-4 border-b border-gray-200 absolute left-0 right-0 z-50 duration-500 transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}>                                         
                    <NavLink 
                        to="/dashboard" 
                        className={({isActive}) => 
                            `text-sm text-gray-500 pb-0.5 hover:text-gray-900 transition-colors border-b-2 ${isActive ? 'border-gray-500 ' : 'border-transparent'}`
                        }
                        onClick={() => setIsOpen(false)}
                    >
                        Dashboard
                    </NavLink>

                    <NavLink 
                        to="/courses" 
                        className={({isActive}) => 
                            `text-sm text-gray-500 pb-0.5 hover:text-gray-900 transition-colors border-b-2 ${isActive ? 'border-gray-500 ' : 'border-transparent'}`
                        }
                         onClick={() => setIsOpen(false)}
                    >
                        My courses
                    </NavLink>

                    <NavLink 
                        to="/schedule" 
                        className={({isActive}) => 
                            `text-sm text-gray-500 pb-0.5 hover:text-gray-900 transition-colors border-b-2 ${isActive ? 'border-gray-500 ' : 'border-transparent'}`
                        }
                         onClick={() => setIsOpen(false)}
                    >
                        Schedule
                    </NavLink>

                    <a 
                        className="text-sm text-red-500 pb-0.5 hover:text-red-600 transition-colors cursor-pointer underline"
                        onClick={handleLogout}
                    >
                        Logout
                    </a>
                </div>
            </div>
    )
}