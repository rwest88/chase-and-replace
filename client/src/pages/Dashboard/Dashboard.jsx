import React, { Component } from "react";
import Nav from "../../components/Nav";
import CurrentCard from "../../components/CurrentCard";
import API from "../../utils/API";
import { Link } from "react-router-dom";
import cards from "./cards.json";
import "./Dashboard.css";

class Dashboard extends Component {
  state = {
    burnedCards: [],
    currentRule: "",
    currentCard: "",
    cards
  };  

  componentDidMount() {
    this.shuffleArray(cards);
    console.log(this.state.cards)
  }

  shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  drawCard = () => {
    const card = cards.pop();
    const newBurn = this.state.burnedCards;
    newBurn.push(card);
    
    this.setState({
      currentCard: card,
      burnedCards: newBurn
    });
  };


  render() {
    return (
      <React.Fragment>

        <Nav />

        <div className="wrapper">
          
          <div className="app-title">App Title</div>
          <div className="game-title">Game Title</div>
          <div className="author">Author</div>
          <div className="version">Version</div>
          
          <div className="decks">
            <img src="./images/deck.png" className="deck" onClick={()=>this.drawCard()}/>
          </div>
          
          <div className="current-cards">
            {/* <CurrentCard rank={this.state.currentCard.rank} image={this.state.currentCard.image} className="current-card"/> */}
            <img alt={this.state.currentCard.rank} src={this.state.currentCard.image} className="current-card"/>
          </div>
          
          <div className="king-rules">King Rules</div>
          <div className="game-rules">Game Rules</div>

          <div className="burned-cards">
            {this.state.burnedCards.map(card=>(
            <img alt={card.rank} src={card.image} className="burned-card" />))}
          </div>

          <div className="HUD">Heads-Up Display</div>
          
        </div>

        <div className="footer" />

      </React.Fragment>

    );
  }
}

export default Dashboard;
