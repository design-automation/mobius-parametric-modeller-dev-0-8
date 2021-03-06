import { OnChanges, Component, Input, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
// import @angular stuff
import {  } from '@angular/core';
// import app services
import { DataAframeService } from '../data/data.aframe.service';
import { DataService as ThreeJSDataService } from '../../gi-viewer/data/data.service';
import { GIModel } from '@libs/geo-info/GIModel';

declare var AFRAME;
const SKY_REFRESH_RATE = 5;

let prevCamPos = new AFRAME.THREE.Vector3();
/**
 * GIViewerComponent
 * This component is used in /app/model-viewers/model-viewers-container.component.html
 */
@Component({
    selector: 'aframe-main',
    templateUrl: './aframe-main.component.html',
    styleUrls: ['./aframe-main.component.scss'],
})
export class AframeMainComponent implements AfterViewInit, OnChanges, OnDestroy {
    // model data passed to the viewer
    @Input() model: GIModel;
    @Input() nodeIndex: number;
    @Output() eventAction = new EventEmitter();

    camPosSaved = false;
    interval: NodeJS.Timer;



    /**
     * constructor
     * @param dataService
     */
    constructor(private dataService: DataAframeService, private threeJSDataService: ThreeJSDataService) {
        this.interval = setInterval(AframeMainComponent.updateCamSkyPos, SKY_REFRESH_RATE);
    }

    static updateCamSkyPos() {
        const cameraEl = <any> document.getElementById('aframe_camera');
        const sky = document.getElementById('aframe_sky');
        // const skyFG = document.getElementById('aframe_sky_foreground');
        if (!cameraEl || !sky) { return; }
        const posVec = new AFRAME.THREE.Vector3();
        cameraEl.object3D.getWorldPosition(posVec);
        if (!prevCamPos || (posVec.x !== prevCamPos.x && posVec.z !== prevCamPos.z)) {
            // sky.setAttribute('position', posVec);
            // skyFG.setAttribute('position', posVec);
            prevCamPos = posVec;
        }
    }

    ngOnDestroy() {
        clearInterval(this.interval);
        const data = this.dataService.getAframeData();
        if (!this.camPosSaved) {
            this.dataService.aframe_cam = data.getCameraPos();
        }
        data.detachAframeView();
    }

    ngAfterViewInit() {
        const data = this.dataService.getAframeData();
        const threejsScene = this.threeJSDataService.getThreejsScene();
        if (!threejsScene || !data) { return; }
        data.scene = <any> document.getElementById('aframe_scene');
        data.camera = <any> document.getElementById('aframe_camera');
        data.model = this.model;
        data.refreshModel(threejsScene);
        if (this.dataService.aframe_cam) {
            data.updateCamera(this.dataService.aframe_cam);
            this.dataService.aframe_cam = null;
        }
        setTimeout(() => {
            this.updateCamList(data);
        }, 0);
    }

    ngOnChanges(changes) {
        if (changes.model || changes.nodeIndex) {
            if (this.model && this.nodeIndex) {
                const data = this.dataService.getAframeData();
                const threejsScene = this.threeJSDataService.getThreejsScene();
                if (!threejsScene || !data) { return; }
                if (!this.model) {
                    data.removeMobiusObjs();
                    return;
                }
                if ((changes.model && !changes.model.previousValue) || (changes.nodeIndex && !changes.nodeIndex.previousValue)) { return; }
                data.model = this.model;
                if (!threejsScene.model || threejsScene.model !== this.model || threejsScene.nodeIndex !== this.nodeIndex) {
                    threejsScene.model = this.model;
                    threejsScene.nodeIndex = this.nodeIndex;
                    threejsScene.populateScene(this.model, null);
                }
                data.refreshModel(threejsScene);
                if (this.dataService.aframe_cam) {
                    data.updateCamera(this.dataService.aframe_cam);
                    this.dataService.aframe_cam = null;
                }
                // ###############################
                this.updateCamList(data);
            }
        }
    }

    saveCamPos() {
        const data = this.dataService.getAframeData();
        this.dataService.aframe_cam = data.getCameraPos();
        this.camPosSaved = true;
    }

    updateCamList(data) {
        this.eventAction.emit({
            'type': 'posListUpdate',
            'posList': data.camPosList
        });
    }

    onmousedown(event) {
        (<HTMLElement> document.activeElement).blur();
        event.preventDefault();
    }
}
