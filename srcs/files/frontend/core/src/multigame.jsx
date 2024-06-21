import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Text } from 'troika-three-text';
import { useMultiGameContext } from './contexts/MultiGameContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function getCurrentLocation() {
	return window.location.href;
}

function MultiGame() {
	const { t } = useTranslation();
	const { options } = useMultiGameContext();
	const navigate = useNavigate();
	options.ball_speed = options.ball_starting_speed;
	let fontSize = window.innerWidth * 0.01 * window.innerHeight;
	useEffect(() => {
		if (options.nb_players === 7) return navigate('/');
		let starting_location = getCurrentLocation();

		let loader = new THREE.TextureLoader();
		let texture_floor = loader.load(options.texture_floor);
		let texture = loader.load(options.texture_ball);
		let scores = [options.nb_players];
		let players_text = [options.nb_players];
		let player_depth = options.ball_radius * 2;
		let directions = [options.nb_players];
		for (let i = 0; i < options.nb_players; i++) {
			directions[i] = 0;
		}
		let directions_r = [options.nb_players];
		for (let i = 0; i < options.nb_players; i++) {
			directions_r[i] = 1;
		}
		let player_angle = options.players_size / (options.nb_players + 1);
		let player_textures = [
			'/yoshi.jpg',
			'/princess.jpg',
			'/ponge.jpg',
			'/badboy.png',
			'/players.jpg',
			'/beaudibe.jpg',
		];
		let player_names = [
			'Yoshi',
			'Peach',
			'Bob',
			'Bowser',
			'Mario',
			'Benoit le BG',
		];

		function create_player(text_to_use, which) {
			if (which % 2 == 1) which = (which / 2) * -1;
			else which = which / 2;
			const innerRadius = options.stage_radius + options.player_width * which;
			const outerRadius =
				options.stage_radius + options.player_width * (which + 1);
			const arcAngle = player_angle;
			const shape = new THREE.Shape();

			const startAngle = -arcAngle / 2;
			const endAngle = arcAngle / 2;

			shape.moveTo(
				innerRadius * Math.cos(startAngle),
				innerRadius * Math.sin(startAngle)
			);

			shape.absarc(0, 0, innerRadius, startAngle, endAngle, false);
			shape.lineTo(
				outerRadius * Math.cos(endAngle),
				outerRadius * Math.sin(endAngle)
			);
			shape.absarc(0, 0, outerRadius, endAngle, startAngle, true);
			shape.lineTo(
				innerRadius * Math.cos(startAngle),
				innerRadius * Math.sin(startAngle)
			);

			const extrudeSettings = {
				steps: 2,
				depth: player_depth,
				bevelEnabled: true,
				bevelThickness: 0,
				bevelSize: 0,
				bevelOffset: 0,
				bevelSegments: 5,
			};

			const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
			const material = new THREE.MeshBasicMaterial({
				map: loader.load(text_to_use),
			});

			const mesh = new THREE.Mesh(geometry, material);
			mesh.rotation.y = Math.PI;
			return mesh;
		}
		class Player {
			constructor(x) {
				this.mesh = create_player(player_textures[x], x);

				this.hit = 0;
				scene.add(this.mesh);
				this.mesh.rotation.z = ((Math.PI * 2) / options.nb_players) * x;
				this.last_hit = 0;
				this.mesh.position.z = options.ball_radius * 2;
			}
			setPosition(x, y, z) {
				this.mesh.position.set(x, y, z);
			}
		}

		const scene = new THREE.Scene();
		const ground_geometry = new THREE.CircleGeometry(
			options.stage_radius + (options.nb_players / 2) * options.player_width,
			1012
		);
		const ground_material = new THREE.MeshBasicMaterial({ map: texture_floor });
		const ground = new THREE.Mesh(ground_geometry, ground_material);
		scene.add(ground);

		const camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		const renderer = new THREE.WebGLRenderer();
		camera.lookAt(new THREE.Vector3(0, 0, 0));
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.domElement.style.position = 'absolute';
		renderer.domElement.style.top = 0;
		renderer.domElement.style.left = 0;
		renderer.domElement.style.zIndex = 1000;
		renderer.domElement.style.width = '100%';
		renderer.domElement.style.height = '100%';
		document.body.appendChild(renderer.domElement);
		const ball_form = new THREE.SphereGeometry(options.ball_radius, 32, 32);

		function player_buttons() {
			let message = '';
			message += t('move_buttons') + '<br>';
			if (options.nb_buttons === 1) {
				message += t('1_button') + '<br>';
				message += t('on_press') + '<br>';
				message += player_names[0] + ' : Q <br>';
				message += player_names[1] + ' : 9 <br>';
				if (options.nb_players > 2) message += player_names[2] + ' : C <br>';
				if (options.nb_players > 3) message += player_names[3] + ' : 1 <br>';
				if (options.nb_players > 4) message += player_names[4] + ' : U <br>';
				if (options.nb_players > 5) message += player_names[5] + ' : > <br>';
			} else {
				message += player_names[0] + ' : A et D <br>';
				message += player_names[1] + ' : 4 et 6 <br>';
				if (options.nb_players > 2)
					message += player_names[2] + ' : U et O <br>';
			}
			return message;
		}
		function clear_components(component) {
			scene.remove(component);
			if (component.geometry) component.geometry.dispose();
			if (component.material) component.material.dispose();
			if (component.texture) component.texture.dispose();
		}
		function show_rules() {
			let message;
			message = t('rules') + '<br>';
			message += t('engage') + '<br>';
			message += t('on_bounce') + '<br>';
			message += t('on_bounce2') + '<br>';
			message += t('on_exit') + '<br>';
			message +=
				t('multi_to_get') +
				options.score_to_get +
				t('multi_to_get2') +
				options.score_diff +
				t('multi_to_get3') +
				'<br>';
			return message;
		}
		//* PREPARATION DU POPUP
		const dialogContainer = document.createElement('div');
		dialogContainer.id = 'dialog-renderer';
		dialogContainer.style.position = 'absolute';
		dialogContainer.style.top = '25%';
		dialogContainer.style.left = '25%';
		dialogContainer.style.width = '50%';
		dialogContainer.style.height = '50%';
		dialogContainer.style.zIndex = 1001;
		dialogContainer.style.color = 'white';
		dialogContainer.style.backgroundColor = `rgba(1,1,0, 0.2)`;
		dialogContainer.style.borderRadius = '25%';
		// dialogContainer.style.opacity= '30%';
		dialogContainer.style.display = 'flex';
		dialogContainer.style.justifyContent = 'center';
		dialogContainer.style.alignItems = 'center';
		document.body.appendChild(dialogContainer);
		const message = document.createElement('p');
		message.style.textAlign = 'center';
		message.innerHTML = t('welcome_multi');
		message.innerHTML +=
			t('goal_1') +
			options.score_to_get +
			t('goal_2') +
			options.score_diff +
			t('goal_3');
		message.innerHTML += t('pause_button');
		message.innerHTML += t('rules_button');
		message.innerHTML += player_buttons();
		message.innerHTML += t('start_button');
		dialogContainer.appendChild(message);
		const dialogRenderer = new THREE.WebGLRenderer();
		dialogRenderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
		dialogRenderer.domElement.style.position = 'absolute';
		dialogRenderer.domElement.style.top = 0;
		dialogRenderer.domElement.style.left = 0;
		dialogRenderer.domElement.style.zIndex = 1001;
		dialogContainer.appendChild(dialogRenderer.domElement);
		renderer.domElement.style.filter = 'blur(5px)';
		options.ball_pause = -1;
		function create_text(to_show) {
			const text = new Text();
			text.text = to_show;
			text.font = 'KFOmCnqEu92Fr1Mu4mxP.ttf';
			let size = 8;
			text.fontSize = (1 * 5) / size;
			text.color = 0x0000ff;
			text.rotation.x = Math.PI / 2;
			text.position.y = options.stage_radius;
			text.sync();
			scene.add(text);
			return text;
		}
		for (let i = 0; i < options.nb_players; i++) {
			scores[i] = 0;
			players_text[i] = create_text(player_names[i] + ' ' + scores[i]);
			players_text[i].position.x = (i % 3) * 5 - options.stage_radius;
			players_text[i].position.z =
				Math.floor(i / 3) * 2 * options.ball_radius + 2;
		}

		const ball_material = new THREE.MeshBasicMaterial({ map: texture });
		const ball_render = new THREE.Mesh(ball_form, ball_material);
		scene.add(ball_render);
		ball_render.position.z = options.ball_radius;
		options.ball_angle = Math.random() * Math.PI;

		const players = [];
		for (let i = 0; i < options.nb_players; i++) {
			players.push(new Player(i));
		}

		function ball_reset() {
			resetTrail();
			options.ball_x =
				Math.random(options.stage_radius - options.ball_radius * 2) -
				options.stage_radius / 2 +
				options.ball_radius;
			options.ball_y =
				Math.random(options.stage_radius - options.ball_radius * 2) -
				options.stage_radius / 2 +
				options.ball_radius;
			options.ball_speed = options.ball_starting_speed;
			options.ball_angle = Math.random() * Math.PI;
			let hitters = 0;
			for (let i = 0; i < options.nb_players; i++) {
				if (players[i].last_hit) hitters++;
			}
			if (hitters) {
				hitters = Math.trunc(options.ball_bounces / hitters);
				for (let i = 0; i < options.nb_players; i++) {
					if (players[i].last_hit) {
						scores[i] += hitters;
						players[i].last_hit = 0;
					}
				}
				let sortedScores = [...scores].sort((a, b) => b - a);
				if (
					sortedScores[0] - sortedScores[1] >= options.score_diff &&
					sortedScores[0] >= options.score_to_get
				) {
					options.ball_pause = -1;
					scene.clear();
					for (let i = 0; i < options.nb_players; i++) {
						scene.remove(players[i].mesh);
						clear_components(players[i].mesh);
						scene.remove(players_text[i]);
						players_text[i].dispose();
					}
					clear_components(ball_render);
					clear_components(ground);
					window.removeEventListener('keydown', handleKeyDown, false);
					window.removeEventListener('keyup', handleKeyUp, false);
					window.removeEventListener('mousemove', handleMouseMove);
					window.addEventListener('keydown', handleKeyDown_2, false);
					return endgame();
				}
			}

			options.ball_pause = 30;
			options.ball_bounces = 0;
			let maxValue = Math.max(...scores);
			let minValue = Math.min(...scores);
			for (let i = 0; i < options.nb_players; i++) {
				players_text[i].text = player_names[i] + ' : ' + scores[i];
				if (scores[i] === maxValue) {
					players_text[i].color = 0x00ff00;
				} else if (scores[i] === minValue) {
					players_text[i].color = 0xff0000;
				} else players_text[i].color = 0x0000ff;
			}
		}
		const trailSpheres = [];
		const trailFactor = 20; // longueur de la traînée

		function createTrailSphere(position, rotation, texture) {
			const geometry = new THREE.SphereGeometry(
				options.ball_radius * 0.8,
				32,
				32
			);
			const material = new THREE.MeshBasicMaterial({
				map: texture,
				transparent: true,
				opacity: 1.0,
			});
			const sphere = new THREE.Mesh(geometry, material);
			sphere.position.copy(position);
			sphere.rotation.copy(rotation);
			scene.add(sphere);
			return sphere;
		}

		function updateTrail() {
			const trailLength = Math.floor(options.ball_radius * trailFactor);

			if (trailSpheres.length >= trailLength) {
				const oldestSphere = trailSpheres.shift();
				scene.remove(oldestSphere);
				if (oldestSphere.geometry) oldestSphere.geometry.dispose();
				if (oldestSphere.material) oldestSphere.material.dispose();
			}

			const newSphere = createTrailSphere(
				ball_render.position,
				ball_render.rotation,
				ball_render.material.map
			);
			trailSpheres.push(newSphere);

			trailSpheres.forEach((sphere, index) => {
				const factor = (index + 1) / trailSpheres.length;
				sphere.scale.setScalar(factor);
				sphere.material.opacity = factor;
			});
		}

		function resetTrail() {
			while (trailSpheres.length > 0) {
				const sphere = trailSpheres.pop();
				scene.remove(sphere);
			}
		}
		function disposeTrail() {
			while (trailSpheres.length > 0) {
				const sphere = trailSpheres.pop();
				scene.remove(sphere);
				if (sphere.geometry) sphere.geometry.dispose();
				if (sphere.material) sphere.material.dispose();
			}
		}
		function calculateReflectionAngle(collision_angle) {
			let normal_angle = collision_angle + Math.PI / 2;
			let ball_vector_x = Math.cos(options.ball_angle);
			let ball_vector_y = Math.sin(options.ball_angle);
			let angle_between =
				Math.atan2(ball_vector_y, ball_vector_x) - normal_angle;
			return (
				normal_angle - angle_between + (0.5 - Math.random()) * (Math.PI / 16)
			);
		}
		function normalize_angle(angle) {
			angle = angle % (Math.PI * 2);
			if (angle < -Math.PI) angle += Math.PI * 2;
			if (angle > Math.PI) angle -= Math.PI * 2;
			return angle;
		}
		function ball_hit(angle) {
			let hit = 0;
			let player_real_angle;
			let player_max_angle;
			let player_min_angle;
			for (let i = 0; i < options.nb_players; i++) {
				player_real_angle = normalize_angle(
					Math.PI - players[i].mesh.rotation.z
				);
				player_max_angle = normalize_angle(
					player_real_angle + player_angle / 2
				);
				player_min_angle = normalize_angle(
					player_real_angle - player_angle / 2
				);
				if (players[i].hit) {
					players[i].mesh.material.color.setHex(0xffffff);
					players[i].hit = 0;
					players[i].last_hit = 1;
					continue;
				}
				players[i].last_hit = 0;
				if (
					(angle > player_min_angle &&
						(angle < player_max_angle ||
							player_max_angle < player_min_angle)) ||
					(angle < player_max_angle &&
						(angle > player_min_angle || player_max_angle < player_min_angle))
				) {
					players[i].hit = 1;
					players[i].mesh.material.color.setHex(0xbbbbbb);
					hit++;
				}
			}
			return hit;
		}

		function ball_move() {
			updateTrail();
			ball_render.position.x = options.ball_x;
			ball_render.position.y = options.ball_y;
			if (options.ball_pause) {
				options.ball_pause--;
				return;
			}

			options.ball_x += options.ball_speed * Math.cos(options.ball_angle);
			options.ball_y += options.ball_speed * Math.sin(options.ball_angle);
			if (
				options.ball_x * options.ball_x + options.ball_y * options.ball_y >
				(options.stage_radius - options.ball_radius) *
					(options.stage_radius - options.ball_radius)
			) {
				let collision_angle = normalize_angle(
					Math.atan2(options.ball_y, options.ball_x)
				);
				let hit = ball_hit(collision_angle);
				if (hit > 0) {
					options.ball_angle = calculateReflectionAngle(collision_angle);
					options.ball_speed *= options.ball_acc;
					options.ball_bounces++;
				} else {
					ball_reset();
				}
			}
		}
		function handleResize() {
			fontSize = (window.innerWidth + window.innerHeight) * 0.005;
			message.style.fontSize = fontSize + 'px';
		}
		window.addEventListener('resize', handleResize);

		//* https://keyevents.netlify.app/
		function handleKeyDown(event) {
			if (event.keyCode === 32) {
				if (options.ball_pause) {
					renderer.domElement.style.filter = 'none';
					dialogContainer.style.zIndex = 999;
					//dialogRenderer.domElement.style.zIndex = 999
					options.ball_pause = 0;
				} else {
					renderer.domElement.style.filter = 'blur(5px)';
					dialogContainer.style.zIndex = 1001;
					dialogContainer.style.top = '35%';
					dialogContainer.style.left = '35%';
					dialogContainer.style.width = '30%';
					dialogContainer.style.height = '30%';
					message.innerHTML = player_buttons();
					message.innerHTML += t('to_show_rules') + '<br>';
					message.innerHTML += t('resume_button');
					options.ball_pause = -1;
				}
			}
			//si on appuie sur la touche echap
			if (event.keyCode === 27) {
				renderer.domElement.style.filter = 'blur(5px)';
				dialogContainer.style.zIndex = 1001;
				dialogContainer.style.top = '35%';
				dialogContainer.style.left = '35%';
				dialogContainer.style.width = '30%';
				dialogContainer.style.height = '30%';
				message.innerHTML = show_rules();
				message.innerHTML += t('resume_button');
				options.ball_pause = -1;
			}
			if (options.nb_buttons === 2) {
				//! joueur 0 jouera avec a et d
				if (event.keyCode === 65) {
					directions[0] = -1;
				}
				if (event.keyCode === 68) {
					directions[0] = 1;
				}
				//! joueur 1 jouera avec 4 et 6
				if (event.keyCode === 100) {
					directions[1] = -1;
				}
				if (event.keyCode === 102) {
					directions[1] = 1;
				}
				//! joueur 2 jouera avec u et o
				if (event.keyCode === 85) {
					directions[2] = -1;
				}
				if (event.keyCode === 79) {
					directions[2] = 1;
				}
			} else {
				//! joueur 0 jouera avec Q
				if (event.keyCode === 81) {
					directions[0] = directions_r[0];
				}
				//! joueur 1 jouera avec 9
				if (event.keyCode === 105) {
					directions[1] = directions_r[1];
				}
				//! joueur 2 jouera avec C
				if (event.keyCode === 67) {
					directions[2] = directions_r[2];
				}
				//! joueur 3 jouera avec 1
				if (event.keyCode === 97) {
					directions[3] = directions_r[3];
				}
				//! joueur 4 jouera avec U
				if (event.keyCode === 85) {
					directions[4] = directions_r[4];
				}
				//! joueur 5 jouera avec >
				if (event.keyCode === 190) {
					directions[5] = directions_r[5];
				}
			}
		}

		function handleKeyUp(event) {
			if (options.nb_buttons === 2) {
				if (event.keyCode === 65 || event.keyCode === 68) {
					directions[0] = 0;
				}
				if (event.keyCode === 102 || event.keyCode === 100) {
					directions[1] = 0;
				}
				if (event.keyCode === 85 || event.keyCode === 79) {
					directions[2] = 0;
				}
			} else {
				if (event.keyCode === 81) {
					directions[0] = 0;
					directions_r[0] *= -1;
				}
				if (event.keyCode === 105) {
					directions[1] = 0;
					directions_r[1] *= -1;
				}
				if (event.keyCode === 67) {
					directions[2] = 0;
					directions_r[2] *= -1;
				}
				if (event.keyCode === 97) {
					directions[3] = 0;
					directions_r[3] *= -1;
				}
				if (event.keyCode === 85) {
					directions[4] = 0;
					directions_r[4] *= -1;
				}
				if (event.keyCode === 190) {
					directions[5] = 0;
					directions_r[5] *= -1;
				}
			}
		}

		window.addEventListener('keydown', handleKeyDown, false);
		window.addEventListener('keyup', handleKeyUp, false);

		function player_move() {
			for (let i = 0; i < options.nb_players; i++) {
				if (directions[i])
					players[i].mesh.rotation.z += directions[i] * options.player_speed;
			}
		}
		camera.position.z = 10;
		camera.lookAt(new THREE.Vector3(0, 0, 0));
		const controls = new OrbitControls(camera, renderer.domElement);
		const handleMouseMove = (event) => {
			//        controls.maxAzimuthAngle = Math.PI /2;
			//        controls.minAzimuthAngle  = -Math.PI /2;
			if (camera.position.z < options.ball_radius + 0.5)
				camera.position.z = options.ball_radius + 0.5;
			//        controls.minPolarAngle = Math.PI/2;
			//        controls.maxPolarAngle = Math.PI;
			controls.update();
		};
		window.addEventListener('mousemove', handleMouseMove);
		//camera.rotateZ(Math.PI / 2);
		//	camera.rotation.set(Math.PI / -2, 0, 0);
		ground.position.z = 0;
		ball_reset();
		options.ball_pause = -1;

		function handleKeyDown_2(event) {
			if (event === 32) options.ball_pause = 0;
		}

		function animate() {
			if (starting_location != getCurrentLocation()) {
				options.ball_pause = -1;
				scene.clear();
				for (let i = 0; i < options.nb_players; i++) {
					scene.remove(players[i].mesh);
					clear_components(players[i].mesh);
					scene.remove(players_text[i]);
					players_text[i].dispose();
				}
				clear_components(ball_render);
				clear_components(ground);
				window.removeEventListener('keydown', handleKeyDown, false);
				window.removeEventListener('keyup', handleKeyUp, false);
				window.removeEventListener('mousemove', handleMouseMove);
				dialogRenderer.dispose();
				if (dialogContainer.parentNode) {
					dialogContainer.parentNode.removeChild(dialogContainer);
				}
				document.body.removeChild(renderer.domElement);
				renderer.domElement.style.filter = 'none';
				disposeTrail();
				renderer.dispose();
				return navigate('/');
			}
			requestAnimationFrame(animate);
			//	ball_render.rotation.z += (Math.abs(ball_y_speed) + Math.abs(ball_x_speed))* ball_rotation_z ;
			//		ball_render.rotation.y += ball_x_speed * 2;
			//		ball_render.rotation.x += ball_y_speed * 2;
			if (options.ball_pause >= 0) {
				ball_move();
				player_move();
			}
			renderer.render(scene, camera);
		}
		animate();

		function endgame() {
			renderer.domElement.style.filter = 'blur(5px)';
			dialogContainer.style.zIndex = 1001;
			dialogContainer.style.top = '35%';
			dialogContainer.style.left = '35%';
			dialogContainer.style.width = '30%';
			dialogContainer.style.height = '30%';
			message.innerHTML = t('end_game_multi') + '<br>';
			dialogContainer.style.color = 'white';
			for (let i = 0; i < options.nb_players; i++) {
				if (scores[i] === Math.max(...scores))
					message.innerHTML += t('winner_multi') + ' ';
				message.innerHTML += player_names[i] + ' : ' + scores[i] + '<br>';
			}
			message.innerHTML += t('restart_button');

			if (options.ball_pause === 0) {
				dialogRenderer.dispose();
				if (dialogContainer.parentNode) {
					dialogContainer.parentNode.removeChild(dialogContainer);
				}
				renderer.domElement.style.filter = 'none';
				renderer.dispose();
				window.removeEventListener('keydown', handleKeyDown_2, false);
				disposeTrail();
				navigate('/');
			}
		}

		return () => {
			// Nettoyez les ressources Three.js et arrêtez les écoutes d'événements si nécessaire
		};
	}, []);

	return null; // Car le rendu est géré par Three.js et non par React
}

export default MultiGame;
