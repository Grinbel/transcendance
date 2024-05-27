import  { useEffect, useState } from 'react'; 
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Text } from 'troika-three-text';
import { useMultiGameContext } from './contexts/MultiGameContext.jsx';


function MultiGame() {
        const { options } = useMultiGameContext();
        options.ball_speed = options.ball_starting_speed
        useEffect(() => {
        
		let loader = new THREE.TextureLoader();
		let texture_floor = loader.load(options.texture_floor);
		let texture = loader.load(options.texture_ball)
		let scores = [options.nb_players];
		let players_text = [options.nb_players]
        console.log("NB " + options.nb_players)
        let directions = [5] ; //! ATTENTION JE LIMITE A 5 JOUEURS !!!!
		let player_angle =options.players_size / (options.nb_players +1)
        let player_textures = ['/yoshi.jpg', '/princess.jpg', '/ponge.jpg', '/badboy.png', '/players.jpg' ];
		let player_names = ['Yoshi', 'Princess', 'Bob', 'Bowser' , 'Mario']

        function create_player(text_to_use) {
            const innerRadius = options.stage_radius;
            const outerRadius = options.stage_radius + options.player_width;
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
                depth: options.player_depth,
                bevelEnabled: true,
                bevelThickness: 0,
                bevelSize: 0,
                bevelOffset: 0,
                bevelSegments: 5
            };

            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            const material = new THREE.MeshBasicMaterial({ map: loader.load(text_to_use) });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.y = Math.PI
            return mesh;
        }
		class Player{
            constructor(x) {
				this.mesh = create_player(player_textures[x]);
				
				this.hit = 0;
				scene.add(this.mesh);
				this.mesh.rotation.z = Math.PI *2 / options.nb_players * x;
				this.last_hit = 0;
                this.mesh.position.z = options.ball_radius * 2;
            }
            setPosition(x, y, z) {
                this.mesh.position.set(x, y, z);
            }

            
        }
        
		// Our Javascript will go here.
		const scene = new THREE.Scene();
		const ground_geometry = new THREE.CircleGeometry(options.stage_radius,1012);
		const ground_material = new THREE.MeshBasicMaterial({ map: texture_floor });
		const ground = new THREE.Mesh(ground_geometry, ground_material);
		scene.add(ground);

		const camera = new THREE.PerspectiveCamera(75, window.innerWidth /
			window.innerHeight, 0.1, 1000);
		const renderer = new THREE.WebGLRenderer();
		camera.lookAt(new THREE.Vector3(0, 0, 0));
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);
		const ball_form = new THREE.SphereGeometry(options.ball_radius, 32, 32);


		function create_text(to_show)
		{
			const text = new Text();
			text.text = to_show;
			text.font = 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.ttf';
			let size = 8
			console.log(size)
			text.fontSize = 1*5/size;
			text.color = 0x0000FF;
	
			text.rotation.x = Math.PI/2;
			text.position.y = options.stage_radius 
			// Après avoir changé des propriétés, vous devez toujours appeler sync()
			text.sync();
	
			// Ajouter le texte à la scène
			console.log("player " + to_show + " added" )
			scene.add(text);
			return text;
		}
		for (let i =0; i<options.nb_players; i++)
		{
			scores[i] = 0;
			players_text[i] = create_text(player_names[i] + " " + scores[i])
			players_text[i].position.x = i%3 *5 - options.stage_radius
			players_text[i].position.z = Math.floor(i / 3) * 2*options.ball_radius +2
			console.log("position " + 2*options.ball_radius +2*i)
		}


		
		const ball_material = new THREE.MeshBasicMaterial({ map: texture });
		const ball_render = new THREE.Mesh(ball_form, ball_material);
		scene.add(ball_render);
		ball_render.position.z = options.ball_radius;
		options.ball_angle = Math.random() * (Math.PI);

	//	controls = new OrbitControls( camera, renderer.domElement );
		const players = [];
		for (let i = 0; i < options.nb_players; i++) {
			players.push(new Player(i));
		}

		function ball_reset() {
			options.ball_x = Math.random(options.stage_radius- options.ball_radius*2) - options.stage_radius / 2 + options.ball_radius;
			options.ball_y = Math.random(options.stage_radius - options.ball_radius*2) - options.stage_radius / 2 + options.ball_radius;
			options.ball_speed = options.ball_starting_speed;
			options.ball_angle = Math.random() * (Math.PI);
			let hitters = 0;
			for (let i =0; i<options.nb_players; i++)
			{
				if (players[i].last_hit)
					hitters++;
			}
			if (hitters)
			{
			console.log("Points marques : " +options.ball_bounces + " a diviser entre "+ hitters + " joueurs");
				hitters = Math.trunc(options.ball_bounces / hitters)
				for (let i =0; i<options.nb_players; i++)
				{
					if (players[i].last_hit)
					{
						scores[i] += hitters;
						console.log("Joueur " + i + " a marque " + hitters + " points");
						players[i].last_hit = 0;
					}
				}
			}
			
			console.log("Remise en jeu ....");
			for (let i =0; i<options.nb_players; i++)
			{
				console.log("Joueur " + i + " a " + scores[i] + " points")
			}
			options.ball_pause = 30;
			options.ball_bounces = 0;
			let maxValue = Math.max(...scores);
			let minValue = Math.min(...scores);
			for(let i = 0; i< options.nb_players ; i++)
			{
				players_text[i].text = player_names[i] + " : " + scores[i]
				if (scores[i] === maxValue)
					{
						players_text[i].color = 0x00FF00;
					}
				else if (scores[i] === minValue)
				{
					players_text[i].color = 0xFF0000;
				}
				else 
				players_text[i].color = 0x0000FF;
			}
		}

		function calculateReflectionAngle(collision_angle){
    let normal_angle = collision_angle + Math.PI / 2;
    let ball_vector_x = Math.cos(options.ball_angle);
    let ball_vector_y = Math.sin(options.ball_angle);
    let angle_between = Math.atan2(ball_vector_y, ball_vector_x) - normal_angle;
    return (normal_angle - angle_between +(0.5-Math.random()) * (Math.PI/16));
}
		function normalize_angle(angle){
			angle = angle % (Math.PI*2);
			if (angle < -Math.PI)
				angle += Math.PI*2;
			if (angle > Math.PI)
				angle -= Math.PI*2;
			return angle;
		}
		function ball_hit(angle){
			let hit =0;
			let player_real_angle ;
			let player_max_angle;
			let player_min_angle;
            console.log("Angle de la balle " + angle)
			for(let i = 0; i<options.nb_players; i++){
				player_real_angle = normalize_angle(players[i].mesh.rotation.z ) ;
				player_max_angle = normalize_angle(player_real_angle + player_angle / 2);
				player_min_angle = normalize_angle(player_real_angle - player_angle / 2);
                console.log("angle du joueur " + i + " max " + player_max_angle + " min " + player_min_angle)
				if (players[i].hit)
				{	
					players[i].mesh.material.color.setHex(0xffffff);
					players[i].hit = 0;
					players[i].last_hit = 1;
				continue;
			}
				players[i].last_hit = 0; 
				if ((angle > player_min_angle && (angle < player_max_angle  || player_max_angle < player_min_angle)) || (angle < player_max_angle && (angle > player_min_angle || player_max_angle < player_min_angle)))
				{
					players[i].hit = 1;
					players[i].mesh.material.color.setHex(0xbbbbbb);
					hit++;
				}

			}
			return hit;
		}

		function ball_move() {
			ball_render.position.x = options.ball_x;
			ball_render.position.y = options.ball_y;
			if (options.ball_pause) {
				options.ball_pause--;
				return;
			}

			options.ball_x += options.ball_speed * Math.cos(options.ball_angle);
			options.ball_y += options.ball_speed * Math.sin(options.ball_angle);
			if (options.ball_x *options.ball_x + options.ball_y * options.ball_y > (options.stage_radius-options.ball_radius) * (options.stage_radius-options.ball_radius)) {
				options.ball_bounces ++;
				let collision_angle = normalize_angle(Math.atan2(options.ball_y, options.ball_x) );
				console.log("Valeur du point : " + options.ball_bounces )
				let hit = ball_hit(collision_angle)
				if (hit >0)
				{
					console.log("touche "+ hit)
                    options.ball_angle = calculateReflectionAngle(collision_angle);
					console.log("reflection angle calculated : " + options.ball_angle)
                    options.ball_speed *= options.ball_acc;}
				else {
					
					ball_reset();}
			}
			//ball_reset();

		}

        //* https://keyevents.netlify.app/
		function handleKeyDown(event) {
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
		}

		function handleKeyUp(event) {
			if (event.keyCode === 65 || event.keyCode === 68) {
				directions[0] = 0;
			}
			if (event.keyCode === 102|| event.keyCode === 100) {
				directions[1] = 0;
			}
            if (event.keyCode === 85|| event.keyCode === 79) {
				directions[2] = 0;
			}
  		}

		window.addEventListener('keydown', handleKeyDown, false);
		window.addEventListener('keyup', handleKeyUp, false);
		function player_move() {
            for(let i =0; i<options.nb_players ; i++)
            {
                if (directions[i])
                    players[i].mesh.rotation.z+=(directions[i] * options.player_speed)
            }
		}
		//camera.position.x = 5;
		//camera.position.y = 5;
		camera.position.z = 10;
		camera.lookAt(new THREE.Vector3(0, 0, 0));
        const controls = new OrbitControls(camera, renderer.domElement);
        const handleMouseMove = (event) => {
    //        controls.maxAzimuthAngle = Math.PI /2;
    //        controls.minAzimuthAngle  = -Math.PI /2;
            if (camera.position.z < options.ball_radius +0.5)
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
		function animate() {
			requestAnimationFrame(animate);
		//	ball_render.rotation.z += (Math.abs(ball_y_speed) + Math.abs(ball_x_speed))* ball_rotation_z ;
	//		ball_render.rotation.y += ball_x_speed * 2;
	//		ball_render.rotation.x += ball_y_speed * 2;
			ball_move();
			player_move();
			renderer.render(scene, camera);
		}
		animate();
		

        return () => {
            // Nettoyez les ressources Three.js et arrêtez les écoutes d'événements si nécessaire
        };
    }, []);

    return null; // Car le rendu est géré par Three.js et non par React
}

export default MultiGame;
