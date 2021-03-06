import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import './Board.css';
import Card from './Card';
import NewCardForm from './NewCardForm';


const Board = (props) => {

  const [cardList, setCardList] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const getCardsURLEndpoint = props.url + props.boardName + "/cards"
  const cardsURLEndpoint = props.url + "/cards/"
  
  useEffect(() => {
    axios.get(getCardsURLEndpoint)
    .then( (response) => {
      const apiCardList = response.data.map((apiCard) => {
        return {
          id: apiCard['card']['id'],
          text: apiCard['card']['text'],
          emoji: apiCard['card']['emoji'],
        }
      });
      setCardList(apiCardList);
    })
    .catch((error) => {
      setErrorMessage(error.message);
      console.log(errorMessage);
    });
  },[]);

  const deleteCard = (cardID) => {
    const availableCards = cardList.filter((card) => { 
      return card.id !== cardID;
    })

    axios.delete(cardsURLEndpoint + cardID)
    .then((response) => {
      console.log(`${cardID} was deleted.`)
      setCardList(availableCards)
    })
    .catch((error) => {
      setErrorMessage(error.message);
      console.log(`Whoops, card not deleted: ${errorMessage}`)
    });
  }

  const addCard = (card) => {
    axios.post(getCardsURLEndpoint,card)
    .then((response) => {
      const newCard = response.data.card;
      const newCardList = [...cardList, newCard];
      setCardList(newCardList);
    })
    .catch((error) => {
      setErrorMessage(error.message);
      console.log(`Whoops, card not created: ${errorMessage}`);
    });
  }
  const updateCard = (cardID) => {
    const availableCards = cardList.filter((card) => {
      return card.id !== cardID;
    })

    axios.patch(cardsURLEndpoint + cardID)
    .then((response) => {
      console.log(`${cardID} was updated.`)
      setCardList(availableCards)
    })
    .catch((error) => {
      setErrorMessage(error.message);
      console.log(`Whoops, card was not updated: ${errorMessage}`)
    });
  }

  const cards = cardList.map((card) => {
      return (<Card 
      key={card.id}
      id={card.id}
      text={card.text ? card.text : ''}
      emoji={card.emoji ? card.emoji : ''}
      onDeleteCardCallback = {deleteCard}
      onUpdateCardCallback = {updateCard}
      setError={setErrorMessage}
      />
      )
    });
  
  
  
    return (
      <div>
        <NewCardForm onAddCardCallback={addCard} setError={setErrorMessage} />
        <h1 className='validation-errors-display'> {errorMessage}</h1>
        <main className='board'>
          { cards }
        </main>
      </div>
    )
}

Board.propTypes = {
  url: PropTypes.string.isRequired,
  boardName: PropTypes.string.isRequired
};

export default Board;
