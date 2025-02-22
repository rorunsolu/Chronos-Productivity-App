import "./DashboardPage.scss";
import '../../App.css';
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

                    <div className="dashboard__top">

                        <span className="dashboard__section-header">Most used categories</span>

                        <div className="dashboard__folders">

                            <div className="dashboard__folder">
                                <div className="dashboard__folder-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 2.4578C14.053 2.16035 13.0452 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 10.2847 21.5681 8.67022 20.8071 7.25945M17 5.75H17.005M10.5001 21.8883L10.5002 19.6849C10.5002 19.5656 10.5429 19.4502 10.6205 19.3596L13.1063 16.4594C13.3106 16.2211 13.2473 15.8556 12.9748 15.6999L10.1185 14.0677C10.0409 14.0234 9.97663 13.9591 9.93234 13.8814L8.07046 10.6186C7.97356 10.4488 7.78657 10.3511 7.59183 10.3684L2.06418 10.8607M21 6C21 8.20914 19 10 17 12C15 10 13 8.20914 13 6C13 3.79086 14.7909 2 17 2C19.2091 2 21 3.79086 21 6ZM17.25 5.75C17.25 5.88807 17.1381 6 17 6C16.8619 6 16.75 5.88807 16.75 5.75C16.75 5.61193 16.8619 5.5 17 5.5C17.1381 5.5 17.25 5.61193 17.25 5.75Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <p className="dashboard__folder-name line-clamp-1">Travel</p>
                            </div>

                            <div className="dashboard__folder">
                                <div className="dashboard__folder-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 2.4578C14.053 2.16035 13.0452 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 10.2847 21.5681 8.67022 20.8071 7.25945M17 5.75H17.005M10.5001 21.8883L10.5002 19.6849C10.5002 19.5656 10.5429 19.4502 10.6205 19.3596L13.1063 16.4594C13.3106 16.2211 13.2473 15.8556 12.9748 15.6999L10.1185 14.0677C10.0409 14.0234 9.97663 13.9591 9.93234 13.8814L8.07046 10.6186C7.97356 10.4488 7.78657 10.3511 7.59183 10.3684L2.06418 10.8607M21 6C21 8.20914 19 10 17 12C15 10 13 8.20914 13 6C13 3.79086 14.7909 2 17 2C19.2091 2 21 3.79086 21 6ZM17.25 5.75C17.25 5.88807 17.1381 6 17 6C16.8619 6 16.75 5.88807 16.75 5.75C16.75 5.61193 16.8619 5.5 17 5.5C17.1381 5.5 17.25 5.61193 17.25 5.75Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <p className="dashboard__folder-name line-clamp-1">Finance</p>
                            </div>

                            <div className="dashboard__folder">
                                <div className="dashboard__folder-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 2.4578C14.053 2.16035 13.0452 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 10.2847 21.5681 8.67022 20.8071 7.25945M17 5.75H17.005M10.5001 21.8883L10.5002 19.6849C10.5002 19.5656 10.5429 19.4502 10.6205 19.3596L13.1063 16.4594C13.3106 16.2211 13.2473 15.8556 12.9748 15.6999L10.1185 14.0677C10.0409 14.0234 9.97663 13.9591 9.93234 13.8814L8.07046 10.6186C7.97356 10.4488 7.78657 10.3511 7.59183 10.3684L2.06418 10.8607M21 6C21 8.20914 19 10 17 12C15 10 13 8.20914 13 6C13 3.79086 14.7909 2 17 2C19.2091 2 21 3.79086 21 6ZM17.25 5.75C17.25 5.88807 17.1381 6 17 6C16.8619 6 16.75 5.88807 16.75 5.75C16.75 5.61193 16.8619 5.5 17 5.5C17.1381 5.5 17.25 5.61193 17.25 5.75Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <p className="dashboard__folder-name line-clamp-1">Folder name</p>
                            </div>

                            <div className="dashboard__folder">
                                <div className="dashboard__folder-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 2.4578C14.053 2.16035 13.0452 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 10.2847 21.5681 8.67022 20.8071 7.25945M17 5.75H17.005M10.5001 21.8883L10.5002 19.6849C10.5002 19.5656 10.5429 19.4502 10.6205 19.3596L13.1063 16.4594C13.3106 16.2211 13.2473 15.8556 12.9748 15.6999L10.1185 14.0677C10.0409 14.0234 9.97663 13.9591 9.93234 13.8814L8.07046 10.6186C7.97356 10.4488 7.78657 10.3511 7.59183 10.3684L2.06418 10.8607M21 6C21 8.20914 19 10 17 12C15 10 13 8.20914 13 6C13 3.79086 14.7909 2 17 2C19.2091 2 21 3.79086 21 6ZM17.25 5.75C17.25 5.88807 17.1381 6 17 6C16.8619 6 16.75 5.88807 16.75 5.75C16.75 5.61193 16.8619 5.5 17 5.5C17.1381 5.5 17.25 5.61193 17.25 5.75Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <p className="dashboard__folder-name line-clamp-1">Folder name</p>
                            </div>

                        </div>

                    </div>

                    <div className="dashboard__overview">

                        <div className="dashboard__activity">

                            <div className="dashboard__activity-item">
                                <div className="dashboard__activity-context">
                                    <p className="dashboard__activity-name">Grind</p>
                                </div>
                                <div className="dashboard__activity-details">
                                    <p className="dashboard__activity-time">3 minutes ago</p>
                                    <p className="dashboard__activity-category">Job hunting</p>
                                </div>
                            </div>

                            <div className="dashboard__activity-item">
                                <div className="dashboard__activity-context">
                                    <p className="dashboard__activity-name">Workout</p>
                                </div>
                                <div className="dashboard__activity-details">
                                    <p className="dashboard__activity-time">10 minutes ago</p>
                                    <p className="dashboard__activity-category">Fitness</p>
                                </div>
                            </div>

                            <div className="dashboard__activity-item">
                                <div className="dashboard__activity-context">
                                    <p className="dashboard__activity-name">Read</p>
                                </div>
                                <div className="dashboard__activity-details">
                                    <p className="dashboard__activity-time">30 minutes ago</p>
                                    <p className="dashboard__activity-category">Education</p>
                                </div>
                            </div>

                            <div className="dashboard__activity-item">
                                <div className="dashboard__activity-context">
                                    <p className="dashboard__activity-name">Cook</p>
                                </div>
                                <div className="dashboard__activity-details">
                                    <p className="dashboard__activity-time">1 hour ago</p>
                                    <p className="dashboard__activity-category">Cooking</p>
                                </div>
                            </div>

                            <div className="dashboard__activity-item">
                                <div className="dashboard__activity-context">
                                    <p className="dashboard__activity-name">Meditate</p>
                                </div>
                                <div className="dashboard__activity-details">
                                    <p className="dashboard__activity-time">2 hours ago</p>
                                    <p className="dashboard__activity-category">Wellness</p>
                                </div>
                            </div>

                            <div className="dashboard__activity-item">
                                <div className="dashboard__activity-context">
                                    <p className="dashboard__activity-name">Code</p>
                                </div>
                                <div className="dashboard__activity-details">
                                    <p className="dashboard__activity-time">3 hours ago</p>
                                    <p className="dashboard__activity-category">Programming</p>
                                </div>

                            </div>

                        </div>

                        <div className="dashboard__stats">

                            <div className="dashboard__stats-item">
                                <div className="dashboard__stats-context">
                                    <div className="dashboard__stats-dot"></div>
                                    <p className="dashboard__stats-name">Finance</p>
                                </div>
                                <p className="dashboard__stats-number">73</p>
                            </div>

                            <div className="dashboard__stats-item">
                                <div className="dashboard__stats-context">
                                    <div className="dashboard__stats-dot"></div>
                                    <p className="dashboard__stats-name">Gym</p>
                                </div>
                                <p className="dashboard__stats-number">23</p>
                            </div>

                            <div className="dashboard__stats-item">
                                <div className="dashboard__stats-context">
                                    <div className="dashboard__stats-dot"></div>
                                    <p className="dashboard__stats-name">Home</p>
                                </div>
                                <p className="dashboard__stats-number">81</p>
                            </div>
                        </div>

                    </div>

                    <div className="dashboard__pages">
                        <div className="dashboard__notes"></div>
                        <div className="dashboard__tasks"></div>
                    </div>

                    <div className="dashboard__calendar"></div>

                </div>

            </div>

        </div >

    );
};

export default Dashboard;
