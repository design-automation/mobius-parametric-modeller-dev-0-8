import { GIModel } from '@assets/libs/geo-info/GIModel';
import * as THREE from 'three';
import { AframeSettings } from '../aframe-viewer.settings';
import * as Modules from '@assets/core/modules';
import { _EEntType, _EFilterOperator } from '@assets/core/modules/basic/query';
import { EEntType } from '@assets/libs/geo-info/common';

declare var AFRAME;
const DEFAUT_CAMERA_POS = {
    position: new AFRAME.THREE.Vector3(0, 0, 0),
    rotation: new AFRAME.THREE.Vector3(0, 0, 0)
};
function postloadSkyBGImg() {
    const sky = <any> document.getElementById('aframe_sky_background');
    sky.setAttribute('src', '');
    sky.setAttribute('src', '#aframe_sky_background_img');
}
function postloadSkyFGImg() {
    const sky = <any> document.getElementById('aframe_sky_foreground');
    sky.setAttribute('src', '');
    sky.setAttribute('src', '#aframe_sky_foreground_img');
}
function resizeScene() {
    const scene = document.getElementById('aframe_scene');
    if (!scene) { return; }
}
/**
 * Aframe data
 */
export class DataAframe {
    public model: GIModel;
    public container: HTMLDivElement;
    public scene;
    public camera;
    public settings: AframeSettings;

    public navMeshEnabled = false;

    public camPosList = [null];
    public staticCamOn = false;
    public vr = {
        enabled: false,
        background_url: '',
        background_rotation: 0,
        foreground_url: '',
        foreground_rotation: 0,
        camera_position: new AFRAME.THREE.Vector3(0, 5, 0),
        camera_rotation: new AFRAME.THREE.Vector3(0, 0, 0),
    };

    private _currentPos = null;


    // test file: https://raw.githubusercontent.com/design-automation/mobius-vr/master/assets/Street%20View%20360_1.jpg

    constructor(settings) {
        this.settings = JSON.parse(JSON.stringify(settings));
        if (this.settings.vr) {
            this.vr.background_url = this.settings.vr.background_url;
            this.vr.background_rotation = this.settings.vr.background_rotation;
            this.vr.foreground_url = this.settings.vr.foreground_url;
            this.vr.foreground_rotation = this.settings.vr.foreground_rotation;
        }
    }

    onChanges(changes, threejsScene) {
        if (changes.data) {
            if (!threejsScene) { return; }
            if (!this.model) {
                this.removeMobiusObjs();
                return;
            }
            if (!threejsScene.model || threejsScene.model !== this.model) {
                threejsScene.model = this.model;
                threejsScene.populateScene(this.model, null);
            }
            this.refreshModel(threejsScene);
        }
    }

    public updateSettings(settings: AframeSettings = null) {
        let newSetting: AframeSettings;
        if (settings) {
            newSetting = <AframeSettings> JSON.parse(JSON.stringify(settings));
        } else {
            newSetting = <AframeSettings> JSON.parse(localStorage.getItem('aframe_settings'));
        }
        if (!newSetting) { return; }
        if (newSetting.hasOwnProperty('background')) {
            this.settings.background = newSetting.background;
        }
        if (newSetting.background) {
            this.settings.background.background_set = newSetting.background.background_set;
            this.settings.background.background_url = newSetting.background.background_url;
            this.settings.background.background_position.x = newSetting.background.background_position.x;
            this.settings.background.background_position.z = newSetting.background.background_position.z;
            this.settings.background.background_rotation = newSetting.background.background_rotation;
        }
        if (newSetting.vr) {
            this.settings.vr.background_url = newSetting.vr.background_url;
            this.settings.vr.background_rotation = newSetting.vr.background_rotation;
            this.settings.vr.foreground_url = newSetting.vr.foreground_url;
            this.settings.vr.foreground_rotation = newSetting.vr.foreground_rotation;
        }
        if (newSetting.ground) {
            this.settings.ground.show = newSetting.ground.show;
            this.settings.ground.width = newSetting.ground.width;
            this.settings.ground.length = newSetting.ground.length;
            this.settings.ground.height = newSetting.ground.height;
            this.settings.ground.color = newSetting.ground.color;
            this.settings.ground.shininess = newSetting.ground.shininess;
        }
        if (newSetting.camera) {
            if (newSetting.camera.position) {
                this.settings.camera.position.x = newSetting.camera.position.x;
                this.settings.camera.position.y = newSetting.camera.position.y;
                this.settings.camera.position.z = newSetting.camera.position.z;
                this.settings.camera.rotation.x = newSetting.camera.rotation.x;
                this.settings.camera.rotation.y = newSetting.camera.rotation.y;
                this.settings.camera.rotation.z = newSetting.camera.rotation.z;
            }
            this.settings.camera.acceleration = newSetting.camera.acceleration;
        }
        if (newSetting.ambient_light) {
            this.settings.ambient_light.show = newSetting.ambient_light.show;
            this.settings.ambient_light.color = newSetting.ambient_light.color;
            this.settings.ambient_light.intensity = newSetting.ambient_light.intensity;
        }
        if (newSetting.hemisphere_light) {
            this.settings.hemisphere_light.show = newSetting.hemisphere_light.show;
            this.settings.hemisphere_light.skyColor = newSetting.hemisphere_light.skyColor;
            this.settings.hemisphere_light.groundColor = newSetting.hemisphere_light.groundColor;
            this.settings.hemisphere_light.intensity = newSetting.hemisphere_light.intensity;
        }
        if (newSetting.directional_light) {
            this.settings.directional_light.show = newSetting.directional_light.show;
            this.settings.directional_light.color = newSetting.directional_light.color;
            this.settings.directional_light.intensity = newSetting.directional_light.intensity;
            this.settings.directional_light.azimuth = newSetting.directional_light.azimuth;
            this.settings.directional_light.altitude = newSetting.directional_light.altitude;
            this.settings.directional_light.shadowSize = newSetting.directional_light.shadowSize;
        }
        localStorage.setItem('aframe_settings', JSON.stringify(this.settings));
    }

