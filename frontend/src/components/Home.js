// src/components/Home.js
import React from "react";
import Signup from "./Signup";

function Home({ setUser }) {
  return (
    <div>
      <h1>Welcome to Power Plan Finder</h1>
      <Signup setUser={setUser} />
    </div>
  );
}

export default Home;