import { TextField } from "@mui/material";
import { useState } from "react";
import styles from "./welcome.module.css";

const Welcome = () => {
  const [register, setRegister] = useState(false);

  const handleSignIn = () => {
    null;
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        margin: "0 auto",
        gap: "4.5rem"
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
              >
                <TextField sx={{ minWidth: "60%" }} label="Email" />
                <TextField sx={{ minWidth: "60%" }} label="Password" />
                <TextField sx={{ minWidth: "60%" }} label="Confirm Password" />
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
