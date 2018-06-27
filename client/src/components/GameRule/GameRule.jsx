import React from "react";
import "./GameRule.css";

const GameRule = props => (
    <div className="game-rule">
      <img src={props.image}/>
      <button>{props.name}
      </button>

    </div>
  );

export default GameRule;