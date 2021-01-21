
// import @angular stuff
import { Injectable } from '@angular/core';
import { AframeSettings } from '../aframe-viewer.settings';

import { DataAframe } from './data.aframe';

/**
 * DataService
 * The data service for the Aframe viewer.
 */
@Injectable()
export class DataAframeService {
    private _aframe_data: DataAframe;
    private _aframe_settings: AframeSettings;
    private _aframe_cam: any;

    /**
     * Create a data service.
     */
    constructor() {
    }

    /**
     * Get the Aframe Scene
     */
    getAframeData(): any {
        return this._aframe_data;
    }
    /**
     * Set the Aframe Scene
     */
    setAframeScene(settings: AframeSettings) {
        this._aframe_data = new DataAframe(settings);
    }

    /**
     * Get the Aframe Scene
     */
    getAframeSettings(): AframeSettings {
        return this._aframe_settings;
    }

    /**
     * Set the Aframe Scene
     */
    setAframeSettings(settings: AframeSettings) {
        this._aframe_settings = settings;
    }

    public get aframe_cam(): any {
        return this._aframe_cam;
    }
    public set aframe_cam(value: any) {
        this._aframe_cam = value;
    }

    // createAframeViewer(threejsScene) {
    //     this._aframe_data.createAframeViewer(threejsScene);
    // }
}
