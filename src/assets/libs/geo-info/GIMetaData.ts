import { EAttribDataTypeStrs, TAttribDataTypes, IMetaData, IMetaJSONData, IAttribJSONValues,
    IModelJSON, IModelJSONData, IAttribJSONData, IAttribValues } from './common';

/**
 * Geo-info model metadata class.
 */
export class GIMetaData {
    private _data: IMetaData = {
        time_stamp: 0,
        posi_count: 0,
        vert_count: 0,
        tri_count: 0,
        edge_count: 0,
        wire_count: 0,
        face_count: 0,
        point_count: 0,
        pline_count: 0,
        pgon_count: 0,
        coll_count: 0,
        attrib_values: {
            number: [[], new Map()],    // an array of numbers, and a map: string key -> array index
            string: [[], new Map()],    // an array of strings, and a map: string key -> array index
            list:   [[], new Map()],    // an array of lists, and a map: string key -> array index
            dict:   [[], new Map()]     // an array of dicts, and a map: string key -> array index
        }
    };
    /**
     * Constructor
     */
    constructor() {
        // console.log('CREATING META OBJECT');
    }
    /**
     * Get the meta data.
     * Returned data object is passed by reference.
     */
    public getJSONData(model_data: IModelJSONData): IMetaJSONData {
        const data_filtered: IAttribValues = {
            number: [[], new Map()],
            string: [[], new Map()],
            list: [[], new Map()],
            dict: [[], new Map()],
        };
        for (const key of Object.keys(model_data.attributes)) {
            if (key !== 'model') {
                for (const attrib of model_data.attributes[key]) {
                    const data_type = attrib.data_type;
                    for (const item of attrib.data) {
                        const attrib_idx = item[0];
                        const attrib_val = this._data.attrib_values[data_type][0][attrib_idx];
                        const attrib_key = (data_type === 'number' || data_type === 'string') ? attrib_val : JSON.stringify(attrib_val);
                        let new_attrib_idx: number;
                        if (attrib_key in data_filtered[data_type][1]) {
                            new_attrib_idx = data_filtered[data_type][1].get(attrib_key);
                        } else {
                            new_attrib_idx = data_filtered[data_type][0].push(attrib_val) - 1;
                            data_filtered[data_type][1].set(attrib_key, new_attrib_idx);
                        }
                        item[0] = new_attrib_idx;
                    }
                }
            }
        }
        const data: IMetaJSONData = {
            time_stamp: this._data.time_stamp,
            posi_count: this._data.posi_count,
            vert_count: this._data.vert_count,
            tri_count: this._data.tri_count,
            edge_count: this._data.edge_count,
            wire_count: this._data.wire_count,
            face_count: this._data.face_count,
            point_count: this._data.point_count,
            pline_count: this._data.pline_count,
            pgon_count: this._data.pgon_count,
            coll_count: this._data.coll_count,
            attrib_values: {
                // number_vals: this._data.attrib_values.number[0],
                // number_keys: Array.from(this._data.attrib_values.number[1].keys()),
                // number_idxs: Array.from(this._data.attrib_values.number[1].values()),
                // string_vals: this._data.attrib_values.string[0],
                // string_keys: Array.from(this._data.attrib_values.string[1].keys()),
                // string_idxs: Array.from(this._data.attrib_values.string[1].values()),
                // list_vals: this._data.attrib_values.list[0],
                // list_keys: Array.from(this._data.attrib_values.list[1].keys()),
                // list_idxs: Array.from(this._data.attrib_values.list[1].values()),
                // dict_vals: this._data.attrib_values.dict[0],
                // dict_keys: Array.from(this._data.attrib_values.dict[1].keys()),
                // dict_idxs: Array.from(this._data.attrib_values.dict[1].values()),
                //-------------------------------------------
                number_vals: data_filtered.number[0],
                // number_keys: Array.from(data_filtered.number[1].keys()),
                number_idxs: Array.from(data_filtered.number[1].values()),
                string_vals: data_filtered.string[0],
                // string_keys: Array.from(data_filtered.string[1].keys()),
                string_idxs: Array.from(data_filtered.string[1].values()),
                list_vals: data_filtered.list[0],
                // list_keys: Array.from(data_filtered.list[1].keys()),
                list_idxs: Array.from(data_filtered.list[1].values()),
                dict_vals: data_filtered.dict[0],
                // dict_keys: Array.from(data_filtered.dict[1].keys()),
                dict_idxs: Array.from(data_filtered.dict[1].values()),
            }
        };
        return data;
    }
    /**
     * Merge that data into this meta data.
     * The entity counts will be updated.
     * The attribute values will be added, if they do not already exist.
     * The attribute indexes in model data will also be renumbered.
     * @param data
     */
    public mergeJSONData(data: IModelJSON): void {
        const meta_data: IMetaJSONData = data.meta_data;
        const model_data: IModelJSONData = data.model_data;
        this._data.posi_count += meta_data.posi_count;
        this._data.vert_count += meta_data.vert_count;
        this._data.tri_count += meta_data.tri_count;
        this._data.edge_count += meta_data.edge_count;
        this._data.wire_count += meta_data.wire_count;
        this._data.face_count += meta_data.face_count;
        this._data.point_count += meta_data.point_count;
        this._data.pline_count += meta_data.pline_count;
        this._data.pgon_count += meta_data.pgon_count;
        this._data.coll_count += meta_data.coll_count;
        // update the attribute values in this meta
        // create the renumbering maps
        const attrib_vals: IAttribJSONValues = meta_data.attrib_values;
        const renum_num_attrib_vals: Map<number, number>  = new Map();
        for (let i = 0; i < attrib_vals.number_vals.length; i++) {
            // const other_key: string = attrib_vals.number_keys[i];
            const other_key: number = attrib_vals.number_vals[i];
            const other_idx: number = attrib_vals.number_idxs[i];
            if (this.hasAttribKey(other_key, EAttribDataTypeStrs.NUMBER)) {
                renum_num_attrib_vals.set(other_idx, this.getAttribIdxFromKey(other_key, EAttribDataTypeStrs.NUMBER));
            } else {
                const other_val: number = attrib_vals.number_vals[i];
                const new_idx: number = this.addAttribByKeyVal(other_key, other_val, EAttribDataTypeStrs.NUMBER);
                renum_num_attrib_vals.set(other_idx, new_idx);
            }
        }
        const renum_str_attrib_vals: Map<number, number>  = new Map();
        for (let i = 0; i < attrib_vals.string_vals.length; i++) {
            // const other_key: string = attrib_vals.string_keys[i];
            const other_key: string = attrib_vals.string_vals[i];
            const other_idx: number = attrib_vals.string_idxs[i];
            if (this.hasAttribKey(other_key, EAttribDataTypeStrs.STRING)) {
                renum_str_attrib_vals.set(other_idx, this.getAttribIdxFromKey(other_key, EAttribDataTypeStrs.STRING));
            } else {
                const other_val: string = attrib_vals.string_vals[i];
                const new_idx: number = this.addAttribByKeyVal(other_key, other_val, EAttribDataTypeStrs.STRING);
                renum_str_attrib_vals.set(other_idx, new_idx);
            }
        }
        const renum_list_attrib_vals: Map<number, number>  = new Map();
        for (let i = 0; i < attrib_vals.list_vals.length; i++) {
            const other_key: string = JSON.stringify(attrib_vals.list_vals[i]);
            const other_idx: number = attrib_vals.list_idxs[i];
            if (this.hasAttribKey(other_key, EAttribDataTypeStrs.LIST)) {
                renum_list_attrib_vals.set(other_idx, this.getAttribIdxFromKey(other_key, EAttribDataTypeStrs.LIST));
            } else {
                const other_val: any[] = attrib_vals.list_vals[i];
                const new_idx: number = this.addAttribByKeyVal(other_key, other_val, EAttribDataTypeStrs.LIST);
                renum_list_attrib_vals.set(other_idx, new_idx);
            }
        }
        const renum_dict_attrib_vals: Map<number, number>  = new Map();
        for (let i = 0; i < attrib_vals.dict_vals.length; i++) {
            const other_key: string = JSON.stringify(attrib_vals.dict_vals[i]);
            const other_idx: number = attrib_vals.dict_idxs[i];
            if (this.hasAttribKey(other_key, EAttribDataTypeStrs.DICT)) {
                renum_dict_attrib_vals.set(other_idx, this.getAttribIdxFromKey(other_key, EAttribDataTypeStrs.DICT));
            } else {
                const other_val: object = attrib_vals.dict_vals[i];
                const new_idx: number = this.addAttribByKeyVal(other_key, other_val, EAttribDataTypeStrs.DICT);
                renum_dict_attrib_vals.set(other_idx, new_idx);
            }
        }
        // apply the renumbering of attribute indexes in the model data
        const renum_attrib_vals: Map<string, Map<number, number>> = new Map();
        renum_attrib_vals.set(EAttribDataTypeStrs.NUMBER, renum_num_attrib_vals);
        renum_attrib_vals.set(EAttribDataTypeStrs.STRING, renum_str_attrib_vals);
        renum_attrib_vals.set(EAttribDataTypeStrs.LIST, renum_list_attrib_vals);
        renum_attrib_vals.set(EAttribDataTypeStrs.DICT, renum_dict_attrib_vals);
        this._renumAttribValues(model_data.attributes.posis, renum_attrib_vals);
        this._renumAttribValues(model_data.attributes.verts, renum_attrib_vals);
        this._renumAttribValues(model_data.attributes.edges, renum_attrib_vals);
        this._renumAttribValues(model_data.attributes.wires, renum_attrib_vals);
        this._renumAttribValues(model_data.attributes.faces, renum_attrib_vals);
        this._renumAttribValues(model_data.attributes.points, renum_attrib_vals);
        this._renumAttribValues(model_data.attributes.plines, renum_attrib_vals);
        this._renumAttribValues(model_data.attributes.pgons, renum_attrib_vals);
        this._renumAttribValues(model_data.attributes.colls, renum_attrib_vals);
        // no need to return the model data
    }
    // get next time stamp
    public nextTimeStamp(): number {
        const ts: number = this._data.time_stamp;
        this._data.time_stamp += 1;
        return ts;
    }
    // get next index
    public nextPosi(): number {
        const index: number = this._data.posi_count;
        this._data.posi_count += 1;
        return index;
    }
    public nextVert(): number {
        const index: number = this._data.vert_count;
        this._data.vert_count += 1;
        return index;
    }
    public nextTri(): number {
        const index: number = this._data.tri_count;
        this._data.tri_count += 1;
        return index;
    }
    public nextEdge(): number {
        const index: number = this._data.edge_count;
        this._data.edge_count += 1;
        return index;
    }
    public nextWire(): number {
        const index: number = this._data.wire_count;
        this._data.wire_count += 1;
        return index;
    }
    public nextFace(): number {
        const index: number = this._data.face_count;
        this._data.face_count += 1;
        return index;
    }
    public nextPoint(): number {
        const index: number = this._data.point_count;
        this._data.point_count += 1;
        return index;
    }
    public nextPline(): number {
        const index: number = this._data.pline_count;
        this._data.pline_count += 1;
        return index;
    }
    public nextPgon(): number {
        const index: number = this._data.pgon_count;
        this._data.pgon_count += 1;
        return index;
    }
    public nextColl(): number {
        const index: number = this._data.coll_count;
        this._data.coll_count += 1;
        return index;
    }
    // set next index
    public setNextPosi(index: number): void {
        this._data.posi_count = index;
    }
    public setNextVert(index: number): void {
        this._data.vert_count = index;
    }
    public setNextTri(index: number): void {
        this._data.tri_count = index;
    }
    public setNextEdge(index: number): void {
        this._data.edge_count = index;
    }
    public setNextWire(index: number): void {
        this._data.wire_count = index;
    }
    public setNextFace(index: number): void {
        this._data.face_count = index;
    }
    public setNextPoint(index: number): void {
        this._data.point_count = index;
    }
    public setNextPline(index: number): void {
        this._data.pline_count = index;
    }
    public setNextPgon(index: number): void {
        this._data.pgon_count = index;
    }
    public setNextColl(index: number): void {
        this._data.coll_count = index;
    }
    // attribute values
    public addAttribByKeyVal(key: string|number, val: TAttribDataTypes, data_type: EAttribDataTypeStrs): number {
        if (this._data.attrib_values[data_type][1].has(key)) {
            return this._data.attrib_values[data_type][1].get(key);
        }
        const index = this._data.attrib_values[data_type][0].push(val) - 1;
        this._data.attrib_values[data_type][1].set(key, index);
        return index;
    }
    public getAttribValFromIdx(index: number, data_type: EAttribDataTypeStrs): TAttribDataTypes {
        return this._data.attrib_values[data_type][0][index];
    }
    public getAttribValFromKey(key: string|number, data_type: EAttribDataTypeStrs): TAttribDataTypes {
        return this._data.attrib_values[data_type][0][this._data.attrib_values[data_type][1].get(key)];
    }
    public getAttribIdxFromKey(key: string|number, data_type: EAttribDataTypeStrs): number {
        return this._data.attrib_values[data_type][1].get(key);
    }
    public hasAttribKey(key: string|number, data_type: EAttribDataTypeStrs): boolean {
        return this._data.attrib_values[data_type][1].has(key);
    }
    // create string for debugging
    public toDebugStr(): string {
        return '' +
            'number: ' +
            JSON.stringify(this._data.attrib_values['number'][0]) +
            JSON.stringify(Array.from(this._data.attrib_values['number'][1])) +
            '\nstring: ' +
            JSON.stringify(this._data.attrib_values['string'][0]) +
            JSON.stringify(Array.from(this._data.attrib_values['string'][1])) +
            '\nlist: ' +
            JSON.stringify(this._data.attrib_values['list'][0]) +
            JSON.stringify(Array.from(this._data.attrib_values['list'][1])) +
            '\ndict: ' +
            JSON.stringify(this._data.attrib_values['dict'][0]) +
            JSON.stringify(Array.from(this._data.attrib_values['dict'][1]));
    }
    // --------------------------------------------

    /**
     * Helper method to renumber the indexes of the attribute values in the JSON data.
     * @param attribs_data the attribute data, [val_index, [list of ents]]
     * @param renum_attrib_vals A map of maps, old numbering -> new numbering
     */
    private _renumAttribValues(attribs_data: IAttribJSONData[], renum_attrib_vals: Map<string, Map<number, number>>): void {
        for (const attrib_data of attribs_data) {
            const renum: Map<number, number> = renum_attrib_vals.get(attrib_data.data_type);
            for (const val_i_ents of attrib_data.data) {
                val_i_ents[0] = renum.get(val_i_ents[0]);
            }
        }
    }
}
