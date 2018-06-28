import React from "react";
import "./GameRule.css";

const GameRule = props => (
    <div className="game-rule">
      <img src={`./images/${props.rank}s.png`}/>
      <button>{props.name}
      </button>

    </div>
  );

export default GameRule;