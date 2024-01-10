import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import Confetti from "react-confetti";

const gameIcons = ["😊", "👀", "🎂", "🌹", "🛺", ":👓"];
type pieceArr = {
  emoji: string;
  flipped: boolean;
  solved: boolean;
  position: number;
};

function App() {
  const [pieces, setPieces] = useState<pieceArr[]>([]);
  const timeout: React.MutableRefObject<undefined | number> = useRef();

  const isGameCompleted = useMemo(() => {
    if (pieces.length > 0 && pieces.every((piece) => piece.solved)) {
      return true;
    } else {
      return false;
    }
  }, [pieces]);

  const startGame = () => {
    const duplicateGameIcons = [...gameIcons, ...gameIcons];
    const newGameItems = [];
    //console.log(duplicategameIcons);
    while (newGameItems.length < gameIcons.length * 2) {
      const randomIndex = Math.floor(Math.random() * duplicateGameIcons.length);
      newGameItems.push({
        emoji: duplicateGameIcons[randomIndex],
        flipped: false,
        solved: false,
        position: newGameItems.length,
      });
      duplicateGameIcons.splice(randomIndex, 1);
    }

    setPieces(newGameItems);
  };

  const handleActive = (data: pieceArr) => {
    const flippedData = pieces.filter((data) => data.flipped && !data.solved);
    if (flippedData.length === 2) return;

    const newPices = pieces.map((piece) => {
      if (piece.position === data.position) {
        piece.flipped = !piece.flipped;
      }
      return piece;
    });
    setPieces(newPices);
  };

  const gameLogicForFlipped = () => {
    console.log(pieces);
    const flippedData = pieces.filter((data) => data.flipped && !data.solved);
    console.log(flippedData);
    if (flippedData.length === 2) {
      timeout.current = setTimeout(() => {
        setPieces(
          pieces.map((piece) => {
            if (
              piece.position === flippedData[0].position ||
              piece.position === flippedData[1].position
            ) {
              if (flippedData[0].emoji === flippedData[1].emoji) {
                piece.solved = true;
              } else {
                piece.flipped = false;
              }
            }
            return piece;
          })
        );
      }, 800);
    }
  };

  useEffect(() => {
    startGame();
  }, []);

  // const checkIfGameFinished = () => {
  //   if (pieces.every((piece) => piece.solved)) {
  //     console.log("Solved");
  //   } else {
  //     console.log("Not Solved");
  //   }
  // };

  useEffect(() => {
    gameLogicForFlipped();
    return () => {
      clearTimeout(timeout.current);
    };

    // if (pieces.length > 0) {
    //   checkIfGameFinished();
    // }
  }, [pieces]);

  //console.log(pieces);
  return (
    <main className="home-page">
      <h1>Memory Game in React</h1>
      <div className="container">
        {pieces.map((data, index) => (
          <div
            className={`flip-card  ${
              data.flipped || data.solved ? "active" : ""
            }`}
            key={index}
            onClick={() => handleActive(data)}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front" />
              <div className="flip-card-back">{data.emoji}</div>
            </div>
          </div>
        ))}
      </div>

      {isGameCompleted && (
        <div className="game-completed">
          <h1>YOU WIN!!!</h1>
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        </div>
      )}
    </main>
  );
}

export default App;
