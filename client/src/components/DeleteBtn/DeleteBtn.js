import React from "react";
import "./DeleteBtn.css";

// The ...props means, spread all of the passed props onto this element
// That way we don't have to define them all individually
const DeleteBtn = props => (
  <span className="btn del" {...props}>
    ✗
  </span>
);

export default DeleteBtn;