    removeMobiusObjs() {
        const entity = document.getElementById('mobius_geom');
        if (!entity || !entity.getAttribute('mobius_geometry')) { return; }
        (<any> entity).removeObject3D('mobius_geometry');
    }

    getMaterial(material) {
        let materials = [];
        if (!Array.isArray(material)) {
            let newMat;
            if (material.type === 'MeshPhongMaterial') {
                newMat = new AFRAME.THREE.MeshPhongMaterial();
            } else if (material.type === 'MeshBasicMaterial') {
                newMat = new AFRAME.THREE.MeshBasicMaterial();
            } else if (material.type === 'MeshStandardMaterial') {
                newMat = new AFRAME.THREE.MeshStandardMaterial();
            } else if (material.type === 'MeshLambertMaterial') {
                newMat = new AFRAME.THREE.MeshLambertMaterial();
            } else if (material.type === 'MeshPhysicalMaterial') {
                newMat = new AFRAME.THREE.MeshPhysicalMaterial();
            } else if (material.type === 'LineDashedMaterial') {
                newMat = new AFRAME.THREE.LineDashedMaterial();
            } else if (material.type === 'PointsMaterial') {
                newMat = new AFRAME.THREE.PointsMaterial();
            }
            newMat.copy(material);
            materials.push(newMat);
        } else {
            for (const mat of material) {
                materials = materials.concat(this.getMaterial(mat));
            }
        }
        return materials;
    }

    refreshModel(threejsScene) {
        this.removeMobiusObjs();
        const threeJSGroup = new AFRAME.THREE.Group();
        this.navMeshEnabled = false;
        try {
            const allPgons = <string[]> Modules.query.Get(this.model, _EEntType.PGON, null) ;
            const navMeshPgons = Modules.query.Filter(this.model, allPgons, 'vr_nav_mesh', _EFilterOperator.IS_EQUAL, true);
            if (navMeshPgons.length > 0) {
                this.navMeshEnabled = true;
            }
        } catch (ex) {}
        for (const i of threejsScene.scene.children) {
            if (i.name.startsWith('obj')) {
                const materials = this.getMaterial(i.material);
                if (i.name === 'obj_tri') {
                    threeJSGroup.add(new AFRAME.THREE.Mesh(i.geometry, materials));
                } else if (i.name === 'obj_line') {
                    threeJSGroup.add(new AFRAME.THREE.LineSegments(i.geometry, materials));
                } else if (i.name === 'obj_point') {
                    threeJSGroup.add(new AFRAME.THREE.Points(i.geometry, materials));
                } else if (i.name === 'obj_tri_navmesh') {
                    const navMesh = document.getElementById('mobius_nav_mesh');
                    if (navMesh) {
                        (<any> navMesh).setObject3D('mesh', new AFRAME.THREE.Mesh(i.geometry, materials));
                    }
                }
            }
        }
        threeJSGroup.name = 'mobius_geom';
        const entity = document.getElementById('mobius_geom');
        if (entity) {
            (<any> entity).setObject3D('mobius_geometry', threeJSGroup);
        }
        this.updateCamPos();

        if (!this.staticCamOn) {
            this.updateCamera(this.settings.camera);
            this.updateSky();
            this.updateLight(threeJSGroup);
        }

        this.updateGround();
        this.updateHUD();
        resizeScene();
    }

