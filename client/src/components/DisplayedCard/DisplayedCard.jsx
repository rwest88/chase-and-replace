import React from "react";
import "./DisplayedCard.css";

const DisplayedCard = props => (
  <div className="displayed-card">
    <img 
      className={props.cardAction ? 
        "current-card card-action" : 
        "current-card"}
      {...props}
    />
  </div>
);
  
export default DisplayedCard;
