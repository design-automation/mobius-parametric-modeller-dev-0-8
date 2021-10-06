import { Component, Injector, OnInit, OnDestroy, Injectable } from '@angular/core';
import { DataService } from '@services';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import * as icon_reg from '@assets/Icons/icon_reg.json';

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
        this.registerIcons();
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

    registerIcons() {
        // @ts-ignore
        icon_reg.default.data.forEach(
            entry => this.matIconRegistry.addSvgIcon(entry.name, this.domSanitizer.bypassSecurityTrustResourceUrl(entry.url))
        );
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