    updateLight(threeJSGroup) {
        const ambLightElement = <any> document.getElementById('aframe_ambientLight');
        const hemLightElement = <any> document.getElementById('aframe_hemisphereLight');
        const dirLightElement = <any> document.getElementById('aframe_directionalLight');
        const ambLight = ambLightElement.object3D.children[0];
        const hemLight = hemLightElement.object3D.children[0];
        const dirLight = dirLightElement.object3D.children[0];
        if (!ambLight || !hemLight || !dirLight) {
            setTimeout(() => {this.updateLight(threeJSGroup); }, 50);
            return;
        }
        if (this.settings.ambient_light.show) {
            ambLight.visible = true;
            ambLight.color = new AFRAME.THREE.Color(parseInt(this.settings.ambient_light.color.replace('#', '0x'), 16));
            ambLight.intensity = this.settings.ambient_light.intensity;
        } else {
            ambLight.visible = false;
        }

        if (this.settings.hemisphere_light.show) {
            hemLight.visible = true;
            hemLight.intensity = this.settings.hemisphere_light.intensity;
            hemLight.color = new AFRAME.THREE.Color(parseInt(this.settings.hemisphere_light.skyColor.replace('#', '0x'), 16));
            hemLight.groundColor = new AFRAME.THREE.Color(parseInt(this.settings.hemisphere_light.groundColor.replace('#', '0x'), 16));
        } else {
            hemLight.visible = false;
        }

        if (this.settings.directional_light.show) {
            const boundingSphere = this._getAllObjsSphere(threeJSGroup);
            dirLight.visible = true;
            dirLight.intensity = this.settings.directional_light.intensity;
            dirLight.color = new AFRAME.THREE.Color(parseInt(this.settings.directional_light.color.replace('#', '0x'), 16));
            dirLight.shadow.camera.top = boundingSphere.radius;
            dirLight.shadow.camera.left = -boundingSphere.radius;
            dirLight.shadow.camera.right = boundingSphere.radius;
            dirLight.shadow.camera.bottom = -boundingSphere.radius;
            dirLight.shadow.camera.far = boundingSphere.radius * 20;
            dirLight.shadow.bias = -0.0001;
            dirLight.shadow.mapSize.width = this.settings.directional_light.shadowSize;  // default
            dirLight.shadow.mapSize.height = this.settings.directional_light.shadowSize; // default
            const dirLightPos = this.getDLPosition(boundingSphere.radius, this.settings.directional_light.azimuth, this.settings.directional_light.altitude, boundingSphere.center);
            dirLight.position.set(...dirLightPos);
        } else {
            dirLight.visible = false;
        }

    }

    /**
     *
     * @param scale
     * @param azimuth
     * @param altitude
     */
    public getDLPosition(scale, azimuth, altitude, objSphereCenter): number[] {
        if (scale === 0) { scale = 100; }
        const azimuth_calc = -90 + azimuth;
        let posX = Math.cos(altitude * Math.PI * 2 / 360) * Math.cos(azimuth_calc * Math.PI * 2 / 360) * scale * 2,
            posY = Math.cos(altitude * Math.PI * 2 / 360) * Math.sin(azimuth_calc * Math.PI * 2 / 360) * scale * 2,
            posZ = Math.sin(altitude * Math.PI * 2 / 360) * scale * 2;

        if (objSphereCenter) {
            posX += objSphereCenter.x;
            posY += objSphereCenter.y;
            posZ += objSphereCenter.z;
        }
        return [posX, posZ, posY];
    }

    /**
     * Get the bounding sphere of all objects
     */
    private _getAllObjsSphere(threeJSGroup) {
        const boxHelper = new THREE.BoxHelper(threeJSGroup);
        boxHelper.geometry.computeBoundingSphere();
        const boundingSphere = boxHelper.geometry.boundingSphere;
        return boundingSphere;
    }

    updateGround() {
        for (const childNode of this.scene.children) {
            if (childNode.id === 'aframe_ground') {
                this.scene.removeChild(childNode);
            }
        }
        if (!this.settings.ground.show) {
            return;
        }
        const ground = document.createElement('a-plane');
        ground.id = 'aframe_ground';
        ground.setAttribute('position', '0 ' + this.settings.ground.height + ' 0');
        ground.setAttribute('rotation', '-90 0 0');
        ground.setAttribute('width', this.settings.ground.width.toString());
        ground.setAttribute('height', this.settings.ground.length.toString());
        ground.setAttribute('color', this.settings.ground.color);
        ground.setAttribute('metalness', this.settings.ground.shininess.toString());
        ground.setAttribute('shadow', 'receive: true');
        this.scene.append(ground);
    }

