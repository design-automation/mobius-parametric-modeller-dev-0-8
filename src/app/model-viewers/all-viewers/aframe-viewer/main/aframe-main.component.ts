import { OnChanges, Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
// import @angular stuff
import {  } from '@angular/core';
// import app services
import { DataAframeService } from '../data/data.aframe.service';
import { DataService as ThreeJSDataService } from '../../gi-viewer/data/data.service';
import { GIModel } from '@libs/geo-info/GIModel';
import { aframe_default_settings } from '../aframe-viewer.settings';
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

    camPosSaved = false;


    /**
     * constructor
     * @param dataService
     */
    constructor(private dataService: DataAframeService, private threeJSDataService: ThreeJSDataService) {
    }

    ngOnDestroy() {
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
        // this.dataService.createAframeViewer(this.dataService.getThreejsScene());
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
                // data.view.notifyChange();
            }
        }
    }

    saveCamPos() {
        const data = this.dataService.getAframeData();
        this.dataService.aframe_cam = data.getCameraPos();
        this.camPosSaved = true;
    }
}
