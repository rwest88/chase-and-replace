import React from "react";
import "./HUD.css";

class HUD extends React.Component {

  state = {
    name: "",
    instructions: "",
    kingRules: []
  };

  setRule(name, instructions, rank) {
    const kings = this.state.kingRules || [];
    kings.push({
      name,
      instructions
    });
    this.setState({kingRules: kings}); // update later for any rank
  }

  // handle any changes to the input fields
  handleInputChange = event => {
    // Pull the name and value properties off of the event.target (the element which triggered the event)
    const { name, value } = event.target;

    // Set the state for the appropriate input field
    this.setState({
      [name]: value
    });
  };

  // When the form is submitted, prevent the default event and alert the username and password
  handleFormSubmit = event => {
    event.preventDefault();
    this.props.setRule(this.state.name, this.state.instructions);
    this.setState({ name: "", instructions: "" });
  };

  render() {
    return (
      <form>
        <p>Enter Rule Name:</p>
        
        <input
          type="text"
          placeholder="name"
          name="name"
          value={this.state.name}
          onChange={this.handleInputChange}
        />
        <p>Enter Instructions:</p>
        <textarea
          type="text"
          placeholder="intsructions"
          name="instructions"
          value={this.state.intsructions}
          onChange={this.handleInputChange}
        />
        <button 
          onClick={this.handleFormSubmit}>Submit
        </button>
      </form>
    );
  }
}  

  
  
  
//   <React.Fragment>
//     <form>
//       <div className="form-group">
//         <label for="rule-name">Rule Name</label>
//         <input type="text" className="form-control" id="enter-rule-name" placeholder="Enter a snazzy name" />
//       </div>
//       <div className="form-group">
//         <label for="rule-instructions">Instructions</label>
//         <textarea className="form-control" id="enter-rule-instructions" placeholder="e.g., no eye-contact" rows="3" />
//       </div>
//       <button onClick={this.handleFormSubmit}>Submit</button>
//     </form>

//   </React.Fragment>
// }

export default HUD;