import React from "react";
import "./HUD.css";

const HUD = props => (

  <React.Fragment>
    <form>
      <div className="form-group">
        <label for="rule-name">Rule Name</label>
        <input type="text" className="form-control" id="enter-rule-name" placeholder="Enter a snazzy name" />
      </div>
      <div className="form-group">
        <label for="rule-instructions">Instructions</label>
        <textarea className="form-control" id="enter-rule-instructions" placeholder="e.g., no eye-contact" rows="3" />
      </div>
      <button onClick={() => props.sendRule()} className="btn btn-primary">Submit</button>
    </form>

  </React.Fragment>
);

export default HUD;