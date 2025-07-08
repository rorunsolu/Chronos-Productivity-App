import { UserAuth } from "../../contexts/authContext/AuthContext";
import ButtonReg from "@/components/Buttons/ButtonReg";
import ErrorMsg from "@/components/ErrorMessage/ErrorMsg";
import { Stack, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "@/pages/Sign Up Page/SignUpPage.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { googleSignIn, emailSignUp, user } = UserAuth();

  const handleGoogleSignUp = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmailSignUp = async (email: string, password: string) => {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      await emailSignUp(email, password);
    } catch (error) {
      console.log(error);
      setError("Failed to sign up. Please check your credentials.");
    }
  };

  useEffect(() => {
    if (user != null) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="flex w-full h-full justify-center items-center pt-6">
      <Stack gap="5">
        <form>
          <Stack gap="5">
            <h2 className="login-form__title">Sign up</h2>
            <p className="login-form__subtitle">
              Enter your email below to sign up for an account
            </p>
          </Stack>

          <div className="login-form__group">
            <label htmlFor="email">Email</label>
            <TextInput
              required
              type="email"
              withAsterisk
              value={email}
              placeholder="email@example.com"
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="login-form__group">
            <label htmlFor="password">Password</label>
            <TextInput
              required
              withAsterisk
              type="password"
              value={password}
              placeholder="Password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <div className="login-form__buttons">
            <ButtonReg
              label="Sign up"
              type="primary"
              onClick={() => handleEmailSignUp(email, password)}
            />
            <ButtonReg
              label="Sign up with Google"
              type="secondary"
              onClick={handleGoogleSignUp}
            />
          </div>

          <div className="flex flex-col items-center justify-center gap-0 mt-5">
            <p className="login-form__signup">
              Already have an account?<Link to="/signin">Sign in</Link>
            </p>
          </div>
        </form>

        {error && <ErrorMsg message={error} />}
      </Stack>
    </div>
  );
};

export default SignUp;
