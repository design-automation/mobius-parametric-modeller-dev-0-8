import { GIModel } from '@assets/libs/geo-info/GIModel';
import * as THREE from 'three';
import { AframeSettings } from '../aframe-viewer.settings';

const DEFAUT_CAMERA_POS = {
    position: new AFRAME.THREE.Vector3(0, 0, 0),
    rotation: new AFRAME.THREE.Vector3(0, 0, 0)
}
function postloadSkyImg() {
    const sky = document.getElementById('aframe_sky');
    (<any> sky).setAttribute('src', '#aframe_sky_img');
}
/**
 * Aframe data
 */
export class DataAframe {
    public model: GIModel;
    public container: HTMLDivElement;
    public scene;
    public camera;
    public settings;

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

        this.updateCamera(this.settings.camera);
        this.updateGround();
        this.updateSky();
        // console.log(this.settings.camera)
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
        ground.setAttribute('width', this.settings.ground.width);
        ground.setAttribute('height', this.settings.ground.length);
        ground.setAttribute('color', this.settings.ground.color);
        ground.setAttribute('metalness', this.settings.ground.shininess);
        this.scene.append(ground);
    }

    updateSky() {
        const sky = document.getElementById('aframe_sky');
        let skyURL;
        const backgroundSet = (Number(this.settings.background.background_set) - 1);
        if (backgroundSet < 0) {
            fetch(this.settings.background.background_url).then(res => {
                if (!res.ok) {
                    const notifyButton = <HTMLButtonElement> document.getElementById('hidden_notify_button');
                    if (!notifyButton) { return; }
                    notifyButton.value = `Unable to retrieve background image from URL<br>${this.settings.background.background_url}`;
                    notifyButton.click();
                } else if (this.settings.background.background_url.trim() === '') {
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
                imgEnt.setAttribute('src', this.settings.background.background_url);
                assetEnt.appendChild(imgEnt);
                imgEnt.addEventListener('load', postloadSkyImg);
            });
            skyURL = '';
        } else {
            skyURL = '/assets/img/background/bg' + backgroundSet + '/aframe.jpg';
        }

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
            // camera_pos.position.y = this.settings.camera.position.y;
            return camera_pos;
        }
        return null;
    }

    updateCamera(camera_pos = DEFAUT_CAMERA_POS) {
        setTimeout(() => {
            const cameraEl = <any> document.getElementById('aframe_camera');
            if (cameraEl && camera_pos) {
                cameraEl.setAttribute('position', camera_pos.position);
                cameraEl.setAttribute('look-controls', {enabled: false});
                cameraEl.setAttribute('rotation', camera_pos.rotation);
                const newX = cameraEl.object3D.rotation.x;
                const newY = cameraEl.object3D.rotation.y;
                cameraEl.components['look-controls'].pitchObject.rotation.x = newX;
                cameraEl.components['look-controls'].yawObject.rotation.y = newY;
                cameraEl.setAttribute('look-controls', {enabled: true});
            }
        }, 0);
    }

    detachAframeView() {
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
}

