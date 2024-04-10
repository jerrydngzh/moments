// import { useState } from "react";
import { useEffect, useState } from "react";
import { useFirebaseAuth } from "../../../contexts/FirebaseAuth.context";
import { Navigate, useNavigate } from "react-router-dom";

export default function EmailVerification() {
  const [emailSent, setEmailSent] = useState(false);
  const { currentUser, firebaseVerifyEmail } = useFirebaseAuth();
  const navigate = useNavigate();

  if (currentUser !== null && currentUser.emailVerified) {
    return (
      <main>
        <h1>Your email is verified!</h1>
        <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
      </main>
    );
  } else if (currentUser === null) {
    return <Navigate to="/signin" />;
  }

  return (
    <main>
      <h1>Verify your email</h1>
      <button
        onClick={async () => {
          await firebaseVerifyEmail(currentUser);
          setEmailSent(true);
        }}
        disabled={emailSent}
      >
        Send verification email
      </button>
      {emailSent && <p>Email sent! Check your inbox. You may safely close this tab now</p>}
    </main>
  );
}
