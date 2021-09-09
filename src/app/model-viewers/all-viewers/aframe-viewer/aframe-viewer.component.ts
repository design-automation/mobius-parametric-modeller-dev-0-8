import { GIModel } from '@libs/geo-info/GIModel';
// import @angular stuff
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
// import app services
import { DataService as MD } from '@services';
import { ColorPickerService } from 'ngx-color-picker';
import { DataAframeService } from './data/data.aframe.service';
import { ModalService } from './html/modal-window.service';
import { DataService as ThreeJSDataService } from '../gi-viewer/data/data.service';
import { AframeSettings, aframe_default_settings } from './aframe-viewer.settings';
import { ProcedureTypes } from '@models/procedure';
import { NodeUtils } from '@models/node';
import { checkNodeValidity } from '@shared/parser';
import { AllFunctionDoc } from '@shared/decorators';
import { DefaultSettings as DefaultGISettings } from '../gi-viewer/gi-viewer.settings';
declare var AFRAME;

/**
 * GIViewerComponent
 * This component is used in /app/model-viewers/model-viewers-container.component.html
 */
@Component({
    selector: 'aframe-viewer',
    templateUrl: './aframe-viewer.component.html',
    styleUrls: ['./aframe-viewer.component.scss'],
})
export class AframeViewerComponent implements OnInit, OnDestroy {
    // model data passed to the viewer
    @Input() data: GIModel;
    @Input() nodeIndex: number;
    public backup_settings: AframeSettings;
    public settings: AframeSettings = aframe_default_settings;

    public showCamPosList = false;
    public camPosList = [null];
    public selectedCamPos = 0;