    updateSky() {
        const skyBG = document.getElementById('aframe_sky_background');
        const skyFG = document.getElementById('aframe_sky_foreground');
        let skyURL: string;
        const backgroundSet = (Number(this.settings.background.background_set) - 1);
        let baseLink = window.location.origin;
        if (baseLink.indexOf('design-automation.github.io') !== -1) {
            baseLink += '/mobius-parametric-modeller-dev-0-8';
        }
        skyURL = baseLink + '/assets/img/background/bg' + backgroundSet + '/aframe.jpg';
        if (this.vr.enabled) {
            fetch(this.vr.background_url).then(res => {
                if (!res.ok) {
                    const notifyButton = <HTMLButtonElement> document.getElementById('hidden_notify_button');
                    if (!notifyButton) { return; }
                    notifyButton.value = `Unable to retrieve background image from URL<br>${this.vr.background_url}`;
                    notifyButton.click();
                    return;
                } else if (this.vr.background_url.trim() === '') {
                    return;
                }
                const assetEnt = document.getElementById('aframe_assets');
                const allImages = document.querySelectorAll('img');
                allImages.forEach(img => {
                    if (img.id !== 'aframe_sky_background_img') { return; }
                    img.id = 'aframe_sky_background_img_tbr';
                    try {
                        assetEnt.removeChild(img);
                    } catch (ex) {}
                    img.removeEventListener('load', postloadSkyBGImg);
                });
                const imgEnt = document.createElement('img');
                imgEnt.id = 'aframe_sky_background_img';
                    imgEnt.setAttribute('crossorigin', 'anonymous');
                imgEnt.setAttribute('src', this.vr.background_url);
                assetEnt.appendChild(imgEnt);
                imgEnt.addEventListener('load', postloadSkyBGImg);

                skyBG.setAttribute('rotation', `0 ${90 + this.vr.background_rotation} 0`);
            });
            if (this.vr.foreground_url) {
                skyFG.setAttribute('visible', 'false');
                fetch(this.vr.foreground_url).then(res => {
                    if (!res.ok) {
                        const notifyButton = <HTMLButtonElement> document.getElementById('hidden_notify_button');
                        if (!notifyButton) { return; }
                        notifyButton.value = `Unable to retrieve foreground image from URL<br>${this.vr.foreground_url}`;
                        notifyButton.click();
                        return;
                    } else if (this.vr.foreground_url.trim() === '') {
                        return;
                    }
                    const assetEnt = document.getElementById('aframe_assets');
                    const allImages = document.querySelectorAll('img');
                    allImages.forEach(img => {
                        if (img.id !== 'aframe_sky_foreground_img') { return; }
                        img.id = 'aframe_sky_foreground_img_tbr';
                        try {
                            assetEnt.removeChild(img);
                        } catch (ex) {}
                        img.removeEventListener('load', postloadSkyFGImg);
                    });
                    const imgEnt = document.createElement('img');
                    imgEnt.id = 'aframe_sky_foreground_img';
                        imgEnt.setAttribute('crossorigin', 'anonymous');
                    imgEnt.setAttribute('src', this.vr.foreground_url);
                    assetEnt.appendChild(imgEnt);
                    imgEnt.addEventListener('load', postloadSkyFGImg);

                    skyFG.setAttribute('rotation', `0 ${90 + this.vr.foreground_rotation} 0`);
                    skyFG.setAttribute('visible', 'true');
                });
            } else {
                skyFG.setAttribute('visible', 'false');
            }
        } else {
            skyFG.setAttribute('visible', 'false');
        }

        if (skyBG) {
            (<any> skyBG).setAttribute('src', skyURL);
        } else {
            const skyEnt = document.createElement('a-sky');
            skyEnt.id = 'aframe_sky_background';
            skyEnt.setAttribute('src', skyURL);
            this.scene.appendChild(skyEnt);
        }
    }

