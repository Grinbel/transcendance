import  { useEffect, useState } from 'react'; 
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Text } from 'troika-three-text';
import { useGameContext } from './contexts/GameContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


function Game() {
    const { options ,resetOptions,setOptions} = useGameContext();
    const navigate = useNavigate();
    const { t } = useTranslation();
    let Hall_of_Fame = [];


    function normalize_angle(angle){
        angle = angle % (Math.PI*2);
        if (angle < -Math.PI)
            angle += Math.PI*2;
        if (angle > Math.PI)
            angle -= Math.PI*2;
        return angle;
    }
    const end_of_game = async (name,winner) => {
			
		try {
			const response = await axiosInstance.post('/endofgame/', {
				room: name,
				winner: winner,
			});
		} catch (error) {
			// setError(error.message);
			// throw (error);
		}
	}

    const nextgameplayer = async (name,p1,p2) => {
		
		try {
			const response = await axiosInstance.post('/nextgameplayer/', {
				p1: p1,
				p2: p2,
				room: name,
				
			});
		} catch (error) {
			// setError(error.message);
			// throw (error);
		}
	}
    options.ball_speed=options.ball_starting_speed
    console.log("juste avant le use effect")
      useEffect(() => {
        console.log("on est rentres dans UseEffect")
        if(options.real_game === 0)
            return navigate('/');
        if(options.is_tournament === 1)
            {
                console.log("TOURNOI")
                options.round_results = options.round_results || [];
                console.log(options.round_results)
                options.usernames = options.usernames || [];
                console.log(options.usernames)
                options.avatar = options.avatar || [];
                console.log(options.avatar)
                options.texture_balls = options.texture_balls || [];
                let i = options.round_results.length ;
                options.name_p1 = options.usernames[i*2];
                options.name_p2 = options.usernames[i*2 + 1];
                options.texture_p1 = options.avatar[i*2];
                options.texture_p2 = options.avatar[i*2 + 1];
                options.texture_ball_p1 = options.texture_balls[i*2];
                options.texture_ball_p2 = options.texture_balls[i*2 + 1];
                options.player_is_ia = 0;
                options.score_p1 = 0;
                options.score_p2 = 0;
                nextgameplayer(options.room,options.name_p1,options.name_p2)

                
            }
        if (options.texture_p1_ball ===1)
            options.texture_p1_ball = options.texture_ball
        if (options.texture_p2_ball ===1)
            options.texture_p2_ball = options.texture_ball
        let loader = new THREE.TextureLoader();
        let texture = loader.load(options.texture_ball)
        let texture_ball_p1 = loader.load(options.texture_p1_ball)
        let texture_ball_p2 = loader.load(options.texture_p2_ball)
        let texturep1 = loader.load(options.texture_p1)
        let texture_floor = loader.load(options.texture_floor);
        let texturep2 = loader.load(options.texture_p2);
        let eye_texture = loader.load(options.texture_eye);
        let wall_texture = loader.load(options.wall_texture)
        console.log(options)
        // Our Javascript will go here.
        const scene = new THREE.Scene();
        const ground_geometry = new THREE.BoxGeometry(options.stage_width, options.stage_height, .0);
        const ground_material = new THREE.MeshBasicMaterial({ map : texture_floor });
        //const ground_material = new THREE.MeshBasicMaterial({ color : 0x00ff00});
        const ground = new THREE.Mesh(ground_geometry, ground_material);
        //! AJOUT SOL
        scene.add(ground);
        const wall_form = new THREE.BoxGeometry(options.stage_width,options.ball_radius +0.2, .0)
        const wall_material = new THREE.MeshBasicMaterial({ map : wall_texture });
        //! marche pas wall_material.transparent=true
        const first_wall = new THREE.Mesh(wall_form, wall_material)
        const second_wall= new THREE.Mesh(wall_form, wall_material)
        //!AJOUT MURS
        scene.add(first_wall)
        scene.add(second_wall)
        first_wall.rotateX(Math.PI/2)
        second_wall.rotateX(Math.PI/2)
        first_wall.position.y = options.stage_height/2
        second_wall.position.y = -options.stage_height/2
        first_wall.position.z = options.ball_radius
        second_wall.position.z = options.ball_radius
        const ia_eye_geometry = new THREE.CircleGeometry(1.2, 32);
        const ia_eye_material = new THREE.MeshBasicMaterial({ map : eye_texture });
        const ia_eye = new THREE.Mesh(ia_eye_geometry, ia_eye_material);
        scene.add(ia_eye);
        const target = new THREE.CircleGeometry(.1, 32);
        const target_material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const target_mesh = new THREE.Mesh(target, target_material);
        if(options.easy_mode == 1)
            scene.add(target_mesh);
        target_mesh.position.z = options.ball_radius;

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth /
            window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = 0;
        renderer.domElement.style.left = 0;
        renderer.domElement.style.zIndex = 1000; 
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.backgroundColor = 'transparent';
        document.body.appendChild(renderer.domElement);
        //document.body.insertBefore(renderer.domElement, document.body.firstChild);
        const ball_form = new THREE.SphereGeometry(options.ball_radius, 32, 32);
        const p1_weapon = new THREE.BoxGeometry(options.player_width, options.player_size, options.player_height);
        const p2_weapon = new THREE.BoxGeometry(options.player_width, options.player_size, options.player_height);
        const p1_material = new THREE.MeshBasicMaterial({ map: texturep1 });
        const p2_material = new THREE.MeshBasicMaterial({ map: texturep2 });
        const ball_material = new THREE.MeshBasicMaterial({ map: texture });
        const ball_material_1 = new THREE.MeshBasicMaterial({ map: texture_ball_p1 });
        const ball_material_2 = new THREE.MeshBasicMaterial({ map: texture_ball_p2 });
        //const ball_material = new THREE.MeshBasicMaterial({ color : 0xFF5020 });
        const ball_render = new THREE.Mesh(ball_form, ball_material);
        const p1_weapon_mesh = new THREE.Mesh(p1_weapon, p1_material);
        const p2_weapon_mesh = new THREE.Mesh(p2_weapon, p2_material);
        //! ajout Balle et joueurs
        scene.add(p1_weapon_mesh);
        scene.add(p2_weapon_mesh);
        scene.add(ball_render);
        ia_eye.position.x = 0;
        ia_eye.position.y = options.stage_height / 2 + 1.5;
        ia_eye.position.z = 3;
        ia_eye.lookAt(new THREE.Vector3(0, 0, 0));
//!        const ia_spotlight = new THREE.SpotLight(0xff0000);
//!        ia_spotlight.position.set(0, options.stage_height / 2 + 1.5, 3);
//!        scene.add(ia_spotlight);
//!        scene.add(ia_spotlight.target);
//!        ia_spotlight.target = ball_render;
        //const light = new THREE.AmbientLight(0xffcccc, 1);
        //scene.add(light);
        const powerup_form = new THREE.SphereGeometry(options.ball_radius, 32, 32);
        //const powerup_material1 = new THREE.MeshBasicMaterial({ map: powerup_texture1 });
        const powerup_material1 = new THREE.MeshBasicMaterial({ color : 0xffffff , transparent: true, opacity: 0.5});
        //const powerup_material2 = new THREE.MeshBasicMaterial({ map: powerup_texture2 });
        const powerup_render1 = new THREE.Mesh(powerup_form, powerup_material1);
    //    const powerup_render2 = new THREE.Mesh(powerup_form, powerup_material2);

        p1_weapon_mesh.position.x = -options.stage_width / 2 + options.distance_from_wall ;
        p2_weapon_mesh.position.x = options.stage_width / 2 - options.distance_from_wall;
        p1_weapon_mesh.position.z = options.player_height/2;
        p2_weapon_mesh.position.z = options.player_height/2;
        ball_render.position.z = options.ball_radius;
        

                //* PREPARATION DU POPUP
                const dialogContainer = document.createElement('div');
                dialogContainer.id = 'dialog-renderer';
                dialogContainer.style.position = 'absolute';
                dialogContainer.style.top = '25%';
                dialogContainer.style.left = '25%';
                dialogContainer.style.width = '50%';
                dialogContainer.style.height = '50%';
                dialogContainer.style.zIndex = 1001; 
                dialogContainer.style.backgroundColor = 'transparent';
                dialogContainer.style.display = 'flex';
                dialogContainer.style.justifyContent = 'center';
                dialogContainer.style.alignItems = 'center';
                document.body.appendChild(dialogContainer);
                const message = document.createElement('p');
                message.style.textAlign = 'center';
                message.innerHTML =  t('beginning_of_speech') + ' ' + options.name_p1 + ' ' + t('à') + ' ' + options.name_p2 + ' ' + t('to_reach') + ' ' + options.score_to_get + ' ' + t('diff') + ' ' + options.score_diff + ' ' + t('fin_intro') + t('controlsj1');
                if(options.player_is_ia === 1)
                    message.innerHTML +="!"
                else
                    message.innerHTML += t('controlsj2');
                    if(options.is_tournament === 1)
                        {
                            let i = options.round_results.length +1;
                            if ( i*2 + 1 <= options.usernames.length){
                                message.innerHTML += '<br>' + t('next_matches') + '<br>';
                                while(options.usernames.length > i*2 + 1)
                                {
                                    let next_p1 = options.usernames[i*2];
                                    let next_p2 = options.usernames[i*2 + 1];
                                    message.innerHTML += next_p1 + t('affrontera') + next_p2 + '<br>';
                                    i++;
                                }
                                if(options.usernames.length === i*2 + 1)
                                    message.innerHTML += options.usernames[i*2] + t('waiting_opp') + '<br>';
                            }

//* AJOUTER L' avancee du tournoi !
                        }
                //'Bienvenue dans le match opposant <span style="font-size: larger; color: red; text-transform: uppercase;">' 
                //+ options.name_p1 + '</span> à <span style="font-size: larger; color: red; text-transform: uppercase;">' 
                //+ options.name_p2 + "</span> !<br>" 
               // + 'Le premier joueur à atteindre ' + options.score_to_get + ' points avec une différence de ' 
                //+ options.score_diff + ' remporte la partie !<br>' 
              //  + 'Appuyez sur la touche ESPACE pour commencer !'
            //    + '<br>Appuyez sur les touches W et S pour déplacer le joueur 1 et les touches HAUT et BAS pour déplacer le joueur 2 !';
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

        const controls = new OrbitControls(camera, renderer.domElement);

        const handleMouseMove = (event) => {
            controls.maxAzimuthAngle = Math.PI /2;
            controls.minAzimuthAngle  = -Math.PI /2;
            if (camera.position.z < options.ball_radius +0.5)
                camera.position.z = options.ball_radius + 0.5;
            controls.minPolarAngle = Math.PI/2;
            controls.maxPolarAngle = Math.PI;
            controls.update();
        };

        window.addEventListener('mousemove', handleMouseMove);

        function clear_components(component){
            scene.remove(component);
            if (component.geometry)
                component.geometry.dispose();
            if (component.material)
                component.material.dispose();
            if (component.texture)
                component.texture.dispose();
        
        }
        function server_ball_reset() {
            options.time_before_powerup = Math.random() * (options.max_time_before_powerup -options.min_time_before_powerup) + options.min_time_before_powerup;
            options.ball_x = 0;
            text_p1.text = options.name_p1 + " : " + options.score_p1;
            text_p2.text = options.name_p2 + " : " + options.score_p2;
            if (options.score_p1 > options.score_p2)
                {
                    text_p1.color = 0x00FF00;
                    text_p2.color = 0xFF0000;
                }
            else if(options.score_p1 < options.score_p2)
                {
                    text_p2.color = 0x00FF00;
                    text_p1.color = 0xFF0000;
                }
            else{
                    text_p2.color = 0x0000FF;
                    text_p1.color = 0x0000FF;
            }
            text_p1.sync();
            text_p2.sync();
            p2_weapon_mesh.material.color.setHex(0xffffff);
            p1_weapon_mesh.material.color.setHex(0xffffff);
            options.ball_is_powerup = 0;
            options.power_up_on_screen = 0;
            options.p1_is_frozen = 0;
            options.p2_is_frozen = 0;
            ball_render.material.color.setHex(0xFFFFFF);
            options.ball_y = Math.random() * (options.stage_height - options.ball_radius*2) - options.stage_height / 2 + options.ball_radius;
            options.ball_speed = options.ball_starting_speed;
            scene.remove(powerup_render1);
            let ball_angle = Math.random() * (Math.PI / 4);
            if (ball_angle < Math.PI / 8)
                ball_angle = Math.PI / 8;
            if (ball_angle > 6 * Math.PI / 8)
                ball_angle = 6 * Math.PI / 8;
            ball_angle += (Math.PI / 2) * Math.floor(Math.random() * 4);
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            ball_angle = Math.PI *7/8;
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            options.ball_x_speed = options.ball_speed * Math.cos(ball_angle);
            options.ball_y_speed = options.ball_speed * Math.sin(ball_angle);
            if(options.ball_x_speed > 0)
                ball_render.material = ball_material_1
            else
                ball_render.material = ball_material_2
            ball_render.geometry.uvsNeedUpdate = true; //pour qu il recalcule les coordonnees de texture
            ball_render.needsUpdate = true; // pour prevenir que le materiau a change
            if(!options.ball_pause)
                options.ball_pause = 40;
            if(options.player_is_ia){
                options.ia_ball_estimated_impact_y = 0;
                options.ia_ball_estimated_y_speed = 0;
                options.ia_ball_estimated_x_speed = 0;
                options.ia_this_point_time = 0;
                options.ia_last_time_ia_hit = 0;
                options.ia_last_time_ia_hit_x = 0;
                options.ia_last_time_ia_hit_y = 0;
                options.ia_this_point_bounces = 0;
            }
        }
                
        function server_ball_move() {
            ball_render.position.x = options.ball_x;
            ball_render.position.y = options.ball_y;
            if (options.ball_pause) {
                options.ball_pause--;
                return;
            }
            if (options.time_before_powerup >= 0 && options.powerups === 1)
                options.time_before_powerup--;
            if (options.time_before_powerup < 0 && !options.power_up_on_screen && !options.ball_is_powerup){
                powerup_render1.position.x = Math.random() * (options.stage_width - options.ball_radius*2) - options.stage_width / 2 + options.ball_radius;
                powerup_render1.position.y = Math.random() * (options.stage_height - options.ball_radius*2) - options.stage_height / 2 + options.ball_radius;
                powerup_render1.position.z = options.ball_radius;
                scene.add(powerup_render1);
                options.power_up_on_screen = 1;
                
            }
            console.log("PUTAIN DE Y SPEED : " + options.ball_y_speed + " ET X SPEED : " + options.ball_x_speed)

            options.ball_x += options.ball_x_speed;
            options.ball_y += options.ball_y_speed;
            if(options.power_up_on_screen){
                if (options.ball_x > powerup_render1.position.x - options.ball_radius && options.ball_x < powerup_render1.position.x + options.ball_radius && options.ball_y > powerup_render1.position.y - options.ball_radius && options.ball_y < powerup_render1.position.y + options.ball_radius){
                    scene.remove(powerup_render1);
                    options.power_up_on_screen = 0;
                    options.ball_is_powerup = 1;
                    ball_render.material.color.setHex(0x2050ff);
                    
                }
            
            }

            if (options.ball_x > options.stage_width /2 -options.distance_from_wall - options.player_width ) {
                if (options.ball_y > p2_weapon_mesh.position.y + options.player_size / 2 || options.ball_y < p2_weapon_mesh.position.y - options.player_size / 2) {
                    options.score_p1++;
                    server_ball_reset();
                    return;
                }
                ball_render.material = ball_material_2
                if (options.ball_is_powerup)
                {
                    options.ball_is_powerup = 0;
                    ball_render.material.color.setHex(0xFFFFFF);
                    options.p2_is_frozen = options.frost_time;
                    p2_weapon_mesh.material.color.setHex(0x0000ff);
                    options.time_before_powerup = Math.random() * (options.max_time_before_powerup - options.min_time_before_powerup) + options.min_time_before_powerup;
                }
            //calculate ball angle
                let angle = Math.atan2(options.ball_y_speed, options.ball_x_speed);
                let impact = p2_weapon_mesh.position.y - options.ball_y;
                let incidence = Math.PI / 2 * impact / (options.player_size / 2);
                console.log("P2 incidence " + incidence + " angle " + angle)
                angle = Math.PI + (incidence -angle)/2
                options.ball_speed *= options.ball_acc;
                options.ball_x_speed = options.ball_speed * Math.cos(angle);
                options.ball_y_speed = options.ball_speed * Math.sin(angle);
                options.ball_rotation_z *= -1;
                if (options.p2_is_frozen)
                    {options.p2_is_frozen --;
                    if(options.p2_is_frozen == 0)
                        p2_weapon_mesh.material.color.setHex(0xffffff);}
            }
            if (options.ball_x < -options.stage_width /2 +options.distance_from_wall + options.player_width) {
                if (options.ball_y > p1_weapon_mesh.position.y + options.player_size / 2 || options.ball_y < p1_weapon_mesh.position.y - options.player_size / 2) {
                    options.score_p2++;
                    server_ball_reset();
                    return;
                }
                ball_render.material = ball_material_1
                if (options.ball_is_powerup)
                {
                    options.ball_is_powerup = 0;
                    ball_render.material.color.setHex(0xFFFFFF);
                    options.p1_is_frozen = options.frost_time;
                    p1_weapon_mesh.material.color.setHex(0x0000ff);
                    options.time_before_powerup = Math.random() * (options.max_time_before_powerup - options.min_time_before_powerup) + options.min_time_before_powerup;
                }
                let angle = Math.atan2(options.ball_y_speed, options.ball_x_speed);
                let impact = p1_weapon_mesh.position.y - options.ball_y;
                let incidence = Math.PI - Math.PI / 2 * impact / (options.player_size / 2);
                console.log("P1 incidence " + incidence + " angle " + angle);
                angle = normalize_angle(angle);
                incidence = normalize_angle(incidence);
                console.log("P1 incidence normalized " + incidence + " angle " + angle + "rebound angelle " + (Math.PI - angle) / 2);
                //let reboundAngle = Math.PI  + (incidence - angle) /2
                let reboundAngle = Math.PI - angle
                
                console.log("angle de rebond" + reboundAngle)
                //let reboundAngle = -Math.PI - (incidence - angle) / 2;
 
                options.ball_speed *= options.ball_acc;
 
                options.ball_x_speed = options.ball_speed * Math.cos(reboundAngle);
                options.ball_y_speed = options.ball_speed * Math.sin(reboundAngle);
                options.ball_rotation_z *=-1;
                if (options.p1_is_frozen)
                {options.p1_is_frozen --;
                    if(options.p1_is_frozen == 0)
                        p1_weapon_mesh.material.color.setHex(0xffffff);}
            }
            if (options.ball_y > options.stage_height/2 - options.ball_radius || options.ball_y < -options.stage_height/2 + options.ball_radius) {
                options.ball_y_speed = -options.ball_y_speed;
                options.ball_rotation_z *=-1;
            }   
        }
        function server_ia_follow_target(pos){
            options.ia_direction = 0;
            if (options.ball_x_speed > 0){	
                if (pos > options.ia_ball_estimated_impact_y +.1){
                    options.ia_direction = 1;
                }
                else if (pos < options.ia_ball_estimated_impact_y - .1){
                    options.ia_direction = -1;
                }
            }
            else
            {
                if (pos > 0.1)
                    options.ia_direction = 1;
                else	if (pos < -0.1){
                    options.ia_direction = -1;
                }
            }
            //console.log(ia_ball_estimated_impact_y);
        }

        function server_estimate_ball_speeds(){
            if (!options.ia_this_point_time){
            //! on lui donne les valeurs de debut si c'est l engagement
            options.ia_ball_estimated_x_speed = options.ball_x_speed;
            options.ia_ball_estimated_y_speed = options.ball_y_speed;
                if (options.ball_x_speed > 0){
                    //elle va a droite
                    target_mesh.material.color.setHex(0xff0000);
                }
                else{
                    //elle va a gauche
                    target_mesh.material.color.setHex(0x00ff00);
                }
                return;
            }
            //on calcule la vitesse de la balle estimee a partir des 2 derniers points
            options.ia_ball_estimated_x_speed = (options.ia_new_ball_x_position - options.ia_last_ball_x_position) / options.ia_time_between_checks;
            options.ia_ball_estimated_y_speed = (options.ia_new_ball_y_position - options.ia_last_ball_y_position) / options.ia_time_between_checks;
            //on calcule a quel point la balle va toucher l'axe des joueurs	
            if (options.ball_x_speed > 0){
                //elle va a droite
                target_mesh.position.x = options.stage_width / 2 - options.distance_from_wall - options.player_width/2 - options.ball_radius;
                //puis on calcule a quel y elle atteindra la position x
                options.ia_ball_estimated_impact_y = options.ball_y + (options.stage_width / 2 - options.distance_from_wall - options.player_width - options.ball_x) * options.ball_y_speed / options.ball_x_speed;
            }
            else{
                //elle va a gauche donc le temps qu'elle atteigne la position x est la distance qui lui reste a parcourir / la vitesse x
                //puis on calcule a quel y elle atteindra la position x
                options.ia_ball_estimated_impact_y = options.ball_y + (options.ball_x + options.stage_width / 2 - options.distance_from_wall - options.player_width/2 - options.ball_radius) / -options.ball_x_speed * options.ball_y_speed;
                target_mesh.position.x = -options.stage_width / 2 + options.distance_from_wall + options.player_width/2 + options.ball_radius;
            }
            // Correction de la position en Y si la balle touche les bords du terrain
            while (options.ia_ball_estimated_impact_y > options.stage_height / 2 - options.ball_radius || options.ia_ball_estimated_impact_y < -options.stage_height / 2 + options.ball_radius) {
                if (options.ia_ball_estimated_impact_y > options.stage_height / 2 - options.ball_radius) {
                    options.ia_ball_estimated_impact_y = 2 * (options.stage_height / 2 - options.ball_radius) - options.ia_ball_estimated_impact_y;
        
                } else if (options.ia_ball_estimated_impact_y < -options.stage_height / 2 + options.ball_radius) {
                    options.ia_ball_estimated_impact_y = 2 * (-options.stage_height / 2 + options.ball_radius) - options.ia_ball_estimated_impact_y;
        
                }
            }
            target_mesh.position.y = options.ia_ball_estimated_impact_y;
                    
                    
        }

        function server_ia_move(){
            if(options.ball_pause)
                return;
            options.ia_position = p2_weapon_mesh.position.y;
            options.ia_direction = 1;
                
            if (options.ia_time_since_last_check >= options.ia_time_between_checks || !options.ia_this_point_time){
                if (options.player_is_ia){
                    scene.add(ia_eye);
//!                    scene.add(ia_spotlight);
                }
                options.ia_time_since_last_check = 0;
                options.ia_last_ball_x_position = options.ia_new_ball_x_position;
                options.ia_last_ball_y_position = options.ia_new_ball_y_position;
                options.ia_new_ball_x_position = options.ball_x;
                options.ia_new_ball_y_position = options.ball_y;
                options.ia_player_know_position = p1_weapon_mesh.position.y;
                server_estimate_ball_speeds();
            }
            if (options.ia_time_since_last_check >6){
                scene.remove(ia_eye);
//!                scene.remove(ia_spotlight);
            }
                    
            options.ia_time_since_last_check++;
            options.ia_this_point_time++;
            switch (options.which_ia){
                default :
                    server_ia_follow_target(options.ia_position);
                    break;
            }
        }
        
        function local_handleKeyDown(event) {
            //si on appuie sur espace : 
            if (event.keyCode === 32) {
                if (options.ball_pause)
                    {
                        renderer.domElement.style.filter = 'none';
                        dialogContainer.style.zIndex = 999; 
                        //dialogRenderer.domElement.style.zIndex = 999
                        options.ball_pause = 0;
                    }
                else
                {
                    renderer.domElement.style.filter = 'blur(5px)';
                    dialogContainer.style.zIndex = 1001;
                    dialogContainer.style.top = '35%';
                    dialogContainer.style.left = '35%';
                    dialogContainer.style.width = '30%';
                    dialogContainer.style.height = '30%';
                    message.innerHTML = t('pause') + '<br>' + t('continue') + '<br>' + t('controlsj1');
                    if (options.player_is_ia === 0) {
                        message.innerHTML += t('controlsj2');
                    }
                    else
                        message.innerHTML += "!";
                    if(options.is_tournament === 1)
                        {
                            let i = options.round_results.length +1;
                            if ( i*2 + 1 <= options.usernames.length){
                                message.innerHTML += '<br>' + t('next_matches') + '<br>';
                                while(options.usernames.length > i*2 + 1)
                                {
                                    let next_p1 = options.usernames[i*2];
                                    let next_p2 = options.usernames[i*2 + 1];
                                    message.innerHTML += next_p1 + t('affrontera') + next_p2 + '<br>';
                                    i++;
                                }
                                if(options.usernames.length === i*2 + 1)
                                    message.innerHTML += options.usernames[i*2] + t('waiting_opp')+ '<br>';
                            }

//* AJOUTER L' avancee du tournoi !
                        }
                    options.ball_pause = -1;
                }
            }
            if (event.keyCode === 87) { 
                options.player1_direction = 1;
            }
            if (event.keyCode === 83) {
                options.player1_direction = -1;
            }
            if (event.keyCode === 38) {
                //options.player_is_ia =0;
                options.player2_direction = -1;
            }
            if (event.keyCode === 40) {
                //options.player_is_ia = 0;
                options.player2_direction = 1;
            }
        }
        
        function local_handleKeyUp(event) {
            if (event.keyCode === 87 || event.keyCode === 83) {
                options.player1_direction = 0;
            }
            if (event.keyCode === 38 || event.keyCode === 40) {
                options.player2_direction = 0;
            }
        }
        
        window.addEventListener('keydown', local_handleKeyDown, false);
        window.addEventListener('keyup', local_handleKeyUp, false);

        function server_player_move(received_direction) {
            if(options.ball_pause)
                return;
            options.player1_direction = received_direction;
            if (options.p1_is_frozen)
                options.player1_direction = options.player1_direction/3*2;
            if (options.p2_is_frozen)
                options.player2_direction = options.player2_direction/3*2;
            p1_weapon_mesh.position.y += options.player_speed *options.player1_direction;
            p2_weapon_mesh.position.y -= options.player_speed *options.player2_direction;
            if (p1_weapon_mesh.position.y > options.stage_height / 2 - options.player_size / 2) {
                p1_weapon_mesh.position.y = options.stage_height / 2 - options.player_size / 2;
            }
            if (p1_weapon_mesh.position.y < -options.stage_height / 2 + options.player_size / 2) {
                p1_weapon_mesh.position.y = -options.stage_height / 2 + options.player_size / 2;
            }
            if (p2_weapon_mesh.position.y > options.stage_height / 2 - options.player_size / 2) {
                p2_weapon_mesh.position.y = options.stage_height / 2 - options.player_size / 2;
            }
            if (p2_weapon_mesh.position.y < -options.stage_height / 2 + options.player_size / 2) {
                p2_weapon_mesh.position.y = -options.stage_height / 2 + options.player_size / 2;
            }
        
                    
        }
		camera.position.z = 10;
		if (camera.position.z / options.stage_height < .67)
			camera.position.z = options.stage_height * .67;
		if (camera.position.z / options.stage_width < .67)
			camera.position.z = options.stage_width  * .67;
        
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        ground.position.z = 0.0;
        
        
        function server_side_work(received_direction){
                server_ball_move();
                server_ia_move();
                if (options.player_is_ia)
                    options.player2_direction = options.ia_direction;
                else
                server_estimate_ball_speeds()
                server_player_move(received_direction);
}

    function create_text(to_show)
    {
        const text = new Text();
        text.text = to_show;
        text.font = 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.ttf';
        //let size = Math.max(options.name_p1.length,options.name_p2.length);
        //console.log(size)
        //text.fontSize = 1*5/size;
        text.fontSize = 1*5/6;
        text.color = 0x0000FF;
        console.log("creation de text : " + to_show)
        text.rotation.x = Math.PI/2;
        text.position.y = options.stage_height /2
        // Après avoir changé des propriétés, vous devez toujours appeler sync()
        //text.sync();

        // Ajouter le texte à la scène
        return text;
    }


        let text_p1 = create_text(options.name_p1 + " : " + options.score_p1);
        scene.add(text_p1);
        text_p1.position.z += options.ball_radius *2 +2
        text_p1.position.x = -options.stage_width/2
        let text_p2 = create_text(options.name_p2 + " : " + options.score_p2);
        scene.add(text_p2);
        text_p2.position.z+=  options.ball_radius*2 +2
        server_ball_reset()
        function animate() {
            if(((options.score_p1 >= options.score_to_get || options.score_p2 >= options.score_to_get) && Math.abs(options.score_p1-options.score_p2) >= options.score_diff) || options.score_p1>options.score_max || options.score_p2>options.score_max)
                {
                    scene.clear();
                    scene.remove(text_p1);
                    scene.remove(text_p2);
                    text_p1.dispose();
                    text_p2.dispose();
                    clear_components(p1_weapon_mesh);
                    clear_components(p2_weapon_mesh);
                    clear_components(ball_render);
                    clear_components(ia_eye);
//*                    clear_components(ia_spotlight);
                    clear_components(target_mesh);
                    clear_components(powerup_render1);
                    clear_components(first_wall);
                    clear_components(second_wall);
                    options.winner = options.score_p1>options.score_p2?options.name_p1:options.name_p2;
                    console.log(options.winner);
                    options.winner = create_text(t('winner') + options.winner );
                    scene.add(options.winner);
                    options.winner.position.x = -3
                    return(end_of_game(120));
                }
            requestAnimationFrame(animate);
            if(!options.ball_pause)
                {
//            ball_render.rotation.z += (Math.abs(options.ball_y_speed) + Math.abs(options.ball_x_speed))* options.ball_rotation_z;
    		ball_render.rotation.y += options.ball_x_speed * 2;
    		ball_render.rotation.x += options.ball_y_speed //* 2;
                }
    server_side_work(options.player1_direction);
            renderer.render(scene, camera);
        }
        animate();
        function end_of_game(counter){


            renderer.render(scene, camera);
            if (counter !=0)
                {
                    options.winner.rotation.y +=0.01;
                    requestAnimationFrame(() => end_of_game(counter - 1));}
            else
                {
                    window.removeEventListener('keydown', local_handleKeyDown, false);
                    window.removeEventListener('keyup', local_handleKeyUp, false);
                    window.removeEventListener('mousemove', handleMouseMove);
                    if (options.is_tournament === 1)
                        {
                            scene.remove(options.winner)
                            let i = options.round_results.length;
                            options.round_results.push(options.score_p1 + " " + options.score_p2);
                            options.usernames.push(options.score_p1>options.score_p2?options.name_p1:options.name_p2);
                            options.usernames[i*2] = options.name_p1 + " : " + options.score_p1;
                            options.usernames[i*2 + 1] = options.name_p2 + " : " + options.score_p2;
                            options.avatar.push(options.score_p1>options.score_p2?options.texture_p1:options.texture_p2);
                            options.texture_balls.push(options.score_p1>options.score_p2?options.texture_p1_ball:options.texture_p2_ball);
                            
                            console.log("taille usernames" + options.usernames.length)
                            if (options.usernames.length === 7 || options.usernames.length === 15 || options.usernames.length === 3)
                                {
                                    console.log("FIN DU TOURNOI")
                                    scene.remove(options.winner)
                                    //options.winner = create_text( options.score_p1>options.score_p2?options.name_p1:options.name_p2 + " REMPORTE LE TOURNOI");
                                    //setShouldRunEffect(false);
                                    for (let i = 0; i < options.usernames.length; i=i+2)
                                        {
                                            Hall_of_Fame[i] = create_text(options.usernames[i]);
                                            if (i +1 < options.usernames.length)
                                                {
                                                    Hall_of_Fame[i+1] =create_text(options.usernames[i+1]);
                                                    if(parseInt(options.usernames[i + 1].split(':')[1]) > parseInt(options.usernames[i].split(':')[1]))
                                                        {
                                                            Hall_of_Fame[i].color = 0x0000FF;
                                                            Hall_of_Fame[i+1].color = 0xFF0000;
                                                        }
                                                    else 
                                                        {
                                                            Hall_of_Fame[i].color = 0xFF0000;
                                                            Hall_of_Fame[i+1].color = 0x0000FF;
                                                        }
                                                }
                                            else {
                                                Hall_of_Fame[i].color = 0x0000FF;
                                                Hall_of_Fame[i].fontSize *=2;
                                            }

                                        }
                                        console.log("tout a ete cree")
                                        console.log(Hall_of_Fame)
                                    let i = options.usernames.length;
                                    let saved = 0;
                                    if (i > 14)
                                        {
                                            for (let j =0; j< 8;j=j+2)
                                                {
                                                    Hall_of_Fame[j].position.z = (j)*3;
                                                    Hall_of_Fame[j+1].position.z = (j)*3 +1;
                                                    Hall_of_Fame[j].position.x = -8;
                                                    Hall_of_Fame[j+1].position.x = -8;
                                                }
                                            saved = 8;
                                        }
                                      
                                    if (i-saved >6)
                                        {
                                            for(let j = 0; j< 4 ; j=j+2)
                                                {
                                                    Hall_of_Fame[j+saved].position.z = j*6+2.5;
                                                    Hall_of_Fame[j+1+saved].position.z = j*6 +4.5;
                                                    Hall_of_Fame[j+saved].fontSize *= 2;
                                                    Hall_of_Fame[j+1+saved].fontSize *= 2;
                                                    Hall_of_Fame[j+saved].position.x = -2;
                                                    Hall_of_Fame[j+1+saved].position.x = -2;
                                                }
                                            saved +=4;
                                        }
                                    if (i-saved >2)
                                        {
                                         
                                            for(let j = 0; j< 2 ; j=j+2)
                                                {
                                        
                                                    Hall_of_Fame[j+saved].position.z = 8
                                                    Hall_of_Fame[j+1+saved].position.z = 12
                                                    Hall_of_Fame[j+saved].fontSize *= 3;
                                                    Hall_of_Fame[j+1+saved].fontSize *= 3;
                                                    Hall_of_Fame[j+saved].position.x = 9;
                                                    Hall_of_Fame[j+1+saved].position.x = 9;
                                                }
                                        
                                        }
                                        
                                    Hall_of_Fame[i-1].position.z = 12
                                    Hall_of_Fame[i-1].fontSize *= 4;
                                    Hall_of_Fame[i-1].position.x = 25;
                                    console.log("tout a ete place")
                                    end_of_game (options.room, options.usernames[options.usernames.length -1])
                                    return(end_of_tournament(-1));}
//!                            navigate('/tournament_continues');
                            document.body.removeChild(renderer.domElement);
                            renderer.dispose();
                            setOptions(prevOptions => ({ ...prevOptions, ...options }));
                            navigate('/game');
                        }
                    else
                    {
                        scene.remove(options.winner)
                        clear_components(options.winner);
                        document.body.removeChild(renderer.domElement);
                        document.body.removeChild(dialogContainer);
                        renderer.dispose();
                        resetOptions();
                        navigate('/');
                    }
                    return () => {
                        console.log("GAME FINIE - WINNER : " + options.winner)
                        // Nettoyez les ressources Three.js et arrêtez les écoutes d'événements si nécessaire
                    };
                }
        }
        function end_of_tournament(counter){
            renderer.render(scene, camera);
            camera.position.z = 0;
            camera.position.x = 0;
            camera.position.y = -40;
            camera.lookAt(new THREE.Vector3(0, 0, 0));
            if(counter/60 < options.usernames.length -1) // options.usernames[15]
                {counter ++;
            if(counter % 60 === 0)
                {
                    scene.add(Hall_of_Fame[counter/60]);
                }
            requestAnimationFrame(() => end_of_tournament(counter));}
            else
                {counter ++;
                    if(counter < options.usernames.length * 60 + 1800)
                        requestAnimationFrame(() => end_of_tournament(counter));
                    else{

                    for (let i = 0; i < options.usernames.length; i++)
                        {
                            scene.remove(Hall_of_Fame[i]);
                            Hall_of_Fame[i].dispose();
                        }
                    document.body.removeChild(renderer.domElement);
                    renderer.dispose();
                    resetOptions();
                    navigate('/');}}
            

        }
        return () => {
            
            // Nettoyez les ressources Three.js et arrêtez les écoutes d'événements si nécessaire
        };
    }, [options]);

    return ; // Car le rendu est géré par Three.js et non par React
}

export default Game;