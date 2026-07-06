import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
    
    const {user, token, logout} = useAuth();
    const navigate = useNavigate();
    
    // console.log(token)
    // console.log(user)

    const handleLogout = async () => {
        if (confirm("Are you sue you want to logout ?")) {
            await logout();
            navigate("/login");
        }
    }

    return (
        <div>

            <div>
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

                    <button>
                        {}
                    </button>
                </nav>
            </div>

            <main className="container mx-auto p-4">
                <Outlet />
            </main>

            
        </div>
    )
}