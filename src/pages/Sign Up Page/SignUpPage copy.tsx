// import { useState, useEffect } from "react";
// import { UserAuth } from '../../contexts/authContext/AuthContext';
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import "./SignUpPage.scss";

// const SignUp = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const { googleSignIn, emailSignUp, user } = UserAuth();

//   const handleGoogleSignUp = async () => {
//     try {
//       await googleSignIn();

//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleEmailSignUp = async (event) => {

//     event.preventDefault();
//     if (!email || !password) {
//       setError("Email and password are required.");
//       return;
//     }

//     try {
//       await emailSignUp(email, password);
//     } catch (error) {
//       console.log(error);
//       setError("Failed to sign up. Please check your credentials.");
//     }
//   };

//   useEffect(() => {
//     if (user != null) {
//       navigate("/dashboard");
//     }
//   }, [user, navigate]);

//   return (

//     <div className="section">

//       <div className="signuppage">

//         <div className="signuppage__header">
//           <img className="signuppage__logo" src="/chronos-logo.svg" alt="Chronos Logo" />
//           <h1 className="signuppage__title display-xs-semibold">Sign up</h1>
//         </div>

//         <div className="signuppage__content">

//           <div className="signuppage__form">

//             <div className="signuppage__input-group">
//               <label htmlFor="email">Email</label>
//               <input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
//             </div>

//             <div className="signuppage__input-group">
//               <label htmlFor="password">Password</label>
//               <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
//             </div>

//           </div>

//           {error && <p className="signuppage__error">{error}</p>}

//           <div className="signuppage__actions">
//             <button className="signuppage__signup-btn" type="submit" onClick={handleEmailSignUp}>Sign up</button>
//             <button className="signuppage__social-btn" type="button"> <img src="/google-logo.svg" alt="Google Logo" onClick={handleGoogleSignUp} /> Sign up with Google</button>
//           </div>

//         </div>

//         <div className="signuppage__footer">
//           <p className="signuppage__footer-text text-sm-regular">Already have an account?
//             <Link to="/signin" className="signuppage__footer-btn">Sign in</Link>
//           </p>
//           <p className="signuppage__footer-text text-sm-regular">Don't want to sign in?
//             <Link to="/" className="signuppage__footer-btn">Go back to home</Link>
//           </p>
//         </div>

//       </div>

//     </div>

//   );
// };

// export default SignUp;
