import { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
    ResponsiveContainer
} from "recharts";

function AnalyticsDashboard() {

    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/analytics", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
            }
        })
            .then(res => res.json())
            .then(setData)
            .catch(() => alert("Failed to load analytics"));
    }, []);

    if (!data) return <h2 style={{ textAlign: "center" }}>Loading Analytics...</h2>;

    return (
        <div style={{
            padding: "20px",
            background: "#eef2f7",
            minHeight: "100vh",
            fontFamily: "sans-serif"
        }}>

            {/* TITLE */}
            <h2 style={{ marginBottom: "20px", fontWeight: "bold" }}>
                📊 Analytics Dashboard
            </h2>

            {/* SUMMARY CARDS */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px"
            }}>
                {[
                    { label: "Events", value: data.totalEvents, color: "#3b82f6" },
                    { label: "Bookings", value: data.totalBookings, color: "#a855f7" },
                    { label: "Users", value: data.totalUsers, color: "#f59e0b" },
                    { label: "Revenue", value: `₹${data.totalRevenue}`, color: "#22c55e" }
                ].map((card, i) => (
                    <div key={i} style={{
                        background: "#fff",
                        padding: "20px",
                        borderRadius: "16px",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                        textAlign: "center",
                        borderTop: `4px solid ${card.color}`
                    }}>
                        <h2 style={{ margin: "0", color: card.color }}>
                            {card.value}
                        </h2>
                        <p style={{ marginTop: "5px", color: "#555" }}>
                            {card.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* CHART SECTION */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginTop: "30px"
            }}>

                {/* BOOKINGS CHART */}
                <div style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "16px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
                }}>
                    <h3>📊 Bookings per Event</h3>

                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.eventStats}>
                            <defs>
                                <linearGradient id="bookingColor" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="title" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="bookings" fill="url(#bookingColor)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* REVENUE CHART */}
                <div style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "16px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
                }}>
                    <h3>💰 Revenue per Event</h3>

                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.eventStats}>
                            <defs>
                                <linearGradient id="revenueColor" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.2}/>
                                </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="title" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="revenue" fill="url(#revenueColor)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* TOP EVENTS */}
            <div style={{
                marginTop: "30px",
                background: "#fff",
                padding: "20px",
                borderRadius: "16px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
            }}>
                <h3>🔥 Top Events</h3>

                {data.eventStats
                    .sort((a, b) => b.bookings - a.bookings)
                    .slice(0, 5)
                    .map((event, i) => (
                        <div key={i} style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "12px 0",
                            borderBottom: "1px solid #eee"
                        }}>
                            <span style={{ fontWeight: "500" }}>
                                {event.title}
                            </span>
                            <span style={{ color: "#3b82f6", fontWeight: "bold" }}>
                                {event.bookings} bookings
                            </span>
                        </div>
                    ))}
            </div>

        </div>
    );
}

export default AnalyticsDashboard;