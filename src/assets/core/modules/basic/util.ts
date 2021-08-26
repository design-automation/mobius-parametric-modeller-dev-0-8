/**
 * The `util` module has some utility functions used for debugging.
 */

/**
 *
 */
import { checkIDs, ID } from '../../_check_ids';
import { GIModel } from '@libs/geo-info/GIModel';
import { EEntType, TId, TEntTypeIdx, EAttribNames, EAttribDataTypeStrs, IModelJSONData, Txyz, Txy, TAttribDataTypes } from '@libs/geo-info/common';
import { arrMakeFlat, getArrDepth } from '@assets/libs/util/arrs';
import { idBreak, idsBreak, idsMake } from '@assets/libs/geo-info/common_id_funcs';
import { _getFile } from './io';
import { vecAng2, vecFromTo, vecRot } from '@assets/libs/geom/vectors';
import { multMatrix, rotateMatrix } from '@assets/libs/geom/matrix';
import { Matrix4 } from 'three';
import proj4 from 'proj4';
import { checkArgs, isNull, isNum, isStr } from '@assets/core/_check_types';

// longitude latitude in Singapore, NUS
const LONGLAT = [103.778329, 1.298759];
/**
 * TODO MEgre with io_geojson.ts
 * Get long lat, Detect CRS, create projection function
 * @param model The model.
 * @param point The features to add.
 */
 function _createProjection(model: GIModel): proj4.Converter {
    // create the function for transformation
    const proj_str_a = '+proj=tmerc +lat_0=';
    const proj_str_b = ' +lon_0=';
    const proj_str_c = '+k=1 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs';
    let longitude = LONGLAT[0];
    let latitude = LONGLAT[1];
    if (model.modeldata.attribs.query.hasModelAttrib('geolocation')) {
        const geolocation = model.modeldata.attribs.get.getModelAttribVal('geolocation');
        const long_value: TAttribDataTypes = geolocation['longitude'];
        if (typeof long_value !== 'number') {
            throw new Error('Longitude attribute must be a number.');
        }
        longitude = long_value as number;
        if (longitude < -180 || longitude > 180) {
            throw new Error('Longitude attribute must be between -180 and 180.');
        }
        const lat_value: TAttribDataTypes = geolocation['latitude'];
        if (typeof lat_value !== 'number') {
            throw new Error('Latitude attribute must be a number');
        }
        latitude = lat_value as number;
        if (latitude < 0 || latitude > 90) {
            throw new Error('Latitude attribute must be between 0 and 90.');
        }
    }
    // try to figure out what the projection is of the source file
    // let proj_from_str = 'WGS84';
    // if (geojson_obj.hasOwnProperty('crs')) {
    //     if (geojson_obj.crs.hasOwnProperty('properties')) {
    //         if (geojson_obj.crs.properties.hasOwnProperty('name')) {
    //             const name: string = geojson_obj.crs.properties.name;
    //             const epsg_index = name.indexOf('EPSG');
    //             if (epsg_index !== -1) {
    //                 let epsg = name.slice(epsg_index);
    //                 epsg = epsg.replace(/\s/g, '+');
    //                 if (epsg === 'EPSG:4326') {
    //                     // do nothing, 'WGS84' is fine
    //                 } else if (['EPSG:4269', 'EPSG:3857', 'EPSG:3785', 'EPSG:900913', 'EPSG:102113'].indexOf(epsg) !== -1) {
    //                     // these are the epsg codes that proj4 knows
    //                     proj_from_str = epsg;
    //                 } else if (epsg === 'EPSG:3414') {
    //                     // singapore
    //                     proj_from_str =
    //                         '+proj=tmerc +lat_0=1.366666666666667 +lon_0=103.8333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 ' +
    //                         '+ellps=WGS84 +units=m +no_defs';
    //                 }
    //             }
    //         }
    //     }
    // }
    // console.log('CRS of geojson data', proj_from_str);

    const proj_from_str = 'WGS84';
    const proj_to_str = proj_str_a + latitude + proj_str_b + longitude + proj_str_c;
    const proj_obj: proj4.Converter = proj4(proj_from_str, proj_to_str);
    return proj_obj;
}
/**
 * TODO MEgre with io_geojson.ts
 * Converts geojson long lat to cartesian coords
 * @param long_lat_arr
 * @param elevation
 */
