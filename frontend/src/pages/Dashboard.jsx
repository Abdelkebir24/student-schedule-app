import { useAuth } from "../context/AuthContext"


export default function Dashboard() {

    const {user} = useAuth();

    return (
        <>
            <h3>Hello {user?.name}, Dashboard coming soon 😃</h3>
        </>
        
    )
}