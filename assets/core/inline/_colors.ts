import * as THREE from 'three';
import * as ch from 'chroma-js';
import { TColor } from '@libs/geo-info/common';
import { checkNumArgs } from '../_check_inline_args';

const false_col  = ch.scale(['blue', 'cyan', 'green', 'yellow', 'red']);

/**
 * Creates a colour from a value in the range between min and max.
 *
 * @param vals
 * @param min
 * @param max
 */
export function colFalse(debug: boolean, vals: number|number[], min: number, max: number): TColor|TColor[] {
    if (debug) {
        checkNumArgs('colFalse', arguments, 3);
    }
    const col_domain  = false_col.domain([min, max]);
    if (!Array.isArray(vals)) {
        const col = col_domain(vals).gl();
        return [col[0], col[1], col[2]];
    } else {
        const cols: TColor[] = [];
        for (const val of vals) {
            const col = col_domain(val).gl();
            cols.push( [col[0], col[1], col[2]] );
        }
        return cols;
    }
}
/**
 * Creates a colour from a value in the range between min and max, given a Brewer color scale.
 *
 * @param vals
 * @param min
 * @param max
 * @param scale
 */
export function colScale(debug: boolean, vals: number|number[], min: number, max: number, scale: any): TColor|TColor[] {
    if (debug) {
        checkNumArgs('colScale', arguments, 4);
    }
    const col_scale  = ch.scale(scale);
    const col_domain  = col_scale.domain([min, max]);
    if (!Array.isArray(vals)) {
        const col = col_domain(vals).gl();
        return [col[0], col[1], col[2]];
    } else {
        const cols: TColor[] = [];
        for (const val of vals) {
            const col = col_domain(val).gl();
            cols.push( [col[0], col[1], col[2]] );
        }
        return cols;
    }
}

/**
 * Creates a colour from a string representation. Examples of strings are as follows:
 *
 * - "rgb(255, 0, 0)"
 * - "rgb(100%, 0%, 0%)"
 * - "hsl(0, 100%, 50%)"
 * - '#ff0000'
 * - '#f00'
 * - 'skyblue'
 *
 * For colour names, all 140 names are supported. See <a
 * href="https://www.w3schools.com/colors/colors_names.asp" target="_blank">w3schools</a>. Note that
 * the names are all lowercase. CamelCase names are not supported.
 *
 * The function is overloaded. If you pass in a list of strings, it will return a list of colours.
 *
 * @param col_str
 */
export function colFromStr(debug: boolean, col_str: string|string[]): TColor | TColor[] {
    if (debug) {
        checkNumArgs('colFromStr', arguments, 1);
    }
    if (!Array.isArray(col_str)) {
        const col_tjs = new THREE.Color(col_str);
        return [col_tjs.r, col_tjs.g, col_tjs.b];
    } else {
        const cols: TColor[] = [];
        for (const a_col_str of col_str) {
            const col_tjs = new THREE.Color(a_col_str);
            cols.push([col_tjs.r, col_tjs.g, col_tjs.b]);
        }
        return cols;
    }
}
