const dc = require('./__doc.json');
const docReplace = require('./docReplace.json');
const fs = require('fs');
const config = require('../gallery/__config__.json');
const { DataTextureLoader } = require('three');

const urlString = 'https://mobius.design-automation.net';

const otherModsList = [{
    name: 'UI',
    srcDir: 'assets/typedoc-json/docUI',
    modnames: ['gallery', 'dashboard', 'flowchart', 'editor', 'menu'],
    opened: false
}, {
    name: 'Viewers',
    srcDir: 'assets/typedoc-json/docVW',
    modnames: ['cad-viewer', 'geo-viewer', 'vr-viewer', 'console'],
    opened: false
}, {
    name: 'Operations',
    srcDir: 'assets/typedoc-json/docCF',
    modnames: ['variable', 'comment', 'expression', 'control_flow', 'local_func', 'global_func'],
    opened: false
}];

let examples;
for (const s of config.data){
    if (s.name === 'Function Examples'){
        examples = s;
        break;
    }
}
if (examples === undefined) {
    examples = {
        "name": "Function Examples",
        "files": [
        ],
        "link": "/assets/gallery/function_examples/"
    };
    config.data.push(examples);
}

function compare(a, b) {
    if (a.id < b.id) {
        return -1;
    }
    if (a.id > b.id) {
        return 1;
    }
    return 0;
}

function replaceText(text) {
    const splittedText = text.split('|');
    for (let i = 0; i < splittedText.length; i++) {
        for (const repText in docReplace) {
            if (splittedText[i] === repText) {
                splittedText[i] =  `<abbr title=\'${docReplace[repText]}\'>${splittedText[i]}</abbr>`
                console.log('~~~~~~~~~~~', splittedText[i])
                break;
            }
        }
    }
    return splittedText.join('');
}

function analyzeParamType(fn, paramType) {
    if (paramType.type === 'array') {
        return `${analyzeParamType(fn, paramType.elementType)}[]`;
    } else if (paramType.type === 'intrinsic' || paramType.type === 'reference') {
        return paramType.name;
    } else if (paramType.type === 'union') {
        return paramType.types.map((tp) => analyzeParamType(fn, tp)).join(' | ');
    } else if (paramType.type === 'tuple') {
        return '[' + paramType.elements.map((tp) => analyzeParamType(fn, tp)).join(', ') + ']';
    } else {
        /**
         * TODO: Update unrecognized param type here
         */
        console.log('param type requires updating:', paramType);
        console.log('in function:', fn.module + '.' + fn.name);
        return paramType.type;
    }
}

function addDoc(mod, modName, docs) {
    const moduleDoc = {};
    moduleDoc['id'] = mod.id;
    moduleDoc['name'] = modName;
    moduleDoc['func'] = [];
    if (!mod.children) { return; }
    for (const func of mod.children) {
        if (func.name[0] === '_') { continue; }
        const fn = {};
        fn['id'] = func.id;
        fn['name'] = func.name;
        fn['module'] = modName;
        if (!func['signatures']) { continue; }
        if (func['signatures'][0].comment) {
            const cmmt = func['signatures'][0].comment;
            fn['description'] = cmmt.shortText;
            if (cmmt.tags) {
                for (const fnTag of cmmt.tags) {
                    if (fnTag.tag === 'summary') { fn['summary'] = fnTag.text;
                    } else {
                        if (fn[fnTag.tag]) {
                            fn[fnTag.tag].push(fnTag.text);
                        } else {
                            fn[fnTag.tag] = [fnTag.text];
                        }

                    }
                }
            }
            fn['returns'] = cmmt.returns;
            if (fn['returns']) { fn['returns'] = fn['returns'].trim(); }
        }
        fn['parameters'] = [];
        if (func['signatures'][0].parameters) {
            for (const param of func['signatures'][0].parameters) {
                let namecheck = true;

                const constList = ['__constList__', '__model__', '__input__'];
                if (constList.indexOf(param.name) !== -1) {
                    namecheck = false;
                }
                if (!namecheck) {
                    fn['parameters'].push(undefined);
                    continue;
                }
                const pr = {};

                pr['name'] = param.name;
                if (param.comment) {
                    pr['description'] = param.comment.shortText || param.comment.text;
                }
                pr['type'] = analyzeParamType(fn, param.type);
                fn['parameters'].push(pr);
            }
        }
        moduleDoc.func.push(fn);
    }
    if (moduleDoc.func.length === 0) {return; }
    moduleDoc.func.sort(compare);
    docs.push(moduleDoc);
}