function _xformFromLongLatToXYZ(
        long_lat_arr: [number, number]|[number, number][], proj_obj: proj4.Converter, elevation: number): Txyz|Txyz[] {
    if (getArrDepth(long_lat_arr) === 1) {
        const long_lat: [number, number] = long_lat_arr as [number, number];
        const xy: [number, number] = proj_obj.forward(long_lat);
        return [xy[0], xy[1], elevation];
    } else {
        long_lat_arr = long_lat_arr as [number, number][];
        const xyzs_xformed: Txyz[] = [];
        for (const long_lat of long_lat_arr) {
            if (long_lat.length >= 2) {
                const xyz: Txyz = _xformFromLongLatToXYZ(long_lat, proj_obj, elevation) as Txyz;
                xyzs_xformed.push(xyz);
            }
        }
        return xyzs_xformed as Txyz[];
    }
}
// ================================================================================================
/**
 * Select entities in the model.
 *
 * @param __model__
 * @param entities
 * @returns void
 */
export function Select(__model__: GIModel, entities: string|string[]|string[][]): void {
    __model__.modeldata.geom.selected[__model__.getActiveSnapshot()] = [];
    const activeSelected = __model__.modeldata.geom.selected[__model__.getActiveSnapshot()];
    entities = ((Array.isArray(entities)) ? entities : [entities]) as string[];
    const [ents_id_flat, ents_indices] = _flatten(entities);
    const ents_arr: TEntTypeIdx[] = idsBreak(ents_id_flat) as TEntTypeIdx[];
    const attrib_name = '_selected';
    for (let i = 0; i < ents_arr.length; i++) {
        const ent_arr: TEntTypeIdx = ents_arr[i];
        const ent_indices: number[] = ents_indices[i];
        const attrib_value: string = 'selected[' + ent_indices.join('][') + ']';
        activeSelected.push(ent_arr);
        if (!__model__.modeldata.attribs.query.hasEntAttrib(ent_arr[0], attrib_name)) {
            __model__.modeldata.attribs.add.addAttrib(ent_arr[0], attrib_name, EAttribDataTypeStrs.STRING);
        }
        __model__.modeldata.attribs.set.setCreateEntsAttribVal(ent_arr[0], ent_arr[1], attrib_name, attrib_value);
    }
}
function _flatten(arrs: string|string[]|string[][]): [string[], number[][]] {
    const arr_flat: string[] = [];
    const arr_indices: number[][] = [];
    let count = 0;
    for (const item of arrs) {
        if (Array.isArray(item)) {
            const [arr_flat2, arr_indices2] = _flatten(item);
            for (let i = 0; i < arr_flat2.length; i++) {
                if (arr_flat.indexOf(arr_flat2[i]) !== -1) { continue; }
                arr_flat.push(arr_flat2[i]);
                arr_indices2[i].unshift(count);
                arr_indices.push(arr_indices2[i]);
            }
        } else {
            arr_flat.push(item);
            arr_indices.push([count]);
        }
        count += 1;
    }
    return [arr_flat, arr_indices];
}
// ================================================================================================
/**
 * Set the geolocation of the Cartesian coordinate system.
 *
 * @param __model__
 * @param lat_long Set the latitude and longitude of the origin of the Cartesian coordinate system. 
 * @param rot Set the counter-clockwise rotation of the Cartesian coordinate system, in radians.
 * @param elev Set the elevation of the Cartesian coordinate system above the ground plane.
 * @returns void
 */
 export function Geolocate(
        __model__: GIModel, 
        lat_long: Txy, 
        rot: number,
        elev: number
    ): void {
    const gl_dict = {"latitude": lat_long[0], "longitude": lat_long[1]};
    if (elev !== null) {
        gl_dict["elevation"] = elev;
    }
    __model__.modeldata.attribs.set.setModelAttribVal("geolocation", gl_dict);
    let n_vec: Txyz = [0,1,0];
    if (rot !== null) {
        n_vec = vecRot(n_vec, [0,0,1], -rot)
    }
    __model__.modeldata.attribs.set.setModelAttribVal("north", [n_vec[0], n_vec[1]]);
}
// ================================================================================================
/**
 * Set the geolocation of the Cartesian coordinate system.
 *
 * @param __model__
 * @param lat_long_o Set the latitude and longitude of the origin of the Cartesian coordinate system. 
 * @param lat_long_x Set the latitude and longitude of a point on the x-axis of the Cartesian coordinate system. 
 * @param elev Set the elevation of the Cartesian coordinate system above the ground plane.
 * @returns void
 */
 export function Geoalign(
        __model__: GIModel, 
        lat_long_o: Txy,
        lat_long_x: Txy,
        elev: number
    ): void {
    const gl_dict = {"latitude": lat_long_o[0], "longitude": lat_long_o[1]};
    if (elev !== null) {
        gl_dict["elevation"] = elev;
    }
    __model__.modeldata.attribs.set.setModelAttribVal("geolocation", gl_dict);
    // calc
    const proj_obj: proj4.Converter = _createProjection(__model__);
    // origin
    let xyz_o: Txyz = _xformFromLongLatToXYZ(lat_long_o, proj_obj, 0) as Txyz;
    // point on x axis
    let xyz_x: Txyz = _xformFromLongLatToXYZ(lat_long_x, proj_obj, 0) as Txyz;
    // x axis vector
    const x_vec: Txyz = vecFromTo(xyz_o, xyz_x);
    const rot: number = vecAng2([1, 0, 0], x_vec, [0, 0, 1]);
    console.log("rot = ", rot, "x_vec = ", x_vec, xyz_o, xyz_x)
    // north vector
    const n_vec: Txyz = vecRot([0,1,0], [0,0,1], rot);
    __model__.modeldata.attribs.set.setModelAttribVal("north", [n_vec[0], n_vec[1]]);
}
// ================================================================================================
/**
 * Transform a coordinate from latitude-longitude location XYZ, based on the geolocation of the
 * model.
 *
 * @param __model__
 * @param lat_long Latitude and longitude coordinates. 
 * @param elev Set the elevation of the Cartesian coordinate system above the ground plane.
 * @returns XYZ coordinates
 */
 export function LatLong2XYZ(
        __model__: GIModel, 
        lat_long: Txy,
        elev: number
    ): Txyz {
    const proj_obj: proj4.Converter = _createProjection(__model__);
    // calculate angle of rotation
    let rot_matrix: Matrix4 = null;
    if (__model__.modeldata.attribs.query.hasModelAttrib('north')) {
        const north: Txy = __model__.modeldata.attribs.get.getModelAttribVal('north') as Txy;
        if (Array.isArray(north)) {
            const rot_ang: number = vecAng2([0, 1, 0], [north[0], north[1], 0], [0, 0, 1]);
            rot_matrix = rotateMatrix([[0, 0, 0], [0, 0, 1]], rot_ang);
        }
    }
    // add feature
    let xyz: Txyz = _xformFromLongLatToXYZ(lat_long, proj_obj, elev) as Txyz;
    // rotate to north
    if (rot_matrix !== null) {
        xyz = multMatrix(xyz, rot_matrix);
    }
    return xyz;

}
// ================================================================================================
/**
 * Creta a VR hotspot. In the VR Viewer, you can teleport to such hotspots.
 * \n
 * @param __model__
 * @param point A point object to be used for creating hotspots.
 * @param name A name for the VR hotspots. If `null`, a default name will be created.
 * @param camera_rot The rotation of the camera direction when you teleport yo the hotspot. The
 * rotation is specified in degrees, in the counter-clockwise direction, starting from the Y axis.
 * If `null`, the camera rotation will default to 0.
 * @returns void
 */
 export function vrHotspot(
        __model__: GIModel, 
        point: string,
        name: string,
        camera_rot: number
    ): void {
    // --- Error Check ---
    const fn_name = 'util.vrHotspot';
    let ent_arr: TEntTypeIdx;
    if (__model__.debug) {
        ent_arr = checkIDs(__model__, fn_name, 'points', point,
            [ID.isID],
            [EEntType.POINT]) as TEntTypeIdx;
        checkArgs(fn_name, 'name', name, [isStr, isNull]);
        checkArgs(fn_name, 'camera_rot', camera_rot, [isNum, isNull]);
    } else {
        ent_arr = idsBreak(point) as TEntTypeIdx;
    }
    // --- Error Check ---
    const ent_i: number = ent_arr[1];
    if (!__model__.modeldata.attribs.query.hasEntAttrib(EEntType.POINT, "vr")) {
        __model__.modeldata.attribs.add.addEntAttrib(EEntType.POINT, "vr", EAttribDataTypeStrs.DICT);
    }
    let hs_dict = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.POINT, ent_i, "vr");
    if (hs_dict === undefined) {
        hs_dict = {}
    }
    if (name !== null) {
        hs_dict["name"] = name;
    }
    if (camera_rot !== null) {
        hs_dict["camera_rotation"] = camera_rot;
    }
    __model__.modeldata.attribs.set.setEntAttribVal(EEntType.POINT, ent_i, "vr", hs_dict);
}
// ================================================================================================
/**
 * Create a VR panorama hotspot. In the VR Viewer, you can teleport to such hotspots.When you enter
 * the hotspot, the panorama images will be loaded into the view. \n
 * @param __model__
 * @param point The point object to be used for creating a panorama. If this point is already
 * defined as a VR hotspot, then the panorama hotspot will inherit the name and camera angle.
 * @param back_url The URL of the 360 degree panorama image to be used for the background.
 * @param Back_rot The rotation of the background panorama image, in degrees, in the
 * counter-clockwise direction. If `null`, then rotation will be 0.
 * @param fore_url The URL of the 360 degree panorama image to be used for the foreground. If `null`
 * then no foreground image will be used.
 * @param fore_rot The rotation of the forground panorama image, in degrees, in the
 * counter-clockwise direction. If `null`, then the foreground rotation will be equal to the background rotation.
 * @returns void
 */
 export function vrPanorama(
        __model__: GIModel, 
        point: string,
        back_url: number, back_rot: number,
        fore_url: number, fore_rot: number
    ): void {
    // --- Error Check ---
    const fn_name = 'util.vrPanorama';
    let ent_arr: TEntTypeIdx;
    if (__model__.debug) {
        ent_arr = checkIDs(__model__, fn_name, 'point', point,
            [ID.isID],
            [EEntType.POINT]) as TEntTypeIdx;
        checkArgs(fn_name, 'back_url', back_url, [isStr]);
        checkArgs(fn_name, 'back_rot', back_rot, [isNum, isNull]);
        checkArgs(fn_name, 'fore_url', fore_url, [isStr, isNull]);
        checkArgs(fn_name, 'fore_rot', fore_rot, [isNum, isNull]);
    } else {
        ent_arr = idsBreak(point) as TEntTypeIdx;
    }
    // --- Error Check ---
    const ent_i: number = ent_arr[1];
    if (!__model__.modeldata.attribs.query.hasEntAttrib(EEntType.POINT, "vr")) {
        __model__.modeldata.attribs.add.addEntAttrib(EEntType.POINT, "vr", EAttribDataTypeStrs.DICT);
    }
    let phs_dict = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.POINT, ent_i, "vr");
    if (phs_dict === undefined) {
        phs_dict = {}
    }
    phs_dict["background_url"] = back_url;
    if (back_rot === null) {
        phs_dict["background_rotation"] = 0;
    } else {
        phs_dict["background_rotation"] = back_rot;
    }
    if (fore_url !== null) {
        phs_dict["foreground_url"] = fore_url;
        if (fore_rot === null) {
            phs_dict["foreground_rotation"] = phs_dict["background_rotation"];
        } else {
            phs_dict["foreground_rotation"] = fore_rot;
        }
    }
    __model__.modeldata.attribs.set.setEntAttribVal(EEntType.POINT, ent_i, "vr", phs_dict);
}
// ================================================================================================
/**
 * Returns am html string representation of the parameters in this model.
 * The string can be printed to the console for viewing.
 *
 * @param __model__
 * @param __constList__
 * @returns Text that summarises what is in the model.
 */
