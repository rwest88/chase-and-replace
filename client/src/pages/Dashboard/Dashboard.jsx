import React, { Component } from "react";
import CurrentCard from "../../components/CurrentCard";
import API from "../../utils/API";
import { Link } from "react-router-dom";
import cards from "./cards.json";


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
    const newBurn= this.state.burnedCards
    newBurn.push(card)
    
    this.setState({
      currentCard: card,
      burnedCards: newBurn
      
    })
    
    
    
    
  };


  render() {
    return (
      <div>
        <img src="./images/deck.png" onClick={()=>this.drawCard()}/>
        <CurrentCard rank={this.state.currentCard.rank} image={this.state.currentCard.image}/>
        
        {this.state.burnedCards.map(card=>(

        <CurrentCard rank={card.rank} image={card.image}/>))}
        

      </div>

    );
  }
}

export default Dashboard;
