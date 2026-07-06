import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [password_confirmation, setPassword_confirmation] = useState("");
    const {register} = useAuth();
    const navigate = useNavigate();

    // handleSubmit function 
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
        <form onSubmit={handleSubmit} className="flex h-screen items-center justify-center">
            <div className="w-80 bg-gray-100 rounded-lg px-5 py-4">
                {/* <!-- register title  --> */}
                <h1 className="text-center text-4xl font-bold text-gray-500 my-3">Schedule Student</h1>

                {/* ------- errors */}
                {error && <p>{error}</p>}

                <div className="my-4">
                    {/* <!-- name  --> */}
                    <div className="mb-3">
                        <label className="text-sm text-gray-500 block mb-1" htmlFor="name">Name</label>
                        <input 
                            className="px-2 py-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                            type="text" 
                            name="name" 
                            id="name" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* <!-- email  --> */}
                    <div className="mb-3">
                        <label className="text-sm text-gray-500 block mb-1" htmlFor="email">Email</label>
                        <input 
                            className="px-2 py-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" 
                            type="email" 
                            name="email" 
                            id="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* <!-- password  --> */}
                    <div className="mb-3">
                        <label className="text-sm text-gray-500 block mb-1" htmlFor="password">Password</label>
                        <input 
                            className="px-2 py-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"  
                            type="password" 
                            name="password" 
                            id="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* <!-- password confirmation  --> */}
                    <div>
                        <label className="text-sm text-gray-500 block mb-1" htmlFor="password_confirmation">Password Confirmation</label>
                        <input 
                            className="px-2 py-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"  
                            type="password" 
                            name="password_confirmation" 
                            id="password_confirmation" 
                            value={password_confirmation}
                            onChange={(e) => setPassword_confirmation(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* <!-- submit button  --> */}
                <button type="submit" className="w-full rounded-lg bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all py-2 text-white mb-3">
                    Register
                </button>

                <p className="text-sm text-center">
                    You have account <Link to="/login" className="text-blue-500 hover:text-blue-300 transition-colors">Login</Link>
                </p>
            </div>
        </form>
    );
}

export default Register