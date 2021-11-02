import { GIModel } from '../GIModel';
import { Txyz, EEntType, TAttribDataTypes, IEntSets } from '../common';
import proj4 from 'proj4';



enum ECityJSONGeomType {
    MULTIPOINT = 'MultiPoint',
    MULTILINESTRING = 'MultiLineString',
    MULTISURFACE = 'MultiSurface',
    COMPOSITESURFACE = 'CompositeSurface',
    SOLID = 'Solid',
    MULTISOLID = 'MultiSolid',
    COMPOSITESOLID = 'CompositeSolid',
    GEOMETRYINSTANCE = 'GeometryInstance'
}

/**
 * Import CityJSON
 */
export function importCityJSON(model: GIModel, geojson_str: string): IEntSets {
    const ssid: number = model.modeldata.active_ssid;
    // parse the json data str
    const cityjson_obj: any = JSON.parse(geojson_str);
    // check type and version
    if (cityjson_obj.type !== 'CityJSON') {
        throw new Error('The data being imported is not CityJSON.');
    }
    if (!('version' in cityjson_obj) || !cityjson_obj.version.startsWith('1.')) {
        throw new Error('The CityJSON data is the wrong version. It must be version 1.x.');
    }
    // crs projection
    let proj_obj: proj4.Converter = null;
    if ('metadata' in cityjson_obj && 'referenceSystem' in cityjson_obj.metadata) {
        proj_obj = _createGeoJSONProjection2(model, cityjson_obj.vertices[0], cityjson_obj.transform);
    }
    // create positions
    const posis_i: number[] = [];
    for (const xyz of cityjson_obj.vertices) {
        // create the posi
        const posi_i: number = _addPosi(model, xyz, cityjson_obj.transform, proj_obj);
        posis_i.push(posi_i);
    }
    // add materials
    let mat_names: string[] = null;
    if ('appearance' in cityjson_obj) {
        mat_names = _addMaterials(model, cityjson_obj.appearance);
    }
    // arrays for objects
    const points_i: Set<number> = new Set();
    const plines_i: Set<number> = new Set();
    const pgons_i: Set<number> = new Set();
    const colls_i: Set<number> = new Set();
    // loop through the geometry
    for (const cityobj_key of Object.keys(cityjson_obj.CityObjects)) {
        const cityobj: any = cityjson_obj.CityObjects[cityobj_key];
        // create collection for the CityJSON object
        const obj_coll_i: number = model.modeldata.geom.add.addColl();
        _addObjAttribs(model, obj_coll_i, cityobj, cityobj_key);
        // add geom
        for (const geom of cityobj.geometry) {
            // create collection for geometry (lod and type)
            const geom_coll_i: number = model.modeldata.geom.add.addColl();
            model.modeldata.geom.snapshot.addCollChildren(ssid, obj_coll_i, geom_coll_i);
            _addGeomAttribs(model, geom_coll_i, geom);
            // add entities to geometry collection
            switch (geom.type) {
                case ECityJSONGeomType.MULTIPOINT: {
                    const new_points_i: number[] = _addMultiPoint(model, geom, posis_i);
                    for (const point_i of new_points_i) {
                        points_i.add(point_i);
                    }
                    model.modeldata.geom.snapshot.addCollPoints(ssid, geom_coll_i, new_points_i);
                    _addSemanticAttribs(model, EEntType.POINT, new_points_i, geom);
                    break;
                }
                case ECityJSONGeomType.MULTILINESTRING: {
                    const new_plines_i: number[] = _addMultiLineString(model, geom, posis_i);
                    for (const pline_i of new_plines_i) {
                        plines_i.add(pline_i);
                    }
                    model.modeldata.geom.snapshot.addCollPlines(ssid, geom_coll_i, new_plines_i);
                    _addSemanticAttribs(model, EEntType.PLINE, new_plines_i, geom);
                    break;
                }
                case ECityJSONGeomType.MULTISURFACE:
                case ECityJSONGeomType.COMPOSITESURFACE: {
                    const new_pgons_i: number[] = _addMultiSurface(model, geom, posis_i);
                    for (const pgon_i of new_pgons_i) {
                        pgons_i.add(pgon_i);
                    }
                    model.modeldata.geom.snapshot.addCollPgons(ssid, geom_coll_i, new_pgons_i);
                    _addSemanticAttribs(model, EEntType.PGON, new_pgons_i, geom);
                    _addMaterialAttribs(model, new_pgons_i, geom, mat_names);
                    break;
                }
                case ECityJSONGeomType.SOLID: {
                    const new_pgons_i: number[] = _addSolid(model, geom, posis_i);
                    for (const pgon_i of new_pgons_i) {
                        pgons_i.add(pgon_i);
                    }
                    model.modeldata.geom.snapshot.addCollPgons(ssid, geom_coll_i, new_pgons_i);
                    _addSemanticAttribs(model, EEntType.PGON, new_pgons_i, geom);
                    _addMaterialAttribs(model, new_pgons_i, geom, mat_names);
                    break;
                }
                case ECityJSONGeomType.MULTISOLID:
                case ECityJSONGeomType.COMPOSITESOLID: {
                    const new_pgons_i: number[] = _addMultiSolid(model, geom, posis_i);
                    for (const pgon_i of new_pgons_i) {
                        pgons_i.add(pgon_i);
                    }
                    model.modeldata.geom.snapshot.addCollPgons(ssid, geom_coll_i, new_pgons_i);
                    _addSemanticAttribs(model, EEntType.PGON, new_pgons_i, geom);
                    _addMaterialAttribs(model, new_pgons_i, geom, mat_names);
                    break;
                }
                case ECityJSONGeomType.GEOMETRYINSTANCE:
                    throw new Error('Importing CityJSON data: Geometry Instances not implemented.');
                default:
                    break;
            }
        }
    }
    // return sets
    return {
        pt: points_i,
        pl: plines_i,
        pg: pgons_i,
        co: colls_i
    };
}

