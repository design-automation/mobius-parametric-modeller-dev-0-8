import { Component, DoCheck, OnDestroy } from '@angular/core';
import { ModuleList} from '@shared/decorators';
import { DataService } from '@shared/services';
import * as showdown from 'showdown';
/**
 * HelpViewerComponent
 */
 @Component({
  selector: 'help-viewer',
  templateUrl: './help-viewer.component.html',
  styleUrls: ['./help-viewer.component.scss']
})
export class HelpViewerComponent implements DoCheck, OnDestroy {
    output: any;
    description = '';
    activeMod: string;
    mdConverter = new showdown.Converter({literalMidWordUnderscores: true});
    modList;

    /**
     * constructor
     */
    constructor(private mainDataService: DataService) {
        this.modList = [{
            name: 'UI',
            srcDir: 'assets/typedoc-json/docUI',
            modnames: ['gallery', 'dashboard', 'flowchart', 'editor', 'menu'],
            opened: false
        }, {
            name: 'Viewers',
            srcDir: 'assets/typedoc-json/docVW',
            modnames: ['gi-viewer', 'geo-viewer', 'vr-viewer', 'console'],
            opened: false
        }, {
            name: 'Operations',
            srcDir: 'assets/typedoc-json/docCF',
            modnames: ['variable', 'comment', 'expression', 'control_flow', 'local_func', 'global_func'],
            opened: false
        }, {
            name: 'Modules',
            srcDir: 'assets/typedoc-json/docMD',
            modnames: [],
            opened: false
        }];

        for (const mod of ModuleList) {
            if (mod.module[0] === '_') {continue; }
            this.modList[3].modnames.push(mod.module);
        }

        this.output = this.mainDataService.helpViewData[0];
        this.activeMod = this.mainDataService.helpViewData[1];
        if (window.location.search) {
            const helpSectionURI = decodeURI(window.location.search).split('docSection=');
            if (helpSectionURI.length > 0) {
                const modData = helpSectionURI[1].split('&')[0].split('.');
                for (const modGroup of this.modList) {
                    if (modGroup.name === modData[0]) {
                        this.output = undefined;
                        this.activeMod = `${modGroup.srcDir}/${modData[1]}.md`;
                        break;
                    }
                }
            }
        }
    }

    ngOnDestroy() {
        this.mainDataService.helpViewData = [this.output, this.activeMod];
    }

    ngDoCheck() {
        if (this.mainDataService.helpView[1] === true) {
            this.output = this.mainDataService.helpView[2];
            this.mainDataService.togglePageHelp(false);
        }
    }

    openHelpMenu(e: MouseEvent) {
        let stl = document.getElementById('helpMenu').style;
        if (!stl.display || stl.display === 'none') {
            stl.display = 'block';
        } else {
            stl.display = 'none';
        }
        e.stopPropagation();
        stl = null;
    }

    switchHelp(modGroup, mod) {
        this.output = undefined;
        this.activeMod = `${modGroup.srcDir}/${mod}.md`;
    }

    toggleAccordion(event: MouseEvent, id: string) {
        event.stopPropagation();
        const acc = document.getElementById(id);
        // acc = document.getElementsByClassName("accordion");
        acc.classList.toggle('active');
        const panel = <HTMLElement>acc.nextElementSibling;
        if (panel.style.display === 'block') {
            panel.style.display = 'none';
        } else {
            panel.style.display = 'block';
        }
        const stl = document.getElementById('helpMenu').style;
        stl.display = 'block';
    }
}
