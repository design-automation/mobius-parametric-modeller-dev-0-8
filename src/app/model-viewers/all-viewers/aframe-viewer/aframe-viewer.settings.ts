import { VERSION } from '@env/version';

export interface AframeSettings {
    camera: {
        position: {x: number, y: number, z: number},
        rotation: {x: number, y: number, z: number}
    };
    background: {
        background_set: number,
        background_url: string
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
        position: {x: 0, y: 2, z: 0},
        rotation: {x: 0, y: 0, z: 0}
    },
    background: {
        background_set: 0,
        background_url: ''
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
