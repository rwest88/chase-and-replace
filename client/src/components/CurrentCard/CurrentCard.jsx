import React from "react";
import "./CurrentCard.css";

const CurrentCard = props => (
    <div>
        <img alt={props.rank} src={props.image} />
    </div>
  );
  
  export default CurrentCard;