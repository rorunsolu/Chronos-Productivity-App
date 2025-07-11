import ButtonReg from "@/components/Buttons/ButtonReg";
import ErrorMsg from "@/components/ErrorMessage/ErrorMsg";
import { UserAuth } from "@/contexts/authContext/AuthContext";
import { Divider } from "@mantine/core";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { PasswordInput, Stack, TextInput } from "@mantine/core";
import "@/pages/Sign Up Page/SignUpPage.scss";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { googleSignIn, emailSignUp, signInAsGuest, user } = UserAuth();

  const handleGoogleSignUp = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      setError("Failed to sign up with Google. Please try again.");
      throw new Error(`Error signing up with Google: ${error}`);
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
      setError("Failed to sign up. Please check your credentials.");
      throw new Error(`Error signing up with email: ${error}`);
    }
  };

  const handleGuestAccess = async () => {
    try {
      await signInAsGuest();
    } catch (error) {
      setError("Failed to sign in as guest. Please try again.");
      throw new Error(`Error signing in as guest: ${error}`);
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
            <img
              src="/chronos-logo.svg"
              alt="Chronos Logo"
              className="w-8 h-8"
            />
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
            <PasswordInput
              required
              withAsterisk
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
              icon={
                <img
                  src="/google-logo.svg"
                  alt="Google Icon"
                  className="w-5 h-5"
                />
              }
            />

            <Divider label="or" labelPosition="center" className="my-2" />

            <ButtonReg
              label="Continue as a Guest"
              type="secondary"
              onClick={handleGuestAccess}
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