    getCameraPos() {
        const rigEl = this.camera;
        if (rigEl) {
            const camEl = <any> document.getElementById('aframe_look_camera');
            const camera_pos = {
                position: new AFRAME.THREE.Vector3(),
                rotation: camEl.getAttribute('rotation')
            };
            rigEl.object3D.getWorldPosition(camera_pos.position);
            camera_pos.position.z =  - camera_pos.position.z;
            camera_pos.position.y = this.settings.camera.position.y;
            camera_pos.rotation.y = 0 - camera_pos.rotation.y;
            while (camera_pos.rotation.y < -180) { camera_pos.rotation.y += 360; }
            while (camera_pos.rotation.y > 180) { camera_pos.rotation.y -= 360; }
            return camera_pos;
        }
        return null;
    }

    updateCamPos() {
        const pts = <string[]> Modules.query.Get(this.model, Modules.query._EEntType.POINT, null);
        const pos = Modules.attrib.Get(this.model, Modules.query.Get(this.model, Modules.query._EEntType.POSI, pts), 'xyz');
        const ptAttribs = Modules.attrib.Get(this.model, pts, 'vr');
        this.camPosList = [{
            name: 'Walk',
            value: null
        }, {
            name: 'Edit POV',
            value: null
        }];
        for (let i = 0; i < pts.length; i++) {
            if (!ptAttribs[i]) { continue; }
            const cam = JSON.parse(JSON.stringify(ptAttribs[i]));
            cam.pos = pos[i];
            if (!cam.name) { cam.name = pts[i]; }
            this.camPosList.splice(this.camPosList.length - 1, 0, cam);
        }
        const viewpointsList = document.getElementById('aframe_viewpoints');
        const newPointNum = this.camPosList.length - 2 - viewpointsList.children.length;
        if (newPointNum > 0) {
            for (let j = 0; j < newPointNum; j++) {
                const newPoint = document.createElement('a-tetrahedron');
                newPoint.id = 'aframe_viewpoint_' + j.toString();
                newPoint.setAttribute('color', '#ffffff');
                newPoint.setAttribute('rotation', '35 0 45');
                viewpointsList.appendChild(newPoint);
            }
        }
        for (let k = 0; k < viewpointsList.children.length; k++) {
            const pointPos = viewpointsList.children[k];
            if (k + 2 >= this.camPosList.length) {
                pointPos.setAttribute('visible', 'false');
                continue;
            }
            const camPos = this.camPosList[k + 1];
            pointPos.setAttribute('visible', 'true');
            pointPos.setAttribute('position', `${camPos.pos[0]} 1 ${- camPos.pos[1]}`);
            pointPos.setAttribute('radius', '2');
            // pointPos.setAttribute('radius-bottom', '10');
            // pointPos.setAttribute('height', '10');
        }
    }

    updateCamera(camera_pos = DEFAUT_CAMERA_POS) {
        const rigEl = <any> document.getElementById('aframe_camera_rig');
        const camEl = <any> document.getElementById('aframe_look_camera');
        if (this.navMeshEnabled) {
            rigEl.setAttribute('movement-controls', {enabled: true, speed: `${this.settings.camera.acceleration / 100}`, constrainToNavMesh: true});
            rigEl.setAttribute('custom-wasd-controls', {enabled: false});
        } else {
            rigEl.setAttribute('movement-controls', {enabled: false});
            rigEl.setAttribute('custom-wasd-controls', {enabled: true, acceleration: `${this.settings.camera.acceleration}%`, fly: false});
        }
        if (this.vr.enabled) {
            setTimeout(() => {
                if (rigEl) {
                    const trueCameraPos = new AFRAME.THREE.Vector3();
                    trueCameraPos.copy(this.vr.camera_position);
                    trueCameraPos.z = - trueCameraPos.z;
                    rigEl.setAttribute('position', trueCameraPos);
                    const trueCamerarot = new AFRAME.THREE.Vector3();
                    trueCamerarot.copy(this.vr.camera_rotation);
                    trueCamerarot.y = 0 - this.vr.camera_rotation.y;
                    camEl.setAttribute('custom-look-controls', {enabled: false});
                    camEl.setAttribute('rotation', trueCamerarot);
                    const newX = camEl.object3D.rotation.x;
                    const newY = camEl.object3D.rotation.y;
                    try {
                        camEl.components['custom-look-controls'].pitchObject.rotation.x = newX;
                        camEl.components['custom-look-controls'].yawObject.rotation.y = newY;
                    } catch (ex) {}
                    camEl.setAttribute('custom-look-controls', {enabled: true});
                }
            }, 0);
            return;
        } else {
            setTimeout(() => {
                if (rigEl && camera_pos) {
                    const trueCameraPos = new AFRAME.THREE.Vector3();
                    trueCameraPos.copy(camera_pos.position);
                    trueCameraPos.z = - trueCameraPos.z;
                    rigEl.setAttribute('position', trueCameraPos);
                    const trueCamerarot = new AFRAME.THREE.Vector3();
                    trueCamerarot.copy(camera_pos.rotation);
                    trueCamerarot.y = 0 - camera_pos.rotation.y;
                    camEl.setAttribute('custom-look-controls', {enabled: false});
                    camEl.setAttribute('rotation', trueCamerarot);
                    const newX = camEl.object3D.rotation.x;
                    const newY = camEl.object3D.rotation.y;
                    try {
                        camEl.components['custom-look-controls'].pitchObject.rotation.x = newX;
                        camEl.components['custom-look-controls'].yawObject.rotation.y = newY;
                    } catch (ex) {}
                    camEl.setAttribute('custom-look-controls', {enabled: true});
                }
            }, 0);
        }
    }

