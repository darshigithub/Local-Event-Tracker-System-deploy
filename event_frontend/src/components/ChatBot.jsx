import React, { useState, useEffect, useRef } from "react";

const API_URL = "http://localhost:5002/chat";

function ChatBot() {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hi I can help you with events, booking, reviews & analytics!" }
    ]);
    const [input, setInput] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ================= TOKEN =================
    const getToken = () => localStorage.getItem("access_token");

    const saveToken = (token) => {
        if (token) {
            localStorage.setItem("access_token", token);
        }
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        return "Logged out successfully!";
    };

    // ================= API =================
    const callAPI = async (message, useAuth = false) => {
        const token = getToken();

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(useAuth && token && { Authorization: `Bearer ${token}` })
            },
            body: JSON.stringify({ message })
        });

        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }

        return await response.text();
    };

    // ================= AUTH =================
    const shouldUseAuth = (text) => {
        const lower = text.toLowerCase();

        if (
            lower.includes("events") ||
            lower.includes("stats") ||
            lower.includes("analytics")
        ) return false;

        if (
            lower.startsWith("login") ||
            lower.startsWith("register")
        ) return false;

        if (lower === "logout") return false;

        return true;
    };

    // ================= SEND =================
    const sendMessage = async (customText = null) => {
        const userInput = customText || input.trim();
        if (!userInput) return;

        const lower = userInput.toLowerCase();

        setMessages(prev => [...prev, { sender: "user", text: userInput }]);
        setInput("");
        setLoading(true);

        try {
            if (lower === "logout") {
                const msg = logout();
                setMessages(prev => [...prev, { sender: "bot", text: msg }]);
                setLoading(false);
                return;
            }

            const useAuth = shouldUseAuth(userInput);

            if (useAuth && !getToken()) {
                setMessages(prev => [
                    ...prev,
                    { sender: "bot", text: "⚠️ Please login first." }
                ]);
                setLoading(false);
                return;
            }

            const data = await callAPI(userInput, useAuth);

            if (typeof data === "object" && data.token) {
                saveToken(data.token);
                setMessages(prev => [
                    ...prev,
                    { sender: "bot", text: `✅ Welcome ${data.name}` }
                ]);
            } else {
                setMessages(prev => [
                    ...prev,
                    {
                        sender: "bot",
                        text: typeof data === "string" ? data : JSON.stringify(data)
                    }
                ]);
            }

        } catch (error) {
            setMessages(prev => [
                ...prev,
                { sender: "bot", text: "❌ Error connecting to server" }
            ]);
        }

        setLoading(false);
    };

    // ================= QUICK ACTIONS =================
    const quickActions = [
        "register username email password",
        "login email password",
        "logout",
        "events",
        "book event 1|1",
        "add review 1|5|Great",
        "stats"
    ];

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setOpen(!open)}
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    width: "65px",
                    height: "65px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    color: "white",
                    fontSize: "26px",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                    transition: "transform 0.2s"
                }}
                onMouseEnter={e => e.target.style.transform = "scale(1.1)"}
                onMouseLeave={e => e.target.style.transform = "scale(1)"}
            >
                💬
            </button>

            {/* Chat Window */}
            {open && (
                <div style={{
                    position: "fixed",
                    bottom: "95px",
                    right: "20px",
                    width: "360px",
                    height: "520px",
                    background: "#fff",
                    borderRadius: "20px",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                    overflow: "hidden"
                }}>

                    {/* Header */}
                    <div style={{
                        padding: "14px",
                        background: "linear-gradient(135deg, #667eea, #764ba2)",
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center"
                    }}>
                        🤖 Event Assistant
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        padding: "10px",
                        overflowY: "auto",
                        background: "#f1f3f6"
                    }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                display: "flex",
                                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                                marginBottom: "10px"
                            }}>
                                <div style={{
                                    padding: "10px 14px",
                                    borderRadius: "18px",
                                    background: msg.sender === "user"
                                        ? "linear-gradient(135deg, #667eea, #764ba2)"
                                        : "#e4e6eb",
                                    color: msg.sender === "user" ? "#fff" : "#000",
                                    maxWidth: "75%",
                                    fontSize: "14px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {loading && <div style={{ fontSize: "12px" }}>🤖 Typing...</div>}
                        <div ref={chatEndRef}></div>
                    </div>

                    {/* Quick Buttons */}
                    <div style={{
                        padding: "6px",
                        display: "flex",
                        flexWrap: "wrap",
                        background: "#fff"
                    }}>
                        {quickActions.map((action, i) => (
                            <button
                                key={i}
                                onClick={() => sendMessage(action)}
                                style={{
                                    margin: "4px",
                                    padding: "6px 10px",
                                    fontSize: "12px",
                                    borderRadius: "15px",
                                    border: "none",
                                    background: "#eef2ff",
                                    cursor: "pointer",
                                    transition: "0.2s"
                                }}
                                onMouseEnter={e => e.target.style.background = "#dbeafe"}
                                onMouseLeave={e => e.target.style.background = "#eef2ff"}
                            >
                                {action}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <div style={{
                        display: "flex",
                        padding: "10px",
                        borderTop: "1px solid #ddd",
                        background: "#fff"
                    }}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            style={{
                                flex: 1,
                                padding: "10px",
                                borderRadius: "20px",
                                border: "1px solid #ccc",
                                outline: "none"
                            }}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />

                        <button
                            onClick={() => sendMessage()}
                            style={{
                                marginLeft: "8px",
                                padding: "10px 14px",
                                borderRadius: "50%",
                                border: "none",
                                background: "#667eea",
                                color: "#fff",
                                cursor: "pointer"
                            }}
                        >
                            ➤
                        </button>
                    </div>

                </div>
            )}
        </>
    );
}

export default ChatBot;