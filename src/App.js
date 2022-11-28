import { useState } from "react";
import styled from "styled-components";
import palavras from "./palavras";
import Jogo from './Jogo';
import Letras from './Letras';
import Chute from './Chute';

const alfabeto = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
let currentWord = "";
let playsCount = 0;
let gameOver = false;
let wordNormalized;

export default function App() {
  const [word, setWord] = useState("");
  const [pressed, setPressed] = useState([...alfabeto]);

  function startGame() {
    const randomIndex = Math.floor(Math.random() * palavras.length);
    currentWord = palavras[randomIndex];
    wordNormalized = currentWord.normalize("NFD").replace(/[^a-zA-Z\s]/g, "");
    playsCount = 0;
    gameOver = false;

    setWord(currentWord.split("").map(e => "_").join(""));
    setPressed([...alfabeto]);
  }

  function selectLetter(index) {
    const letter = alfabeto[index];
    const newArr = word.split("");
    let found = false;
    for (let i = 0; i < currentWord.length; i++) {
      if (wordNormalized[i] === letter) {
        newArr[i] = currentWord[i];
        found = true;
      }
    }

    const newWord = newArr.join("");
    setWord(newWord);
    if (newWord === currentWord) {
      gameOver = true;
      return;
    }
    const newPressed = [...pressed]; newPressed[index] = false;
    setPressed(newPressed);
    if (!found) playsCount++;

    if (playsCount > 5) {
      setWord(currentWord);
      gameOver = true;
    }
  }

  function guessWord(e) {
    const input = e.target[0];
    const inputWord = input.value.toLowerCase();
    e.preventDefault();

    if (inputWord !== wordNormalized && inputWord !== currentWord) playsCount = 6;
    input.value = "";
    
    setWord(currentWord);
    gameOver = true;
  }

  return (
    <Main>
      <Jogo playsCount={playsCount} startGame={startGame} gameOver={gameOver} word={word} />
      <Letras word={word} gameOver={gameOver} alfabeto={alfabeto} pressed={pressed} selectLetter={selectLetter} />
      <Chute guessWord={guessWord} />
    </Main>
  );
}

const Main = styled.div`
  margin-top: 32px;
  font-family: 'JetBrains Mono', monospace;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;