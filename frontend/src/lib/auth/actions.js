import { authClient } from "../authClient.js"; //import the auth client

export const signUpWithEmail = async ({ email, password, callbackURL = "/home" }) => {
  if (!email || !password) {
    return { data: null, error: { message: "Missing required fields!" } };
  }

  const { data, error } = await authClient.signUp.email(
    {
      email, // user email address
      password, // user password -> min 8 characters by default
      // name, // user display name
      callbackURL: "/home", // A URL to redirect to after the user verifies their email (optional)
    },
    {
      onRequest: (ctx) => {
        //show loading
      },
      onSuccess: (ctx) => {
        //redirect to the dashboard or sign in page
      },
      onError: (ctx) => {
        // display the error message
        alert(ctx.error.message);
      },
    },
  );
};
