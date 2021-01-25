import { GIModel } from '@assets/libs/geo-info/GIModel';
import * as THREE from 'three';

const DEFAUT_CAMERA_POS = {
    position: new AFRAME.THREE.Vector3(0, 0, 0),
    rotation: new AFRAME.THREE.Vector3(0, 0, 0)
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
        const sky = document.getElementById('aframe_sky');
        if (sky) {
            console.log('....', this.settings.background.background_set);
            (<any> sky).setAttribute('src', '/assets/img/background/bg' + this.settings.background.background_set + '/aframe.jpg')
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
            console.log('     pos:', camera_pos)
            return camera_pos;
        }
        return null;
    }

    updateCameraPos(camera_pos = DEFAUT_CAMERA_POS) {
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
        // const viewcontainer = <HTMLDivElement> document.getElementById('aframe-view');
        // viewcontainer.removeChild(this.container);
        if (!this.scene || !this.scene.renderer) { return; }
        this.scene.renderer.forceContextLoss();
        this.scene.renderer.dispose();
        this.scene.renderer = undefined;
        AFRAME.THREE.Cache.clear();
    }
}

