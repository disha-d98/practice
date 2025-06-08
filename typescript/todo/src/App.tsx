import { useState, type JSX, useMemo, Children, useEffect } from "react";
import "./App.css";

const elements = "ABCDEFGHABCDEFGH";
const chunkSize = 4;

const rows: string[] = [];
for (let i = 0; i < elements.length / chunkSize; i++) {
  rows[i] = elements.slice(i * chunkSize, i * chunkSize + chunkSize);
}

function App(): JSX.Element {
  let timeout: ReturnType<typeof setTimeout>;
  const [visible, setVisible] = useState<Record<number, boolean>>({});

  const gameWon = Object.keys(visible).length === elements.length && Object.values(visible).every((v) => v);

  const [moveCounter, setMoveCounter] = useState<number>(0);
  const totalMoves = Math.floor(moveCounter / 2);

  const [currentPair, setCurrentPair] = useState<Array<number>>([-1 , -1]);

  const toggleVisible = (index: number) => {
    setVisible((prev) => {
      const newVisible = { ...prev };
      newVisible[index] = !newVisible[index];
      return newVisible;
      }
    );

    setMoveCounter(moveCounter + 1);
    setCurrentPair((curr) => {
      const newPair = [...curr];
      newPair[moveCounter%2] = index;
      return newPair;
    })
  }

  useEffect(() => {
    timeout = setTimeout(() => {
      if (gameWon) {
        alert("You won!");
        clearTimeout(timeout);
        return;
      }
      if(elements[currentPair[0]] !== elements[currentPair[1]]) {
        setCurrentPair([-1, -1]);
        setVisible((prev) => {
          const newVisible = { ...prev };
          newVisible[currentPair[0]] = false;
          newVisible[currentPair[1]] = false;
          return newVisible;
        })
      }else{
        console.log("good going")
      }

    }, 2000);

  }, [totalMoves])

  return (
    <div>
      {rows.map((row, r) => {
        return (
          <div  className="rowContainer">
            {row.split("").map((char, c) => (
              <span onClick={() => toggleVisible((r*chunkSize + c))} className="block">{ visible[(r*chunkSize + c)] ===true ? char : " "}</span>
            ))}
          </div>
        );
      })}
      Moves: {totalMoves}
    </div>
  );
}

export default App;
