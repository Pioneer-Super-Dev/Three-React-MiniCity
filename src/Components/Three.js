import * as THREE from "three";
import * as React from 'react';

//import Stats from 'three/examples/jsm/libs/stats.module.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export function ThreeCanvas() {

    const ref = React.useRef();
    const [loaded, setLoaded] = React.useState(false);

    React.useEffect(() => {
        if(!loaded && ref) {

            let mixer;
            const clock = new THREE.Clock();
            //const stats = new Stats();
            
            const renderer = new THREE.WebGLRenderer({antialias: true});
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.outputEncoding = THREE.sRGBEncoding;

            //document.body.innerHTML = "";
            //document.body.appendChild(renderer.domElement);
            //renderer.domElement.appendChild(stats.dom);

            const pmremGenerator = new THREE.PMREMGenerator( renderer );

            const scene = new THREE.Scene();
            //scene.background = new THREE.Color(0xbfe3dd);
            scene.environemnt = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
            
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(5, 2, 8);

            const controls = new OrbitControls( camera, renderer.domElement );
			controls.target.set( 0, 0.5, 0 );
			controls.update();
			controls.enablePan = false;
			controls.enableDamping = true;

            //const geometry = new THREE.DodecahedronBufferGeometry(1.7, 0);
            // const material = new THREE.MeshStandardMaterial({
            //     color: "#00FF95",
            // });

            const Stars = () => {
                const starGeometry = new THREE.SphereGeometry(0.1, 24, 24)
                const starMaterial = new THREE.MeshStandardMaterial({color: 0xffffff})
                const star = new THREE.Mesh(starGeometry, starMaterial)

                const [x, y, z] = Array(3).fill(1).map(() => THREE.MathUtils.randFloatSpread(70))
                star.position.set(x, y, z)

                scene.add(star)
            }

            Array(200).fill(100).forEach(Stars)

            const light = new THREE.PointLight(0xffffff)
            light.position.set(20, 20, 20)
            scene.add(light)

            //camera.position.z = 5;
            //camera.position.x = 3.5

            //const Figure = new THREE.Mesh(geometry, material);

            //scene.add(Figure);

            const dracoLoader = new DRACOLoader();
			dracoLoader.setDecoderPath( 'js/libs/draco/gltf/' );

            const loader = new GLTFLoader();
			loader.setDRACOLoader( dracoLoader );
			loader.load( 'models/LittlestTokyo.glb', function ( gltf ) {

				const model = gltf.scene;
				model.position.set( 1, 1, 0 );
				model.scale.set( 0.01, 0.01, 0.01 );
				scene.add( model );

				mixer = new THREE.AnimationMixer( model );
				mixer.clipAction( gltf.animations[ 0 ] ).play();

				animate();

			}, function ( xhr ) {

                console.log(xhr.total);
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        
            }, function ( e ) {

				console.error( e );

			} );


            const animate = () => {
                requestAnimationFrame(animate);
                
                //Figure.rotation.x += 0.01;
                //Figure.rotation.y += 0.01;
                const delta = clock.getDelta();
				mixer.update( delta );
                controls.update();
                //stats.update();
                renderer.render(scene, camera);
            };

            const resize = ()  => {
                renderer.setSize(window.innerWidth, window.innerHeight);
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
            };

            //animate();
            ref.current.appendChild(renderer.domElement);
            //ref.current.appendChild(stats.dom);
            window.addEventListener("resize", resize);
            setLoaded(true);
            //return () => window.removeEventListener("resize", resize);
        }
    }, [ref, loaded]);
    
    return <div ref={ref}/>;
}