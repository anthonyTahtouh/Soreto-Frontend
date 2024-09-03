import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="App">
      <h3>Home</h3>
      <Link to="/category">Category</Link>
      <br />
      <Link to="/about">About</Link>
    </div>
  );
}

export default Home;
