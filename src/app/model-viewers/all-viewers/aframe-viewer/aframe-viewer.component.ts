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
import { AframeSettings, aframe_default_settings } from './aframe-viewer.settings';

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
    public backup_settings: AframeSettings;
    public settings: AframeSettings = aframe_default_settings;

    public showCamPosList = false;
    public camPosList = [null];
    public selectedCamPos = 0;

    temp_camera_pos = new AFRAME.THREE.Vector3(0, 0, 0);
    temp_camera_rot = new AFRAME.THREE.Vector3(-1, 0, 0);

    private settingsUpdateInterval;

    /**
     * constructor
     * @param dataService
     */
    constructor(private dataService: DataAframeService, private modalService: ModalService,
            private threeJSDataService: ThreeJSDataService, private cpService: ColorPickerService,
            private mainDataService: MD) {
        const previous_settings = JSON.parse(localStorage.getItem('aframe_settings'));
        // const devMode = isDevMode();
        const devMode = false;
        if (previous_settings === null) {
            localStorage.setItem('aframe_settings', JSON.stringify(this.settings));
        } else {
            this.propCheck(previous_settings, this.settings);
            localStorage.setItem('aframe_settings', JSON.stringify(previous_settings));
            this.settings = previous_settings;
        }
        this.dataService.setAframeScene(this.settings);
    }

    /**
     * ngOnInit
     */
    ngOnInit() {
        this.getSettings();
        localStorage.setItem('aframe_default_settings', JSON.stringify(aframe_default_settings));
        // this.temp_camera_pos = this.dataService.getThreejsScene().perspCam.position;

        this.settingsUpdateInterval = setInterval(() => {
            if (this.mainDataService.aframeViewerSettingsUpdated) {
                this.settings = JSON.parse(localStorage.getItem('aframe_settings'));
                const aframeData = this.dataService.getAframeData();
                aframeData.settings = JSON.parse(localStorage.getItem('aframe_settings'));
                aframeData.refreshModel(this.threeJSDataService.getThreejsScene());
                this.mainDataService.aframeViewerSettingsUpdated = false;
            }
        }, 100);
    }

    private getSettings() {
        if (localStorage.getItem('aframe_settings') !== null) {
            this.settings = JSON.parse(localStorage.getItem('aframe_settings'));
        }
    }

    public onEventAction(event) {
        if (event.type === 'posListUpdate' && event.posList) {
            this.camPosList = event.posList;
            if (this.camPosList && this.camPosList.length > 1) {
                this.showCamPosList = true;
            } else {
                this.showCamPosList = false;
            }
            if (this.showCamPosList && this.dataService.aframeCamPos) {
                let posCheck = false;
                for (let i = 0 ; i < this.camPosList.length; i ++) {
                    if (this.dataService.aframeCamPos === this.camPosList[i].name) {
                        posCheck = true;
                        this.changePos(i);
                    }
                }
                if (!posCheck) {
                    this.selectedCamPos = 0;
                    this.dataService.aframeCamPos = 'default';
                }
            }
        }
    }

    changePos(value) {
        const selectedIndex = Number(value);
        // this.selectedCamPos = this.camPosList[selectedIndex];
        this.selectedCamPos = selectedIndex;
        const aframeData = this.dataService.getAframeData();
        if (selectedIndex > 0) {
            aframeData.updateCameraPos(this.camPosList[selectedIndex]);
        } else {
            aframeData.updateCameraPos(null);
        }
        this.dataService.aframeCamPos = this.camPosList[selectedIndex].name;
        (<HTMLElement> document.activeElement).blur();
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
                const cam_pos_data = this.dataService.getAframeData().getCameraPos();
                if (!cam_pos_data) { break; }
                this.temp_camera_pos.x = cam_pos_data.position.x;
                this.temp_camera_pos.y = this.settings.camera.position.y;
                this.temp_camera_pos.z = cam_pos_data.position.z;
                this.settings.camera.position = this.temp_camera_pos;
                break;
            case 'camera.get_camera_rot':
                const cam_rot_data = this.dataService.getAframeData().getCameraPos();
                if (!cam_rot_data) { break; }
                this.temp_camera_rot.x = cam_rot_data.rotation.x;
                this.temp_camera_rot.y = cam_rot_data.rotation.y;
                this.temp_camera_rot.z = cam_rot_data.rotation.z;
                this.settings.camera.rotation = this.temp_camera_rot;
                break;
            case 'background.set':
                this.settings.background.background_set = Number(value);
                break;
            case 'background.pos_x':
                if (isNaN(value)) {
                    return;
                }
                this.settings.background.background_position.x = Number(value);
                break;
            case 'background.pos_z':
                if (isNaN(value)) {
                    return;
                }
                this.settings.background.background_position.z = Number(value);
                break;
            case 'background.rotation':
                if (isNaN(value)) {
                    return;
                }
                this.settings.background.background_rotation = Number(value);
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
            this.backup_settings = <AframeSettings> JSON.parse(JSON.stringify(this.settings));
            this.temp_camera_pos = this.settings.camera.position;
            this.temp_camera_rot = this.settings.camera.rotation;
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
            this.settings.camera = {
                position: this.temp_camera_pos,
                rotation: this.temp_camera_rot
            };
            this.dataService.getAframeData().updateSettings(this.settings);
            // document.getElementById('executeButton').click();
        } else {
            this.settings = this.backup_settings;
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

    resetToDefault() {
        this.settings = JSON.parse(JSON.stringify(aframe_default_settings));
        this.temp_camera_pos = JSON.parse(JSON.stringify(aframe_default_settings.camera.position));
        this.temp_camera_rot = JSON.parse(JSON.stringify(aframe_default_settings.camera.rotation));
    }
}
