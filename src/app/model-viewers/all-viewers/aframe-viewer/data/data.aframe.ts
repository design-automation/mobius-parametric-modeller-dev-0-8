import { GIModel } from '@assets/libs/geo-info/GIModel';
import * as THREE from 'three';
import { AframeSettings } from '../aframe-viewer.settings';
import * as Modules from '@assets/core/modules';
import { _EEntType } from '@assets/core/modules/basic/query';

declare var AFRAME;
const DEFAUT_CAMERA_POS = {
    position: new AFRAME.THREE.Vector3(0, 0, 0),
    rotation: new AFRAME.THREE.Vector3(0, 0, 0)
}
function postloadSkyImg() {
    const sky = document.getElementById('aframe_sky');
    (<any> sky).setAttribute('src', '#aframe_sky_img');
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

    public camPosList = [null];
    public staticCamOn = false;
    public vr = {
        enabled: false,
        background_url: '',
        background_rotation: 0,
        camera_position: new AFRAME.THREE.Vector3(0, 5, 0),
        camera_rotation: new AFRAME.THREE.Vector3(0, 0, 0),
    };

    // test file: https://raw.githubusercontent.com/design-automation/mobius-vr/master/assets/Street%20View%20360_1.jpg

    constructor(settings) {
        this.settings = JSON.parse(JSON.stringify(settings));
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
        if (settings !== null) {
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

        for (const i of threejsScene.scene.children) {
            if (i.name.startsWith('obj')) {
                const materials = this.getMaterial(i.material);
                if (i.name === 'obj_tri') {
                    threeJSGroup.add(new AFRAME.THREE.Mesh(i.geometry, materials));
                } else if (i.name === 'obj_line') {
                    threeJSGroup.add(new AFRAME.THREE.LineSegments(i.geometry, materials));
                } else if (i.name === 'obj_point') {
                    threeJSGroup.add(new AFRAME.THREE.Points(i.geometry, materials));
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
        const sky = document.getElementById('aframe_sky');
        let skyURL;
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
                } else if (this.vr.background_url.trim() === '') {
                    return;
                }
                const assetEnt = document.getElementById('aframe_assets');
                const allImages = document.querySelectorAll('img');
                allImages.forEach(img => {
                    try {
                        assetEnt.removeChild(img);
                    } catch (ex) {}
                    img.removeEventListener('load', postloadSkyImg);
                });
                const imgEnt = document.createElement('img');
                imgEnt.id = 'aframe_sky_img';
                    imgEnt.setAttribute('crossorigin', 'anonymous');
                imgEnt.setAttribute('src', this.vr.background_url);
                assetEnt.appendChild(imgEnt);
                imgEnt.addEventListener('load', postloadSkyImg);

                const skyPos = new AFRAME.THREE.Vector3(0, 0, 0);
                skyPos.copy(this.vr.camera_position);
                skyPos.z = - skyPos.z;
                sky.setAttribute('position', skyPos);
                sky.setAttribute('rotation', `0 ${90 + this.vr.background_rotation} 0`);
            });
        }
        // if (backgroundSet < 0) {
        //     fetch(this.settings.background.background_url).then(res => {
        //         if (!res.ok) {
        //             const notifyButton = <HTMLButtonElement> document.getElementById('hidden_notify_button');
        //             if (!notifyButton) { return; }
        //             notifyButton.value = `Unable to retrieve background image from URL<br>${this.settings.background.background_url}`;
        //             notifyButton.click();
        //         } else if (this.settings.background.background_url.trim() === '') {
        //             return;
        //         }
        //         const assetEnt = document.getElementById('aframe_assets');
        //         const allImages = document.querySelectorAll('img');
        //         allImages.forEach(img => {
        //             try {
        //                 assetEnt.removeChild(img);
        //             } catch (ex) {}
        //             img.removeEventListener('load', postloadSkyImg);
        //         });
        //         const imgEnt = document.createElement('img');
        //         imgEnt.id = 'aframe_sky_img';
        //             imgEnt.setAttribute('crossorigin', 'anonymous');
        //         imgEnt.setAttribute('src', this.settings.background.background_url);
        //         assetEnt.appendChild(imgEnt);
        //         imgEnt.addEventListener('load', postloadSkyImg);

        //         const skyPos = new AFRAME.THREE.Vector3(0, 0, 0);
        //         skyPos.copy(this.settings.camera.position);
        //         skyPos.z = - skyPos.z;
        //         sky.setAttribute('position', skyPos);
        //         sky.setAttribute('rotation', `0 ${90 + this.settings.background.background_rotation} 0`);
        //         // sky.setAttribute('rotation', `0 ${this.settings.background.background_rotation} 0`);
        //         // sky.setAttribute('rotation', `0 ${90 - this.settings.background.background_rotation} 0`);
        //         // sky.setAttribute('rotation', `0 0 0`);
        //     });
        //     skyURL = '';
        // } else {
        //     skyURL = '/assets/img/background/bg' + backgroundSet + '/aframe.jpg';
        // }

        if (sky) {
            (<any> sky).setAttribute('src', skyURL);
        } else {
            const skyEnt = document.createElement('a-sky');
            skyEnt.id = 'aframe_sky';
            skyEnt.setAttribute('src', skyURL);
            this.scene.appendChild(skyEnt);
        }
    }

    getCameraPos() {
        const cameraEl = this.camera;
        if (cameraEl) {
            const camera_pos = {
                position: new AFRAME.THREE.Vector3(),
                rotation: cameraEl.getAttribute('rotation')
            };
            cameraEl.object3D.getWorldPosition(camera_pos.position);
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
            name: 'default',
            value: null
        }];
        for (let i = 0; i < pts.length; i++) {
            if (!ptAttribs[i]) { continue; }
            const cam = JSON.parse(JSON.stringify(ptAttribs[i]));
            cam.pos = pos[i];
            if (!cam.name) { cam.name = pts[i]; }
            this.camPosList.push(cam);
        }
    }

    updateCamera(camera_pos = DEFAUT_CAMERA_POS) {
        if (this.vr.enabled) {
            setTimeout(() => {
                const cameraEl = <any> document.getElementById('aframe_camera');
                if (cameraEl) {
                    const trueCameraPos = new AFRAME.THREE.Vector3();
                    trueCameraPos.copy(this.vr.camera_position);
                    trueCameraPos.z = - trueCameraPos.z;
                    cameraEl.setAttribute('position', trueCameraPos);
                    const trueCamerarot = new AFRAME.THREE.Vector3();
                    trueCamerarot.copy(this.vr.camera_rotation);
                    trueCamerarot.y = 0 - this.vr.camera_rotation.y;
                    cameraEl.setAttribute('look-controls', {enabled: false});
                    cameraEl.setAttribute('rotation', trueCamerarot);
                    const newX = cameraEl.object3D.rotation.x;
                    const newY = cameraEl.object3D.rotation.y;
                    cameraEl.components['look-controls'].pitchObject.rotation.x = newX;
                    cameraEl.components['look-controls'].yawObject.rotation.y = newY;
                    cameraEl.setAttribute('look-controls', {enabled: true});
                }
            }, 0);
            return;
        }
        setTimeout(() => {
            const cameraEl = <any> document.getElementById('aframe_camera');
            if (cameraEl && camera_pos) {
                const trueCameraPos = new AFRAME.THREE.Vector3();
                trueCameraPos.copy(camera_pos.position);
                trueCameraPos.z = - trueCameraPos.z;
                cameraEl.setAttribute('position', trueCameraPos);

                const trueCamerarot = new AFRAME.THREE.Vector3();
                trueCamerarot.copy(camera_pos.rotation);
                trueCamerarot.y = 0 - camera_pos.rotation.y;
                cameraEl.setAttribute('look-controls', {enabled: false});
                cameraEl.setAttribute('rotation', trueCamerarot);
                const newX = cameraEl.object3D.rotation.x;
                const newY = cameraEl.object3D.rotation.y;
                cameraEl.components['look-controls'].pitchObject.rotation.x = newX;
                cameraEl.components['look-controls'].yawObject.rotation.y = newY;
                cameraEl.setAttribute('look-controls', {enabled: true});
            }
        }, 0);
    }

    updateCameraPos(posDetails) {
        const cameraEl = <any> document.getElementById('aframe_camera');
        const sky = document.getElementById('aframe_sky');
        const mobiusGeom = document.getElementById('mobius_geom');
        sky.setAttribute('position', '0 0 0');
        sky.setAttribute('rotation', '0 0 0');
        mobiusGeom.setAttribute('scale', '1 1 1');
        if (!posDetails || !posDetails.pos || posDetails.pos.length < 2) {
            this.staticCamOn = false;
            cameraEl.setAttribute('wasd-controls', 'enabled: true; acceleration: 500%; fly: false');
            this.updateSky();
            // this.updateCamera(this.settings.camera);
            return;
        }
        let scaleVal = 1;
        if (posDetails.scaling) {
            scaleVal = Number(posDetails.scaling);
            if (scaleVal) {
                const scaleString = `${scaleVal} ${scaleVal} ${scaleVal}`;
                mobiusGeom.setAttribute('scale', scaleString);
                // sky.setAttribute('scale', '-' + scaleString);
            }
        }
        this.staticCamOn = true;
        cameraEl.setAttribute('wasd-controls', 'enabled: false;');
        const camPos = new AFRAME.THREE.Vector3(0, 0, 0);
        camPos.x = posDetails.pos[0] * scaleVal;
        camPos.z = (0 - posDetails.pos[1]) * scaleVal;
        camPos.y = posDetails.pos[2] * scaleVal;
        if (!camPos.y && camPos.y !== 0) {
            camPos.y = 10 * scaleVal;
        }
        cameraEl.setAttribute('position', camPos);
        if (posDetails.camera_rotation) {
            cameraEl.setAttribute('rotation', new AFRAME.THREE.Vector3(0, 0 - posDetails.camera_rotation, 0));
            const newX = cameraEl.object3D.rotation.x;
            const newY = cameraEl.object3D.rotation.y;
            cameraEl.components['look-controls'].pitchObject.rotation.x = newX;
            cameraEl.components['look-controls'].yawObject.rotation.y = newY;
        }

        if (posDetails.background_url && posDetails.background_rotation) {
            sky.setAttribute('src', '');

            fetch(posDetails.background_url).then(res => {
                if (!res.ok) {
                    const notifyButton = <HTMLButtonElement> document.getElementById('hidden_notify_button');
                    if (!notifyButton) { return; }
                    notifyButton.value = `Unable to retrieve background image from URL<br>${posDetails.background_url}`;
                    notifyButton.click();
                }
                const assetEnt = document.getElementById('aframe_assets');
                const allImages = document.querySelectorAll('img');
                allImages.forEach(img => {
                    try {
                        assetEnt.removeChild(img);
                    } catch (ex) {}
                    img.removeEventListener('load', postloadSkyImg);
                });
                const imgEnt = document.createElement('img');
                imgEnt.id = 'aframe_sky_img';
                imgEnt.setAttribute('crossorigin', 'anonymous');
                imgEnt.setAttribute('src', posDetails.background_url);
                assetEnt.appendChild(imgEnt);
                imgEnt.addEventListener('load', postloadSkyImg);
                const skypos = new AFRAME.THREE.Vector3(0, 0, 0);
                skypos.copy(camPos);
                skypos.y = 0;
                sky.setAttribute('position', skypos);
                sky.setAttribute('rotation', `0 ${90 + posDetails.background_rotation} 0`);
                // sky.setAttribute('rotation', `0 ${posDetails.background_rotation} 0`);
                // sky.setAttribute('rotation', `0 ${90 - posDetails.background_rotation} 0`);
                // sky.setAttribute('rotation', `0 0 0`);
            });

        }
    }

    detachAframeView() {
        const assetEnt = document.getElementById('aframe_assets');
        const allImages = document.querySelectorAll('img');
        allImages.forEach(img => {
            try {
                assetEnt.removeChild(img);
            } catch (ex) {}
            img.id = 'tbr_' + img.id;
            img.removeEventListener('load', postloadSkyImg);
        });

        const tbrElements = [   'aframe_ambientLight', 'aframe_hemisphereLight', 'aframe_directionalLight',
                                'aframe_assets', 'aframe_camera', 'aframe_sky', 'mobius_geom', 'aframe_ground'];
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

    updateVRSettings(vr_settings: { enabled: boolean; background_url: string; background_rotation: number; camera_position: any; camera_rotation: any; }) {
        this.vr.enabled = vr_settings.enabled;
        this.vr.background_url = vr_settings.background_url;
        this.vr.background_rotation = vr_settings.background_rotation;
        this.vr.camera_position.copy(vr_settings.camera_position);
        this.vr.camera_rotation.copy(vr_settings.camera_rotation);
    }
}

