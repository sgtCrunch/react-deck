import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ncl from "./NCL.png";
import "./Deck.css";

const DECK_URL = "https://deckofcardsapi.com/api/deck/";

function Deck() {
    const [deck, setDeck] = useState(null);
    const [pile, setPile] = useState([]);

    const deckButton = useRef();
    const drawButton = useRef();

    useEffect(() => {
        async function fetchDeck(){
            const deckInfo = await axios.get(DECK_URL+"new/shuffle");
            setDeck(deckInfo.data);
        }
        fetchDeck();
    }, []);

    async function drawCard(){
        const cardInfo = await axios.get(DECK_URL+deck.deck_id+"/draw/?count=1");
        if(!cardInfo.data.success){
            setPile([ncl]);
            drawButton.current.disabled = true;
            return;
        }
        setPile([...pile, cardInfo.data.cards[0].images.png]);
    }

    function renderPile() {
        return (
            <div className="pile">
                {pile.map(card => (<img src={card} alt={card}/>))}
            </div>
        );
    }

    async function shuffleDeck(){
        deckButton.current.disabled = true;
        await axios.get(DECK_URL + deck.deck_id + "/shuffle/");
        setPile([]);
        deckButton.current.disabled = false;
        drawButton.current.disabled = false;
    }

    return (
        <div className="DeckArea">

            {deck ? <button onClick={drawCard} ref={drawButton}>Draw a Card</button> : <i>(loading)</i>}

            {deck ? <button onClick={shuffleDeck} ref={deckButton}>Shuffle Deck</button> : <i>(loading)</i>}
            <br/>
            <br/>
            {renderPile()}

        </div>
    )



}

export default Deck;