    updateCameraPos(posDetails, changeCam = true) {
        if (posDetails && posDetails.name === this._currentPos) {
            return;
        }
        const skyBG = document.getElementById('aframe_sky_background');
        const skyFG = document.getElementById('aframe_sky_foreground');
        const viewpointsList = <any> document.getElementById('aframe_viewpoints');
        // skyBG.setAttribute('rotation', '0 0 0');
        // skyFG.setAttribute('rotation', '0 0 0');
        this.staticCamOn = false;
        if (!posDetails || !posDetails.pos || posDetails.pos.length < 2) {
            if (this._currentPos !== null) {
                this._currentPos = null;
                this.updateSky();
                skyBG.setAttribute('rotation', '0 0 0');
                skyFG.setAttribute('rotation', '0 0 0');
                if (viewpointsList) {
                    for (let i = 1; i < (this.camPosList.length - 1); i++) {
                        viewpointsList.children[i - 1].setAttribute('visible', true);
                    }
                }
            }
            return;
        }
        this._currentPos = posDetails.name;

        if (viewpointsList) {
            viewpointsList.children.forEach(vp => vp.setAttribute('visible', false));
        }
        // const disablePosInput = <HTMLInputElement> document.getElementById('aframe-disablePosUpdate');
        // if (disablePosInput) {
        //     disablePosInput.value = '1';
        //     setTimeout(() => disablePosInput.value = null, 1000);
        // }

        const rigEl = <any> document.getElementById('aframe_camera_rig');
        const camPos = new AFRAME.THREE.Vector3(0, 0, 0);
        camPos.x = posDetails.pos[0];
        camPos.z = (0 - posDetails.pos[1]);
        camPos.y = posDetails.pos[2];
        if (!camPos.y && camPos.y !== 0) {
            camPos.y = 10;
        }
        rigEl.setAttribute('position', camPos);
        if (changeCam) {
            const camEl = <any> document.getElementById('aframe_look_camera');
            if (posDetails.camera_rotation) {
                camEl.setAttribute('rotation', new AFRAME.THREE.Vector3(0, 0 - posDetails.camera_rotation, 0));
                const newX = camEl.object3D.rotation.x;
                const newY = camEl.object3D.rotation.y;
                try {
                    camEl.components['custom-look-controls'].pitchObject.rotation.x = newX;
                    camEl.components['custom-look-controls'].yawObject.rotation.y = newY;
                } catch (ex) {}
            }
        }

        if (posDetails.background_url) {
            skyBG.setAttribute('src', '');
            skyBG.setAttribute('rotation', '0 0 0');

            fetch(posDetails.background_url).then(res => {
                if (!res.ok) {
                    const notifyButton = <HTMLButtonElement> document.getElementById('hidden_notify_button');
                    if (!notifyButton) { return; }
                    notifyButton.value = `Unable to retrieve background image from URL<br>${posDetails.background_url}`;
                    notifyButton.click();
                    return;
                }
                const assetEnt = document.getElementById('aframe_assets');
                const allImages = document.querySelectorAll('img');
                allImages.forEach(img => {
                    if (img.id !== 'aframe_sky_background_img') { return; }
                    img.id = 'aframe_sky_background_img_tbr';
                    try {
                        assetEnt.removeChild(img);
                    } catch (ex) {}
                    img.removeEventListener('load', postloadSkyBGImg);
                });
                const imgEnt = document.createElement('img');
                imgEnt.id = 'aframe_sky_background_img';
                imgEnt.setAttribute('crossorigin', 'anonymous');
                imgEnt.setAttribute('src', posDetails.background_url);
                assetEnt.appendChild(imgEnt);
                imgEnt.addEventListener('load', postloadSkyBGImg);
                skyBG.setAttribute('rotation', `0 ${90 + posDetails.background_rotation} 0`);
            });
        }
        if (posDetails.foreground_url) {
            skyFG.setAttribute('src', '');
            skyFG.setAttribute('visible', 'false');
            skyFG.setAttribute('rotation', '0 0 0');
            fetch(posDetails.foreground_url).then(res => {
                if (!res.ok) {
                    const notifyButton = <HTMLButtonElement> document.getElementById('hidden_notify_button');
                    if (!notifyButton) { return; }
                    notifyButton.value = `Unable to retrieve foreground image from URL<br>${posDetails.foreground_url}`;
                    notifyButton.click();
                    return;
                }
                const assetEnt = document.getElementById('aframe_assets');
                const allImages = document.querySelectorAll('img');
                allImages.forEach(img => {
                    if (img.id !== 'aframe_sky_foreground_img') { return; }
                    img.id = 'aframe_sky_foreground_img_tbr';
                    try {
                        assetEnt.removeChild(img);
                    } catch (ex) {}
                    img.removeEventListener('load', postloadSkyFGImg);
                });
                const imgEnt = document.createElement('img');
                imgEnt.id = 'aframe_sky_foreground_img';
                imgEnt.setAttribute('crossorigin', 'anonymous');
                imgEnt.setAttribute('src', posDetails.foreground_url);
                assetEnt.appendChild(imgEnt);
                imgEnt.addEventListener('load', postloadSkyFGImg);
                skyFG.setAttribute('rotation', `0 ${90 + posDetails.foreground_rotation} 0`);
                skyFG.setAttribute('visible', 'true');
            });
        }
    }