function _createGeoJSONProjection2(model: GIModel, first_xyz: Txyz, transform: any): proj4.Converter {
    let x = first_xyz[0];
    let y = first_xyz[1];
    if (transform) {
        x = (x * transform.scale[0]) + transform.translate[0];
        y = (y * transform.scale[1]) + transform.translate[1];
    }
    // from
    let proj_from_str: string = null;
    if (model.modeldata.attribs.query.hasModelAttrib('proj')) {
        proj_from_str = model.modeldata.attribs.get.getModelAttribVal('proj') as string;
    } else {
        proj_from_str = 'WGS84';
    }
    // long lat
    let longitude = null;
    let latitude = null;
    if (model.modeldata.attribs.query.hasModelAttrib('geolocation')) {
        const geolocation = model.modeldata.attribs.get.getModelAttribVal('geolocation');
        longitude = geolocation['longitude'];
        latitude = geolocation['latitude'];
    } else {
        const long_lat: number[] = proj4(proj_from_str, 'WGS84', [x, y]);
        // change long lat
        longitude = long_lat[0];
        latitude = long_lat[1];
        model.modeldata.attribs.set.setModelAttribVal('geolocation', {
            'longitude': longitude,
            'latitude': latitude
        });
    }
    // create the function for transformation
    const proj_str_a = '+proj=tmerc +lat_0=';
    const proj_str_b = ' +lon_0=';
    const proj_str_c = '+k=1 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs';
    const proj_to_str2 = proj_str_a + latitude + proj_str_b + longitude + proj_str_c;
    // create projector
    const proj_obj: proj4.Converter = proj4(proj_from_str, proj_to_str2);
    return proj_obj;
}

/*
"metadata": {
  "referenceSystem": "urn:ogc:def:crs:EPSG::7415"
}
*/
/**
 * Get long lat TESTING
 * @param crs The crs string 
 */
