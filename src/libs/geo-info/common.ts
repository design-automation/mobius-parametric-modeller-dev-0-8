import { GIAttribMap } from './GIAttribMap';

// Types
export type TRay = [Txyz, Txyz]; // an origin and a direction vector
export type TPlane = [Txyz, Txyz, Txyz]; // an origin, an x vec and a y vec
export type TQuery = string;
export type TId = string;
export type TColor = [number, number, number]; // TODO replace with Txyz
export type TNormal = [number, number, number]; // TODO replace with xyz
export type TTexture = [number, number];


// Types of entities
export enum EEntityTypeStr {
    POSI =   'ps',
    TRI  =   '_t',
    VERT =   '_v',
    EDGE =   '_e',
    WIRE =   '_w',
    FACE =   '_f',
    POINT =  'pt',
    PLINE =  'pl',
    PGON =   'pg',
    COLL =   'co'
}

// Names of attributes
export enum EAttribNames {
    COORDS =  'xyz',
    NORMAL =  'normal',
    COLOR =   'color',
    TEXTURE = 'texture',
    NAME = 'name'
}

/**
 * The types of operators that can be used in a query.
 */
export enum EQueryOperatorTypes {
    IS_EQUAL = '==',
    IS_NOT_EQUAL = '!=',
    IS_GREATER_OR_EQUAL = '>=',
    IS_LESS_OR_EQUAL = '<=',
    IS_GREATER = '>',
    IS_LESS = '<',
    EQUAL = '='
}

/**
 * A query component.
 * Each query can consist of multiple components.
 * Some examples of queries
 * @name == value
 * @name > value
 * @name[2] <= value
 */
export interface IQueryComponent {
    attrib_name: string;
    attrib_index: number;
    attrib_value_str: string;
    operator_type: EQueryOperatorTypes;
}

/**
 * A sort component.
 * Each sort can consist of multiple components.
 * Some examples of queries
 * @name
 * @name[2]
 */
export interface ISortComponent {
    attrib_name: string;
    attrib_index: number;
}

export enum ESort {
    'DESCENDING' = 'descending',
    'ASCENDING' = 'ascending'
}

/**
 * Geom arrays
 */
export interface IGeomArrays {
    num_posis: number;
    dn_verts_posis: TVert[];
    dn_tris_verts: TTri[];
    dn_edges_verts: TEdge[];
    dn_wires_edges: TWire[];
    dn_faces_wirestris: TFace[];
    dn_points_verts: TPoint[];
    dn_plines_wires: TPline[];
    dn_pgons_faces: TPgon[];
    dn_colls_objs: TColl[];
    up_posis_verts: number[][]; // one to many
    up_tris_faces: number[];
    up_verts_edges: number[][]; // one to two
    up_verts_tris: number[][]; // one to many
    up_verts_points: number[];
    up_edges_wires: number[];
    up_wires_faces: number[];
    up_wires_plines: number[];
    up_faces_pgons: number[];
    up_points_colls: number[][]; // one to many
    up_plines_colls: number[][]; // one to many
    up_pgons_colls: number[][]; // one to many
}
export enum EEntStrToGeomArray {
    _v = 'dn_verts_posis',
    _t = 'dn_tris_verts',
    _e = 'dn_edges_verts',
    _w = 'dn_wires_edges',
    _f = 'dn_faces_wirestris',
    pt = 'dn_points_verts',
    pl = 'dn_plines_wires',
    pg = 'dn_pgons_faces',
    co = 'dn_colls_objs'
}

/**
 * Attribute maps
 */
export interface IAttribsMaps {
    posis: Map<string, GIAttribMap>;
    verts: Map<string, GIAttribMap>;
    edges: Map<string, GIAttribMap>;
    wires: Map<string, GIAttribMap>;
    faces: Map<string, GIAttribMap>;
    points: Map<string, GIAttribMap>;
    plines: Map<string, GIAttribMap>;
    pgons: Map<string, GIAttribMap>;
    colls: Map<string, GIAttribMap>;
}
// export interface IGIAttribMap {
//     // TODO
// }
export enum EEntStrToAttribMap {
    ps = 'posis',
    _v = 'verts',
    _e = 'edges',
    _w = 'wires',
    _f = 'faces',
    pt = 'points',
    pl = 'plines',
    pg = 'pgons',
    co = 'colls'
}

// copy geometry
export interface IGeomCopy {
    points: number[];
    plines: number[];
    pgons: number[];
    colls: number[];
}
// ================================================================================================
// JSON DATA
// ================================================================================================

// enums
export enum EAttribDataTypeStrs {
    // INT = 'Int',
    FLOAT = 'Float',
    STRING = 'String'
}

// types
export type Txyz = [number, number, number]; // in use
export type TPosi = number;
export type TTri = [number, number, number]; // [position, position, position]
export type TVert = number; // positions
export type TEdge = [number, number]; // [vertex, vertex]
export type TWire = number[]; // [edge, edge,....]
export type TFace = [number[], number[]]; // [[wire, ....], [triangle, ...]]
export type TPoint = number; // [vertex,....]
export type TPline = number; // [wire,....]
export type TPgon = number; // [face,....]
export type TColl = [number, number[], number[], number[]]; // [parent, [point, ...], [polyline, ...], [polygon, ....]]
export type TEntity = TTri | TVert | TEdge | TWire | TFace | TPoint | TPline | TPgon | TColl;
export type TAttribDataTypes = string | string[] | number | number[];
export type TAttribValuesArr = Array<[number[], TAttribDataTypes]>;
// interfaces for JSON data

export interface IGeomData {
    num_positions: number;
    triangles: TTri[];
    vertices: TVert[];
    edges: TEdge[];
    wires: TWire[];
    faces: TFace[];
    points: TPoint[];
    polylines: TPline[];
    polygons: TPgon[];
    collections: TColl[];
}
export interface IAttribData {
    name: string;
    data_type: EAttribDataTypeStrs;
    data_size: number;
    data: TAttribValuesArr;
}
export interface IAttribsData {
    positions: IAttribData[];
    vertices: IAttribData[];
    edges: IAttribData[];
    wires: IAttribData[];
    faces: IAttribData[];
    points: IAttribData[];
    polylines: IAttribData[];
    polygons: IAttribData[];
    collections: IAttribData[];
}
export interface IModelData {
    geometry: IGeomData;
    attributes: IAttribsData;
}