    // updateCameraPos_old(posDetails) {
    //     const rigEl = <any> document.getElementById('aframe_camera_rig');
    //     const camEl = <any> document.getElementById('aframe_look_camera');
    //     const skyBG = document.getElementById('aframe_sky_background');
    //     const skyFG = document.getElementById('aframe_sky_foreground');
    //     skyBG.setAttribute('rotation', '0 0 0');
    //     skyFG.setAttribute('rotation', '0 0 0');

    //     if (!posDetails || !posDetails.pos || posDetails.pos.length < 2) {
    //         this.staticCamOn = false;
    //         if (this.navMeshEnabled) {
    //             rigEl.setAttribute('movement-controls', {enabled: true, speed: `${this.settings.camera.acceleration / 100}`, constrainToNavMesh: true});
    //             rigEl.setAttribute('custom-wasd-controls', {enabled: false});
    //         } else {
    //             rigEl.setAttribute('movement-controls', {enabled: false});
    //             rigEl.setAttribute('custom-wasd-controls', {enabled: true, acceleration: `${this.settings.camera.acceleration}%`, fly: false});
    //         }
    //         this.updateSky();
    //         // this.updateCamera(this.settings.camera);
    //         return;
    //     }
    //     this.staticCamOn = true;
    //     rigEl.setAttribute('custom-wasd-controls', 'enabled: false;');
    //     rigEl.setAttribute('movement-controls', 'enabled: false;');
    //     const camPos = new AFRAME.THREE.Vector3(0, 0, 0);
    //     camPos.x = posDetails.pos[0];
    //     camPos.z = (0 - posDetails.pos[1]);
    //     camPos.y = posDetails.pos[2];
    //     if (!camPos.y && camPos.y !== 0) {
    //         camPos.y = 10;
    //     }
    //     rigEl.setAttribute('position', camPos);
    //     if (posDetails.camera_rotation) {
    //         camEl.setAttribute('rotation', new AFRAME.THREE.Vector3(0, 0 - posDetails.camera_rotation, 0));
    //         const newX = camEl.object3D.rotation.x;
    //         const newY = camEl.object3D.rotation.y;
    //         try {
    //             camEl.components['custom-look-controls'].pitchObject.rotation.x = newX;
    //             camEl.components['custom-look-controls'].yawObject.rotation.y = newY;
    //         } catch (ex) {}
    //     }

    //     if (posDetails.background_url) {
    //         skyBG.setAttribute('src', '');

