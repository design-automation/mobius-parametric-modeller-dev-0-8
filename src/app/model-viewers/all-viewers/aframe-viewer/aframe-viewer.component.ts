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
import { aframe_default_settings } from './aframe-viewer.settings';

/**
 * GIViewerComponent
 * This component is used in /app/model-viewers/model-viewers-container.component.html
 */
@Component({
    selector: 'aframe-viewer',
    templateUrl: './aframe-viewer.component.html',
    styleUrls: ['./aframe-viewer.component.scss'],
})
export class AframeViewerComponent implements OnInit{
    // model data passed to the viewer
    @Input() data: GIModel;
    @Input() nodeIndex: number;
    public settings = aframe_default_settings;

    temp_camera_pos = new AFRAME.THREE.Vector3(0, 0, 0);
    temp_camera_rot = new AFRAME.THREE.Vector3(-1, 0, 0);

    /**
     * constructor
     * @param dataService
     */
    constructor(private dataService: DataAframeService, private modalService: ModalService,
            private threeJSDataService: ThreeJSDataService, private cpService: ColorPickerService) {
        const previous_settings = JSON.parse(localStorage.getItem('aframe_settings'));
        // const devMode = isDevMode();
        const devMode = false;
        console.log(previous_settings)
        if (previous_settings === null) {
            localStorage.setItem('aframe_settings', JSON.stringify(this.settings));
        } else {
            this.propCheck(previous_settings, this.settings);
            localStorage.setItem('aframe_settings', JSON.stringify(previous_settings));
        }
        this.settings = previous_settings;
        this.dataService.setAframeScene(this.settings);
    }

    /**
     * ngOnInit
     */
    ngOnInit() {
        this.getSettings();
        localStorage.setItem('aframe_default_settings', JSON.stringify(aframe_default_settings));
        // this.temp_camera_pos = this.dataService.getThreejsScene().perspCam.position;

        // this.settingsUpdateInterval = setInterval(() => {
        //     if (this.mainDataService.viewerSettingsUpdated) {
        //         this.settings = JSON.parse(localStorage.getItem('mpm_settings'));
        //         this.closeModal('settings_modal', true);
        //         this.mainDataService.viewerSettingsUpdated = false;
        //     }
        // }, 100);
    }

    private getSettings() {
        if (localStorage.getItem('aframe_settings') !== null) {
            this.settings = JSON.parse(localStorage.getItem('aframe_settings'));
        }
    }


    zoomfit() {
    }

    /**
     * settingOnChange
     * @param setting
     * @param value
     */
    public settingOnChange(setting: string, value?: number) {
        // const scene = this.dataService.getThreejsScene();
        switch (setting) {
            case 'camera.pos_x':
                if (isNaN(value)) {
                    return;
                }
                this.temp_camera_pos.x = Math.round(value);
                break;
            case 'camera.pos_y':
                if (isNaN(value)) {
                    return;
                }
                this.temp_camera_pos.y = Math.round(value);
                break;
            case 'camera.pos_z':
                if (isNaN(value)) {
                    return;
                }
                this.temp_camera_pos.z = Math.round(value);
                break;
            case 'camera.rot_x':
                if (isNaN(value)) {
                    return;
                }
                this.temp_camera_rot.x = Math.round(value);
                break;
            case 'camera.rot_y':
                if (isNaN(value)) {
                    return;
                }
                this.temp_camera_rot.y = Math.round(value);
                break;
            case 'camera.rot_z':
                if (isNaN(value)) {
                    return;
                }
                this.temp_camera_rot.z = Math.round(value);
                break;
            case 'camera.get_camera_pos':
                break;
            case 'camera.get_camera_rot':
                break;
            case 'background.set':
                this.settings.background.background_set = Number(value);
                break;
            case 'ground.show':
                this.settings.ground.show = !this.settings.ground.show;
                break;
            case 'ground.width':
                this.settings.ground.width = Number(value);
                break;
            case 'ground.length':
                this.settings.ground.length = Number(value);
                break;
            case 'ground.height':
                this.settings.ground.height = Number(value);
                // if (scene.groundObj) {
                //     scene.groundObj.position.setZ(this.settings.ground.height);
                // }
                break;
            case 'ground.shininess':
                this.settings.ground.shininess = Number(value);
                break;
        }
    }
    /**
     *
     * @param id
     */
    public openModal(id: string) {
        // if (localStorage.getItem('geo_settings') !== null) {
        //     // this.settings = JSON.parse(localStorage.getItem('mpm_settings'));
        // }
        if (document.body.className === 'modal-open') {
            this.modalService.close(id);
        } else {
            // this.backup_settings = <GeoSettings> JSON.parse(JSON.stringify(this.settings));
            // const scene = this.dataService.getGeoScene();
            this.modalService.open(id);
        }
    }
    /**
     *
     * @param id
     * @param save
     */
    public closeModal(id: string, save = false) {
        this.modalService.close(id);
        if (save) {
            // this.settings.camera = {
            //     position: this.temp_camera_pos,
            //     rotation: this.temp_camera_rot,
            // };
            this.dataService.getAframeData().settings = this.settings;
            console.log(this.dataService.getAframeData().settings);
            localStorage.setItem('aframe_settings', JSON.stringify(this.settings));
        } else {
            // tslint:disable-next-line: forin
            for (const setting in this.dataService.getAframeData().settings) {
                this.settings[setting] = this.dataService.getAframeData().settings[setting];
            }
        }
        this.dataService.getAframeData().refreshModel(this.threeJSDataService.getThreejsScene());
    }

    public onCloseModal() {
        // tslint:disable-next-line: forin
        for (const setting in this.dataService.getAframeData().settings) {
            this.settings[setting] = this.dataService.getAframeData().settings[setting];
        }
    }

    public updateSettings(thisSettings: any, newSettings: any) {
    }

    public updateLighting(event) {
    }

    formatNumber(value) {
        if (!value) { value = 0; }
        return Math.round(value * 100) / 100;
    }
    /**
     * Check whether the current settings has same structure with
     * the previous settings saved in local storage. If not, replace the local storage.
     * @param obj1
     * @param obj2
     */
    propCheck(obj1, obj2, checkChildren = true) {
        for (const i in obj2) {
            if (!obj1.hasOwnProperty(i)) {
                obj1[i] = JSON.parse(JSON.stringify(obj2[i]));
            } else if (checkChildren && obj1[i].constructor === {}.constructor && obj2[i].constructor === {}.constructor) {
                this.propCheck(obj1[i], obj2[i], false);
            }
        }
    }

    checkColor(color) {
        const _color = this.cpService.hsvaToRgba(this.cpService.stringToHsva(color));
        if ((_color.r + _color.g + _color.b) / _color.a < 1.5) {
            return true;
        } else {
            return false;
        }
    }

}
