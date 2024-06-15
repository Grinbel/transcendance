import React, { createContext, useContext, useState } from 'react';
import * as THREE from 'three';
const GameContext = createContext();

export const GameProvider = ({ children }) => {
        const defaultOptions = {

//! PLACEHOLDERS

        real_game : 0,
        winner : '', //placeholder pour gagnant
//! OPTIONS DES JOUEURS
        score_p1 : 0,
        name_p1 : "Tac",
        name_p2 : "La Vache",
        score_p2 : 0,
        player_speed  : 0.1,
        player1_direction : 0,
        player2_direction : 0,

//! OPTIONS DE L IA
        player_is_ia : 1,
        ia_time_between_checks : 60,
        ia_time_since_last_check : 0,
        ia_player_know_position : 0,
        ia_last_ball_x_position : 0,
        ia_last_ball_y_position : 0,
        ia_new_ball_x_position : 0,
        ia_new_ball_y_position : 0,
        ia_direction : 0,
        ia_ball_estimated_impact_y : 0,
        ia_ball_estimated_y_speed : 0,
        ia_ball_estimated_x_speed : 0,
        ia_this_point_time : 0,
        ia_last_time_ia_hit : 0,
        ia_last_time_ia_hit_x : 0,
        ia_last_time_ia_hit_y : 0,
        ia_this_point_bounces : 0,
        ia_just_hit : 0,
        player_just_hit : 0,
        nombre_ia_activees : 1,
        ia_position : '',

//! OPTIONS DE DIMENSIONS / GRAPHISMES

        distance_from_wall : 0,
        ball_rotation_z : 1,
        player_size : 2,
        player_width : 1,
        player_height : 1,
        stage_height : 8,
        stage_width : 15,
        ball_radius : 0.5,

//!OPTIONS SPECIFIQUES TOURNOI
        is_tournament : 0,
        rounds_results : [],
        avatar : [],
        usernames : [],
        texture_balls : [],

//! OPTIONS DE GAMEPLAY
        easy_mode : 0,
        ball_starting_speed : 0.02,
        ball_speed : '',
        ball_x : 0,
        ball_y : 0,
        ball_z : 0,
        ball_x_speed : 0,
        ball_y_speed : 0,
        ball_pause : 0,
        ball_acc : 1.2,
        score_to_get : 15, //Score a obtenir pour gagner
        score_diff : 3, //ecart minimal pour gagner
        score_max : 25, // score a atteindre pour gagner sans ecart
            //! OPTIONS DE BUFFS / DEBUFFS
        p1_is_frozen : 0,
        p2_is_frozen : 0,
        frost_time : 2,
        min_time_before_powerup : 10,
        max_time_before_powerup : 50,
        ball_is_powerup : 0,
        power_up_on_screen : 0,
        powerups : 1,
    


//! OPTIONS DE SKINS)
        texture_ball : 'https://thumbs.dreamstime.com/b/bille-de-football-de-texture-13533294.jpg',
        texture_p1 : 'https://cdn.intra.42.fr/users/ed6e227d33ac3fe0670ab0765747b72e/fmessina.jpg',
        texture_floor : 'https://t2.uc.ltmcdn.com/fr/posts/8/4/8/quelle_est_la_taille_d_un_terrain_de_football_12848_600.webp',
        texture_p2 : 'https://media.4-paws.org/b/3/7/9/b3791e0f2858422701916ca7274fd9b65b584c93/VIER%20PFOTEN_2015-04-27_010-1927x1333-1920x1328.webp',
        texture_eye : 'https://media.ouest-france.fr/v1/pictures/MjAyMTA3NTYyMzgxMTg4YWZlMzI2YjY3N2VjZGExZTUxOTkxNmY?width=1260&focuspoint=50%2C24&cropresize=1&client_id=bpeditorial&sign=95034bcb2a35dc8397c6791fde91c71f9a73e28d620a686b1027cc99439a0bb4',
        wall_texture : 'https://png.pngtree.com/element_origin_min_pic/17/09/10/92d43f628122927e219612df377cc4a0.jpg',
        texture_p1_ball : 1,
        texture_p2_ball : 1,


    };

    const [options, setOptions] = useState(defaultOptions);

    const resetOptions = () => setOptions(defaultOptions);

    return (
        <GameContext.Provider value={{ options, setOptions, resetOptions }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => {
    return useContext(GameContext);
};