function _setLongLat(model: GIModel, crs: any): number[] {
    // const proj_str_a = '+proj=tmerc +lat_0=';
    // const proj_str_b = ' +lon_0=';
    // const proj_str_c = '+k=1 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs';
    // const proj_from_str = proj_str_a + latitude + proj_str_b + longitude + proj_str_c;



    const proj_to_str  = 'WGS84';
    const proj_from_str = '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +vunits=m +no_defs'
    return proj4(proj_from_str, proj_to_str, [0, 0]);
}


/**
 * Add a point to the model
 * @param model The model.
 * @param point The features to add.
 */
function _addPosi(model: GIModel, xyz: Txyz, transform: any, proj_obj: proj4.Converter): number {
    // // rotate to north
    // if (rot_matrix) {
    //     xyz = multMatrix(xyz, rot_matrix);
    // }
    // transform
    if (transform) {
        xyz[0] = (xyz[0] * transform.scale[0]) + transform.translate[0];
        xyz[1] = (xyz[1] * transform.scale[1]) + transform.translate[1];
        xyz[2] = (xyz[2] * transform.scale[2]) + transform.translate[2];
    }
    // project
    if (proj_obj) {
        const xy = proj_obj.forward([xyz[0], xyz[1]]);
        xyz[0] = xy[0];
        xyz[1] = xy[1];
    }
    // create the posi
    const posi_i: number = model.modeldata.geom.add.addPosi();
    model.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
    // return the index
    return posi_i;
}

/*
{
  "type": "MultiPoint",
  "lod": 1,
  "boundaries": [2, 44, 0, 7]
}
*/

/**
 * Add a MultiPoint to the model
 * @param model The model
 * @param geom The CityJSON geometry object to add.
 * @param posis_i The array of positions.
 */
function _addMultiPoint(model: GIModel, geom: any, posis_i: number[]): number[] {
    // create the point
    const points_i: number[] = [];
    for (const idx of geom.boundaries) {
        points_i.push(model.modeldata.geom.add.addPoint(posis_i[idx]));
    }
    return points_i;
}

/*
{
  "type": "MultiLineString",
  "lod": 1,
  "boundaries": [
    [2, 3, 5], [77, 55, 212]
  ]
}
*/
/**
 * Add a MultiLineString to the model
 * @param model The model
 * @param geom The CityJSON object to add.
 * @param posis_i The array of positions.
 */
function _addMultiLineString(model: GIModel, geom: any, posis_i: number[]): number[] {
    const plines_i: number[] = [];
    for (let idxs of geom.boundaries) {
        const close = idxs.length > 2 && idxs[0] === idxs[idxs.length];
        if (close) { idxs = idxs.slice(0, idxs.length - 1); }
        const pline_posis_i: number[] = idxs.map((i: number) => posis_i[i]);
        plines_i.push(model.modeldata.geom.add.addPline(pline_posis_i, close));
    }
    return plines_i;
}

/*
{
  "type": "MultiSurface",
  "lod": 2,
  "boundaries": [
    [[0, 3, 2, 1]], [[4, 5, 6, 7]], [[0, 1, 5, 4]]
  ]
}
*/
/*
{
    "type": "CompositeSurface",
    "lod": 2,
    "boundaries": [
       [[0, 3, 2]], [[4, 5, 6]], [[0, 1, 5]], [[1, 2, 6]], [[2, 3, 7]], [[3, 0, 4]]
    ]
}
*/
/**
 * Add a MultiSurface to the model
 * @param model The model
 * @param geom The CityJSON object to add.
 * @param posis_i The array of positions.
 */
function _addMultiSurface(model: GIModel, geom: any, posis_i: number[]): number[] {
    const pgons_i: number[] = [];
    for (const idxs of geom.boundaries) {
        const pgon_posis_i: number[][] = idxs.map((i_list: number[]) => i_list.map((i: number) => posis_i[i]));
        pgons_i.push(model.modeldata.geom.add.addPgon(pgon_posis_i[0], pgon_posis_i.slice(1)));
    }
    return pgons_i;
}