    //         fetch(posDetails.background_url).then(res => {
    //             if (!res.ok) {
    //                 const notifyButton = <HTMLButtonElement> document.getElementById('hidden_notify_button');
    //                 if (!notifyButton) { return; }
    //                 notifyButton.value = `Unable to retrieve background image from URL<br>${posDetails.background_url}`;
    //                 notifyButton.click();
    //                 return;
    //             }
    //             const assetEnt = document.getElementById('aframe_assets');
    //             const allImages = document.querySelectorAll('img');
    //             allImages.forEach(img => {
    //                 if (img.id !== 'aframe_sky_background_img') { return; }
    //                 img.id = 'aframe_sky_background_img_tbr';
    //                 try {
    //                     assetEnt.removeChild(img);
    //                 } catch (ex) {}
    //                 img.removeEventListener('load', postloadSkyBGImg);
    //             });
    //             const imgEnt = document.createElement('img');
    //             imgEnt.id = 'aframe_sky_background_img';
    //             imgEnt.setAttribute('crossorigin', 'anonymous');
    //             imgEnt.setAttribute('src', posDetails.background_url);
    //             assetEnt.appendChild(imgEnt);
    //             imgEnt.addEventListener('load', postloadSkyBGImg);
    //             skyBG.setAttribute('rotation', `0 ${90 + posDetails.background_rotation} 0`);
    //         });
    //     }
    //     if (posDetails.foreground_url) {
    //         skyFG.setAttribute('src', '');
    //         skyFG.setAttribute('visible', 'false');
    //         fetch(posDetails.foreground_url).then(res => {
    //             if (!res.ok) {
    //                 const notifyButton = <HTMLButtonElement> document.getElementById('hidden_notify_button');
    //                 if (!notifyButton) { return; }
    //                 notifyButton.value = `Unable to retrieve foreground image from URL<br>${posDetails.foreground_url}`;
    //                 notifyButton.click();
    //                 return;
    //             }
    //             const assetEnt = document.getElementById('aframe_assets');
    //             const allImages = document.querySelectorAll('img');
    //             allImages.forEach(img => {
    //                 if (img.id !== 'aframe_sky_foreground_img') { return; }
    //                 img.id = 'aframe_sky_foreground_img_tbr';
    //                 try {
    //                     assetEnt.removeChild(img);
    //                 } catch (ex) {}
    //                 img.removeEventListener('load', postloadSkyFGImg);
    //             });
    //             const imgEnt = document.createElement('img');
    //             imgEnt.id = 'aframe_sky_foreground_img';
    //             imgEnt.setAttribute('crossorigin', 'anonymous');
    //             imgEnt.setAttribute('src', posDetails.foreground_url);
    //             assetEnt.appendChild(imgEnt);
    //             imgEnt.addEventListener('load', postloadSkyFGImg);
    //             skyFG.setAttribute('rotation', `0 ${90 + posDetails.foreground_rotation} 0`);
    //             skyFG.setAttribute('visible', 'true');
    //         });
    //     }
    // }

    updateHUD() {
        const hud = document.getElementById('aframe_hud');
        if (!this.model.modeldata.attribs.query.hasEntAttrib(EEntType.MOD, 'hud')) {
            hud.innerHTML = '';
            hud.style.visibility = 'hidden';
            return;
        }
        hud.innerHTML = this.model.modeldata.attribs.get.getModelAttribVal('hud') as string;
    }

    detachAframeView() {
        const assetEnt = document.getElementById('aframe_assets');
        const allImages = document.querySelectorAll('img');
        allImages.forEach(img => {
            try {
                assetEnt.removeChild(img);
            } catch (ex) {}
            img.id = 'tbr_' + img.id;
            img.removeEventListener('load', postloadSkyBGImg);
        });

        const tbrElements = [   'aframe_ambientLight', 'aframe_hemisphereLight', 'aframe_directionalLight', 'aframe_viewpoints',
                                'aframe_assets', 'aframe_viewpoint_assets',
                                'aframe_camera_rig', 'aframe_sky_background', 'mobius_geom', 'aframe_ground',
                                'aframe_hud'];
        for (const tbrElmName of tbrElements) {
            const tbr = document.getElementById(tbrElmName);
            if (!tbr) { continue; }
            tbr.id = 'tbr_' + tbrElements;
        }
        if (!this.scene || !this.scene.renderer) { return; }
        this.scene.renderer.forceContextLoss();
        this.scene.renderer.dispose();
        this.scene.renderer = null;
        for (const childObj of this.scene.children) {
            childObj.id = childObj.id + '_';
            childObj.remove();
        }
        AFRAME.THREE.Cache.clear();
    }

    updateVRSettings(vr_settings: any) {
        this.vr.enabled = vr_settings.enabled;
        this.vr.background_url = vr_settings.background_url;
        this.vr.background_rotation = vr_settings.background_rotation;
        this.vr.foreground_url = vr_settings.foreground_url;
        this.vr.foreground_rotation = vr_settings.foreground_rotation;
        this.vr.camera_position.copy(vr_settings.camera_position);
        this.vr.camera_rotation.copy(vr_settings.camera_rotation);
    }
}

