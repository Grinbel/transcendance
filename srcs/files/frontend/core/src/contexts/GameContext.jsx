import React, { createContext, useContext, useState } from 'react';
import * as THREE from 'three';
const GameContext = createContext();

export const GameProvider = ({ children }) => {
	const defaultOptions = {
		//! PLACEHOLDERS

		real_game: 0,
		winner: '', //placeholder pour gagnant
		//! OPTIONS DES JOUEURS
		score_p1: 0,
		name_p1: 'Tac',
		name_p2: 'La Vache',
		score_p2: 0,
		player_speed: 0.1,
		player1_direction: 0,
		player2_direction: 0,

		//! OPTIONS DE L IA
		player_is_ia: 1,
		ia_time_between_checks: 60,
		ia_time_since_last_check: 0,
		ia_player_know_position: 0,
		ia_last_ball_x_position: 0,
		ia_last_ball_y_position: 0,
		ia_new_ball_x_position: 0,
		ia_new_ball_y_position: 0,
		ia_direction: 0,
		ia_ball_estimated_impact_y: 0,
		ia_ball_estimated_y_speed: 0,
		ia_ball_estimated_x_speed: 0,
		ia_this_point_time: 0,
		ia_last_time_ia_hit: 0,
		ia_last_time_ia_hit_x: 0,
		ia_last_time_ia_hit_y: 0,
		ia_this_point_bounces: 0,
		ia_just_hit: 0,
		player_just_hit: 0,
		nombre_ia_activees: 1,
		ia_position: '',

		//! OPTIONS DE DIMENSIONS / GRAPHISMES

		distance_from_wall: 0,
		ball_rotation_z: 1,
		player_size: 2,
		player_width: 1,
		player_height: 1,
		stage_height: 8,
		stage_width: 15,
		ball_radius: 0.5,

		//!OPTIONS SPECIFIQUES TOURNOI
		is_tournament: 0,
		rounds_results: [],
		avatar: [],
		usernames: [],
		texture_balls: [],

		//! OPTIONS DE GAMEPLAY
		easy_mode: 0,
		ball_starting_speed: 0.05,
		ball_speed: '',
		ball_x: 0,
		ball_y: 0,
		ball_z: 0,
		ball_x_speed: 0,
		ball_y_speed: 0,
		ball_pause: 0,
		ball_acc: 1.2,
		score_to_get: 15, //Score a obtenir pour gagner
		score_diff: 3, //ecart minimal pour gagner
		score_max: 25, // score a atteindre pour gagner sans ecart
		//! OPTIONS DE BUFFS / DEBUFFS
		frost_time: 2,

		//! OPTIONS DE SKINS)
		texture_ball: 'ballon_de_foot.jpg',
		texture_p1:
			'fmessina.jpg',
		texture_floor: 'terrain_foot.webp',
		texture_p2:
			'vache.webp',
		texture_eye:
			'sauron_2.jpg',
		wall_texture:
			'grille.jpg',
		texture_p1_ball: 1,
		texture_p2_ball: 1,
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