/*
{
  "type": "Solid",
  "lod": 2,
  "boundaries": [
    [ [[0, 3, 2, 1, 22]], [[4, 5, 6, 7]], [[0, 1, 5, 4]], [[1, 2, 6, 5]] ], //-- exterior shell
    [ [[240, 243, 124]], [[244, 246, 724]], [[34, 414, 45]], [[111, 246, 5]] ] //-- interior shell
  ]
}
*/
/**
 * Add a Solid to the model
 * @param model The model
 * @param geom The CityJSON object to add.
 * @param posis_i The array of positions.
 */
function _addSolid(model: GIModel, geom: any, posis_i: number[]): number[] {
    // create pgons
    const pgons_i: number[] = [];
    for (const shell of geom.boundaries) {
        for (const idxs of shell) {
            const pgon_posis_i: number[][] = idxs.map((i_list: number[]) => i_list.map((i: number) => posis_i[i]));
            pgons_i.push(model.modeldata.geom.add.addPgon(pgon_posis_i[0], pgon_posis_i.slice(1)));
        }
    }
    return pgons_i;
}


/*
{
    "type": "MultiSolid",
    "lod": 2,
    "boundaries": [
      [
        [ [[0, 3, 2, 1]], [[4, 5, 6, 7]], [[0, 1, 5, 4]], [[10, 13, 22, 31]] ]
      ],
      [
        [ [[5, 34, 31, 12]], [[44, 54, 62, 74]], [[10, 111, 445, 222]], [[111, 123, 922, 66]] ]
      ]
    ]
  }
*/

/*
{
   "type": "CompositeSolid",
   "lod": 2,
   "boundaries": [
     [ //-- 1st Solid
       [ [[0, 3, 2, 1, 22]], [[4, 5, 6, 7]], [[0, 1, 5, 4]], [[1, 2, 6, 5]] ]
     ],
     [ //-- 2nd Solid
       [ [[666, 667, 668]], [[74, 75, 76]], [[880, 881, 885]], [[111, 122, 226]] ]
     ]
   ]
  }
*/
/**
 * Add a MultiSolid to the model
 * @param model The model
 * @param geom The CityJSON object to add.
 * @param posis_i The array of positions.
 */
function _addMultiSolid(model: GIModel, geom: any, posis_i: number[]): number[] {
    // create pgons
    const pgons_i: number[] = [];
    for (const solid of geom.boundaries) {
        for (const shell of solid) {
            for (const idxs of shell) {
                const pgon_posis_i: number[][] = idxs.map((i_list: number[]) => i_list.map((i: number) => posis_i[i]));
                pgons_i.push(model.modeldata.geom.add.addPgon(pgon_posis_i[0], pgon_posis_i.slice(1)));
            }
        }
    }
    return pgons_i;
}


/*
"id-1": {
    "type": "Building",
    "attributes": {
      "roofType": "gable roof"
    },
    "geographicalExtent": [ 84710.1, 446846.0, -5.3, 84757.1, 446944.0, 40.9 ],
    "children": ["id-56", "id-832", "mybalcony"]
}
*/
/**
 * Adds attributes to the model
 * @param model The model
 * @param coll_i The entity index.
 * @param geom The cityJSON geometry object.
 */
