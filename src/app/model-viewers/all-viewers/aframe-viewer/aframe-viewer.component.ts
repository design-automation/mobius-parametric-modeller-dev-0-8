import { GIModel } from '@libs/geo-info/GIModel';
import { isDevMode, ViewChild, HostListener, OnChanges } from '@angular/core';
// import @angular stuff
import { Component, Input, OnInit } from '@angular/core';
// import app services
import { DataService as MD } from '@services';
import { ColorPickerService } from 'ngx-color-picker';
import { Vector3, GridHelper } from 'three';
import { SplitComponent } from 'angular-split';
import { DataAframeService } from './data/data.aframe.service';
import { ModalService } from './html/modal-window.service';
import { DataService as ThreeJSDataService } from '../gi-viewer/data/data.service';

/**
 * GIViewerComponent
 * This component is used in /app/model-viewers/model-viewers-container.component.html
 */
@Component({
    selector: 'aframe-viewer',
    templateUrl: './aframe-viewer.component.html',
    styleUrls: ['./aframe-viewer.component.scss'],
})
export class AframeViewerComponent {
    // model data passed to the viewer
    @Input() data: GIModel;
    @Input() nodeIndex: number;


    /**
     * constructor
     * @param dataService
     */
    constructor(private dataService: DataAframeService, private modalService: ModalService, private threeJSDataService: ThreeJSDataService) {
    }

    zoomfit() {
    }

    /**
     * settingOnChange
     * @param setting
     * @param value
     */
    public settingOnChange(setting: string, value?: number) {
    }
    /**
     *
     * @param id
     */
    public openModal(id: string) {
    }
    /**
     *
     * @param id
     * @param save
     */
    public closeModal(id: string, save = false) {
    }

    public checkAPIKeyInput() {
    }

    public onCloseModal() {
    }

    public updateSettings(thisSettings: any, newSettings: any) {
    }

    public updateLighting(event) {
    }

}
