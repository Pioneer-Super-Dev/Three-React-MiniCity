import * as THREE from "three";
import * as React from 'react';
import * as THREE from "three";

export function ThreeCanvas() {

    const ref = React.useRef();
    const [loaded, setLoaded] = React.useState(false);

    React.useEffect(() => {
        if(!loaded && ref) {

            
            ref.current.appendChild(renderer.domElement);
            window.addEventListener("resize", resize);
            setLoaded(true);
        }
    }, [ref, loaded]);
    
    return <div ref={ref}/>;
}