import { Component, Injector, OnInit, OnDestroy, Injectable } from '@angular/core';
import { DataService } from '@services';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    // notificationMessage = 'Saving Flowchart...';
    // notificationTrigger = true;

    constructor(private dataService: DataService, private injector: Injector,
        private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
        this.matIconRegistry.addSvgIcon('printDis', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Print_disabled.svg'));
        this.matIconRegistry.addSvgIcon('print', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/iconPrint.svg'));
        this.matIconRegistry.addSvgIcon('disabled', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/iconDisabled.svg'));
        this.matIconRegistry.addSvgIcon('settings', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Settings.svg'));
        this.matIconRegistry.addSvgIcon('select', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Select.svg'));
        this.matIconRegistry.addSvgIcon('terminate', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Terminate.svg'));

        this.matIconRegistry.addSvgIcon('c3D Viewer', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/3D2.svg'));
        this.matIconRegistry.addSvgIcon('cThree Geo Viewer', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/location_searching.svg'));
        this.matIconRegistry.addSvgIcon('cVR Viewer', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/panorama_horizontal.svg'));

        this.matIconRegistry.addSvgIcon('cCytoscape Viewer', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/cyto.svg'));
        this.matIconRegistry.addSvgIcon('cMobius Cesium', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Geo2.svg'));
        this.matIconRegistry.addSvgIcon('cConsole', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Console.svg'));
        this.matIconRegistry.addSvgIcon('cHelp', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Help.svg'));
        this.matIconRegistry.addSvgIcon('cSummary', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Summary.svg'));
        this.matIconRegistry.addSvgIcon('cZoom', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Zoom.svg'));
        this.matIconRegistry.addSvgIcon('cfv', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Mobius favicon.svg'));
        this.matIconRegistry.addSvgIcon('cMenu', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Three Lines Menu.svg'));
        this.matIconRegistry.addSvgIcon('cGallery', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Home.svg'));
        this.matIconRegistry.addSvgIcon('cDashboard', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Dashboard.svg'));
        this.matIconRegistry.addSvgIcon('cFlowchart', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Flowchart.svg'));
        this.matIconRegistry.addSvgIcon('cEditor', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Node.svg'));
        this.matIconRegistry.addSvgIcon('cAdd', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/add.svg'));
        this.matIconRegistry.addSvgIcon('cRemove', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/remove.svg'));
        this.matIconRegistry.addSvgIcon('cCredits', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Credits.svg'));
        this.matIconRegistry.addSvgIcon('cUpArrow', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/arrowup.svg'));
        this.matIconRegistry.addSvgIcon('cDnArrow', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/arrowdown.svg'));
        this.matIconRegistry.addSvgIcon('cControlCam', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/ControlCam.svg'));

    }

    ngOnInit() {
        this.dataService.rendererInfo = this.getVideoCardInfo();
        let errorMsg = null;
        if (this.dataService.rendererInfo.error) {
            errorMsg = 'No WebGL renderer detected.';
        } else if (this.dataService.rendererInfo.renderer.toLowerCase().indexOf('google') !== -1) {
            errorMsg = `<div>You have not enabled hardware support for WebGL rendering. Performance will be degraded.
                        <br> 1. In Chrome, select "Menu" > "Settings"
                        <br> 2. Scroll down to the bottom and select the “Advanced” option.
                        <br> 3. Scroll to the “System” section and switch on “Use hardware acceleration when available”.</div>`;
        }
        if (errorMsg) {
            setTimeout(() => {
                this.dataService.notifyMessage(errorMsg);
            }, 1000);
        }
    }
    ngOnDestroy() {
    }

    notificationMsg() {
        return this.dataService.notificationMessage;
    }

    notificationTrig() {
        return this.dataService.notificationTrigger;
    }

    getVideoCardInfo() {
        const gl = document.createElement('canvas').getContext('webgl');
        if (!gl) {
          return {
            error: 'no webgl',
          };
        }
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        return debugInfo ? {
          vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
          renderer:  gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
        } : {
          error: 'no WEBGL_debug_renderer_info',
        };
      }
}

@Injectable()
export class NoCacheHeadersInterceptor implements HttpInterceptor {
intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authReq = req.clone({
      // Prevent caching in IE, in particular IE11.
      // See: https://support.microsoft.com/en-us/help/234067/how-to-prevent-caching-in-internet-explorer
      setHeaders: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache'
      }
    });
    return next.handle(authReq);
  }
}
