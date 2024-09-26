import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import "./styles.css";

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Welcome to FeurOfCode</h1>
      <p>
        Discover the world of coding, enhance your skills, and participate in
        exciting coding competitions. Join our community of passionate
        developers today!
      </p>
      {isAuthenticated ? <LogoutButton /> : <LoginButton />}
    </div>
  );
}

export default App;