function _addGeomAttribs(model: GIModel, coll_i: number, geom: any): void {
    model.modeldata.attribs.set.setCreateEntsAttribVal(EEntType.COLL, coll_i, 'type', geom.type);
    model.modeldata.attribs.set.setCreateEntsAttribVal(EEntType.COLL, coll_i, 'lod', geom.lod);
}
/*
{
  "type": "MultiSurface",
  "lod": 2,
  "boundaries": [
    [[0, 3, 2, 1]], [[4, 5, 6, 7]], [[0, 1, 5, 4]], [[0, 2, 3, 8]], [[10, 12, 23, 48]]
  ],
  "semantics": {
    "surfaces" : [
      {
        "type": "WallSurface",
        "slope": 33.4,
        "children": [2]
      },
      {
        "type": "RoofSurface",
        "slope": 66.6
      },
      {
        "type": "Door",
        "parent": 0,
        "colour": "blue"
      }
    ],
    "values": [0, 0, null, 1, 2]
  }
}
*/
/*
{
   "type": "CompositeSolid",
   "lod": 2,
   "boundaries": [
     [ //-- 1st Solid
       [ [[0, 3, 2, 1, 22]], [[4, 5, 6, 7]], [[0, 1, 5, 4]], [[1, 2, 6, 5]] ]
     ],
     [ //-- 2nd Solid
       [ [[666, 667, 668]], [[74, 75, 76]], [[880, 881, 885]], [[111, 122, 226]] ]
     ]
   ],
   "semantics": {
     "surfaces" : [
       {
         "type": "RoofSurface",
       },
       {
         "type": "WallSurface",
       }
     ],
     "values": [
       [ //-- 1st Solid
         [0, 1, 1, null]
       ],
       [ //-- 2nd Solid get all null values
         null
       ]
     ]
   }
 }
*/
/**
 * Adds attributes to the model
 * @param model The model
 * @param ent_type The entity type
 * @param ent_i The entity index.
 * @param geom The cityJSON geometry object.
 */
function _addSemanticAttribs(model: GIModel, ent_type: EEntType, ents_i: number[], geom: any): void {
    if (!geom.hasOwnProperty('semantics')) { return; }
    const surfaces: any = geom.semantics.surfaces;
    let values: any[] = geom.semantics.values;
    if (geom.type === 'CompositeSolid' || geom.type === 'MultiSolid') {
        _expandNullValues(values, geom.boundaries);
        values = values.flat(2);
    } else {
        values = values.flat(1);
    }
    if (ents_i.length !== values.length) {
        console.log('CityJSON import: Error adding sematic attributes to polygons.');
        console.log('Num entities: ', ents_i.length);
        console.log('Num values: ', values.length);
        console.log(ents_i, values);
        return;
    }
    for (let i = 0; i < ents_i.length; i++) {
        if (values[i] === null) { continue; }
        const surface: any = surfaces[values[i]];
        for (const [key, val] of Object.entries(surface)) {
            model.modeldata.attribs.set.setCreateEntsAttribVal(ent_type, ents_i[i], key, val as TAttribDataTypes);
        }
    }
}


/*
{
  "type": "Solid",
  "lod": 2,
  "boundaries": [
    [ [[0, 3, 2, 1]], [[4, 5, 6, 7]], [[0, 1, 5, 4]], [[1, 2, 6, 5]] ]
  ],
  "material": {
    "irradiation": {
      "values": [[0, 0, 1, null]]
    },
    "irradiation-2": {
      "values": [[2, 2, 1, null]]
    }
  }
}
*/
/**
 * Adds material assignments to the polygons in the model
 * @param model The model
 * @param ent_i The entity index.
 * @param geom The cityJSON geometry object.
 * @param mat_names The names of the materials.
 */
function _addMaterialAttribs(model: GIModel, ents_i: number[], geom: any, mat_names: string[]): void {
    if (!mat_names) { return; }
    if (!geom.hasOwnProperty('material')) { return; }
    for (const [theme_key, theme_data] of Object.entries(geom.material)) {
        let values: any[] = theme_data['values'];
        if (geom.type === 'CompositeSolid' || geom.type === 'MultiSolid') {
            _expandNullValues(values, geom.boundaries);
            values = values.flat(2);
        } else {
            values = values.flat(1);
        }
        if (ents_i.length !== values.length) {
            console.log('CityJSON import: Error adding sematic attributes to polygons.');
            console.log('Num entities: ', ents_i.length);
            console.log('Num values: ', values.length);
            console.log(ents_i, values);
            return;
        }
        for (let i = 0; i < ents_i.length; i++) {
            if (values[i] === null) { continue; }
            const mat_name: string = mat_names[values[i]];
            model.modeldata.attribs.set.setCreateEntsAttribVal(
                EEntType.PGON, ents_i[i], 'material', mat_name);
        }
    }
}