function genModuleDocs(docs) {
    let count = 0;
    for (const mod of docs) {
        // let mod;
        // for (let m of docs) {
        //     if (m.name === modName) {
        //         mod = m;
        //         break;
        //     }
        // }
        // if (!mod) {continue;}
        if (mod.name[0] === '_') { continue; }
        // if (!docs[modName]) { continue; }
        // const mod = docs[modName];
        // Module name
        // if (ModuleList.indexOf (mod.name) === -1) { continue; }``
        let mdString = `# ${mod.name.toUpperCase()}  \n  \n`;
        for (const func of mod.func) {
            // if (!mod[funcName]) { continue; }
    
            // const func = mod[funcName];
            fnString = `## ${func.name}  \n  \n  \n`;
            fnString += `**Description:** ${func.description}  \n  \n`;
            if (func.parameters && func.parameters.length > 0) {
                fnString += `**Parameters:**  \n`;
                for (const param of func.parameters) {
                    if (!param) {continue; }
                    fnString += `  * *${param.name}:* ${param.description}  \n`;
                }
            }
            if (func.returns) {
                fnString += `  \n**Returns:** ${func.returns}  \n`;
            }
            if (func.example) {
                fnString += `**Examples:**  \n`;
                for (const i in func.example) {
                    if (!func.example[i]) {continue; }
                    fnString += `  * ${func.example[i]}  \n`;
                    if (func.example_info) {
                        fnString += `    ${func.example_info[i]}  \n`;
                    }
    
                }
            }
            fnString += `  \n  \n`;
            mdString += fnString
        }
    
        count += 1;
        let countStr = count.toString();
        if (countStr.length === 1) {
            countStr = '0' + countStr;
        }
        mdString = replaceText(mdString.replace(/\\n/g, '\n'));
        fs.writeFile(`./src/assets/typedoc-json/docMD/${mod.name}.md`, mdString, function(err) {
            if (err) {
                return console.log(err);
            }
            console.log(`successfully saved ${mod.name}.md`);
        });
    }
}

// const doc = dc.default;
const doc = dc;
const moduleDocs = [];

for (const mod of doc.children) {
    const modNameSplit = mod.name.replace(/"/g, '').replace(/'/g, '').split('/');
    const coreIndex = modNameSplit.indexOf('core');
    if (modNameSplit.length < 3 || coreIndex === -1) {
        continue;
    }
    if (modNameSplit[coreIndex + 1] === 'inline') {

    } else if (modNameSplit[coreIndex + 1] === 'modules') {
        const modName = modNameSplit[modNameSplit.length - 1];
        if (modName.substr(0, 1) === '_' || modName === 'index' || modName === 'categorization') {
            continue;
        }
        addDoc(mod, modName, moduleDocs);
    }
}
moduleDocs.sort(compare);

fs.mkdirSync('./src/assets/typedoc-json/docMD', { recursive: true }, (err) => {
    if (err) throw err;
});

genModuleDocs(moduleDocs)

fs.writeFile(`./src/assets/gallery/__config__.json`, JSON.stringify(config, null, 4), function(err) {
    if (err) {
        return console.log(err);
    }
    console.log(`successfully saved __config__.json`);
});

fs.writeFile(`./src/assets/typedoc-json/doc.json`, replaceText(JSON.stringify(dc, null, 2)), function(err) {
    if (err) {
        return console.log(err);
    }
    console.log(`successfully saved doc.json`);
});


// for (const category of otherModsList) {
//     for (const mod of category.modnames) {
//         const fileDir = './src/' + category.srcDir + '/' + mod + '.md'
//         fs.readFile(fileDir, 'utf8' , (err, data) => {
//             if (err) {
//               console.log('ERROR: unable to read file: ' + fileDir)
//               return
//             }
//             const replacedText = replaceText(data.toString());
//             fs.writeFile(fileDir, replacedText, function(err) {
//                 if (err) {
//                     return console.log(err);
//                 }
//                 console.log(`successfully saved ${fileDir}`);
//             });
//         })
//     }
// }

