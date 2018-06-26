import React from "react";
import "./CurrentCard.css";

const CurrentCard = props => (
    <div>
        <img alt={props.rank} src={props.image} className={props.className} />
    </div>
  );
  
  export default CurrentCard;