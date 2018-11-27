import { Injectable } from '@angular/core';

import { IModule, IFunction } from '@models/procedure';
import { IArgument } from '@models/code';
import * as doc from '@assets/typedoc-json/doc.json';

import * as Modules from '@modules';

let docs = undefined;
let module_list = [];

// todo: bug fix for defaults
function extract_params(func: Function): [IArgument[], boolean] {
    let fnStr = func.toString().replace( /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '');
    
    let result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).split(",")//.match( /([^\s,]+)/g);
    if(result === null || result[0]==""){
         result = [];
    }
    let final_result = result.map(function(r){ 
        r = r.trim();
        let r_value = r.split("=");

        if (r_value.length == 1){
            return { name: r_value[0].trim(), value: undefined, default: 0}
        }
        else{
            return { name: r_value[0].trim(), value: undefined, default: 0 }
        }

    });
    let hasReturn = true;
    if (fnStr.indexOf("return") === -1 || fnStr.indexOf("return;") !== -1){
        hasReturn = false;
    }
    return [final_result, hasReturn];
}

export function ModuleAware(constructor: Function) {
    if (module_list.length == 0){
        for( let m_name in Modules ){
            if (m_name[0] == '_') continue;
            
            let modObj = <IModule>{};
            modObj.module = m_name;
            modObj.functions = [];
            
            for( let fn_name of Object.keys(Modules[m_name])){
                
                let func = Modules[m_name][fn_name];
    
                let fnObj = <IFunction>{};
                fnObj.module = m_name;
                fnObj.name = fn_name;
                fnObj.argCount = func.length;
                let args = extract_params(func);
                fnObj.args = args[0];
                fnObj.hasReturn = args[1];
                modObj.functions.push(fnObj);
            }
            module_list.push(modObj);
        }
    }
    constructor.prototype.Modules = module_list;
}

export function ModuleDocAware(constructor: Function) {
    if (!docs){
        docs = {};
        for (let mod of doc.children){
            if (mod.name.substr(1,1)== '_' || mod.name == '"index"'){
                continue
            }
            let modName = mod.name.substr(1, mod.name.length-2);
            let moduleDoc = {}
            for (let func of mod.children){
                let fn = {};
                fn["name"] = func.name;
                fn["module"] = modName;
                fn["description"] = func["signatures"][0].comment.shortText;
                for (let fnTag of func["signatures"][0].comment.tags){
                    if (fnTag.tag == 'summary') fn["summary"] = fnTag.text.trim();
                }
                fn["returns"] = func["signatures"][0].comment.returns;
                if (fn["returns"]) fn["returns"] = fn["returns"].trim();
                fn["parameters"] = [];
                if (func["signatures"][0].parameters){ 
                    for (let param of func["signatures"][0].parameters){
                        let namecheck = true;
                        for (let systemVarName in Modules._parameterTypes){
                            if (param.name == Modules._parameterTypes[systemVarName]){
                                namecheck = false
                                break;
                            }
                        }
                        if (!namecheck) continue;
                        let pr = {};
    
                        pr["name"] = param.name;
                        pr["description"] = param.comment.shortText||param.comment.text;
                        if (param.type.type == 'array'){
                            pr["type"] = `${param.type.elementType.name}[]`;
                        } else if (param.type.type == "intrinsic"){
                            pr["type"] = param.type.name;
                        } else {
                            /**
                             * TODO: Update param type here
                             */
                            console.log('param type requires updating:', param.type)
                            pr["type"] = param.type.type;
                        }
                        fn["parameters"].push(pr)
                    }
                }
                moduleDoc[func.name] = fn;
            }
            docs[modName] = moduleDoc
        }    
    }
    constructor.prototype.ModuleDoc = docs;
}