export function ParamInfo(__model__: GIModel, __constList__: {}): string {
    return JSON.stringify(__constList__);
}
// ================================================================================================
/**
 * Returns an html string representation of one or more entities in the model.
 * The string can be printed to the console for viewing.
 *
 * @param __model__
 * @param entities One or more objects ot collections.
 * @returns void
 */
export function EntityInfo(__model__: GIModel, entities: TId|TId[]): string {
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = 'util.EntityInfo';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'coll', entities,
            [ID.isID, ID.isIDL1],
            [EEntType.COLL, EEntType.PGON, EEntType.PLINE, EEntType.POINT]) as TEntTypeIdx[];
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    let result = '<h4>Entity Information:</h4>';
    for (const ent_arr of ents_arr) {
        const [ent_type, ent_i] = ent_arr;
        switch (ent_type) {
            case EEntType.COLL:
                result += _collInfo(__model__, ent_i);
                break;
            case EEntType.PGON:
                result += _pgonInfo(__model__, ent_i);
                break;
            case EEntType.PLINE:
                result += _plineInfo(__model__, ent_i);
                break;
            case EEntType.POINT:
                result += _pointInfo(__model__, ent_i);
                break;
            default:
                break;
        }
    }
    return result;
}
function _getAttribs(__model__: GIModel, ent_type: EEntType, ent_i: number): string[] {
    const names: string[] = __model__.modeldata.attribs.getAttribNames(ent_type);
    const attribs_with_vals = [];
    for (const name of names) {
        const val = __model__.modeldata.attribs.get.getEntAttribVal(ent_type, ent_i, name);
        if (val !== undefined) {
            attribs_with_vals.push(name);
        }
    }
    return attribs_with_vals;
}
function _getColls(__model__: GIModel, ent_type: EEntType, ent_i: number): string[] {
    const ssid: number = __model__.modeldata.active_ssid;
    let colls_i: number[] = [];
    if (ent_type === EEntType.COLL) {
        const parent: number = __model__.modeldata.geom.snapshot.getCollParent(ssid, ent_i);
        if (parent !== -1) { colls_i = [parent]; }
    } else {
        colls_i = __model__.modeldata.geom.nav.navAnyToColl(ent_type, ent_i);
    }
    const colls_names = [];
    for (const coll_i of colls_i) {
        let coll_name = 'No name';
        if (__model__.modeldata.attribs.query.hasEntAttrib(EEntType.COLL, EAttribNames.COLL_NAME)) {
            coll_name = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.COLL, coll_i, EAttribNames.COLL_NAME) as string;
        }
        colls_names.push(coll_name);
    }
    return colls_names;
}
function _pointInfo(__model__: GIModel, point_i: number): string {
    let info = '';
    // get the data
    const attribs: string[] = _getAttribs(__model__, EEntType.POINT, point_i);
    const colls_names = _getColls(__model__, EEntType.POINT, point_i);
    // make str
    info += '<ul>';
    info += '<li>Type: <b>Point</b></li>';
    info += '<ul>';
    if (attribs.length !== 0) { info += '<li>Attribs: ' + attribs.join(', ') + '</li>'; }
    if (colls_names.length === 1) {
        info += '<li>In collection: ' + colls_names[0] + '</li>';
    } else if (colls_names.length > 1) {
        info += '<li>In ' + colls_names.length + ' collections: ' + colls_names.join(', ') + '</li>';
    }
    info += '</ul>';
    info += '</ul>';
    return info;
}
function _plineInfo(__model__: GIModel, pline_i: number): string {
    let info = '';
    // get the data
    const attribs: string[] = _getAttribs(__model__, EEntType.PLINE, pline_i);
    const num_verts: number = __model__.modeldata.geom.nav.navAnyToVert(EEntType.PLINE, pline_i).length;
    const num_edges: number = __model__.modeldata.geom.nav.navAnyToEdge(EEntType.PLINE, pline_i).length;
    const colls_names = _getColls(__model__, EEntType.PLINE, pline_i);
    // make str
    info += '<ul>';
    info += '<li>Type: <b>Polyline</b></li>';
    info += '<ul>';
    if (attribs.length !== 0) { info += '<li>Attribs: ' + attribs.join(', ') + '</li>'; }
    if (num_verts) { info += '<li>Num verts: ' + num_verts + '</li>'; }
    if (num_edges) { info += '<li>Num edges: ' + num_edges + '</li>'; }
    if (colls_names.length === 1) {
        info += '<li>In collection: ' + colls_names[0] + '</li>';
    } else if (colls_names.length > 1) {
        info += '<li>In ' + colls_names.length + ' collections: ' + colls_names.join(', ') + '</li>';
    }
    info += '</ul>';
    info += '</ul>';
    return info;
}
function _pgonInfo(__model__: GIModel, pgon_i: number): string {
    let info = '';
    // get the data
    const attribs: string[] = _getAttribs(__model__, EEntType.PGON, pgon_i);
    const num_verts: number = __model__.modeldata.geom.nav.navAnyToVert(EEntType.PGON, pgon_i).length;
    const num_edges: number = __model__.modeldata.geom.nav.navAnyToEdge(EEntType.PGON, pgon_i).length;
    const num_wires: number = __model__.modeldata.geom.nav.navAnyToWire(EEntType.PGON, pgon_i).length;
    const colls_i: number[] = __model__.modeldata.geom.nav.navPgonToColl(pgon_i);
    const colls_names = _getColls(__model__, EEntType.PGON, pgon_i);
    // make str
    info += '<ul>';
    info += '<li>Type: <b>Polygon</b></li>';
    info += '<ul>';
    if (attribs.length !== 0) { info += '<li>Attribs: ' + attribs.join(', ') + '</li>'; }
    if (num_verts) { info += '<li>Num verts: ' + num_verts + '</li>'; }
    if (num_edges) { info += '<li>Num edges: ' + num_edges + '</li>'; }
    if (num_wires) { info += '<li>Num wires: ' + num_wires + '</li>'; }
    if (colls_i.length === 1) {
        info += '<li>In collection: ' + colls_names[0] + '</li>';
    } else if (colls_i.length > 1) {
        info += '<li>In ' + colls_i.length + ' collections: ' + colls_names.join(', ') + '</li>';
    }
    info += '</ul>';
    info += '</ul>';
    return info;
}
function _collInfo(__model__: GIModel, coll_i: number): string {
    const ssid: number = __model__.modeldata.active_ssid;
    let info = '';
    // get the data
    let coll_name = 'None';
    if (__model__.modeldata.attribs.query.hasEntAttrib(EEntType.COLL, EAttribNames.COLL_NAME)) {
        coll_name = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.COLL, coll_i, EAttribNames.COLL_NAME) as string;
    }
    const attribs: string[] = _getAttribs(__model__, EEntType.COLL, coll_i);
    const num_pgons: number = __model__.modeldata.geom.nav.navCollToPgon(coll_i).length;
    const num_plines: number = __model__.modeldata.geom.nav.navCollToPline(coll_i).length;
    const num_points: number = __model__.modeldata.geom.nav.navCollToPoint(coll_i).length;
    const colls_names = _getColls(__model__, EEntType.COLL, coll_i);
    // make str
    info += '<ul>';
    info += '<li>Type: <b>Collection</b></li>';
    info += '<ul>';
    info += '<li>Name: <b>' + coll_name + '</b></li>';
    if (attribs.length !== 0) { info += '<li>Attribs: ' + attribs.join(', ') + '</li>'; }
    if (num_pgons) { info += '<li>Num pgons: ' + num_pgons + '</li>'; }
    if (num_plines) { info += '<li>Num plines: ' + num_plines + '</li>'; }
    if (num_points) { info += '<li>Num points: ' + num_points + '</li>'; }
    if (colls_names.length === 1) {
        info += '<li>In collection: ' + colls_names[0] + '</li>';
    } else if (colls_names.length > 1) {
        info += '<li>In ' + colls_names.length + ' collections: ' + colls_names.join(', ') + '</li>';
    }
    const children: number[] = __model__.modeldata.geom.snapshot.getCollChildren(ssid, coll_i);
    if (children.length > 0) {
        info += '<li>Child collections: </li>';
        for (const child of children) {
            info += _collInfo(__model__, child);
        }
    }
    info += '</ul>';
    info += '</ul>';
    return info;
}
// ================================================================================================
/**
 * Returns an html string representation of the contents of this model.
 * The string can be printed to the console for viewing.
 *
 * @param __model__
 * @returns Text that summarises what is in the model, click print to see this text.
 */
