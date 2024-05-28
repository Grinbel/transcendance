import  { useEffect, useState } from 'react'; 
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Text } from 'troika-three-text';
import { useGameContext } from './contexts/GameContext.jsx';
//! ICI j'adapte le code pour jouer en distant avec le bot .


function Game() {
    //TODO : get all options from main page
    const { options } = useGameContext();
    console.log(" COUCOU NOM P1 =" + options.name_p1)
    //console.log(" COUCOU NOM P2 =" + options.name_p2)
    console.log(" vitessse balle" + options.ball_starting_speed)
    options.ball_speed=options.ball_starting_speed
      useEffect(() => {
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
        ia_eye.position.x = 0;
        ia_eye.position.y = options.stage_height / 2 + 1.5;
        ia_eye.position.z = 3;
        ia_eye.lookAt(new THREE.Vector3(0, 0, 0));
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth /
            window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
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
            options.ball_x_speed = options.ball_speed * Math.cos(ball_angle);
            options.ball_y_speed = options.ball_speed * Math.sin(ball_angle);
            if(options.ball_x_speed > 0)
                ball_render.material = ball_material_1
            else
                ball_render.material = ball_material_2
            ball_render.geometry.uvsNeedUpdate = true; //pour qu il recalcule les coordonnees de texture
            ball_render.needsUpdate = true; // pour prevenir que le materiau a change
            console.log("ball_x_speed " + options.ball_x_speed)
            console.log("ball_y_speed " + options.ball_y_speed)
            console.log("ball_angle " + ball_angle)
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
                options.ball_x_speed = -options.ball_x_speed * options.ball_acc;
                options.ball_y_speed = options.ball_y_speed * options.ball_acc;
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
                options.ball_x_speed = -options.ball_x_speed * options.ball_acc;
                options.ball_y_speed = options.ball_y_speed * options.ball_acc;
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
            options.ia_position = p2_weapon_mesh.position.y;
            options.ia_direction = 1;
                
            if (options.ia_time_since_last_check >= options.ia_time_between_checks || !options.ia_this_point_time){
                if (options.player_is_ia){
                    scene.add(ia_eye);
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
            if (event.keyCode === 87) { 
                options.player1_direction = 1;
            }
            if (event.keyCode === 83) {
                options.player1_direction = -1;
            }
            if (event.keyCode === 38) {
                options.player_is_ia =0;
                options.player2_direction = -1;
            }
            if (event.keyCode === 40) {
                options.player_is_ia = 0;
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
        let size = Math.max(options.name_p1.length,options.name_p2.length);
        console.log(size)
        text.fontSize = 1*5/size;
        text.color = 0x0000FF;

        text.rotation.x = Math.PI/2;
        text.position.y = options.stage_height /2
        // Après avoir changé des propriétés, vous devez toujours appeler sync()
        text.sync();

        // Ajouter le texte à la scène

        scene.add(text);
        return text;
    }


        let text_p1 = create_text(options.name_p1 + " : " + options.score_p1);
        text_p1.position.z += options.ball_radius *2 +2
        text_p1.position.x = -options.stage_width/2
        let text_p2 = create_text(options.name_p2 + " : " + options.score_p2);
        text_p2.position.z+=  options.ball_radius*2 +2
        server_ball_reset()
        function animate() {
            if(((options.score_p1 >= options.score_to_get || options.score_p2 >= options.score_to_get) && Math.abs(options.score_p1-options.score_p2) >= options.score_diff) || options.score_p1>options.score_max || options.score_p2>options.score_max)
                {
                    scene.clear();
                    options.winner = options.score_p1>options.score_p2?options.name_p1:options.name_p2;
                    console.log(options.winner);
                    options.winner = create_text("WINNER : " + options.winner );
                    options.winner.position.x = -3
                    return(end_of_game(-1));
                }
            requestAnimationFrame(animate);
            ball_render.rotation.z += (Math.abs(options.ball_y_speed) + Math.abs(options.ball_x_speed))* options.ball_rotation_z;
    //		ball_render.rotation.y += ball_x_speed * 2;
    //		ball_render.rotation.x += ball_y_speed * 2;
            server_side_work(options.player1_direction);
            renderer.render(scene, camera);
        }
        animate();
        function end_of_game(counter){

            renderer.render(scene, camera);
            if (counter !=0)
                {
                    options.winner.rotation.y +=0.1;
                    requestAnimationFrame(() => end_of_game(counter - 1));}
            
        }
        return () => {
            // Nettoyez les ressources Three.js et arrêtez les écoutes d'événements si nécessaire
        };
    }, []);

    return null; // Car le rendu est géré par Three.js et non par React
}

export default Game;