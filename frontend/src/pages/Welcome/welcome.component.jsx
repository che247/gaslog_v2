import { Check, Error } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { signUpWithEmail } from "../../lib/auth/actions";
import styles from "./welcome.module.css";

const MIN_PASSWORD_LENGTH = 4;

const Welcome = () => {
  const [register, setRegister] = useState(true);
  const [registrationForm, setRegistrationForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [passwordsMatch, setPasswordsMatch] = useState();

  const handleRegistrationFormChange = (e) => {
    const { name, value } = e.target;
    const currentPassword = registrationForm.password ?? "";
    if (name === "passwordConfirm" && currentPassword) {
      if (value === currentPassword) setPasswordsMatch(true);
      else setPasswordsMatch(false);
    }
    setRegistrationForm((prev) => ({ ...prev, [name]: value }));
  };

  const checkPasswordLengthValid = registrationForm.password.length >= MIN_PASSWORD_LENGTH;
  const checkPasswordsMatch =
    registrationForm.password.length > 0 &&
    registrationForm.password === registrationForm.passwordConfirm;
  const checkValidEmail = registrationForm.email.length > 1
  const enableRegistration = checkPasswordLengthValid && checkPasswordsMatch && checkValidEmail

  const handleSignIn = () => {
    null;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        margin: "0 auto",
        gap: "4.5rem",
        height: "100vh",
      }}
      className={styles.container}
    >
      <div className={styles.overview}>
        <h2>Welcome to GasLog!</h2>
        <p>GasLog helps you track and monitor your car's fuel consumption</p>
        <p>Key Features</p>
        <ul>
          <li>Price per gallon tracking</li>
          <li>Clear fuel usage graphs</li>
          <li>Historical tracking</li>
          <li>Support for multiple vehicles</li>
        </ul>
      </div>
      <div className={styles.registration}>
        <div className={styles.form}>
          {!register ? (
            <>
              <h2>Sign in</h2>
              <form
                onSubmit={handleSignIn}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                <TextField sx={{ minWidth: "60%" }} label="Email" />
                <TextField sx={{ minWidth: "60%" }} label="Password" />
                <span style={{ marginTop: "1.5rem", paddingBottom: "0.5rem" }}>
                  Not a user?{" "}
                  <button
                    type="button"
                    onClick={() => setRegister(true)}
                    style={{
                      cursor: "pointer",
                      color: "dodgerblue",
                      textDecoration: "underline",
                      background: "none",
                    }}
                  >
                    Register
                  </button>
                </span>
              </form>
            </>
          ) : (
            <>
              <h2>Create an account</h2>
              <form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                  gap: "0.25rem",
                }}
                onSubmit={() => signUpWithEmail()}
              >
                <TextField
                  name="email"
                  label="Email"
                  value={registrationForm.email}
                  sx={{ minWidth: "60%" }}
                  onChange={handleRegistrationFormChange}
                />
                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  value={registrationForm.password}
                  sx={{ minWidth: "60%" }}
                  onChange={handleRegistrationFormChange}
                />
                <TextField
                  name="passwordConfirm"
                  label="Confirm Password"
                  type="password"
                  value={registrationForm.passwordConfirm}
                  sx={{ minWidth: "60%" }}
                  onChange={handleRegistrationFormChange}
                />
                <div style={{ fontSize: "0.75rem", textAlign: "left", padding: "0.5rem" }}>
                  <li
                    style={{
                      display: "flex",
                      color: checkPasswordLengthValid ? "green" : "red",
                    }}
                  >
                    {checkPasswordLengthValid ? (
                      <Check fontSize="small" />
                    ) : (
                      <Error fontSize="small" />
                    )}
                    Password must be at least {MIN_PASSWORD_LENGTH} characters long
                  </li>
                  <li
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "left",
                      color: checkPasswordsMatch ? "green" : "red",
                    }}
                  >
                    {checkPasswordsMatch ? <Check fontSize="small" /> : <Error fontSize="small" />}
                    Passwords must match
                  </li>
                </div>
                <Button variant="contained" disabled={!enableRegistration} style={{marginLeft: "auto"}}>Register</Button>
                <span style={{ marginTop: "1.5rem", paddingBottom: "0.5rem" }}>
                  Already a user?{" "}
                  <button
                    type="button"
                    onClick={() => setRegister(false)}
                    style={{
                      cursor: "pointer",
                      color: "dodgerblue",
                      textDecoration: "underline",
                      background: "none",
                    }}
                  >
                    Sign in
                  </button>
                </span>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