export function ModelInfo(__model__: GIModel): string {
    let info = '<h4>Model Information:</h4>';
    info += '<ul>';
    // model attribs
    const model_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.MOD);
    if (model_attribs.length !== 0) { info += '<li>Model attribs: ' + model_attribs.join(', ') + '</li>'; }
    // collections
    const num_colls: number = __model__.modeldata.geom.query.numEnts(EEntType.COLL);
    const coll_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.COLL);
    info += '<li>';
    info += '<b>Collections</b>: ' + num_colls; // + ' (Deleted: ' + num_del_colls + ') ';
    if (coll_attribs.length !== 0) { info += 'Attribs: ' + coll_attribs.join(', '); }
    info += '</li>';
    // pgons
    const num_pgons: number = __model__.modeldata.geom.query.numEnts(EEntType.PGON);
    const pgon_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.PGON);
    info += '<li>';
    info += '<b>Polygons</b>: ' + num_pgons; // + ' (Deleted: ' + num_del_pgons + ') ';
    if (pgon_attribs.length !== 0) { info += 'Attribs: ' + pgon_attribs.join(', '); }
    info += '</li>';
    // plines
    const num_plines: number = __model__.modeldata.geom.query.numEnts(EEntType.PLINE);
    const pline_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.PLINE);
    info += '<li>';
    info += '<b>Polylines</b>: ' + num_plines; // + ' (Deleted: ' + num_del_plines + ') ';
    if (pline_attribs.length !== 0) { info += 'Attribs: ' + pline_attribs.join(', '); }
    info += '</li>';
    // points
    const num_points: number = __model__.modeldata.geom.query.numEnts(EEntType.POINT);
    const point_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.POINT);
    info += '<li>';
    info += '<b>Points</b>: ' + num_points; // + ' (Deleted: ' + num_del_points + ') ';
    if (point_attribs.length !== 0) { info += 'Attribs: ' + point_attribs.join(', '); }
    info += '</li>';
    // wires
    const num_wires: number = __model__.modeldata.geom.query.numEnts(EEntType.WIRE);
    const wire_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.WIRE);
    info += '<li>';
    info += '<b>Wires</b>: ' + num_wires; // + ' (Deleted: ' + num_del_wires + ') ';
    if (wire_attribs.length !== 0) { info += 'Attribs: ' + wire_attribs.join(', '); }
    info += '</li>';
    // edges
    const num_edges: number = __model__.modeldata.geom.query.numEnts(EEntType.EDGE);
    const edge_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.EDGE);
    info += '<li>';
    info += '<b>Edges</b>: ' + num_edges; // + ' (Deleted: ' + num_del_edges + ') ';
    if (edge_attribs.length !== 0) { info += 'Attribs: ' + edge_attribs.join(', '); }
    info += '</li>';
    // verts
    const num_verts: number = __model__.modeldata.geom.query.numEnts(EEntType.VERT);
    const vert_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.VERT);
    info += '<li>';
    info += '<b>Vertices</b>: ' + num_verts; // + ' (Deleted: ' + num_del_verts + ') ';
    if (vert_attribs.length !== 0) { info += 'Attribs: ' + vert_attribs.join(', '); }
    info += '</li>';
    // posis
    const num_posis: number = __model__.modeldata.geom.query.numEnts(EEntType.POSI);
    const posi_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.POSI);
    info += '<li>';
    info += '<b>Positions</b>: ' + num_posis; // + ' (Deleted: ' + num_del_posis + ') ';
    if (posi_attribs.length !== 0) { info += 'Attribs: ' + posi_attribs.join(', '); }
    info += '</li>';
    // end
    info += '</ul>';
    // return the string
    return info;
}
// ================================================================================================
/**
 * Checks the internal consistency of the model. Used for debugigng Mobius.
 *
 * @param __model__
 * @returns Text that summarises what is in the model, click print to see this text.
 */