    public vr = {
        enabled: false,
        background_url: '',
        background_rotation: 0,
        foreground_url: '',
        foreground_rotation: 0,
        camera_position: new AFRAME.THREE.Vector3(0, 5, 0),
        camera_rotation: new AFRAME.THREE.Vector3(0, 0, 0),
    };

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
        const data = this.dataService.getAframeData();
        if (!data) {
            this.dataService.setAframeScene(this.settings);
        }
        this.resetVRSettings();
    }

    /**
     * ngOnInit
     */
    ngOnInit() {
        this.getSettings();
        localStorage.setItem('aframe_default_settings', JSON.stringify(aframe_default_settings));
        if (this.vr.enabled) {
            this.selectedCamPos = this.camPosList.length - 1;
        }
        const threejsScene = this.threeJSDataService.getThreejsScene();
        if (!threejsScene) {
            this.threeJSDataService.setThreejsScene(DefaultGISettings);
        }
        this.settingsUpdateInterval = setInterval(() => {
            if (this.mainDataService.aframeViewerSettingsUpdated) {
                this.settings = JSON.parse(localStorage.getItem('aframe_settings'));
                const aframeData = this.dataService.getAframeData();
                aframeData.settings = JSON.parse(localStorage.getItem('aframe_settings'));
                aframeData.refreshModel(this.threeJSDataService.getThreejsScene());
                this.mainDataService.aframeViewerSettingsUpdated = false;
            }
            const cameraUpdateData = document.getElementById('aframe-cameraUpdateData');
            if (!cameraUpdateData) { return; }
            if ((<HTMLInputElement>cameraUpdateData.children[0]).value) {
                this.updatePos((<HTMLInputElement>cameraUpdateData.children[1]).value);
                (<HTMLInputElement>cameraUpdateData.children[0]).value = null;
            }
            if ((<HTMLInputElement>cameraUpdateData.children[2]).value) {
                this.updateLook((<HTMLInputElement>cameraUpdateData.children[3]).value);
                (<HTMLInputElement>cameraUpdateData.children[2]).value = null;
            }
        }, 100);
    }

    ngOnDestroy() {
        clearInterval(this.settingsUpdateInterval);
    }

    private getSettings() {
        if (localStorage.getItem('aframe_settings') !== null) {
            this.settings = JSON.parse(localStorage.getItem('aframe_settings'));
        }
    }

    public onEventAction(event) {
        if (event.type === 'posListUpdate' && event.posList) {
            this.camPosList = event.posList;
            if (this.dataService.aframeCamPos) {
                let posCheck = false;
                for (let i = 0 ; i < this.camPosList.length; i ++) {
                    if (this.dataService.aframeCamPos === this.camPosList[i].name) {
                        this.selectedCamPos = i;
                        this.changePos(i);
                        posCheck = true;
                    }
                }
                if (!posCheck) {
                    if (this.vr.enabled) {
                        this.selectedCamPos = this.camPosList.length - 1;
                        this.dataService.aframeCamPos = 'Edit POV';
                    } else {
                        this.selectedCamPos = 0;
                        this.dataService.aframeCamPos = 'Walk';
                    }
                    this.changePos(this.selectedCamPos);
                }
            }
            this.showCamPosList = true;
            setTimeout(() => {
                const selCamPosEl = <HTMLSelectElement> document.getElementById('selCamPosEl');
                if (selCamPosEl) { selCamPosEl.value = this.selectedCamPos.toString(); }
            }, 0);
        }
    }

    changePos(value) {
        const selectedIndex = Number(value);
        this.selectedCamPos = selectedIndex;
        const aframeData = this.dataService.getAframeData();
        if (selectedIndex === this.camPosList.length - 1) {
            aframeData.updateCameraPos(null);
            this.vr.enabled = true;
            this.vr.background_url = this.settings.vr.background_url;
            this.vr.foreground_url = this.settings.vr.foreground_url;
            aframeData.updateVRSettings(this.vr);
            aframeData.refreshModel(this.threeJSDataService.getThreejsScene());
        } else if (selectedIndex === 0) {
            aframeData.updateCameraPos(null);
            this.vr.enabled = false;
            this.vr.background_url = '';
            this.vr.foreground_url = '';
            aframeData.updateVRSettings(this.vr);
            aframeData.refreshModel(this.threeJSDataService.getThreejsScene());
            this.vr.background_url = this.settings.vr.background_url;
            this.vr.foreground_url = this.settings.vr.foreground_url;
        } else {
            this.vr.enabled = false;
            this.vr.background_url = '';
            this.vr.foreground_url = '';
            aframeData.updateVRSettings(this.vr);
            // aframeData.refreshModel(this.threeJSDataService.getThreejsScene());
            this.vr.background_url = this.settings.vr.background_url;
            this.vr.foreground_url = this.settings.vr.foreground_url;
            aframeData.updateCameraPos(this.camPosList[selectedIndex]);
        }
        this.dataService.aframeCamPos = this.camPosList[selectedIndex].name;
        (<HTMLElement> document.activeElement).blur();
    }

    zoomfit() {
        this.resetDefault('camera.pos');
        this.resetDefault('camera.rot');
        this.settings.camera.position = this.temp_camera_pos;
        this.settings.camera.rotation = this.temp_camera_rot;
        this.dataService.getAframeData().updateSettings(this.settings);
        this.dataService.getAframeData().refreshModel(this.threeJSDataService.getThreejsScene());
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
            case 'camera.acceleration':
                if (isNaN(value)) {
                    return;
                }
                this.settings.camera.acceleration = Math.round(value);
                break;
            case 'background.get_background_pos':
                const cam_pos = this.dataService.getAframeData().getCameraPos();
                this.settings.background.background_position.x = cam_pos.position.x;
                this.settings.background.background_position.z = cam_pos.position.z;
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
            case 'vr.enabled':
                this.vr.enabled = !this.vr.enabled;
                break;
            case 'vr.background_rotation':
                if (isNaN(value)) {
                    return;
                }
                this.vr.background_rotation = Number(value);
                this.settings.vr.background_rotation = Number(value);
                this.vr.foreground_rotation = Number(value);
                this.settings.vr.foreground_rotation = Number(value);
                break;
            case 'vr.foreground_rotation':
                if (isNaN(value)) {
                    return;
                }
                this.vr.foreground_rotation = Number(value);
                this.settings.vr.foreground_rotation = Number(value);
                this.vr.background_rotation = Number(value);
                this.settings.vr.background_rotation = Number(value);
                break;
            case 'vr.camera.pos_x':
                if (isNaN(value)) {
                    return;
                }
                this.vr.camera_position.x = Math.round(value);
                break;
            case 'vr.camera.pos_y':
                if (isNaN(value)) {
                    return;
                }
                this.vr.camera_position.y = Math.round(value);
                break;
            case 'vr.camera.pos_z':
                if (isNaN(value)) {
                    return;
                }
                this.vr.camera_position.z = Math.round(value);
                break;
            case 'vr.camera.rot_x':
                if (isNaN(value)) {
                    return;
                }
                this.vr.camera_rotation.x = Math.round(value);
                break;
            case 'vr.camera.rot_y':
                if (isNaN(value)) {
                    return;
                }
                this.vr.camera_rotation.y = Math.round(value);
                break;
            case 'camera.get_vr_camera_pos':
                const vr_cam_pos_data = this.dataService.getAframeData().getCameraPos();
                if (!vr_cam_pos_data) { break; }
                this.vr.camera_position.x = vr_cam_pos_data.position.x;
                this.vr.camera_position.z = vr_cam_pos_data.position.z;
                break;
            case 'camera.get_vr_camera_rot':
                const vr_cam_rot_data = this.dataService.getAframeData().getCameraPos();
                if (!vr_cam_rot_data) { break; }
                this.vr.camera_rotation.x = vr_cam_rot_data.rotation.x;
                this.vr.camera_rotation.y = vr_cam_rot_data.rotation.y;
                break;

            case 'ambient_light.show': // Ambient Light
                this.settings.ambient_light.show = !this.settings.ambient_light.show;
                break;
            case 'ambient_light.intensity':
                this.settings.ambient_light.intensity = Number(value);
                break;
            case 'hemisphere_light.show': // Hemisphere Light
                this.settings.hemisphere_light.show = !this.settings.hemisphere_light.show;
                break;
            case 'hemisphere_light.intensity':
                this.settings.hemisphere_light.intensity = Number(value);
                break;
            case 'directional_light.show': // Directional Light
                this.settings.directional_light.show = !this.settings.directional_light.show;
                if (this.settings.directional_light.show) {
                    this.settings.ambient_light.intensity = 0.15;
                    this.settings.hemisphere_light.intensity = 0.15;
                } else {
                    this.settings.ambient_light.intensity = 0.5;
                    this.settings.hemisphere_light.intensity = 0.5;
                }
                break;
            case 'directional_light.intensity':
                this.settings.directional_light.intensity = Number(value);
                break;
            case 'directional_light.shadowSize':
                this.settings.directional_light.shadowSize = Number(value);
                break;
            case 'directional_light.azimuth':
                this.settings.directional_light.azimuth = Number(value);
                break;
            case 'directional_light.altitude':
                this.settings.directional_light.altitude = Number(value);
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

    public resetDefault(setting: string) {
        // const scene = this.dataService.getThreejsScene();
        switch (setting) {
            case 'camera.pos':
                this.temp_camera_pos.x = 0;
                this.temp_camera_pos.z = 0;
                break;
            case 'camera.rot':
                this.temp_camera_rot.x = 0;
                this.temp_camera_rot.y = 0;
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
                rotation: this.temp_camera_rot,
                acceleration: this.settings.camera.acceleration
            };
            this.settings.vr.background_url = this.vr.background_url;
            this.settings.vr.foreground_url = this.vr.foreground_url;
            this.updateVRSettings();
            this.dataService.getAframeData().updateSettings(this.settings);
            // document.getElementById('executeButton').click();
        } else {
            this.settings = this.backup_settings;
            this.resetVRSettings();
        }
        this.dataService.getAframeData().refreshModel(this.threeJSDataService.getThreejsScene());
    }

    public onCloseModal() {
        // tslint:disable-next-line: forin
        for (const setting in this.dataService.getAframeData().settings) {
            this.settings[setting] = this.dataService.getAframeData().settings[setting];
        }
    }

    openViewerHelp() {
        this.mainDataService.helpView = AllFunctionDoc['vrviewer']['vr-viewer'];
        this.mainDataService.toggleHelp(true);
    }

    public resetVRSettings() {
        const data = this.dataService.getAframeData();
        this.vr.enabled = data.vr.enabled;
        this.vr.background_url = data.vr.background_url;
        this.vr.background_rotation = data.vr.background_rotation;
        this.vr.foreground_url = data.vr.foreground_url;
        this.vr.foreground_rotation = data.vr.foreground_rotation;
        this.vr.camera_position.copy(data.vr.camera_position);
        this.vr.camera_rotation.copy(data.vr.camera_rotation);
    }

    public updateVRSettings() {
        const data = this.dataService.getAframeData();
        data.updateVRSettings(this.vr);
    }

    public addVRProcedure() {
        let attribVal = `{"background_url": "${this.vr.background_url}",`
        + `"background_rotation": ${this.vr.background_rotation},`;
        if (this.vr.foreground_url) {
            attribVal +=  `"foreground_url": "${this.vr.foreground_url}",`
            + `"foreground_rotation": ${this.vr.foreground_rotation},`;
        }
        attribVal += `"camera_rotation": ${this.vr.camera_rotation.y}}`;

        const startNode = this.mainDataService.flowchart.nodes[0];
        NodeUtils.deselect_procedure(startNode);
        NodeUtils.add_procedure(startNode, ProcedureTypes.MainFunction, {
            argCount: 2,
            args: [{name: '__model__', value: undefined}, {name: 'coords', value: undefined}],
            length: 2,
            hasReturn: true,
            module: 'make',
            name: 'Position'
        });
        NodeUtils.add_procedure(startNode, ProcedureTypes.MainFunction, {
            argCount: 2,
            args: [{name: '__model__', value: undefined}, {name: 'entities', value: undefined}],
            hasReturn: true,
            module: 'make',
            name: 'Point'
        });
        NodeUtils.add_procedure(startNode, ProcedureTypes.Variable, null);

        for (let i = startNode.procedure.length - 1; i >= 0; i--) {
            const prod = startNode.procedure[i];
            if (prod.type === ProcedureTypes.Variable) {
                prod.args[0].value = 'vr_view_data@vr';
                prod.args[1].value = attribVal;
            } else if (prod.type === ProcedureTypes.MainFunction) {
                if (prod.meta.name === 'Point') {
                    prod.args[0].value = 'vr_view_data';
                    prod.args[2].value = 'vr_view_data';
                } else if (prod.meta.name === 'Position') {
                    prod.args[0].value = 'vr_view_data';
                    prod.args[2].value = `[${this.vr.camera_position.x},${this.vr.camera_position.z},${this.vr.camera_position.y}]`;
                    break;
                }
            }
        }
        checkNodeValidity(startNode);
        this.mainDataService.notifyMessage('Added VR procedures to start node main code');
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

    updatePos(posData) {
        try {
            const pos = JSON.parse(posData);
            pos.z = - pos.z;
            if (this.vr.enabled) {
                this.vr.camera_position.copy(pos);
            } else {
                this.settings.camera.position.x = pos.x;
                this.settings.camera.position.y = pos.y;
                this.settings.camera.position.z = pos.z;

                const camPosCoord = new AFRAME.THREE.Vector3();
                pos.y = 0;
                const aframeData = this.dataService.getAframeData();
                let checkVRcam = false;
                // console.log(pos)
                for (let i = 1; i < (this.camPosList.length - 1); i++) {
                    const camPos = this.camPosList[i];
                    if (checkVRcam || !camPos.pos) { continue; }
                    camPosCoord.x = camPos.pos[0];
                    camPosCoord.z = camPos.pos[1];
                    const distance = camPosCoord.distanceTo(pos);
                    // console.log('_____', distance)
                    if (distance < 2) {
                        aframeData.updateCameraPos(camPos, false);
                        this.selectedCamPos = i;
                        checkVRcam = true;
                    }
                }
                if (!checkVRcam) {
                    this.selectedCamPos = 0;
                    aframeData.updateCameraPos(null);
                }
            }
        } catch (ex) {}
    }

    updateLook(lookData) {
        try {
            const rot = JSON.parse(lookData);
            rot.y = 0 - rot.y;
            while (rot.y < -180) { rot.y += 360; }
            while (rot.y > 180) { rot.y -= 360; }
            if (this.vr.enabled) {
                this.vr.camera_rotation.x = rot.x;
                this.vr.camera_rotation.y = rot.y;
                this.vr.camera_rotation.z = rot.z;
            } else {
                this.settings.camera.rotation.x = rot.x;
                this.settings.camera.rotation.y = rot.y;
                this.settings.camera.rotation.z = rot.z;
            }
        } catch (ex) {}
    }
}
