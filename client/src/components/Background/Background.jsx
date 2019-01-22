import React from 'react';
import './Background.css';

const Background = ({ tiles }) => (
  <div className="background">
    <div className="background-image">
      <div className="background-tile">
        {new Array(tiles).fill(null).map(tile => <img alt="stone" src="./images/stone.png" />)}
      </div>
    </div>
  </div>
);

export default Background;