export function ModelCheck(__model__: GIModel): string {
    console.log('==== ==== ==== ====');
    console.log('MODEL GEOM\n', __model__.modeldata.geom.toStr());
    // console.log('MODEL ATTRIBS\n', __model__.modeldata.attribs.toStr());
    console.log('META\n', __model__.metadata.toDebugStr());
    console.log('==== ==== ==== ====');
    console.log(__model__);
    const check: string[] = __model__.check();
    if (check.length > 0) {
        return String(check);
    }
    return 'No internal inconsistencies have been found.';
}
// ================================================================================================
/**
 * Compares two models. Used for grading models.
 * 
 * Checks that every entity in this model also exists in the input_data.
 *
 * Additional entitis in the input data will not affect the score.
 *
 * Attributes at the model level are ignored except for the `material` attributes.
 *
 * For grading, this model is assumed to be the answer model, and the input model is assumed to be
 * the model submitted by the student.
 *
 * The order or entities in this model may be modified in the comparison process.
 *
 * For specifying the location of the GI Model, you can either specify a URL, or the name of a file in LocalStorage.
 * In the latter case, you do not specify a path, you just specify the file name, e.g. 'my_model.gi'
 *
 * @param __model__
 * @param input_data The location of the GI Model to compare this model to.
 * @returns Text that summarises the comparison between the two models.
 */
