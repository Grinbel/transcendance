import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMultiGameContext } from "./contexts/MultiGameContext.jsx";
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation } from 'react-i18next';

const MultiOptions = () => {
  const { t } = useTranslation();
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
          {`${t('nb_joueurs')}: ${playerCount}`}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item eventKey="2">2 {t('players')}</Dropdown.Item>
          <Dropdown.Item eventKey="3">3 {t('players')}</Dropdown.Item>
          <Dropdown.Item eventKey="4">4 {t('players')}</Dropdown.Item>
          <Dropdown.Item eventKey="5">5 {t('players')}</Dropdown.Item>
          <Dropdown.Item eventKey="6">6 {t('players')}</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {(playerCount === 2 || playerCount === 3) && (
        <Dropdown onSelect={(e) => setButtonCount(Number(e))}>
          <Dropdown.Toggle variant="primary">
            {`${t('nb_buttons')}: ${buttonCount}`}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item eventKey="1">1 {t('button')}</Dropdown.Item>
            <Dropdown.Item eventKey="2">2 {t('buttons')}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
      <Button variant="primary" onClick={handleStartGame}>{t('start game')}</Button>
    </div>
  );
};

export default MultiOptions;