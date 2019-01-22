import React from "react";
import "./GameRule.css";

const GameRule = props => (
  <div className="game-rule dropup">
    <img src={`./images/${props.rank}s.png`} />
    <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      {props.name}
    </button>
    <div class="dropdown-menu">
      <p>{props.instructions}</p>
    </div>
  </div>
);

export default GameRule;