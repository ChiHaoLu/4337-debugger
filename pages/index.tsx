import React from "react";
import Link from "next/link";

import Header from "./header";
import Footer from "./footer";

const Home = () => {
  return (
    <div className="container">
      <Header />
      <div className="gif-container">
        <img src="/chiikawa.GIF" alt="GIF" className="gif" />
      </div>
      <div className="link-container">
        <Link href="/explorer">
          <div className="link">Go to 4337 Explorer</div>
        </Link>
        <Link href="/debugger">
          <div className="link">Go to 4337 Debugger</div>
        </Link>
        <Link href="/imaccount-info">
          <div className="link">imToken AA Wallet Watcher</div>
        </Link>
        <Link href="/tool">
          <div className="link">Debug Toolkit</div>
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
