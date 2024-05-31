import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMultiGameContext } from "./contexts/MultiGameContext.jsx";
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';

const MultiOptions = () => {
  const { setOptions: setMultiGameOptions } = useMultiGameContext();
  const navigate = useNavigate();
  const [playerCount, setPlayerCount] = useState(2);
  const [buttonCount, setButtonCount] = useState(1);

  const handleStartGame = () => {
    setMultiGameOptions(prevOptions => ({
      ...prevOptions,
      nb_players : playerCount,
      nb_buttons : buttonCount,
    }));
    navigate('/multigame');
  };

  return (
    <div>
      <Dropdown onSelect={(e) => setPlayerCount(Number(e))}>
        <Dropdown.Toggle variant="primary">
          {`Player Count: ${playerCount}`}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item eventKey="2">2 Players</Dropdown.Item>
          <Dropdown.Item eventKey="3">3 Players</Dropdown.Item>
          <Dropdown.Item eventKey="4">4 Players</Dropdown.Item>
          <Dropdown.Item eventKey="5">5 Players</Dropdown.Item>
          <Dropdown.Item eventKey="6">6 Players</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {(playerCount === 2 || playerCount === 3) && (
        <Dropdown onSelect={(e) => setButtonCount(Number(e))}>
          <Dropdown.Toggle variant="primary">
            {`Button Count: ${buttonCount}`}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item eventKey="1">1 Button</Dropdown.Item>
            <Dropdown.Item eventKey="2">2 Buttons</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
      <Button variant="primary" onClick={handleStartGame}>Start Game</Button>
    </div>
  );
};

export default MultiOptions;