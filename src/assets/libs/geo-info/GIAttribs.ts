import { GIAttribsAdd } from './GIAttribsAdd';
import { GIAttribsQuery } from './GIAttribsQuery';
import { GIModel } from './GIModel';
import { EEntType, EAttribDataTypeStrs, IAttribsMaps } from './common';
import { GIAttribsMerge } from './GIAttribsMerge';
import { GIAttribsModify } from './GIAttribModify';
import { GIModelData } from './GIModelData';
import { GIAttribsSnapshot } from './GIAttribsSnapshot';
import { GIAttribsThreejs } from './GIAttribsThreejs';
import { GIAttribsColls } from './GIAttribsColls';
import { GIAttribsImpExp } from './GIAttribsImpExp';

const eny_type_array: EEntType[] = [
    EEntType.POSI,
    EEntType.VERT,
    EEntType.EDGE,
    EEntType.WIRE,
    EEntType.FACE,
    EEntType.POINT,
    EEntType.PLINE,
    EEntType.PGON,
    EEntType.COLL,
    EEntType.MOD
];
const ent_type_strs: Map<EEntType, string> = new Map([
    [EEntType.POSI, 'positions'],
    [EEntType.VERT, 'vertices'],
    [EEntType.EDGE, 'edges'],
    [EEntType.WIRE, 'wires'],
    [EEntType.FACE, 'faces'],
    [EEntType.POINT, 'points'],
    [EEntType.PLINE, 'polylines'],
    [EEntType.PGON, 'polygons'],
    [EEntType.COLL, 'collections'],
    [EEntType.MOD, 'model']
]);
/**
 * Class for attributes.
 */
export class GIAttribs {
    private modeldata: GIModelData;
    // maps, the key is the name, the value is the attrib map clas
    public attribs_maps: Map<number, IAttribsMaps> = new Map();
    // sub classes with methods
    public merge: GIAttribsMerge;
    public imp_exp: GIAttribsImpExp;
    public add: GIAttribsAdd;
    public modify: GIAttribsModify;
    public query: GIAttribsQuery;
    public snapshot: GIAttribsSnapshot;
    public colls: GIAttribsColls;
    public threejs: GIAttribsThreejs;
   /**
     * Creates an object to store the attribute data.
     * @param modeldata The JSON data
     */
    constructor(modeldata: GIModelData) {
        this.modeldata = modeldata;
        this.merge = new GIAttribsMerge(modeldata);
        this.imp_exp = new GIAttribsImpExp(modeldata);
        this.add = new GIAttribsAdd(modeldata);
        this.modify = new GIAttribsModify(modeldata);
        this.query = new GIAttribsQuery(modeldata);
        this.snapshot = new GIAttribsSnapshot(modeldata);
        this.colls = new GIAttribsColls(modeldata);
        this.threejs = new GIAttribsThreejs(modeldata);
    }
    /**
     * Compares this model and another model.
     * ~
     * If check_equality=false, the max total score will be equal to the number of attributes in this model.
     * It checks that each attribute in this model exists in the other model. If it exists, 1 mark is assigned.
     * ~
     * If check_equality=true, the max score will be increased by 10, equal to the number of entity levels.
     * For each entity level, if the other model contains no additional attributes, then one mark is assigned.
     * ~
     * @param other_model The model to compare with.
     */
    public compare(other_model: GIModel, result: {score: number, total: number, comment: any[]}): void {
        result.comment.push('Comparing attribute names and types.');
        // compare all attributes except model attributes
        // check that this model is a subset of other model
        // all the attributes in this model must also be in other model
        const attrib_comments: string[] = [];
        let matches = true;
        const attrib_names: Map<EEntType, string[]> = new Map();
        for (const ent_type of eny_type_array) {
            // get the attrib names
            const ent_type_str: string = ent_type_strs.get(ent_type);
            const this_attrib_names: string[] = this.modeldata.attribs.query.getAttribNames(ent_type);
            const other_attrib_names: string[] = other_model.modeldata.attribs.query.getAttribNames(ent_type);
            attrib_names.set(ent_type, this_attrib_names);
            // check that each attribute in this model exists in the other model
            for (const this_attrib_name of this_attrib_names) {
                // check is this is built in
                let is_built_in = false;
                if (this_attrib_name === 'xyz' || this_attrib_name === 'rgb' || this_attrib_name.startsWith('_')) {
                    is_built_in = true;
                }
                // update the total
                if (!is_built_in) { result.total += 1; }
                // compare names
                if (other_attrib_names.indexOf(this_attrib_name) === -1 ) {
                    matches = false;
                    attrib_comments.push('The "' + this_attrib_name + '" ' + ent_type_str + ' attribute is missing.');
                } else {
                    // get the data types
                    const data_type_1: EAttribDataTypeStrs =
                        this.modeldata.attribs.query.getAttribDataType(ent_type, this_attrib_name);
                    const data_type_2: EAttribDataTypeStrs =
                        other_model.modeldata.attribs.query.getAttribDataType(ent_type, this_attrib_name);
                    // compare data types
                    if (data_type_1 !== data_type_2) {
                        matches = false;
                        attrib_comments.push('The "' + this_attrib_name + '" ' + ent_type_str + ' attribute datatype is wrong. '
                            + 'It is "' + data_type_1 + '" but it should be "' + data_type_1 + '".');
                    } else {
                        // update the score
                        if (!is_built_in) { result.score += 1; }
                    }
                }
            }
            // check if we have exact equality in attributes
            // total marks is not updated, we deduct marks
            // check that the other model does not have additional attribs
            if (other_attrib_names.length > this_attrib_names.length) {
                const additional_attribs: string[] = [];
                for (const other_attrib_name of other_attrib_names) {
                    if (this_attrib_names.indexOf(other_attrib_name) === -1) {
                        additional_attribs.push(other_attrib_name);
                    }
                }
                attrib_comments.push('There are additional ' + ent_type_str + ' attributes. ' +
                    'The following attributes are not required: [' + additional_attribs.join(',') + ']. ');
                // update the score, deduct 1 mark
                result.score -= 1;
            } else if (other_attrib_names.length < this_attrib_names.length) {
                attrib_comments.push('Mismatch: Model has too few entities of type: ' + ent_type_strs.get(ent_type) + '.');
            } else {
                // correct
            }
        }
        if (attrib_comments.length === 0) {
            attrib_comments.push('Attributes all match, both name and data type.');
        }
        // add to result
        result.comment.push(attrib_comments);
    }
    /**
     * Generate a string for debugging
     */
    public toStr(ssid: number): string {
        let result = '';
        for (const ent_type of eny_type_array) {
            const ent_type_str: string = ent_type_strs.get(ent_type);
            result += ent_type_str + ': ';
            if (ent_type === EEntType.MOD) {
                // TODO
                throw new Error('Not implemented.');
            } else {
                const attrib_names: string[] = this.query.getAttribNames(ent_type);
                for (const attrib_name of attrib_names) {
                    result += JSON.stringify(this.query.getAttrib(ent_type, attrib_name).getJSONData(null));
                    result += '\n';
                }
            }
        }
        return result;
    }
}
