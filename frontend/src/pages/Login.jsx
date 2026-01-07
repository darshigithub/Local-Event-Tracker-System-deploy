import React from "react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg" style={{ width: "420px" }}>
        <div className="card-body text-center border-bottom">
          <h4 className="fw-bold text-primary">EventSphere</h4>
        </div>

        <div className="card-body px-4">
          <label className="fw-semibold">Email</label>
          <input className="form-control mb-3" />

          <label className="fw-semibold">Password</label>
          <input type="password" className="form-control mb-4" />

          <button className="btn btn-primary w-100 btn-lg">
            Login
          </button>
        </div>

        <div className="card-footer text-center bg-white">
          New user? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
