import React from "react";
import "./HUD.css";

const HUD = props => (

  <React.Fragment>
    <form>
      <div className="form-group">
        <label for="exampleInputEmail1">Rule Name</label>
        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter a snazzy name" />
      </div>
      <div className="form-group">
        <label for="exampleInputPassword1">Instructions</label>
        <textarea className="form-control" id="enter-rule-instructions" placeholder="e.g., no eye-contact" rows="3" />
      </div>
      <button  className="btn btn-primary">Submit</button>
    </form>

  </React.Fragment>
);

export default HUD;