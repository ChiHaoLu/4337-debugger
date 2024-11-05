import React from "react";
import Link from "next/link";

import Header from "./header";

const Home = () => {
  return (
    <div className="container">
      <Header />
      <div className="link-container">
        <Link href="/explorer">
          <div className="link">Go to 4337 Explorer</div>
        </Link>
        <Link href="/debugger">
          <div className="link">Go to 4337 Debugger</div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
