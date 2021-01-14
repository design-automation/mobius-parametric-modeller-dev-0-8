import { OnChanges, Component, Input, AfterViewInit } from '@angular/core';
// import @angular stuff
import {  } from '@angular/core';
// import app services
import { DataAframeService } from '../data/data.aframe.service';
import { DataService as ThreeJSDataService } from '../../gi-viewer/data/data.service';
import { GIModel } from '@libs/geo-info/GIModel';
/**
 * GIViewerComponent
 * This component is used in /app/model-viewers/model-viewers-container.component.html
 */
@Component({
    selector: 'aframe-main',
    templateUrl: './aframe-main.component.html',
    styleUrls: ['./aframe-main.component.scss'],
})
export class AframeMainComponent implements AfterViewInit, OnChanges {
    // model data passed to the viewer
    @Input() model: GIModel;
    @Input() nodeIndex: number;



    /**
     * constructor
     * @param dataService
     */
    constructor(private dataService: DataAframeService, private threeJSDataService: ThreeJSDataService) {
    }

    ngAfterViewInit() {
        if (!this.dataService.getAframeData()) {
            // const savedSettings = localStorage.getItem('aframe_settings');
            // if (!savedSettings) {
            //     this.dataService.setAframeScene(geo_default_settings);
            // } else {
                this.dataService.setAframeScene('__dummy_settings_input__');
            // }
        }
        const data = this.dataService.getAframeData();
        const threejsScene = this.threeJSDataService.getThreejsScene();
        if (!threejsScene || !data) { return; }
        data.model = this.model;
        data.refreshModel(threejsScene);
        // this.dataService.createAframeViewer(this.threeJSDataService.getThreejsScene());
    }

    ngOnChanges(changes) {
        if (changes.model || changes.nodeIndex) {
            if (this.model && this.nodeIndex) {
                // if (this.dataService.switch_page) {
                //     this.dataService.switch_page = false;
                //     return;
                // }
                // this.model.outputSnapshot = this.nodeIndex;
                const data = this.dataService.getAframeData();
                const threejsScene = this.threeJSDataService.getThreejsScene();
                if (!threejsScene || !data) { return; }
                if (!this.model) {
                    data.removeMobiusObjs();
                    return;
                }
                data.model = this.model;
                if (!threejsScene.model || threejsScene.model !== this.model || threejsScene.nodeIndex !== this.nodeIndex) {
                    threejsScene.model = this.model;
                    threejsScene.nodeIndex = this.nodeIndex;
                    threejsScene.populateScene(this.model, null);
                }
                data.refreshModel(threejsScene);
                // data.view.notifyChange();
            }
        }
    }
}
