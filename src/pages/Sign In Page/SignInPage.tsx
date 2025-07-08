import "./SignInPage.scss";
import ButtonReg from "@/components/Buttons/ButtonReg";
import ErrorMsg from "@/components/ErrorMessage/ErrorMsg";
import { UserAuth } from "@/contexts/authContext/AuthContext";
import { Stack, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { googleSignIn, emailSignIn, user } = UserAuth();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmailSignIn = async (email: string, password: string) => {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      await emailSignIn(email, password);
    } catch (error) {
      console.log(error);
      setError("Failed to sign in. Please check your credentials.");
    }
  };

  useEffect(() => {
    if (user != null && !user.isAnonymous) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="flex w-full h-full justify-center items-center pt-6 ">
      <Stack>
        <form>
          <Stack gap="5">
            <h2 className="login-form__title">Login</h2>
            <p className="login-form__subtitle">
              Enter your email below to login to your account
            </p>
          </Stack>

          <div className="login-form__group">
            <label htmlFor="email">Email</label>

            <TextInput
              required
              type="email"
              withAsterisk
              placeholder="m@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <a href="#" className="login-form__forgot">
              Forgot your email?
            </a>
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
            <a href="#" className="login-form__forgot">
              Forgot your password?
            </a>
          </div>

          {!user && (
            <>
              <div className="login-form__buttons">
                <ButtonReg
                  label="Login"
                  type="primary"
                  formSubmit={true}
                  onClick={() => handleEmailSignIn(email, password)}
                />
                <ButtonReg
                  label="Login with Google"
                  type="secondary"
                  onClick={handleGoogleSignIn}
                />
              </div>

              <div className="flex flex-col items-center justify-center gap-0 mt-5">
                <p className="login-form__signup">
                  Don't have an account?<Link to="/signup">Sign up</Link>
                </p>
              </div>
            </>
          )}
        </form>

        {error && <ErrorMsg message={error} />}
      </Stack>
    </div>
  );
};

export default SignIn;
