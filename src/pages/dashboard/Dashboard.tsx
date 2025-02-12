import "./Dashboard.css";
import { UserAuth } from "../../contexts/authContext/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    const { user } = UserAuth();

    useEffect(() => {
        if (user === null) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className="container">
            <h1 className="dashboard__title">Welcome to your Chronos Dashboard</h1>
        </div>
    );
};

export default Dashboard;
