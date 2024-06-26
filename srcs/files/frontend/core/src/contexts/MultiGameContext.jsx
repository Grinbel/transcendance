import React, { createContext, useContext, useState } from 'react';
import * as THREE from 'three';
const MultiGameContext = createContext();

export const MultiGameProvider = ({ children }) => {
    const [options, setOptions] = useState({

//! PLACEHOLDERS
        language : 'en',
        winner : '', //placeholder pour gagnant
//! OPTIONS DES JOUEURS

        nb_players : 7,
        player_speed  : 0.06,
        nb_buttons : 1,


//! OPTIONS DE DIMENSIONS / GRAPHISMES

        players_size : (Math.PI /2) *1.5,
        ball_rotation_z : 1,
        player_size : 2,
        player_width : .05,
        player_height : 1,
        stage_radius : 5,
        ball_radius : 0.5,

//! OPTIONS DE GAMEPLAY
        ball_starting_speed : 0.02,
        ball_speed : '',
        ball_x : 0,
        ball_y : 0,
        ball_z : 0,
        ball_x_speed : 0,
        ball_y_speed : 0,
        ball_pause : 0,
        ball_acc : 1.1,
        ball_bounces : 0,
        score_to_get : 30, //Score a obtenir pour gagner
        score_diff : 5, //ecart minimal pour gagner
        score_max : 100000000, // score a atteindre pour gagner sans ecart
            //! OPTIONS DE BUFFS / DEBUFFS
    


//! OPTIONS DE SKINS)
        texture_ball : '/opacity.png',
        texture_floor : 'wall.jpg',
        wall_texture : 'grille.jpg',



    });

    return (
        <MultiGameContext.Provider value={{ options, setOptions }}>
            {children}
        </MultiGameContext.Provider>
    );
};

export const useMultiGameContext = () => {
    return useContext(MultiGameContext);
};