/**
 * Adds object attributes to the model
 * @param model The model
 * @param ent_type The entity type
 * @param ent_i The entity index.
 * @param obj The cityJSON object.
 * @param id The key to the CityJSON object.
 */
function _addObjAttribs(model: GIModel, coll_i: number, obj: any, id: String): void {
    model.modeldata.attribs.set.setCreateEntsAttribVal(EEntType.COLL, coll_i, 'id', id);
    model.modeldata.attribs.set.setCreateEntsAttribVal(EEntType.COLL, coll_i, 'type', obj.type);
    if (obj.hasOwnProperty('children')) {
        model.modeldata.attribs.set.setCreateEntsAttribVal(EEntType.COLL, coll_i, 'children', obj.children);
    }
    if (!obj.hasOwnProperty('attributes')) { return; }
    for (const name of Object.keys(obj.attributes)) {
        let value: any = obj.attributes[name];
        if (value === null) {
            continue;
        }
        const value_type: string = typeof obj.attributes[name];
        if (value_type === 'object') {
            value = JSON.stringify(value);
        }
        model.modeldata.attribs.set.setCreateEntsAttribVal(EEntType.COLL, coll_i, name, value);
    }
}

/*
"materials": [
  {
    "name": "roofandground",
    "ambientIntensity":  0.2000,
    "diffuseColor":  [0.9000, 0.1000, 0.7500],
    "emissiveColor": [0.9000, 0.1000, 0.7500],
    "specularColor": [0.9000, 0.1000, 0.7500],
    "shininess": 0.2,
    "transparency": 0.5,
    "isSmooth": false
  },
  {
    "name": "wall",
    "ambientIntensity":  0.4000,
    "diffuseColor":  [0.1000, 0.1000, 0.9000],
    "emissiveColor": [0.1000, 0.1000, 0.9000],
    "specularColor": [0.9000, 0.1000, 0.7500],
    "shininess": 0.0,
    "transparency": 0.5,
    "isSmooth": true
  }
]
*/
/**
 * Adds materials defentitons to the model
 * @param model The model
 * @param appearance The CityJSON appearance object
 */
function _addMaterials(model: GIModel, appearance: any): string[] {
    if (!appearance.materials) { return; }
    const mat_names: string[] = [];
    for (const material of appearance.materials) {
        const mat_obj = {
            'type': 'MeshPhongMaterial',
            'color': 'diffuseColor' in material ? material.diffuseColor : [1, 1, 1],
            'emissive': 'emissiveColor' in material ? material.emissiveColor : [0, 0, 0],
            'specular': 'specularColor' in material ? material.specularColor : [0, 0, 0],
            'shininess': 'shininess' in material ? material.shininess * 100 : 0,
            'opacity': 'transparency' in material ? 1 - material.transparency : 1,
            'transparent': 'transparency' in material ? true : false,
            'side': 2,
            'vertexColors': 0,
        };
        model.modeldata.attribs.set.setModelAttribVal(material.name, mat_obj);
        mat_names.push(material.name);
    }
    return mat_names;
}

/*
   "boundaries": [
     [ //-- 1st Solid
       [ ..., ..., ..., ... ]
     ],
     [ //-- 2nd Solid
       [ ..., ..., ..., ... ]
     ]
   ],
   ....
    "values": [
       [ //-- 1st Solid
         [0, 1, 1, null]
       ],
       [ //-- 2nd Solid get all null values
         null
       ]
    ]
*/
/**
 * 
 * @param arr1 An array of arrays of values, some null
 * @param arr2 An array of arrays
 */
function _expandNullValues(arr1: any[][], arr2: any[][]): void {
    for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr1[i].length; j++) {
            if (arr1[i][j] === null) {
                arr1[i][j] = Array(arr2[i][j].length).fill(null);
            }
        }
    }
}

