import "./Dashboard.scss";
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
        <div className="section">

            <div className="dashboard">

                <div className="dashboard__header">
                    <h1 className="dashboard__title">Dashboard</h1>
                </div>

                <div className="dashboard__content">

                    <div className="dashboard__overview">
                        <div className="dashboard__profile"></div>
                        <div className="dashboard__stats"></div>
                    </div>

                    <div className="dashboard__pages">
                        <div className="dashboard__notes"></div>
                        <div className="dashboard__tasks"></div>
                    </div>

                    <div className="dashboard__calendar"></div>

                </div>

            </div>

        </div>

    );
};

export default Dashboard;