export async function ModelCompare(__model__: GIModel, input_data: string): Promise<string> {
    const input_data_str: string = await _getFile(input_data);
    if (!input_data_str) {
        throw new Error('Invalid imported model data');
    }
    const input_model = new GIModel();
    input_model.importGI(input_data_str);
    const result: {score: number, total: number, comment: string} = __model__.compare(input_model, true, false, false);
    return result.comment;
}
// ================================================================================================
/**
 * Merges data from another model into this model.
 * This is the same as importing the model, except that no collection is created.
 *
 * For specifying the location of the GI Model, you can either specify a URL, or the name of a file in LocalStorage.
 * In the latter case, you do not specify a path, you just specify the file name, e.g. 'my_model.gi'
 *
 * @param __model__
 * @param input_data The location of the GI Model to import into this model to.
 * @returns Text that summarises the comparison between the two models.
 */
export async function ModelMerge(__model__: GIModel, input_data: string): Promise<TId[]> {
    const input_data_str: string = await _getFile(input_data);
    if (!input_data_str) {
        throw new Error('Invalid imported model data');
    }
    const ents_arr: TEntTypeIdx[] = __model__.importGI(input_data_str);
    return idsMake(ents_arr) as TId[];
}
// ================================================================================================
/**
 * Post a message to the parent window.
 *
 * @param __model__
 * @param data The data to send, a list or a dictionary.
 * @returns Text that summarises what is in the model, click print to see this text.
 */
export function SendData(__model__: GIModel, data: any): void {
    window.parent.postMessage(data, '*');
}
// ================================================================================================
