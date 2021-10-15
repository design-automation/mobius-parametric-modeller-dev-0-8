const dc = require('./doc.json');
const docReplace = require('./docReplace.json');
const fs = require('fs');
const config = require('../gallery/__config__.json');

// const urlString = 'https://mobius.design-automation.net';

// const otherModsList = [{
//     name: 'UI',
//     srcDir: 'assets/typedoc-json/docUI',
//     modnames: ['gallery', 'dashboard', 'flowchart', 'editor', 'menu'],
//     opened: false
// }, {
//     name: 'Viewers',
//     srcDir: 'assets/typedoc-json/docVW',
//     modnames: ['cad-viewer', 'geo-viewer', 'vr-viewer', 'console'],
//     opened: false
// }, {
//     name: 'Operations',
//     srcDir: 'assets/typedoc-json/docCF',
//     modnames: ['variable', 'comment', 'expression', 'control_flow', 'local_func', 'global_func'],
//     opened: false
// }];

const extraMods = [ 'variable', 'comment', 'expression',
                    'control_flow', 'global_func', 'local_func',
                    'dashboard', 'editor', 'flowchart', 'gallery', 'menu',
                    'console', 'geoviewer', 'cadviewer', 'vrviewer'];
const extraModPaths = {
    variable: 'docCF/variable',
    comment: 'docCF/comment',
    expression: 'docCF/expression',
    control_flow: 'docCF/control_flow',
    local_func: 'docCF/local_func',
    global_func: 'docCF/global_func',

    dashboard: 'docUI/dashboard',
    editor: 'docUI/editor',
    flowchart: 'docUI/flowchart',
    gallery: 'docUI/gallery',
    menu: 'docUI/menu',

    console: 'docVW/console',
    geoviewer: 'docVW/geo-viewer',
    cadviewer: 'docVW/cad-viewer',
    vrviewer: 'docVW/vr-viewer',
    vrviewerhotspot: 'docVW/vr-viewer-hotspots',
};


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
    if (mod.comment && mod.comment.shortText) {
        moduleDoc['description'] = mod.comment.shortText;
    } else {
        moduleDoc['description'] = ''
    }
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
        if (mod.name[0] === '_') { continue; }
        fs.mkdirSync(`./src/assets/typedoc-json/docs__/${mod.name.toLowerCase()}`, { recursive: true }, (err) => {
            if (err) throw err;
        });
        let mdString = `# ${mod.name.toUpperCase()}  \n  \n`;
        if (mod.description) {
            mdString += mod.description + '  \n  \n  \n'
        }
        for (const func of mod.func) {
            fnString = ``;
            fnString += `**Description:** ${func.description}  \n  \n`;
            if (func.parameters && func.parameters.length > 0) {
                fnString += `**Parameters:**  \n`;
                for (const param of func.parameters) {
                    if (!param) {continue; }
                    const paramName = param.name.replace(/_/g, '\\_')
                    fnString += `  * *${paramName}:* ${param.description}  \n`;
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
            if (func.name) {
                const writtenFnStr = `## ${mod.name}.${func.name}  \n  \n  \n` + replaceText(fnString.replace(/\\n/g, '\n'));
                fs.writeFile(`./src/assets/typedoc-json/docs__/${mod.name.toLowerCase()}/${func.name.toLowerCase()}.md`, writtenFnStr, function(err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            }
            fnString = `## ${func.name}  \n  \n  \n` + fnString + `  \n  \n`;
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

function addModFuncDoc(modUrl, modName) {
    const docText = fs.readFileSync(modUrl,'utf8')
    fs.mkdirSync(`./src/assets/typedoc-json/docs__/${modName.toLowerCase()}`, { recursive: true }, (err) => {
        if (err) throw err;
    });
    let fnString = '';
    let funcName;
    const splitText = docText.split('## ');
    if (splitText.length === 1) {
        const funcText = docText.split('# ')[1];
        funcName = funcText.split('\n')[0].trim().toLowerCase();

        if (extraMods.indexOf(modName) !== -1) {
            fnString = '## ' + funcText.trim();
        } else {
            fnString = '## ' + modName + '.' + funcText.trim();
        }
        fs.writeFile(`./src/assets/typedoc-json/docs__/${modName.toLowerCase()}/${funcName.toLowerCase()}.md`,
                fnString, function(err) {
            if (err) {
                return console.log(err);
            }
        });
    } else {
        for (const funcText of splitText) {
            if (funcText[0] === '#') { continue; }
            funcName = funcText.split('\n')[0].trim().toLowerCase();
            if (!funcName) { continue; }

            if (extraMods.indexOf(modName) !== -1) {
                fnString = '## ' + funcText.trim();
            } else {
                fnString = '## ' + modName + '.' + funcText.trim();
            }
            fs.writeFile(`./src/assets/typedoc-json/docs__/${modName.toLowerCase()}/${funcName.toLowerCase()}.md`,
                    fnString, function(err) {
                if (err) {
                    return console.log(err);
                }
            });
        }
    }
}

// const doc = dc.default;
const doc = dc;
const moduleDocs = [];

for (const mod of doc.children) {
    const modSourceSplit = mod.sources[0].fileName.replace(/"/g, '').replace(/'/g, '').split('/');
    // const coreIndex = modSourceSplit.indexOf('core');
    // if (modSourceSplit.length < 3 || coreIndex === -1) {
    //     continue;
    // }
    if (modSourceSplit[0] === 'inline') {
    } else if (modSourceSplit[0] === 'modules') {
        const modName = mod.name;
        if (modName.substr(0, 1) === '_' || modName === 'index' || modName === 'categorization') {
            continue;
        }
        addDoc(mod, modName, moduleDocs);
    }
}
for (const i of extraMods) {
    addModFuncDoc(`./src/assets/typedoc-json/${extraModPaths[i]}.md`, i);
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

