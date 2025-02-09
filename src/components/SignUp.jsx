import React from "react";
import "../styles/forms/SignUp.css";

const SignUp = () => {
  return (
    <div className="container">

      <div className="header">
        <img className="logo" src="/chronos-logo.svg" alt="Chronos Logo" />
        <h1 className="title">Sign Up</h1>
      </div>

      <div className="content">

        <div className="form">

          <div className="input-group">
            <label htmlFor="first-name">First Name</label>
            <input type="text" placeholder="First Name" />
          </div>

          <div className="input-group">
            <label htmlFor="last-name">Last Name</label>
            <input type="text" placeholder="Last Name" />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" placeholder="Email" />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" placeholder="Password" />
          </div>

          <div className="input-group">
            <input type="password" placeholder="Confirm Password" />
          </div>

        </div>

        <div className="actions">
          <button className="signup-btn">Sign up</button>
          <button className="google-btn"> <img src="/google-logo.svg" alt="Google Logo" /> Sign up with Google</button>
        </div>

      </div>

      <div className="footer">
        <p>Already have an account? <a href="/signin">Sign in</a></p>
      </div>

    </div>
  );
};

export default SignUp;
