import { useState } from "react"
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

 

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
        <>
            <form onSubmit={handleSubmit} className="flex h-screen items-center justify-center">
                <div className="w-80 bg-gray-100 rounded-lg px-5 py-4">
                    {/* <!-- login title  --> */}
                    <h1 className="text-center text-4xl font-bold text-gray-500 my-3">Schedule Student</h1>

                     {/* display error if the email or password invalid  */}
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                    <div className="my-4">
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
                        <div>
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
                    </div>

                    {/* <!-- submit button  --> */}
                    <button type="submit" className="w-full rounded-lg bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all py-2 text-white mb-3">
                        Login
                    </button>

                    {/* link if user dont have account  */}
                    <p className="text-sm text-center">
                        You dont have account <Link to="/register" className="text-blue-500 hover:text-blue-300 transition-colors">Register</Link>
                    </p>
                </div>
            </form>
        </>
    )
 }