import React, { useEffect } from 'react';
import * as THREE from 'https://unpkg.com/three/build/three.module.js'; // Assurez-vous de placer le lien de l'importation correctement

function Game() {
    useEffect(() => {
        let loader = new THREE.TextureLoader();
        //		let texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/wall.jpg');
                let texture = loader.load('./opacity.png')
                let texturep1 = loader.load('https://cdn.intra.42.fr/users/ed6e227d33ac3fe0670ab0765747b72e/fmessina.jpg')
                let texture_floor = loader.load('https://t2.uc.ltmcdn.com/fr/posts/8/4/8/quelle_est_la_taille_d_un_terrain_de_football_12848_600.webp');
                let texturep2 = loader.load('https://media.4-paws.org/b/3/7/9/b3791e0f2858422701916ca7274fd9b65b584c93/VIER%20PFOTEN_2015-04-27_010-1927x1333-1920x1328.webp');
                let eye_texture = loader.load('https://media.ouest-france.fr/v1/pictures/MjAyMTA3NTYyMzgxMTg4YWZlMzI2YjY3N2VjZGExZTUxOTkxNmY?width=1260&focuspoint=50%2C24&cropresize=1&client_id=bpeditorial&sign=95034bcb2a35dc8397c6791fde91c71f9a73e28d620a686b1027cc99439a0bb4');
                //* ball and players settings 
                let ball_starting_speed = 0.03;
                let ball_speed = ball_starting_speed;
                let ball_x = 0;
                let ball_y = 0;
                let ball_z = 0;
                let ball_x_speed = ball_speed;
                let ball_y_speed = ball_speed;
                let ball_pause = 0;
                let score_p1 = 0;
                let score_p2 = 0;
                let ball_acc = 1.3;
                let player_size = 2;
                let player_width = 1;
                let player_height = 1;
                let stage_height = 10;
                let stage_width = 12;
                let ball_radius = .5;
                let player_speed = 0.1;
                let player1_direction = 0;
                let player2_direction = 0;
                let player_is_ia = 1;
                let distance_from_wall = 0;
                let ball_rotation_z =1;
                //* IA VARIABLES
                let ia_time_between_checks = 60;
                let ia_time_since_last_check = 0;
                let ia_player_know_position = 0;
                let ia_last_ball_x_position = 0;
                let ia_last_ball_y_position = 0;
                let ia_new_ball_x_position = 0;
                let ia_new_ball_y_position = 0;
                let ia_direction = 0;
                let ia_ball_estimated_impact_y = 0;
                let ia_ball_estimated_y_speed = 0;
                let ia_ball_estimated_x_speed = 0;
                let ia_this_point_time = 0;
                let ia_last_time_ia_hit =0;
                let ia_last_time_ia_hit_x = 0;
                let ia_last_time_ia_hit_y = 0;
                let ia_this_point_bounces = 0;
                let ia_just_hit = 0;
                let player_just_hit = 0;
                let nombre_ia_activees = 1;
                let which_ia = Math.trunc(Math.random() * nombre_ia_activees);
                // Our Javascript will go here.
                const scene = new THREE.Scene();
                const ground_geometry = new THREE.BoxGeometry(stage_width, stage_height, .0);
                const ground_material = new THREE.MeshBasicMaterial({ map : texture_floor });
                //const ground_material = new THREE.MeshBasicMaterial({ color : 0x00ff00});
                const ground = new THREE.Mesh(ground_geometry, ground_material);
                scene.add(ground);
                const ia_eye_geometry = new THREE.CircleGeometry(.6, 32);
                const ia_eye_material = new THREE.MeshBasicMaterial({ map : eye_texture });
                const ia_eye = new THREE.Mesh(ia_eye_geometry, ia_eye_material);
                scene.add(ia_eye);
                const target = new THREE.CircleGeometry(.1, 32);
                const target_material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                const target_mesh = new THREE.Mesh(target, target_material);
                scene.add(target_mesh);
                target_mesh.position.z = ball_radius;
                ia_eye.position.x = 0;
                ia_eye.position.y = stage_height / 2 + 1.5;
                ia_eye.position.z = .5;
                ia_eye.lookAt(new THREE.Vector3(0, 0, 0));
                const camera = new THREE.PerspectiveCamera(75, window.innerWidth /
                    window.innerHeight, 0.1, 1000);
                const renderer = new THREE.WebGLRenderer();
                camera.lookAt(new THREE.Vector3(0, 0, 0));
                renderer.setSize(window.innerWidth, window.innerHeight);
                document.body.appendChild(renderer.domElement);
                const ball_form = new THREE.SphereGeometry(ball_radius, 32, 32);
                const p1_weapon = new THREE.BoxGeometry(player_width, player_size, player_height);
                const p2_weapon = new THREE.BoxGeometry(player_width, player_size, player_height);
                const p1_material = new THREE.MeshBasicMaterial({ map: texturep1 });
                const p2_material = new THREE.MeshBasicMaterial({ map: texturep2 });
                //const ball_material = new THREE.MeshBasicMaterial({ map: texture });
                const ball_material = new THREE.MeshBasicMaterial({ color : 0xFFFFFF });
                const ball_render = new THREE.Mesh(ball_form, ball_material);
                const p1_weapon_mesh = new THREE.Mesh(p1_weapon, p1_material);
                const p2_weapon_mesh = new THREE.Mesh(p2_weapon, p2_material);
                scene.add(p1_weapon_mesh);
                scene.add(p2_weapon_mesh);
                scene.add(ball_render);
        
                p1_weapon_mesh.position.x = -stage_width / 2 + distance_from_wall ;
                p2_weapon_mesh.position.x = stage_width / 2 - distance_from_wall;
                p1_weapon_mesh.position.z = player_height;
                p2_weapon_mesh.position.z = player_height;
                ball_render.position.z = ball_radius;
            //	controls = new OrbitControls( camera, renderer.domElement );
        
                function ball_reset() {
                    ball_x = 0;
                    ball_y = Math.random() * (stage_height - ball_radius*2) - stage_height / 2 + ball_radius;
                    ball_speed = ball_starting_speed;
                    let ball_angle = Math.random() * (Math.PI / 4);
                    if (ball_angle < Math.PI / 8)
                        ball_angle = Math.PI / 8;
                    if (ball_angle > 6 * Math.PI / 8)
                        ball_angle = 6 * Math.PI / 8;
                    ball_angle += (Math.PI / 2) * Math.floor(Math.random() * 4);
                    ball_x_speed = ball_speed * Math.cos(ball_angle);
                    ball_y_speed = ball_speed * Math.sin(ball_angle);
                    ball_pause = 40;
                    if(player_is_ia){
                        ia_ball_estimated_impact_y = 0;
                        ia_ball_estimated_y_speed = 0;
                        ia_ball_estimated_x_speed = 0;
                        ia_this_point_time = 0;
                        ia_last_time_ia_hit = 0;
                        ia_last_time_ia_hit_x = 0;
                        ia_last_time_ia_hit_y = 0;
                        ia_this_point_bounces = 0;
                    }
                }
        
                function ball_move() {
                    ball_render.position.x = ball_x;
                    ball_render.position.y = ball_y;
                    if (ball_pause) {
                        ball_pause--;
                        return;
                    }
                    ball_x += ball_x_speed;
                    ball_y += ball_y_speed;
                    if (ball_x > stage_width /2 -distance_from_wall - player_width ) {
                        if (ball_y > p2_weapon_mesh.position.y + player_size / 2 || ball_y < p2_weapon_mesh.position.y - player_size / 2) {
                            score_p1++;
                            ball_reset();
                        }
                        ball_x_speed = -ball_x_speed * ball_acc;
                        ball_y_speed = ball_y_speed * ball_acc;
                        ball_rotation_z *= -1;
                    }
                    if (ball_x < -stage_width /2 +distance_from_wall + player_width) {
                        if (ball_y > p1_weapon_mesh.position.y + player_size / 2 || ball_y < p1_weapon_mesh.position.y - player_size / 2) {
                            score_p2++;
                            ball_reset();
                        }
                        ball_x_speed = -ball_x_speed * ball_acc;
                        ball_y_speed = ball_y_speed * ball_acc;
                        ball_rotation_z *=-1;
                    }
                    if (ball_y > stage_height/2 - ball_radius || ball_y < -stage_height/2 + ball_radius) {
                        ball_y_speed = -ball_y_speed;
                        ball_rotation_z *=-1;
                    }
        
                }
                function ia_follow_target(pos){
                    if (ball_x_speed > 0){	
                        if (pos > ia_ball_estimated_impact_y +.1){
                        ia_direction = 1;
                        }
                        else if (pos < ia_ball_estimated_impact_y - .1){
                            ia_direction = -1;
                        }
                        else {
                            ia_direction = 0;
                        }
                    }
                    else
                    {
                        if (pos > 0.1)
                            ia_direction = 1;
                        else	if (pos < -0.1)
                            {
                            ia_direction = -1;}
                            else {
                                ia_direction = 0;
                            }
                    }
                        console.log(ia_ball_estimated_impact_y);
        
        
                }
                function estimate_ball_speeds(){
                    if (!ia_this_point_time){
                        //! on lui donne les valeurs de debut si c'est l engagement
                        ia_ball_estimated_x_speed = ball_x_speed;
                        ia_ball_estimated_y_speed = ball_y_speed;
                        if (ball_x_speed > 0){
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
                    ia_ball_estimated_x_speed = (ia_new_ball_x_position - ia_last_ball_x_position) / ia_time_between_checks;
                    ia_ball_estimated_y_speed = (ia_new_ball_y_position - ia_last_ball_y_position) / ia_time_between_checks;
                    //on calcule a quel point la balle va toucher l'axe des joueurs	
                    if (ball_x_speed > 0){
                        //elle va a droite
                        target_mesh.position.x = stage_width / 2 - distance_from_wall - player_width/2 - ball_radius;
                        //puis on calcule a quel y elle atteindra la position x
                        ia_ball_estimated_impact_y = ball_y + (stage_width / 2 - distance_from_wall - player_width - ball_x) * ball_y_speed / ball_x_speed;
                    }
                    else{
                        //elle va a gauche donc le temps qu'elle atteigne la position x est la distance qui lui reste a parcourir / la vitesse x
                        //puis on calcule a quel y elle atteindra la position x
                        ia_ball_estimated_impact_y = ball_y + (ball_x + stage_width / 2 - distance_from_wall - player_width/2 - ball_radius) / -ball_x_speed * ball_y_speed;
                        target_mesh.position.x = -stage_width / 2 + distance_from_wall + player_width/2 + ball_radius;
                    }
            // Correction de la position en Y si la balle touche les bords du terrain
            while (ia_ball_estimated_impact_y > stage_height / 2 - ball_radius || ia_ball_estimated_impact_y < -stage_height / 2 + ball_radius) {
                if (ia_ball_estimated_impact_y > stage_height / 2 - ball_radius) {
                    ia_ball_estimated_impact_y = 2 * (stage_height / 2 - ball_radius) - ia_ball_estimated_impact_y;
        
                } else if (ia_ball_estimated_impact_y < -stage_height / 2 + ball_radius) {
                    ia_ball_estimated_impact_y = 2 * (-stage_height / 2 + ball_radius) - ia_ball_estimated_impact_y;
        
                }
            }
        
        
        
        
                    target_mesh.position.y = ia_ball_estimated_impact_y;
                    
                    
                }
                function ia_move(){
                    let ia_position = p2_weapon_mesh.position.y;
                    ia_direction = 1;
                    
                    if (ia_time_since_last_check >= ia_time_between_checks || !ia_this_point_time){
                        if (player_is_ia){
                            scene.add(ia_eye);
                        }
                        ia_time_since_last_check = 0;
                        ia_last_ball_x_position = ia_new_ball_x_position;
                        ia_last_ball_y_position = ia_new_ball_y_position;
                        ia_new_ball_x_position = ball_x;
                        ia_new_ball_y_position = ball_y;
                        ia_player_know_position = p1_weapon_mesh.position.y;
                        estimate_ball_speeds();
                    }
                    if (ia_time_since_last_check >3){
                        scene.remove(ia_eye);
                    }
                    
                    ia_time_since_last_check++;
                    ia_this_point_time++;
                    switch (which_ia){
                        default :
                            ia_follow_target(ia_position);
                            break;
                    }
                }
        
                function handleKeyDown(event) {
                  if (event.keyCode === 87) { 
                    player1_direction = 1;
                    }
                if (event.keyCode === 83) {
                    player1_direction = -1;
                    }
                if (event.keyCode === 38) {
                    player_is_ia =0;
                    player2_direction = -1;
                    }
                if (event.keyCode === 40) {
                    player_is_ia = 0;
                    player2_direction = 1;
                    }
                }
        
                function handleKeyUp(event) {
                    if (event.keyCode === 87 || event.keyCode === 83) {
                        player1_direction = 0;
                    }
                    if (event.keyCode === 38 || event.keyCode === 40) {
                        player2_direction = 0;
                    }
                  }
        
                window.addEventListener('keydown', handleKeyDown, false);
                window.addEventListener('keyup', handleKeyUp, false);
                let p1_direction = 1;
                let p2_direction = 1;
                function player_move() {
                    p1_weapon_mesh.position.y += player_speed *player1_direction;
                    p2_weapon_mesh.position.y -= player_speed *player2_direction;
                    if (p1_weapon_mesh.position.y > stage_height / 2 - player_size / 2) {
                        p1_weapon_mesh.position.y = stage_height / 2 - player_size / 2;
                    }
                    if (p1_weapon_mesh.position.y < -stage_height / 2 + player_size / 2) {
                        p1_weapon_mesh.position.y = -stage_height / 2 + player_size / 2;
                    }
                    if (p2_weapon_mesh.position.y > stage_height / 2 - player_size / 2) {
                        p2_weapon_mesh.position.y = stage_height / 2 - player_size / 2;
                    }
                    if (p2_weapon_mesh.position.y < -stage_height / 2 + player_size / 2) {
                        p2_weapon_mesh.position.y = -stage_height / 2 + player_size / 2;
                    }
        
                    
                }
            //	camera.position.x = 10;
            //	camera.position.y = 0;
                camera.position.z = 10;
                camera.lookAt(new THREE.Vector3(0, 0, 0));
                //camera.rotateZ(Math.PI / 2);
            //	camera.rotation.set(Math.PI / -2, 0, 0);
                ground.position.z = 0.0;
                function animate() {
                    requestAnimationFrame(animate);
                    ball_render.rotation.z += (Math.abs(ball_y_speed) + Math.abs(ball_x_speed))* ball_rotation_z ;
            //		ball_render.rotation.y += ball_x_speed * 2;
            //		ball_render.rotation.x += ball_y_speed * 2;
                    ball_move();
                    ia_move();
                    if (player_is_ia)
                        player2_direction = ia_direction;
                    else
                        estimate_ball_speeds();
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

export default Game;
