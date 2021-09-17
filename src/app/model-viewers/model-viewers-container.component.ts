import { Component, Injector, Input,
    ViewChild, ViewContainerRef, ComponentFactoryResolver, OnDestroy, OnInit, DoCheck } from '@angular/core';
import { IView } from './view.interface';
import { Viewers } from './model-viewers.config';
import { DataService } from '@services';
import { DataService as GIDataService } from './all-viewers/gi-viewer/data/data.service';
import { Router } from '@angular/router';
import { GIModel } from '@assets/libs/geo-info/GIModel';
import { _parameterTypes } from '@assets/core/modules';

const VIEWER_MATCHING = {
    '1': 'GIViewerComponent',
    '2': 'GIGeoViewerComponent',
    '3': 'ConsoleViewerComponent',
    // '4': 'HelpViewerComponent',
    'cad': 'GIViewerComponent',
    'geo': 'GIGeoViewerComponent',
    'vr': 'AframeViewerComponent',
    'console': 'ConsoleViewerComponent',
    // 'doc': 'HelpViewerComponent'
};

/**
 * A component that contains all the viewers.
 * This component is used in /app/appmodule/app.component.html
 */
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'model-viewers-container',
    templateUrl: 'model-viewers-container.component.html',
    styleUrls: ['model-viewers-container.component.scss']
})
export class DataViewersContainerComponent implements DoCheck, OnInit, OnDestroy {
    @ViewChild('vc', { read: ViewContainerRef, static: true }) vc: ViewContainerRef;
    // @Input() data: any;
    private views = {};
    private activeView: IView;
    private emptyModel: GIModel;
    Viewers = Viewers;
    /**
     * Construct the viewer container.
     * @param injector
     * @param r
     */
    constructor(private injector: Injector, private r: ComponentFactoryResolver, private dataService: DataService,
                private giDataService: GIDataService, private router: Router) {
        let viewCheck: any;
        this.emptyModel = _parameterTypes.newFn();
        // this.emptyModel.nextSnapshot([]);

        const page = this.router.url.split('?')[0]
        viewCheck = this.router.url.split('showViewer=');
        this.Viewers = [];
        if (viewCheck.length === 1) {
            viewCheck = '';
        } else {
            viewCheck = decodeURIComponent(viewCheck[1].split('&')[0]);
        }
        if (viewCheck.length > 0 && viewCheck[0] === '[') {
            viewCheck = viewCheck.slice(1, -1).split(',');
            for (const view of Viewers) {
                // if (view.component.name === 'HelpViewerComponent') {
                //     this.Viewers.push(view);
                //     continue;
                // }
                for (const v of viewCheck) {
                    if (view.component.name === VIEWER_MATCHING[v.trim()]) {
                        this.Viewers.push(view);
                        break;
                    }
                }
            }
        } else {
            for (const view of Viewers) {
                if (view.component.name === 'HelpViewerComponent') {
                    // if (page !== '/publish' && page !== '/minimal') {
                    //     this.Viewers.push(view);
                    // }
                    this.Viewers.push(view);
                    continue;
                }
                if (view.component.name === 'ConsoleViewerComponent') {
                    this.Viewers.push(view);
                    continue;
                }
                if (viewCheck === '0') { continue; }
                if (viewCheck === '1' && view.component.name === 'GIGeoViewerComponent') { continue; }
                if (viewCheck === '2' && view.component.name === 'GIViewerComponent') { continue; }
                this.Viewers.push(view);
            }
        }
        viewCheck = this.router.url.split('defaultViewer=');
        if (viewCheck.length > 1) {
            viewCheck = viewCheck[1].split('&')[0];
            switch (viewCheck) {
                case '0':
                    this.dataService.activeView = 'Console';
                    break;
                case '1':
                    this.dataService.activeView = 'CAD Viewer';
                    break;
                case '2':
                    this.dataService.activeView = 'Geo Viewer';
                    break;
                case 'console':
                    this.dataService.activeView = 'Console';
                    break;
                case 'cad':
                    this.dataService.activeView = 'CAD Viewer';
                    break;
                case 'geo':
                    this.dataService.activeView = 'Geo Viewer';
                    break;
                case 'vr':
                    this.dataService.activeView = 'VR Viewer';
                    break;
                case 'doc':
                    this.dataService.activeView = 'Documentation';
                    break;
            }
        }

    }
    /**
     * ngOnInit
     */
    ngOnInit() {
        this.activeView = this.Viewers[0];
        if (this.dataService.activeView) {
            for (const view of this.Viewers) {
                if (view.name === this.dataService.activeView) {
                    this.activeView = view;
                }
            }
        }
        if (this.activeView.name !== 'CAD Viewer') {
            this.giDataService.switch_page = false;
        }
        this.updateView( this.activeView );
    }
    /**
     * ngOnDestroy
     */
    ngOnDestroy() {
        this.dataService.activeView = this.activeView.name;
        this.vc.clear();
        for (const view in this.views) {
            if (this.views[view]) {
                this.views[view].destroy();
            }
        }
    }
    /**
     * ngDoCheck
     */
    ngDoCheck() {
        if (this.dataService.helpView[0] === true) {
            let view;
            for (const v of this.Viewers) {
                if (v.name === 'Documentation') { view = v; }
            }
            this.dataService.toggleViewHelp(false);
            this.updateView(view);
        } else { this.updateValue(); }
    }
    /**
     * createView
     * @param view
     */
    createView(view: IView) {
        const component = view.component;
        const factory = this.r.resolveComponentFactory(component);
        const componentRef = factory.create(this.injector);
        componentRef.instance['nodeIndex'] = 1;
        componentRef.instance['data'] = this.emptyModel;
        componentRef.instance['data'].setActiveSnapshot(1);
        /*
        if (view.name != 'Console'){
            componentRef.instance["data"] = this.data;
        }
        */
        return componentRef;
    }
    /**
     * updateView
     * @param view
     */
    updateView(view: IView, viewCheck = false): void {
        if (viewCheck && view.name === this.activeView.name) { return; }
        this.activeView = view;

        if (this.views['VR Viewer']) {
            (<HTMLElement> document.getElementById('save_aframe_camera')).click();
            setTimeout(() => {
                this.views['VR Viewer'].destroy();
                this.views['VR Viewer'] = undefined;
            }, 0);
        }

        if ( this.views[ this.activeView.name ] === undefined) {
            this.views[ this.activeView.name ] = this.createView(view);
        }

        this.updateValue();

        this.vc.detach();
        this.vc.insert( this.views[ this.activeView.name ].hostView );
    }
    /**
     * updateValue
     */
    updateValue() {
        try {
            const componentRef =  this.views[this.activeView.name];
            if (this.activeView.name === 'Documentation') {
                // componentRef.instance['output'] = this.dataService.helpView[1];
            } else if (this.activeView.name !== 'Console') {
                if (!this.dataService.node.enabled || !this.dataService.node.model) {
                    componentRef.instance['nodeIndex'] = 1;
                    componentRef.instance['data'] = this.emptyModel;
                    componentRef.instance['data'].setActiveSnapshot(1);
                } else {
                    componentRef.instance['data'] = this.dataService.flowchart.model;
                    componentRef.instance['data'].setActiveSnapshot(this.dataService.node.model);
                    componentRef.instance['nodeIndex'] = this.dataService.node.model;
                }
            // } else {
            //     componentRef.instance['scrollcheck'] = true;
            }
        } catch (ex) {
            // console.log(`Active View not defined`);
        }
    }
}
