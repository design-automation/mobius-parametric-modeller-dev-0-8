import { GIModel } from '@libs/geo-info/GIModel';
// import @angular stuff
import { Component, OnInit, Input, Injector, ElementRef, DoCheck, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { DataThreejs } from '../data/data.threejs';
// import { IModel } from 'gs-json';
import { DataService } from '../data/data.service';
import { EEntityTypeStr, EAttribNames } from '@libs/geo-info/common';
import { DropdownMenuComponent } from '../html/dropdown-menu.component';

/**
 * A threejs viewer for viewing geo-info (GI) models.
 * This component gets used in /app/model-viewers/all-viewers/gi-viewer/gi-viewer.component.html
 */
@Component({
    selector: 'threejs-viewer',
    templateUrl: './threejs-viewer.component.html',
    styleUrls: ['./threejs-viewer.component.scss']
})
export class ThreejsViewerComponent implements OnInit, DoCheck, OnChanges {
    @Input() model: GIModel;
    @ViewChild(DropdownMenuComponent) dropdown = new DropdownMenuComponent();

    public container = null;
    public _elem;
    // viewer size
    public _width: number;
    public _height: number;
    // DataService
    protected dataService: DataService;
    // threeJS scene data
    public _data_threejs: DataThreejs;
    // num of positions, edges, triangles in threejs
    public _threejs_nums: [number, number, number];
    // flags for displayinhg text in viewer, see html
    public _no_model = false;
    public _model_error = false;
    public messageVisible = false;
    public message: string;
    // the selectable type of entity by user, depends on the Attribute Tab
    public selectable: number;

    // right selection dropdown
    public needSelect = false;
    public selectingEntityType: { id: string, name: string } = { id: '', name: '' };
    public selectDropdownVisible = false;
    public selections = [
        { id: EEntityTypeStr.POSI, name: 'Positions' }, { id: EEntityTypeStr.VERT, name: 'Vetex' },
        { id: EEntityTypeStr.POINT, name: 'Points' }, { id: EEntityTypeStr.EDGE, name: 'Edges' },
        { id: EEntityTypeStr.WIRE, name: 'Wires' }, { id: EEntityTypeStr.FACE, name: 'Faces' },
        { id: EEntityTypeStr.PLINE, name: 'Polylines' }, { id: EEntityTypeStr.PGON, name: 'Polygons' },
        { id: EEntityTypeStr.COLL, name: 'Collections' }];

    public dropdownPosition = { x: 0, y: 0 };
    /**
     * Creates a new viewer,
     * @param injector
     * @param elem
     */
    constructor(injector: Injector, elem: ElementRef) {
        this._elem = elem;
        this.dataService = injector.get(DataService);
    }
    /**
     * Called when the viewer is initialised.
     */
    ngOnInit() {
        this.dropdown.items = [];
        this.dropdown.visible = false;
        this.dropdown.position = { x: 0, y: 0 };
        // console.log('CALLING ngOnInit in THREEJS VIEWER COMPONENT');
        this.container = this._elem.nativeElement.children.namedItem('threejs-container');
        // check for container
        if (!this.container) {
            console.error('No container in Three Viewer');
            return;
        }
        // size of window
        this._width = this.container.offsetWidth; // container.client_width;
        this._height = this.container.offsetHeight; // container.client_height;

        this._data_threejs = this.dataService.getThreejsScene();
        this.container.appendChild(this._data_threejs._renderer.domElement);
        // set the numbers of entities
        this._threejs_nums = this._data_threejs._threejs_nums;
        // ??? What is happening here?
        const self = this;
        this._data_threejs._controls.addEventListener('change', function () { self.render(self); });
        self._data_threejs._renderer.render(self._data_threejs._scene, self._data_threejs._camera);

        if (this._data_threejs.ObjLabelMap.size !== 0) {
            this._data_threejs.ObjLabelMap.forEach((obj, label) => {
                this._data_threejs.createLabelforObj(this.container, obj.entity, obj.type, label);
            });
        }
    }
    /**
     * @param self
     */
    public render(self) {
        // console.log('CALLING render in THREEJS VIEWER COMPONENT');
        const textLabels = this._data_threejs._textLabels;
        if (textLabels.size !== 0) {
            textLabels.forEach((label) => {
                label.updatePosition();
            });
        }
        self._data_threejs._renderer.render(self._data_threejs._scene, self._data_threejs._camera);
    }

    /**
     * Called when anything changes
     */
    ngDoCheck() {
        if (!this.container) {
            console.error('No container in Three Viewer');
            return;
        }
        const width: number = this.container.offsetWidth;
        const height: number = this.container.offsetHeight;

        // this is when dimensions change
        if (width !== this._width || height !== this._height) {
            this._width = width;
            this._height = height;
            setTimeout(() => {
                this._data_threejs._camera.aspect = this._width / this._height;
                this._data_threejs._camera.updateProjectionMatrix();
                this._data_threejs._renderer.setSize(this._width, this._height);
                this.render(this);
            }, 10);
        }
    }

    // receive data -> model from gi-viewer component and update model in the scene
    ngOnChanges(changes: SimpleChanges) {
        if (changes['model']) {
            if (this.model) {
                this.updateModel(this.model);
            }
        }
    }

    /**
     * Update the model in the viewer.
     */
    public async updateModel(model: GIModel) {
        this._data_threejs = this.dataService.getThreejsScene();
        if (!model) {
            console.warn('Model or Scene not defined.');
            this._no_model = true;
            return;
        } else {
            if (model !== this._data_threejs._model) {
                this._data_threejs._model = model;
                try {
                    // add geometry to the scene
                    this._data_threejs.addGeometry(model, this.container);
                    this._model_error = false;
                    this._no_model = false;
                    this.render(this);
                } catch (ex) {
                    console.error('Error displaying model:', ex);
                    this._model_error = true;
                    this._data_threejs._text = ex;
                }
            }
        }
    }

    private initRaycaster(event) {
        const scene = this._data_threejs;
        scene._mouse.x = (event.offsetX / scene._renderer.domElement.clientWidth) * 2 - 1;
        scene._mouse.y = - (event.offsetY / scene._renderer.domElement.clientHeight) * 2 + 1;
        scene._raycaster.setFromCamera(scene._mouse, scene._camera);
        return scene._raycaster.intersectObjects(scene.sceneObjs);
    }

    public onDocumentMouseMove(event) {
        const intersects = this.initRaycaster(event);
        if (intersects.length > 0) {
            const tags = document.getElementsByTagName('body');
            for (let index = 0; index < tags.length; index++) {
                tags[index].style.cursor = 'pointer';
            }
        } else {
            const tags = document.getElementsByTagName('body');
            for (let index = 0; index < tags.length; index++) {
                tags[index].style.cursor = 'default';
            }
        }
    }

    public onUserAction(event) {
        const scene = this._data_threejs;
        scene.onWindowKeyPress(event);
        this.render(this);
        const intersects = this.initRaycaster(event);
        if (event.target.tagName === 'CANVAS' && intersects.length > 0) {
            const pos_x = event.clientX - event.target.getBoundingClientRect().left;
            const pos_y = event.clientY - event.target.getBoundingClientRect().top;
            this.dropdownPosition = { x: pos_x, y: pos_y };
        } else if (event.target.tagName !== 'OL') {
            this.dropdown.visible = false;
            return;
        }

        if (intersects.length > 0) {
            if (this.dataService.countSelectedEnts() === 0) {
                this.selectObj(intersects);
            } else {
                if (event.shiftKey && event.which === 1) {
                    this.selectObj(intersects);
                } else if (event.which === 1) {
                    console.log('Press Shift key to do multiple selection.');
                }
            }
        } else {
            if (event.which === 27) {
                this.unselectAll();
            }
        }
    }

    private unselectAll() {
        const scene = this._data_threejs;
        const selectings = Array.from(scene._selecting.keys());
        for (const selecting of selectings) {
            scene.unselectObj(selecting, this.container);
        }
        document.querySelectorAll('[id^=textLabel_]').forEach(value => {
            this.container.removeChild(value);
        });
        this._data_threejs._textLabels.clear();
        this.render(this);
        this.dataService.selected_ents.forEach(map => {
            map.clear();
        });
    }


    private selectObj(intersects) {
        // console.log('interecting object', intersect);
        if (intersects.length > 0) {
            const intersect0 = intersects[0];
            switch (this.selectingEntityType.id) {
                case EEntityTypeStr.POSI:
                    this.selectPositions(intersect0);
                    break;
                case EEntityTypeStr.VERT:
                    this.selectVertex(intersect0);
                    break;
                case EEntityTypeStr.COLL:
                    if (intersect0.object.type === 'Mesh') {
                        this.selectColl(intersect0, 'Mesh');
                    } else if (intersect0.object.type === 'LineSegments') {
                        this.selectColl(intersect0, 'LineSegments');
                    } else if (intersect0.object.type === 'Points') {
                        this.selectColl(intersect0, 'Points');
                    }
                    break;
                case EEntityTypeStr.FACE:
                    if (intersect0.object.type === 'Mesh') {
                        this.selectFace(intersect0);
                    } else {
                        this.showMessages('Faces');
                    }
                    break;
                case EEntityTypeStr.PGON:
                    if (intersect0.object.type === 'Mesh') {
                        this.selectPGon(intersect0);
                    } else {
                        this.showMessages('Polygons');
                    }
                    break;
                case EEntityTypeStr.EDGE:
                    if (intersect0.object.type === 'LineSegments') {
                        this.selectEdge(intersect0);
                    } else {
                        this.showMessages('Edges');
                    }
                    break;
                case EEntityTypeStr.WIRE:
                    if (intersect0.object.type === 'LineSegments') {
                        this.selectWire(intersect0);
                    } else {
                        this.showMessages('Wires');
                    }
                    break;
                case EEntityTypeStr.PLINE:
                    if (intersect0.object.type === 'LineSegments') {
                        this.selectPLine(intersect0);
                    } else {
                        this.showMessages('Polylines');
                    }
                    break;
                case EEntityTypeStr.POINT:
                    if (intersect0.object.type === 'Points') {
                        this.selectPoint(intersect0);
                    } else {
                        this.showMessages('Points');
                    }
                    break;
                default:
                    this.needSelect = true;
                    console.log('needSelect');
                    break;
            }
            // if (intersect0.object.type === 'LineSegments') {
            //     const intersect1 = intersects[1];
            //     if (intersect1 && intersect0.distance === intersect1.distance) {
            //         this.chooseLine(intersect0, intersect1);
            //         this.selectWire(intersect0);
            //     } else {
            //         this.selectEdge(intersect0);
            //         this.selectWire(intersect0);
            //     }
            // }
        }
        this.render(this);
    }

    private showMessages(tab: string) {
        this.messageVisible = true;
        this.message = `Please Select ${tab}`;
        setTimeout(() => {
            this.messageVisible = false;
        }, 3000);
    }

    private chooseLine(intersect0, intersect1) {
        this.selectEdge(intersect0);
        this.selectEdge(intersect1);
    }

    private selectPositions(object: THREE.Intersection) {
        const ent_type_str = EEntityTypeStr.POSI;
        const scene = this._data_threejs;
        if (object.object.type === 'Points') {
            const vert = this.model.geom.query.navPointToVert(object.index);
            const position = this.model.attribs.query.getPosiCoords(vert);
            const posi_ents = this.model.geom.query.navVertToPosi(vert);

            const posi_ent = this.dataService.selected_ents.get(ent_type_str);
            const selecting = `${EEntityTypeStr.POINT}${object.index}`;
            if (!scene._selecting.has(selecting)) {
                scene.selectObjPoint(selecting, position, this.container);
                posi_ent.set(`${EEntityTypeStr.POSI}${posi_ents}`, posi_ents);
            } else {
                scene.unselectObj(selecting, this.container);
                posi_ent.delete(`${ent_type_str}${posi_ents}`);
            }
        } else if (object.object.type === 'LineSegments') {
            const verts = this.model.geom.query.navEdgeToVert(object.index / 2);
            const positions = verts.map(v => this.model.attribs.query.getVertCoords(v));
            const posi_flat = [].concat(...positions);
            const posi_ents = verts.map(v => this.model.geom.query.navVertToPosi(v));

            const posi_ent = this.dataService.selected_ents.get(ent_type_str);
            const selecting = `${EEntityTypeStr.EDGE}${object.index / 2}`;
            if (!scene._selecting.has(selecting)) {
                scene.selectObjLine(selecting, [], posi_flat, this.container);
                posi_ents.map(posi => posi_ent.set(`${ent_type_str}${posi}`, posi));
            } else {
                scene.unselectObj(selecting, this.container);
                posi_ents.map(posi => posi_ent.delete(`${ent_type_str}${posi}`));
            }
        } else if (object.object.type === 'Mesh') {
            const face = this.model.geom.query.navTriToFace(object.faceIndex);
            const tri = this.model.geom.query.navFaceToTri(face);
            const verts = tri.map(index => this.model.geom.query.navTriToVert(index));
            const verts_flat = [].concat(...verts);
            const posis = verts_flat.map(v => this.model.geom.query.navAnyToPosi(EEntityTypeStr.VERT, v));
            const posis_flat = [].concat(...posis);

            const posi_ents = verts_flat.map(v => this.model.geom.query.navVertToPosi(v));

            const tri_indices = [];
            const positions = [];
            posis_flat.map((posi, index) => {
                positions.push(this.model.attribs.query.getPosiCoords(posi));
                tri_indices.push(index);
            });
            const posi_flat = [].concat(...positions);

            const posi_ent = this.dataService.selected_ents.get(ent_type_str);
            const selecting = `${EEntityTypeStr.FACE}${face}`;
            if (!scene._selecting.has(selecting)) {
                scene.selectObjFace(selecting, tri_indices, posi_flat, this.container);
                posi_ents.map(posi => posi_ent.set(`${ent_type_str}${posi}`, posi));
            } else {
                scene.unselectObj(selecting, this.container);
                posi_ents.map(posi => posi_ent.delete(`${ent_type_str}${posi}`));
            }
        }
    }

    private selectVertex(object: THREE.Intersection) {
        const ent_type_str = EEntityTypeStr.VERT;
        const scene = this._data_threejs;
        if (object.object.type === 'Points') {
            const vert = this.model.geom.query.navPointToVert(object.index);
            const position = this.model.attribs.query.getPosiCoords(vert);

            const posi_ent = this.dataService.selected_ents.get(ent_type_str);
            const selecting = `${EEntityTypeStr.POINT}${object.index}`;
            if (!scene._selecting.has(selecting)) {
                scene.selectObjPoint(selecting, position, this.container);
                posi_ent.set(`${EEntityTypeStr.POSI}${vert}`, vert);
            } else {
                scene.unselectObj(selecting, this.container);
                posi_ent.delete(`${ent_type_str}${vert}`);
            }
        } else if (object.object.type === 'LineSegments') {
            const verts = this.model.geom.query.navEdgeToVert(object.index / 2);
            const positions = verts.map(v => this.model.attribs.query.getVertCoords(v));
            const posi_flat = [].concat(...positions);

            const posi_ent = this.dataService.selected_ents.get(ent_type_str);
            const selecting = `${EEntityTypeStr.EDGE}${object.index / 2}`;
            if (!scene._selecting.has(selecting)) {
                scene.selectObjLine(selecting, [], posi_flat, this.container);
                verts.map(vert => posi_ent.set(`${ent_type_str}${vert}`, vert));
            } else {
                scene.unselectObj(selecting, this.container);
                verts.map(vert => posi_ent.delete(`${ent_type_str}${vert}`));
            }
        } else if (object.object.type === 'Mesh') {
            const face = this.model.geom.query.navTriToFace(object.faceIndex);
            const tris = this.model.geom.query.navFaceToTri(face);
            const verts = tris.map(tri => this.model.geom.query.navTriToVert(tri));
            const verts_flat = [].concat(...verts);
            const posis = verts_flat.map(v => this.model.geom.query.navAnyToPosi(EEntityTypeStr.VERT, v));
            const posis_flat = [].concat(...posis);

            const tri_indices = [];
            const positions = [];
            posis_flat.map((posi, index) => {
                positions.push(this.model.attribs.query.getPosiCoords(posi));
                tri_indices.push(index);
            });
            const posi_flat = [].concat(...positions);

            const posi_ent = this.dataService.selected_ents.get(ent_type_str);
            const selecting = `${EEntityTypeStr.FACE}${face}`;
            if (!scene._selecting.has(selecting)) {
                scene.selectObjFace(selecting, tri_indices, posi_flat, this.container);
                verts_flat.map(vert => posi_ent.set(`${ent_type_str}${vert}`, vert));
            } else {
                scene.unselectObj(selecting, this.container);
                verts_flat.map(vert => posi_ent.delete(`${ent_type_str}${vert}`));
            }
        }
    }


    private selectPoint(point: THREE.Intersection) {
        const ent_type_str = EEntityTypeStr.POINT;
        const scene = this._data_threejs;
        const vert = this.model.geom.query.navPointToVert(point.index);
        const position = this.model.attribs.query.getPosiCoords(vert);
        const selecting = `${ent_type_str}${point.index}`;
        if (!scene._selecting.has(selecting)) {
            scene.selectObjPoint(selecting, position, this.container);
            this.dataService.selected_ents.get(ent_type_str).set(selecting, point.index);
        } else {
            scene.unselectObj(selecting, this.container);
            this.dataService.selected_ents.get(ent_type_str).delete(selecting);
        }
    }

    private selectEdge(line: THREE.Intersection) {
        const ent_type_str = EEntityTypeStr.EDGE;
        const scene = this._data_threejs;
        const verts = this.model.geom.query.navEdgeToVert(line.index / 2);
        const positions = verts.map(v => this.model.attribs.query.getVertCoords(v));
        const posi_flat = [].concat(...positions);

        const selecting = `${ent_type_str}${line.index / 2}`;
        if (!scene._selecting.has(selecting)) {
            scene.selectObjLine(selecting, [], posi_flat, this.container);
            this.dataService.selected_ents.get(ent_type_str).set(selecting, line.index / 2);
        } else {
            scene.unselectObj(selecting, this.container);
            this.dataService.selected_ents.get(ent_type_str).delete(selecting);
        }
    }

    private selectWire(line: THREE.Intersection) {
        const scene = this._data_threejs;
        const wire = this.model.geom.query.navEdgeToWire(line.index / 2);
        const edges = this.model.geom.query.navWireToEdge(wire);

        const verts = edges.map(e => this.model.geom.query.navEdgeToVert(e));
        const verts_flat = [].concat(...[].concat(...verts));
        const indices = [];
        const positions = [];
        verts_flat.map((v, i) => {
            positions.push(this.model.attribs.query.getVertCoords(v));
            indices.push(i);
        });
        const posi_flat = [].concat(...positions);
        const selecting = `${EEntityTypeStr.WIRE}${wire}`;
        if (!scene._selecting.has(selecting)) {
            scene.selectObjLine(selecting, indices, posi_flat, this.container);
            this.dataService.selected_ents.get(EEntityTypeStr.WIRE).set(selecting, wire);
        } else {
            scene.unselectObj(selecting, this.container);
            this.dataService.selected_ents.get(EEntityTypeStr.WIRE).delete(selecting);
        }
    }

    private selectFace(triangle: THREE.Intersection) {
        const scene = this._data_threejs;
        const face = this.model.geom.query.navTriToFace(triangle.faceIndex);
        const tri = this.model.geom.query.navFaceToTri(face);
        const verts = tri.map(index => this.model.geom.query.navTriToVert(index));
        const verts_flat = [].concat(...verts);
        const posis = verts_flat.map(v => this.model.geom.query.navAnyToPosi(EEntityTypeStr.VERT, v));
        const posis_flat = [].concat(...posis);
        const tri_indices = [];
        const positions = [];
        posis_flat.map((posi, index) => {
            positions.push(this.model.attribs.query.getPosiCoords(posi));
            tri_indices.push(index);
        });
        const posi_flat = [].concat(...positions);

        const selecting = `${EEntityTypeStr.FACE}${face}`;
        if (!scene._selecting.has(selecting)) {
            scene.selectObjFace(selecting, tri_indices, posi_flat, this.container);
            this.dataService.selected_ents.get(EEntityTypeStr.FACE).set(selecting, face);
        } else {
            scene.unselectObj(selecting, this.container);
            this.dataService.selected_ents.get(EEntityTypeStr.FACE).delete(selecting);
        }
    }

    private selectPLine(line: THREE.Intersection) {
        const scene = this._data_threejs;
        const wire = this.model.geom.query.navEdgeToWire(line.index / 2);
        const pline = this.model.geom.query.navWireToPline(wire);
        if (pline === undefined) {
            return null;
        }
        const wire1 = this.model.geom.query.navPlineToWire(pline);
        const edges = this.model.geom.query.navWireToEdge(wire1);
        const verts = edges.map(e => this.model.geom.query.navEdgeToVert(e));
        const verts_flat = [].concat(...[].concat(...verts));
        const indices = [];
        const positions = [];
        verts_flat.map((v, i) => {
            positions.push(this.model.attribs.query.getVertCoords(v));
            indices.push(i);
        });
        const posi_flat = [].concat(...positions);
        const selecting = `${EEntityTypeStr.PLINE}${wire}`;
        if (!scene._selecting.has(selecting)) {
            scene.selectObjLine(selecting, indices, posi_flat, this.container);
            this.dataService.selected_ents.get(EEntityTypeStr.PLINE).set(selecting, wire);
        } else {
            scene.unselectObj(selecting, this.container);
            this.dataService.selected_ents.get(EEntityTypeStr.PLINE).delete(selecting);
        }
    }

    private selectPGon(triangle: THREE.Intersection) {
        const scene = this._data_threejs;
        const face = this.model.geom.query.navTriToFace(triangle.faceIndex);
        const pgon = this.model.geom.query.navFaceToPgon(face);
        if (pgon === undefined) {
            return null;
        }
        const face1 = this.model.geom.query.navPgonToFace(pgon);
        const tri = this.model.geom.query.navFaceToTri(face1);
        const verts = tri.map(index => this.model.geom.query.navTriToVert(index));
        const verts_flat = [].concat(...verts);
        const posis = verts_flat.map(v => this.model.geom.query.navAnyToPosi(EEntityTypeStr.VERT, v));
        const posis_flat = [].concat(...posis);
        const tri_indices = [];
        const positions = [];
        posis_flat.map((posi, index) => {
            positions.push(this.model.attribs.query.getPosiCoords(posi));
            tri_indices.push(index);
        });
        const posi_flat = [].concat(...positions);

        const selecting = `${EEntityTypeStr.PGON}${face}`;
        if (!scene._selecting.has(selecting)) {
            scene.selectObjFace(selecting, tri_indices, posi_flat, this.container);
            this.dataService.selected_ents.get(EEntityTypeStr.PGON).set(selecting, face);
        } else {
            scene.unselectObj(selecting, this.container);
            this.dataService.selected_ents.get(EEntityTypeStr.PGON).delete(selecting);
        }
    }

    private selectColl(object: THREE.Intersection, type) {
        if (type === 'Mesh') {
            const colls = this.model.geom.query.navAnyToAny(EEntityTypeStr.TRI, EEntityTypeStr.COLL, object.faceIndex);
            /**
             * Show dropdown menu only when Entity belongs to more than 1 Collection.
             */
            if (this.dataService.selected_ents.get(EEntityTypeStr.COLL).size === 0 && colls.length > 1) {

                this.dropdown.setItems(colls, 'co');
                this.dropdown.visible = true;
                this.dropdown.position = this.dropdownPosition;
            } else {
                this.chooseColl(colls[0]);
            }
        } else if (type === 'LineSegments') {
            // console.log('selectColl');
            // const wire = this.model.geom.query.navEdgeToWire(object.index / 2);
            // console.log(wire);
            // const coll = this.model.geom.query.navAnyToColl(EEntityTypeStr.WIRE, wire);
            // console.log(coll);
        }
    }

    private chooseColl(id: number) {
        const scene = this._data_threejs;
        const pgons = this.model.geom.query.navCollToPgon(id);
        const pgons_flat = [].concat(...pgons);
        const faces = pgons_flat.map(pgon => this.model.geom.query.navPgonToFace(pgon));
        const faces_flat = [].concat(...faces);
        const tris = faces_flat.map(face => this.model.geom.query.navFaceToTri(face));
        const tris_flat = [].concat(...tris);
        const verts = tris_flat.map(tri => this.model.geom.query.navTriToVert(tri));
        const verts_flat = [].concat(...verts);
        const posis = verts_flat.map(v => this.model.geom.query.navAnyToPosi(EEntityTypeStr.VERT, v));
        const posis_flat = [].concat(...posis);
        const tri_indices = [];
        const positions = [];
        posis_flat.map((posi, index) => {
            positions.push(this.model.attribs.query.getPosiCoords(posi));
            tri_indices.push(index);
        });
        const posi_flat = [].concat(...positions);
        const attrib_val = this.model.attribs.query.getAttribValue(EEntityTypeStr.COLL, EAttribNames.NAME, id);
        // const selecting = attrib_val ? attrib_val.toString() : `${EEntityTypeStr.COLL}${id}`;
        const selecting = `${EEntityTypeStr.COLL}${id}`;
        if (!scene._selecting.has(selecting)) {
            scene.selectObjFace(selecting, tri_indices, posi_flat, this.container);
            this.dataService.selected_ents.get(EEntityTypeStr.COLL).set(selecting, id);
        } else {
            scene.unselectObj(selecting, this.container);
            this.dataService.selected_ents.get(EEntityTypeStr.COLL).delete(selecting);
        }
        this.render(this);
    }

    public zoomfit() {
        this._data_threejs.lookAtObj(this._width);
    }

    private selectEntityType(selection: { id: string, name: string }) {
        this.selectingEntityType = selection;
        this.selectDropdownVisible = false;
    }

    private selectEntity(id: number) {
        this.chooseColl(id);
    }
}
