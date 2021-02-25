import { VERSION } from '@env/version';

export interface AframeSettings {
    camera: {
        position: {x: number, y: number, z: number},
        rotation: {x: number, y: number, z: number}
    };
    background: {
        background_set: number,
        background_url: string,
        background_position: {x: number, y: number, z: number},
        background_rotation: number
    };
    ambient_light: {
        show: boolean,
        color: string,
        intensity: number
    };
    hemisphere_light: {
        show: boolean,
        skyColor: string,
        groundColor: string,
        intensity: number
    };
    directional_light: {
        show: boolean,
        color: string,
        intensity: number,
        shadow: boolean,
        azimuth: number,
        altitude: number,
        distance: number,
        type: string,
        shadowSize: number
    };
    ground: {
        show: boolean,
        width: number,
        length: number,
        height: number,
        color: string,
        shininess: number
    };
}

export const aframe_default_settings: AframeSettings = {
    camera: {
        position: {x: 0, y: 5, z: 0},
        rotation: {x: 0, y: 0, z: 0}
    },
    background: {
        background_set: 1,
        background_url: '',
        background_position: {x: 0, y: 0, z: 0},
        background_rotation: 0
    },
    ambient_light: {
        show: true,
        color: '#FFFFFF',
        intensity: 0.15
    },
    hemisphere_light: {
        show: true,
        skyColor: '#FFFFFF',
        groundColor: '#FFFFFF',
        intensity: 0.15
    },
    directional_light: {
        show: true,
        color: '#FFFFFF',
        intensity: 1,
        shadow: true,
        azimuth: 90,
        altitude: 45,
        distance: 10,
        type: 'directional',
        shadowSize: 2048
    },
    ground: {
        show: true,
        width: 1000,
        length: 1000,
        height: -0.5,
        color: '#FFFFFF',
        shininess: 0
    }
};
