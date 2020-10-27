
import {  EEntType, IGeomMaps, EEntStrToGeomMaps, TWire, Txyz, TEntTypeIdx,
    TFace, EWireType, TEdge, IEntSets, EAttribNames } from '../common';
import { isPosi, isPoint, isPline, isPgon, isColl } from '../id';
import { vecFromTo, vecCross, vecDiv, vecNorm, vecLen, vecDot } from '../../geom/vectors';
import * as Mathjs from 'mathjs';
import { GIModelData } from '../GIModelData';
/**
 * Class for geometry.
 */
export class GIGeomQuery {
    private modeldata: GIModelData;
    private _geom_maps: IGeomMaps;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData, geom_maps: IGeomMaps) {
        this.modeldata = modeldata;
        this._geom_maps = geom_maps;
    }
    // ============================================================================
    // Entities
    // ============================================================================
    /**
     * Returns a list of indices for ents.
     * @param ent_type
     */
    public getEnts(ent_type: EEntType): number[] {
        const geom_map_key: string = EEntStrToGeomMaps[ent_type];
        // collections
        if (ent_type === EEntType.COLL) { return Array.from(this._geom_maps[geom_map_key]); }
        // get ents indices array from down arrays
        const geom_map: Map<number, any> = this._geom_maps[geom_map_key];
        return Array.from(geom_map.keys());
    }
    /**
     * Returns the number of entities
     */
    public numEnts(ent_type: EEntType): number {
        const geom_array_key: string = EEntStrToGeomMaps[ent_type];
        return this._geom_maps[geom_array_key].size;
    }
    /**
     * Returns the number of entities for [posis, point, polylines, polygons, collections].
     */
    public numEntsAll(): number[] {
        return [
            this.numEnts(EEntType.POSI),
            this.numEnts(EEntType.POINT),
            this.numEnts(EEntType.PLINE),
            this.numEnts(EEntType.PGON),
            this.numEnts(EEntType.COLL)
        ];
    }
    /**
     * Check if an entity exists
     * @param ent_type
     * @param index
     */
    public entExists(ent_type: EEntType, index: number): boolean {
        const geom_maps_key: string = EEntStrToGeomMaps[ent_type];
        return this._geom_maps[geom_maps_key].has(index);
    }
    /**
     *
     * @param ents
     */
    public getEntsTree(ents: TEntTypeIdx[]): TEntTypeIdx[] {
        const ent_sets: IEntSets = this.getEntSetsTree(ents);
        const ents_tree: TEntTypeIdx[] = [];
        ent_sets.ps.forEach( posi_i => ents_tree.push([EEntType.POSI, posi_i]) );
        ent_sets.obj_ps.forEach( posi_i => ents_tree.push([EEntType.POSI, posi_i]) );
        ent_sets.pt.forEach( point_i => ents_tree.push([EEntType.POINT, point_i]) );
        ent_sets.pl.forEach( pline_i => ents_tree.push([EEntType.PLINE, pline_i]) );
        ent_sets.pg.forEach( pgon_i => ents_tree.push([EEntType.PGON, pgon_i]) );
        ent_sets.co.forEach( coll_i => ents_tree.push([EEntType.COLL, coll_i]) );
        return ents_tree;
    }
    /**
     * Returns sets of unique entity indexes, given an array of TEntTypeIdx.
     * ~
     * Object positions are added to the geompack.
     * ~
     * Collections contents is added to teh geompack, including nested collections..
     * ~
     * If invert=true, then the geompack will include the opposite set of entities.
     * ~
     * Used for deleting all entities and for adding global function entities to a snapshot.
     */
    public getEntSetsTree(ents: TEntTypeIdx[], incl_topo = false, incl_tris = false): IEntSets {
        const ent_sets: IEntSets = {
            ps: new Set(),
            obj_ps: new Set(),
            pt: new Set(),
            pl: new Set(),
            pg: new Set(),
            co: new Set()
        };
        // process all the ents, but not posis of the ents, we will do that at the end
        for (const ent_arr of ents) {
            const [ent_type, ent_i]: TEntTypeIdx = ent_arr as TEntTypeIdx;
            if (isColl(ent_type)) {
                // get the descendants of this collection
                const coll_and_desc_i: number[] = this.modeldata.attribs.colls.getCollDescendents(ent_i);
                coll_and_desc_i.splice(0, 0, ent_i);
                // get all the objs
                for (const one_coll_i of coll_and_desc_i) {
                    for (const point_i of this.modeldata.attribs.colls.getCollPoints(one_coll_i)) {
                        ent_sets.pt.add(point_i);
                    }
                    for (const pline_i of this.modeldata.attribs.colls.getCollPlines(one_coll_i)) {
                        ent_sets.pl.add(pline_i);
                    }
                    for (const pgon_i of this.modeldata.attribs.colls.getCollPgons(one_coll_i)) {
                        ent_sets.pg.add(pgon_i);
                    }
                    ent_sets.co.add(one_coll_i);
                }
            } else if (isPgon(ent_type)) {
                ent_sets.pg.add(ent_i);
            } else if (isPline(ent_type)) {
                ent_sets.pl.add(ent_i);
            } else if (isPoint(ent_type)) {
                ent_sets.pt.add(ent_i);
            } else if (isPosi(ent_type)) {
                ent_sets.ps.add(ent_i);
            }
        }
        // now get all the posis of the objs and add them to the list
        // also add topo if incl_topo is true
        if (incl_topo) {
            ent_sets._v = new Set();
            ent_sets._e = new Set();
            ent_sets._w = new Set();
            ent_sets._f = new Set();
            if (incl_tris) {
                ent_sets._t = new Set();
            }
        }
        ent_sets.pt.forEach( point_i => {
            const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.POINT, point_i);
            posis_i.forEach( posi_i => {
                if ( !ent_sets.ps.has(posi_i) ) { ent_sets.obj_ps.add(posi_i); }
            });
            if (incl_topo) {
                ent_sets._v.add(this.modeldata.geom.nav.navPointToVert(point_i) );
            }
        });
        ent_sets.pl.forEach( pline_i => {
            const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.PLINE, pline_i);
            posis_i.forEach( posi_i => {
                if ( !ent_sets.ps.has(posi_i) ) { ent_sets.obj_ps.add(posi_i); }
            });
            if (incl_topo) {
                const wire_i: number = this.modeldata.geom.nav.navPlineToWire(pline_i);
                const edges_i: number[] = this.modeldata.geom.nav.navWireToEdge(wire_i);
                const verts_i: number[] = this.modeldata.geom.query.getWireVerts(wire_i);
                ent_sets._w.add(wire_i);
                edges_i.forEach( edge_i => ent_sets._e.add(edge_i) );
                verts_i.forEach( vert_i => ent_sets._v.add(vert_i) );
            }
        });
        ent_sets.pg.forEach( pgon_i => {
            const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(EEntType.PGON, pgon_i);
            posis_i.forEach( posi_i => {
                if ( !ent_sets.ps.has(posi_i) ) { ent_sets.obj_ps.add(posi_i); }
            });
            if (incl_topo) {
                const face_i: number = this.modeldata.geom.nav.navPgonToFace(pgon_i);
                ent_sets._f.add(face_i);
                if (incl_tris) {
                    const tris_i: number[] = this.modeldata.geom.nav.navFaceToTri(face_i);
                    tris_i.forEach( tri_i => ent_sets._t.add(tri_i) );
                }
                const wires_i: number[] = this.modeldata.geom.nav.navFaceToWire(face_i);
                wires_i.forEach( wire_i => {
                    ent_sets._w.add(wire_i);
                    const edges_i: number[] = this.modeldata.geom.nav.navWireToEdge(wire_i);
                    const verts_i: number[] = this.modeldata.geom.query.getWireVerts(wire_i);
                    edges_i.forEach( edge_i => ent_sets._e.add(edge_i) );
                    verts_i.forEach( vert_i => ent_sets._v.add(vert_i) );
                });
            }
        });
        // return the result
        return ent_sets;
    }
    /**
     * Fill a map of sets of unique indexes
     */
    public getEntSets(ents: TEntTypeIdx[], ent_types: number[]): Map<number, Set<number>> {
        const set_ent_types: Set<number> = new Set(ent_types);
        const map: Map<number, Set<number>> = new Map();
        ent_types.forEach( ent_type => map.set(ent_type, new Set()) );
        for (const [ent_type, ent_i] of ents) {
            if (set_ent_types.has(EEntType.COLL)) {
                this.modeldata.geom.nav.navAnyToColl(ent_type, ent_i).forEach( coll_i => map.get(EEntType.COLL).add(coll_i) );
            }
            if (set_ent_types.has(EEntType.PGON)) {
                this.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i).forEach( pgon_i => map.get(EEntType.PGON).add(pgon_i) );
            }
            if (set_ent_types.has(EEntType.PLINE)) {
                this.modeldata.geom.nav.navAnyToPline(ent_type, ent_i).forEach( pline_i => map.get(EEntType.PLINE).add(pline_i) );
            }
            if (set_ent_types.has(EEntType.POINT)) {
                this.modeldata.geom.nav.navAnyToPoint(ent_type, ent_i).forEach( point_i => map.get(EEntType.POINT).add(point_i) );
            }
            if (set_ent_types.has(EEntType.FACE)) {
                this.modeldata.geom.nav.navAnyToFace(ent_type, ent_i).forEach( face_i => map.get(EEntType.FACE).add(face_i) );
            }
            if (set_ent_types.has(EEntType.WIRE)) {
                this.modeldata.geom.nav.navAnyToWire(ent_type, ent_i).forEach( wire_i => map.get(EEntType.WIRE).add(wire_i) );
            }
            if (set_ent_types.has(EEntType.EDGE)) {
                this.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i).forEach( edge_i => map.get(EEntType.EDGE).add(edge_i) );
            }
            if (set_ent_types.has(EEntType.VERT)) {
                this.modeldata.geom.nav.navAnyToVert(ent_type, ent_i).forEach( vert_i => map.get(EEntType.VERT).add(vert_i) );
            }
            if (set_ent_types.has(EEntType.POSI)) {
                this.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i).forEach( posi_i => map.get(EEntType.POSI).add(posi_i) );
            }
        }
        return map;
    }
    // ============================================================================
    // Posis
    // ============================================================================
    /**
     * Returns a list of indices for all posis that have no verts
     */
    public getUnusedPosis(): number[] {
        const posis_i: number[] = [];
        this._geom_maps.up_posis_verts.forEach( (posi, posi_i) => {
            if (posi.length === 0) { posis_i.push(posi_i); }
        });
        return posis_i;
    }
    // ============================================================================
    // Verts
    // ============================================================================
    /**
     * Get two edges that are adjacent to this vertex that are both not zero length.
     * In some cases wires and polygons have edges that are zero length.
     * This causes problems for calculating normals etc.
     * The return value can be either one edge (in open polyline [null, edge_i], [edge_i, null])
     * or two edges (in all other cases) [edge_i, edge_i].
     * If the vert has no non-zero edges, then [null, null] is returned.
     * @param vert_i
     */
    public getVertNonZeroEdges(vert_i: number): number[] {
        // get the wire start and end verts
        const edges_i: number[] = this._geom_maps.up_verts_edges.get(vert_i);
        const posi_coords: Txyz[] = [];
        // get the first edge
        let edge0 = null;
        if (edges_i[0] !== null || edges_i[0] !== undefined) {
            let prev_edge_i: number = edges_i[0];
            while (edge0 === null) {
                if (prev_edge_i === edges_i[1]) { break; }
                const edge_verts_i: number[] = this._geom_maps.dn_edges_verts.get(prev_edge_i);
                // first
                const posi0_i: number =  this._geom_maps.dn_verts_posis.get(edge_verts_i[0]);
                if ( posi_coords[posi0_i] === undefined) {
                    posi_coords[posi0_i] = this.modeldata.attribs.posis.getPosiCoords(posi0_i);
                }
                const xyz0: Txyz = posi_coords[posi0_i];
                // second
                const posi1_i: number =  this._geom_maps.dn_verts_posis.get(edge_verts_i[1]);
                if ( posi_coords[posi1_i] === undefined) {
                    posi_coords[posi1_i] = this.modeldata.attribs.posis.getPosiCoords(posi1_i);
                }
                const xyz1: Txyz = posi_coords[posi1_i];
                // check
                if (Math.abs(xyz0[0] - xyz1[0]) > 0 || Math.abs(xyz0[1] - xyz1[1]) > 0 || Math.abs(xyz0[2] - xyz1[2]) > 0) {
                    edge0 = prev_edge_i;
                } else {
                    prev_edge_i = this._geom_maps.up_verts_edges.get(edge_verts_i[0])[0];
                    if (prev_edge_i === null || prev_edge_i === undefined) { break; }
                }
            }
        }
        // get the second edge
        let edge1 = null;
        if (edges_i[1] !== null || edges_i[1] !== undefined) {
            let next_edge_i: number = edges_i[1];
            while (edge1 === null) {
                if (next_edge_i === edges_i[0]) { break; }
                const edge_verts_i: number[] = this._geom_maps.dn_edges_verts.get(next_edge_i);
                // first
                const posi0_i: number =  this._geom_maps.dn_verts_posis.get(edge_verts_i[0]);
                if ( posi_coords[posi0_i] === undefined) {
                    posi_coords[posi0_i] = this.modeldata.attribs.posis.getPosiCoords(posi0_i);
                }
                const xyz0: Txyz = posi_coords[posi0_i];
                // second
                const posi1_i: number =  this._geom_maps.dn_verts_posis.get(edge_verts_i[1]);
                if ( posi_coords[posi1_i] === undefined) {
                    posi_coords[posi1_i] = this.modeldata.attribs.posis.getPosiCoords(posi1_i);
                }
                const xyz1: Txyz = posi_coords[posi1_i];
                // check
                if (Math.abs(xyz0[0] - xyz1[0]) > 0 || Math.abs(xyz0[1] - xyz1[1]) > 0 || Math.abs(xyz0[2] - xyz1[2]) > 0) {
                    edge1 = next_edge_i;
                } else {
                    next_edge_i = this._geom_maps.up_verts_edges.get(edge_verts_i[1])[1];
                    if (next_edge_i === null || next_edge_i === undefined) { break; }
                }
            }
        }
        // return the two edges, they can be null
        return [edge0, edge1];
    }
    // ============================================================================
    // Edges
    // ============================================================================
    /**
     * Get the next edge in a sequence of edges
     * @param edge_i
     */
    public getNextEdge(edge_i: number): number {
        // get the wire start and end verts
        const edge: TEdge = this._geom_maps.dn_edges_verts.get(edge_i);
        const edges_i: number[] = this._geom_maps.up_verts_edges.get(edge[1]);
        if (edges_i.length === 1) { return null; }
        return edges_i[1];
    }
    /**
     * Get the previous edge in a sequence of edges
     * @param edge_i
     */
    public getPrevEdge(edge_i: number): number {
        // get the wire start and end verts
        const edge: TEdge = this._geom_maps.dn_edges_verts.get(edge_i);
        const edges_i: number[] = this._geom_maps.up_verts_edges.get(edge[0]);
        if (edges_i.length === 1) { return null; }
        return edges_i[1];
    }
    /**
     * Get a list of edges that are neighbours ()
     * The list will include the input edge.
     * @param edge_i
     */
    public getNeighborEdges(edge_i: number): number[] {
        // get the wire start and end verts
        const edge: TEdge = this._geom_maps.dn_edges_verts.get(edge_i);
        const start_posi_i: number = this._geom_maps.dn_verts_posis.get(edge[0]);
        const end_posi_i: number = this._geom_maps.dn_verts_posis.get(edge[1]);
        const start_edges_i: number[] = this.modeldata.geom.nav.navAnyToEdge(EEntType.POSI, start_posi_i);
        const end_edges_i: number[] = this.modeldata.geom.nav.navAnyToEdge(EEntType.POSI, end_posi_i);
        return Mathjs.setIntersect(start_edges_i, end_edges_i);
    }
    // ============================================================================
    // Wires
    // ============================================================================
    /**
     * Check if a wire is closed.
     * @param wire_i
     */
    public isWireClosed(wire_i: number): boolean {
        // get the wire start and end verts
        const wire: TWire = this._geom_maps.dn_wires_edges.get(wire_i);
        const num_edges: number = wire.length;
        const start_edge_i: number = wire[0];
        const end_edge_i: number = wire[num_edges - 1];
        const start_vert_i: number = this.modeldata.geom.nav.navEdgeToVert(start_edge_i)[0];
        const end_vert_i: number = this.modeldata.geom.nav.navEdgeToVert(end_edge_i)[1];
        // if start and end verts are the same, then wire is closed
        return (start_vert_i === end_vert_i);
    }
    /**
     * Check if a wire belongs to a pline, a pgon or a pgon hole.
     */
    public getWireType(wire_i: number): EWireType {
        // get the wire start and end verts
        const wire: TWire = this._geom_maps.dn_wires_edges.get(wire_i);
        if (this.modeldata.geom.nav.navWireToPline(wire_i) !== undefined) {
            return EWireType.PLINE;
        }
        const face_i: number = this.modeldata.geom.nav.navWireToFace(wire_i);
        const face: TFace = this._geom_maps.dn_faces_wires.get(face_i); // nav.getFace(face_i);
        const index: number = face.indexOf(wire_i);
        if (index === 0) { return EWireType.PGON; }
        if (index > 0) { return EWireType.PGON_HOLE; }
        throw new Error('Inconsistencies found in the internal data structure.');
    }
    /**
     * Returns the vertices.
     * For a closed wire, #vertices = #edges
     * For an open wire, #vertices = #edges + 1
     * @param wire_i
     */
    public getWireVerts(wire_i: number): number[] {
        const edges_i: number[] = this._geom_maps.dn_wires_edges.get(wire_i);
        const verts_i: number[] = [];
        // walk the edges chain
        let next_edge_i: number = edges_i[0];
        for (let i = 0; i < edges_i.length; i++) {
            const edge_verts_i: number[] = this._geom_maps.dn_edges_verts.get(next_edge_i);
            verts_i.push(edge_verts_i[0]);
            next_edge_i = this.getNextEdge(next_edge_i);
            // are we at the end of the chain
            if (next_edge_i === null) { // open wire
                verts_i.push(edge_verts_i[1]);
                break;
            } else if (next_edge_i === edges_i[0]) { // closed wire
                break;
            }
        }
        return verts_i;
    }
    // ============================================================================
    // Objects
    // ============================================================================
    // /**
    //  * Returns three arrays of pairs of maps, for points, plines, and pgons.
    //  * This is used for creating a timeline, and is based on an attribute called "visible"
    //  * on collections.
    //  * The visible attribute is an array of strings, where each string is a time-stamp label.
    //  * ~
    //  * For the first map in each pair, keys are the group names, and values are a set of entitie IDs.
    //  * For the second map in each pair, keys are the time-stamp names, and values are a set of group names.
    //  * @return Array of arrays of maps.
    //  */
    // public getObjVisGroups(): [ {}, Map<string, Set<string>> ] {
    //     if (!this.modeldata.attribs.query.hasAttrib(EEntType.COLL, 'visible')) {
    //         return null;
    //     }
    //     // return the result
    //     const colls_i: number[] = this.getEnts(EEntType.COLL);

    //     const full_obj_grp = {'default': []};
    //     const full_lbl_grp = new Map<string, Set<string>>();
    //     const grps = [  this._getObjVisGroups(colls_i, EEntType.POINT),
    //                     this._getObjVisGroups(colls_i, EEntType.EDGE),
    //                     this._getObjVisGroups(colls_i, EEntType.TRI)];
    //     for (let i = 0; i < grps.length; i ++) {
    //         const grp = grps[i];
    //         console.log(grp)
    //         full_obj_grp['default'][i] = grp[0].get('default');
    //         grp[1].forEach((val, key) => {
    //             let lbl_grp = full_lbl_grp.get(key);
    //             if (!lbl_grp) { lbl_grp = new Set<string>(); }
    //             for (const v of val) {
    //                 lbl_grp.add(v);
    //                 if (!full_obj_grp[v]) {
    //                     full_obj_grp[v] = [null, null, null];
    //                 }
    //                 full_obj_grp[v][i] = grp[0].get(v);
    //             }
    //             full_lbl_grp.set(key, lbl_grp);
    //         });
    //     }
    //     return [full_obj_grp, full_lbl_grp];
    // }
    // private _getObjVisGroups(colls_i: number[], ent_type: EEntType): [Map<string, Set<number>>, Map<string, Set<string>>] {
    //     // get objects
    //     const objs_i: number[] = this.getEnts(ent_type);
    //     // create overlapping groups of objects
    //     // keys are for example "2020", "2021" etc
    //     // objects can be in more than one group
    //     const obj_groups: Map<string, Set<number>> = new Map();
    //     for (const coll_i of colls_i) {
    //         const visibility: string[] = this.modeldata.attribs.get.getAttribVal(EEntType.COLL, 'visible', coll_i) as string[];
    //         if (visibility !== undefined) {
    //             // points
    //             const coll_objs_i: number[] = this.modeldata.geom.nav.navAnyToAny(EEntType.COLL, ent_type, coll_i);
    //             if (coll_objs_i.length > 0) {
    //                 for (const label of visibility) {
    //                     if (!obj_groups.has(label)) { obj_groups.set(label, new Set()); }
    //                 }
    //                 for (const i of coll_objs_i) {
    //                     for (const label of visibility) { obj_groups.get(label).add(i); }
    //                 }
    //             }
    //         }
    //     }
    //     // create non-overlapping groups of objects
    //     // keys are for example "2020_2021", "2022_2023_2024" etc
    //     // objects will only be in one group
    //     const obj_groups2: Map<string, Set<number>> = new Map();
    //     const obj_labels2: Map<string, Set<string>> = new Map();
    //     obj_groups2.set('default', new Set());
    //     for (const i of objs_i) {
    //         const labels: string[] = [];
    //         obj_groups.forEach( (group, label) => {
    //             if (group.has(i)) { labels.push(label); }
    //         });
    //         if (labels.length > 0) {
    //             const label2 = labels.sort().join('_');
    //             if (!obj_groups2.has(label2)) { obj_groups2.set(label2, new Set()); }
    //             obj_groups2.get(label2).add(i);
    //             for (const label of labels) {
    //                 if (!obj_labels2.has(label)) { obj_labels2.set(label, new Set()); }
    //                 obj_labels2.get(label).add(label2);
    //             }
    //         } else {
    //             obj_groups2.get('default').add(i);
    //         }
    //     }
    //     // return the result
    //     return [obj_groups2, obj_labels2];
    // }
    // ============================================================================
    // Collections
    // ============================================================================
    // /**
    //  * Get the parent of a collection.
    //  * @param coll_i
    //  */
    // public getCollParent(coll_i: number): number {
    //     return this._geom_maps.up_colls_colls.get(coll_i);
    // }
    // /**
    //  * Get the children collections of a collection.
    //  * @param coll_i
    //  */
    // public getCollChildren(coll_i: number): number[] {
    //     const children: number[] = [];
    //     this._geom_maps.up_colls_colls.forEach( (coll2_parent, coll2_i) => {
    //         if (coll2_parent === coll_i) {
    //             children.push(coll2_i);
    //         }
    //     });
    //     return children;
    // }
    // /**
    //  * Get the ancestor collections of a collection.
    //  * @param coll_i
    //  */
    // public getCollAncestors(coll_i: number): number[] {
    //     const ancestor_colls_i: number[] = [];
    //     let parent_coll_i: number = this._geom_maps.up_colls_colls.get(coll_i);
    //     while (parent_coll_i !== -1) {
    //         ancestor_colls_i.push(parent_coll_i);
    //         parent_coll_i = this._geom_maps.up_colls_colls.get(parent_coll_i);
    //     }
    //     return ancestor_colls_i;
    // }
    // /**
    //  * Get the descendent collections of a collection.
    //  * @param coll_i
    //  */
    // public getCollDescendents(coll_i: number): number[] {
    //     const descendent_colls_i: number[] = [];
    //     this._geom_maps.up_colls_colls.forEach( (coll2_parent, coll2_i) => {
    //         if (coll2_parent !== -1 && coll2_i !== coll_i) {
    //             if (this.isCollDescendent(coll2_i, coll_i)) {
    //                 descendent_colls_i.push(coll2_i);
    //             }
    //         }
    //     });
    //     return descendent_colls_i;
    // }
    // /**
    //  * Returns true if the first coll is a descendent of the second coll.
    //  * @param coll_i
    //  */
    // public isCollDescendent(coll1_i: number, coll2_i: number): boolean {
    //     let parent_coll_i: number = this._geom_maps.up_colls_colls.get(coll1_i);
    //     while (parent_coll_i !== -1) {
    //         if (parent_coll_i === coll2_i) { return true; }
    //         parent_coll_i = this._geom_maps.up_colls_colls.get(parent_coll_i);
    //     }
    //     return false;
    // }
    // /**
    //  * Returns true if the first coll is an ancestor of the second coll.
    //  * @param coll_i
    //  */
    // public isCollAncestor(coll1_i: number, coll2_i: number): boolean {
    //     let parent_coll_i: number = this._geom_maps.up_colls_colls.get(coll2_i);
    //     while (parent_coll_i !== -1) {
    //         if (parent_coll_i === coll1_i) { return true; }
    //         parent_coll_i = this._geom_maps.up_colls_colls.get(parent_coll_i);
    //     }
    //     return false;
    // }
    // ============================================================================
    // Faces
    // ============================================================================
    /**
     *
     * @param face_i
     */
    public getFaceBoundary(face_i: number): number {
        return this._geom_maps.dn_faces_wires.get(face_i)[0];
    }
    /**
     *
     * @param face_i
     */
    public getFaceHoles(face_i: number): number[] {
        return this._geom_maps.dn_faces_wires.get(face_i).slice(1);
    }
    /**
     *
     * @param face_i
     */
    public getFaceNormal(ssid: number, face_i: number): Txyz {
        const normal: Txyz = [0, 0, 0];
        const tris_i: number[] = this.modeldata.geom._geom_maps.dn_faces_tris.get(face_i);
        let count = 0;
        for (const tri_i of tris_i) {
            const posis_i: number[] = this._geom_maps.dn_tris_verts.get(tri_i).map(vert_i => this._geom_maps.dn_verts_posis.get(vert_i));
            const xyzs: Txyz[] = posis_i.map(posi_i => this.modeldata.attribs.attribs_maps.get(ssid).ps.get(EAttribNames.COORDS).getEntVal(posi_i) as Txyz);
            const vec_a: Txyz = vecFromTo(xyzs[0], xyzs[1]);
            const vec_b: Txyz = vecFromTo(xyzs[0], xyzs[2]); // CCW
            const tri_normal: Txyz = vecCross(vec_a, vec_b, true);
            if (!(tri_normal[0] === 0 && tri_normal[1] === 0 && tri_normal[2] === 0)) {
                count += 1;
                normal[0] += tri_normal[0];
                normal[1] += tri_normal[1];
                normal[2] += tri_normal[2];
            }
        }
        if (count === 0) { return [0, 0, 0]; }
        return vecDiv(normal, count);
    }
    public getFaceNormalActive(face_i: number): Txyz {
        return this.getFaceNormal(this.modeldata.active_ssid, face_i);
    }
    // ============================================================================
    // Calculate
    // ============================================================================
    /**
     *
     * @param ent_i
     */
    public getCentroid(ent_type: EEntType, ent_i: number): Txyz {
        const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
        const centroid: Txyz = [0, 0, 0];
        for (const posi_i of posis_i) {
            const xyz: Txyz = this.modeldata.attribs.posis.getPosiCoords(posi_i);
            centroid[0] += xyz[0];
            centroid[1] += xyz[1];
            centroid[2] += xyz[2];
        }
        return vecDiv(centroid, posis_i.length);
    }
    /**
     * Gets a normal from a wire.
     *
     * It triangulates the wire and then adds up all the normals of all the triangles.
     * Each edge has equal weight, irrespective of length.
     *
     * In some cases, the triangles may cancel each other out.
     * In such a case, it will choose the side' where the wire edges are the longest.
     *
     * @param wire_i
     */
    public getWireNormal(wire_i: number): Txyz {
        const edges_i: number[] = this.modeldata.geom._geom_maps.dn_wires_edges.get(wire_i);
        // deal with special case, just a single edge
        if (edges_i.length === 1) {
            const posis_i: number[] = this._geom_maps.dn_edges_verts.get(edges_i[0]).map(
                vert_i => this._geom_maps.dn_verts_posis.get(vert_i));
            const xyz0: Txyz = this.modeldata.attribs.posis.getPosiCoords(posis_i[0]);
            const xyz1: Txyz = this.modeldata.attribs.posis.getPosiCoords(posis_i[1]);
            if (xyz0[2] === xyz1[2]) { return [0, 0, 1]; }
            if (xyz0[1] === xyz1[1]) { return [0, 1, 0]; }
            if (xyz0[0] === xyz1[0]) { return [1, 0, 0]; }
            return vecNorm(vecCross(vecFromTo(xyz0, xyz1), [0, 0, 1]));
        }
        // proceed with multiple edges
        const centroid: Txyz = this.getCentroid(EEntType.WIRE, wire_i);
        const normal: Txyz = [0, 0, 0];
        const tri_normals: Txyz[] = [];
        // let count = 0;
        for (const edge_i of edges_i) {
            const posis_i: number[] = this._geom_maps.dn_edges_verts.get(edge_i).map(
                vert_i => this._geom_maps.dn_verts_posis.get(vert_i));
            const xyzs: Txyz[] = posis_i.map(posi_i => this.modeldata.attribs.posis.getPosiCoords(posi_i));
            const vec_a: Txyz = vecFromTo(centroid, xyzs[0]);
            const vec_b: Txyz = vecFromTo(centroid, xyzs[1]); // CCW
            const tri_normal: Txyz = vecCross(vec_a, vec_b, true);
            tri_normals.push(tri_normal);
            normal[0] += tri_normal[0];
            normal[1] += tri_normal[1];
            normal[2] += tri_normal[2];
        }
        // if we have a non-zero normal, then return it
        if (Math.abs(normal[0]) > 1e-6 || Math.abs(normal[1]) > 1e-6 || Math.abs(normal[2]) > 1e-6) {
            return vecNorm(normal);
        }
        // check for special case of a symmetrical shape where all triangle normals are
        // cancelling each other out, we need to look at both 'sides', see which is bigger
        const normal_a: Txyz = [0, 0, 0];
        const normal_b: Txyz = [0, 0, 0];
        let len_a = 0;
        let len_b = 0;
        let first_normal_a = null;
        for (const edge_i of edges_i) {
            const posis_i: number[] = this._geom_maps.dn_edges_verts.get(edge_i).map(
                vert_i => this._geom_maps.dn_verts_posis.get(vert_i));
            const xyzs: Txyz[] = posis_i.map(posi_i => this.modeldata.attribs.posis.getPosiCoords(posi_i));
            const vec_a: Txyz = vecFromTo(centroid, xyzs[0]);
            const vec_b: Txyz = vecFromTo(centroid, xyzs[1]); // CCW
            const tri_normal: Txyz = vecCross(vec_a, vec_b, true);
            if (!(tri_normal[0] === 0 && tri_normal[1] === 0 && tri_normal[2] === 0)) {
                if (first_normal_a === null) {
                    first_normal_a = tri_normal;
                    normal_a[0] = tri_normal[0];
                    normal_a[1] = tri_normal[1];
                    normal_a[2] = tri_normal[2];
                    len_a += vecLen(vecFromTo(xyzs[0], xyzs[1]));
                } else {
                    if (vecDot(first_normal_a, tri_normal) > 0) {
                        normal_a[0] += tri_normal[0];
                        normal_a[1] += tri_normal[1];
                        normal_a[2] += tri_normal[2];
                        len_a += vecLen(vecFromTo(xyzs[0], xyzs[1]));
                    } else {
                        normal_b[0] += tri_normal[0];
                        normal_b[1] += tri_normal[1];
                        normal_b[2] += tri_normal[2];
                        len_b += vecLen(vecFromTo(xyzs[0], xyzs[1]));
                    }
                }
            }
        }
        // return the normal for the longest set of edges in the wire
        // if they are the same length, return the normal associated with the start of the wire
        if (len_a >= len_b) {
            return vecNorm(normal_a);
        }
        return vecNorm(normal_b);
    }
    // ============================================================================
    // Other methods
    // ============================================================================
    /**
     * Given a set of vertices, get the welded neighbour entities.
     * @param ent_type
     * @param verts_i
     */
    public neighbor(ent_type: EEntType, verts_i: number[]): number[] {
        const neighbour_ents_i: Set<number> = new Set();
        for (const vert_i of verts_i) {
            const posi_i: number = this.modeldata.geom.nav.navVertToPosi(vert_i);
            const found_verts_i: number[] = this.modeldata.geom.nav.navPosiToVert(posi_i);
            for (const found_vert_i of found_verts_i) {
                if (verts_i.indexOf(found_vert_i) === -1) {
                    const found_ents_i: number[] = this.modeldata.geom.nav.navAnyToAny(EEntType.VERT, ent_type, found_vert_i);
                    found_ents_i.forEach( found_ent_i => neighbour_ents_i.add(found_ent_i) );
                }
            }
        }
        return Array.from(neighbour_ents_i);
    }
    /**
     * Given a set of edges, get the perimeter entities.
     * @param ent_type
     * @param edges_i
     */
    public perimeter(ent_type: EEntType, edges_i: number[]): number[] {
        const edge_posis_map: Map<number, number[]> = new Map();
        const edge_to_posi_pairs_map: Map<number, [number, number]> = new Map();
        for (const edge_i of edges_i) {
            const posi_pair_i: [number, number] = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i) as [number, number];
            if (!edge_posis_map.has(posi_pair_i[0])) {
                edge_posis_map.set(posi_pair_i[0], []);
            }
            edge_posis_map.get(posi_pair_i[0]).push(posi_pair_i[1]);
            edge_to_posi_pairs_map.set(edge_i, posi_pair_i );
        }
        const perimeter_ents_i: Set<number> = new Set();
        for (const edge_i of edges_i) {
            const posi_pair_i: [number, number] = edge_to_posi_pairs_map.get(edge_i);
            if (!edge_posis_map.has(posi_pair_i[1]) || edge_posis_map.get(posi_pair_i[1]).indexOf(posi_pair_i[0]) === -1) {
                const found_ents_i: number[] = this.modeldata.geom.nav.navAnyToAny(EEntType.EDGE, ent_type, edge_i);
                found_ents_i.forEach( found_ent_i => perimeter_ents_i.add(found_ent_i) );
            }
        }
        return Array.from(perimeter_ents_i);
    }
    /**
     * Get the object of a topo entity.
     * Returns a point, pline, or pgon. (no posis)
     * @param ent_type
     * @param ent_i
     */
    public getTopoObj(ent_type: EEntType, ent_i: number): TEntTypeIdx {
        switch (ent_type) {
            case EEntType.FACE:
                return [EEntType.PGON, this.modeldata.geom.nav.navFaceToPgon(ent_i)];
            case EEntType.WIRE:
            case EEntType.EDGE:
            case EEntType.VERT:
                const pgons_i: number[] = this.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
                if (pgons_i.length !== 0) {
                    return [EEntType.PGON, pgons_i[0]];
                }
                const plines_i: number[] = this.modeldata.geom.nav.navAnyToPline(ent_type, ent_i);
                if (plines_i.length !== 0) {
                    return [EEntType.PLINE, plines_i[0]];
                }
                const points_i: number[] = this.modeldata.geom.nav.navAnyToPoint(ent_type, ent_i);
                if (this.modeldata.geom.nav.navAnyToVert(ent_type, ent_i).length !== 0) {
                    return [EEntType.POINT, points_i[0]];
                }
                break;
            default:
                throw new Error('Invalid entity type: Must be a topo entity.');
        }
    }
    /**
     * Get the object type of a topo entity.
     * @param ent_type
     * @param ent_i
     */
    public getTopoObjType(ent_type: EEntType, ent_i: number): EEntType {
        switch (ent_type) {
            case EEntType.FACE:
                return EEntType.PGON;
            case EEntType.WIRE:
            case EEntType.EDGE:
            case EEntType.VERT:
                if (this.modeldata.geom.nav.navAnyToFace(ent_type, ent_i).length !== 0) {
                    return EEntType.PGON;
                } else if (this.modeldata.geom.nav.navAnyToWire(ent_type, ent_i).length !== 0) {
                    return EEntType.PLINE;
                } else if (this.modeldata.geom.nav.navAnyToVert(ent_type, ent_i).length !== 0) {
                    return EEntType.POINT;
                }
                break;
            default:
                throw new Error('Invalid entity type: Must be a topo entity.');
        }
    }
    /**
     * Get the topo entities of an object
     * @param ent_type
     * @param ent_i
     */
    public getObjTopo(ent_type: EEntType, ent_i: number): [number[], number[], number[], number[]] {
        return [
            this.modeldata.geom.nav.navAnyToVert(ent_type, ent_i),
            this.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i),
            this.modeldata.geom.nav.navAnyToWire(ent_type, ent_i),
            this.modeldata.geom.nav.navAnyToFace(ent_type, ent_i),
        ];
    }
}
