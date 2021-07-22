import { Component, Injector, OnInit, OnDestroy, Injectable } from '@angular/core';
import { DataService } from '@services';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';


declare var AFRAME;
function registerAframeComponents() {
    const KEYCODE_TO_CODE = {
        '38': 'ArrowUp',
        '37': 'ArrowLeft',
        '40': 'ArrowDown',
        '39': 'ArrowRight',
        '87': 'KeyW',
        '65': 'KeyA',
        '83': 'KeyS',
        '68': 'KeyD'
    };
    const bind = AFRAME.utils.bind;
    const shouldCaptureKeyEvent = AFRAME.utils.shouldCaptureKeyEvent;
    const THREE = AFRAME.THREE;

    const CLAMP_VELOCITY = 0.00001;
    const MAX_DELTA = 0.2;
    const KEYS = [
        'KeyW', 'KeyA', 'KeyS', 'KeyD',
        'ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown'
    ];

    function isEmptyObject (keys) {
        let key;
        // tslint:disable-next-line: forin
        for (key in keys) {return false; }
        return true;
    }

    AFRAME.registerComponent('custom-wasd-controls', {
        schema: {
            acceleration: {default: 65},
            adAxis: {default: 'x', oneOf: ['x', 'y', 'z']},
            adEnabled: {default: true},
            adInverted: {default: false},
            enabled: {default: true},
            fly: {default: false},
            wsAxis: {default: 'z', oneOf: ['x', 'y', 'z']},
            wsEnabled: {default: true},
            wsInverted: {default: false}
        },

        init: function () {
            // To keep track of the pressed keys.
            this.keys = {};
            this.easing = 1.1;

            this.velocity = new THREE.Vector3();

            // Bind methods and add event listeners.
            this.onBlur = bind(this.onBlur, this);
            this.onContextMenu = bind(this.onContextMenu, this);
            this.onFocus = bind(this.onFocus, this);
            this.onKeyDown = bind(this.onKeyDown, this);
            this.onKeyUp = bind(this.onKeyUp, this);
            this.onVisibilityChange = bind(this.onVisibilityChange, this);
            this.attachVisibilityEventListeners();
            this.lookCamera = document.getElementById('aframe_look_camera');
        },

        tick: function (time, delta) {
            const data = this.data;
            const el = this.el;
            const velocity = this.velocity;
            // const bg = this.backgroundSky;

            if (!velocity[data.adAxis] && !velocity[data.wsAxis] &&
                isEmptyObject(this.keys)) { return; }

            // Update velocity.
            delta = delta / 1000;
            this.updateVelocity(delta);

            if (!velocity[data.adAxis] && !velocity[data.wsAxis]) { return; }

            // Get movement vector and translate position.
            el.object3D.position.add(this.getMovementVector(delta));
            // if (bg) {
            //     bg.object3D.position.copy(el.object3D.position);
            // }
        },

        remove: function () {
            this.removeKeyEventListeners();
            this.removeVisibilityEventListeners();
        },

        play: function () {
            this.attachKeyEventListeners();
        },

        pause: function () {
            this.keys = {};
            this.removeKeyEventListeners();
        },

        updateVelocity: function (delta) {
            let acceleration;
            let adAxis;
            let adSign;
            const data = this.data;
            const keys = this.keys;
            const velocity = this.velocity;
            let wsAxis;
            let wsSign;

            adAxis = data.adAxis;
            wsAxis = data.wsAxis;

            // If FPS too low, reset velocity.
            if (delta > MAX_DELTA) {
                velocity[adAxis] = 0;
                velocity[wsAxis] = 0;
                return;
            }

            // https://gamedev.stackexchange.com/questions/151383/frame-rate-independant-movement-with-acceleration
            const scaledEasing = Math.pow(1 / this.easing, delta * 60);
            // Velocity Easing.
            if (velocity[adAxis] !== 0) {
                velocity[adAxis] = velocity[adAxis] * scaledEasing;
            }
            if (velocity[wsAxis] !== 0) {
                velocity[wsAxis] = velocity[wsAxis] * scaledEasing;
            }

            // Clamp velocity easing.
            if (Math.abs(velocity[adAxis]) < CLAMP_VELOCITY) { velocity[adAxis] = 0; }
            if (Math.abs(velocity[wsAxis]) < CLAMP_VELOCITY) { velocity[wsAxis] = 0; }

            if (!data.enabled) { return; }

            // Update velocity using keys pressed.
            acceleration = data.acceleration;
            if (data.adEnabled) {
                adSign = data.adInverted ? -1 : 1;
                if (keys.KeyA || keys.ArrowLeft) { velocity[adAxis] -= adSign * acceleration * delta; }
                if (keys.KeyD || keys.ArrowRight) { velocity[adAxis] += adSign * acceleration * delta; }
            }
            if (data.wsEnabled) {
                wsSign = data.wsInverted ? -1 : 1;
                if (keys.KeyW || keys.ArrowUp) { velocity[wsAxis] -= wsSign * acceleration * delta; }
                if (keys.KeyS || keys.ArrowDown) { velocity[wsAxis] += wsSign * acceleration * delta; }
            }
        },

        getMovementVector: (function () {
            const directionVector = new THREE.Vector3(0, 0, 0);
            const rotationEuler = new THREE.Euler(0, 0, 0, 'YXZ');

            return function (delta) {
                const rotation = this.lookCamera.getAttribute('rotation');
                const velocity = this.velocity;
                let xRotation;

                directionVector.copy(velocity);
                directionVector.multiplyScalar(delta);

                // Absolute.
                if (!rotation) { return directionVector; }

                xRotation = this.data.fly ? rotation.x : 0;

                // Transform direction relative to heading.
                rotationEuler.set(THREE.Math.degToRad(xRotation), THREE.Math.degToRad(rotation.y), 0);
                directionVector.applyEuler(rotationEuler);
                return directionVector;
            };
        })(),

        attachVisibilityEventListeners: function () {
            window.oncontextmenu = this.onContextMenu;
            window.addEventListener('blur', this.onBlur);
            window.addEventListener('focus', this.onFocus);
            document.addEventListener('visibilitychange', this.onVisibilityChange);
        },

        removeVisibilityEventListeners: function () {
            window.removeEventListener('blur', this.onBlur);
            window.removeEventListener('focus', this.onFocus);
            document.removeEventListener('visibilitychange', this.onVisibilityChange);
        },

        attachKeyEventListeners: function () {
            window.addEventListener('keydown', this.onKeyDown);
            window.addEventListener('keyup', this.onKeyUp);
        },

        removeKeyEventListeners: function () {
            window.removeEventListener('keydown', this.onKeyDown);
            window.removeEventListener('keyup', this.onKeyUp);
        },

        onContextMenu: function () {
            const keys = Object.keys(this.keys);
            for (let i = 0; i < keys.length; i++) {
                delete this.keys[keys[i]];
            }
        },

        onBlur: function () {
            this.pause();
        },

        onFocus: function () {
            this.play();
        },

        onVisibilityChange: function () {
            if (document.hidden) {
                this.onBlur();
            } else {
                this.onFocus();
            }
        },

        onKeyDown: function (event) {
            let code;
            if (!shouldCaptureKeyEvent(event)) { return; }
            code = event.code || KEYCODE_TO_CODE[event.keyCode];
            if (KEYS.indexOf(code) !== -1) { this.keys[code] = true; }
            // if (Object.keys(this.keys).length > 0) {
            //     if (this.lastsettimeout) {
            //         clearTimeout(this.lastsettimeout);
            //     }
            //     this.backgroundSky.setAttribute('visible', false);
            // }
        },

        onKeyUp: function (event) {
            let code;
            code = event.code || KEYCODE_TO_CODE[event.keyCode];
            delete this.keys[code];
            // if (Object.keys(this.keys).length === 0) {
            //     this.lastsettimeout = setTimeout(() => {
            //         this.backgroundSky.setAttribute('visible', true);
            //     }, 700);
            // }
        }
      });
}


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

        this.matIconRegistry.addSvgIcon('cCAD Viewer', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/3D2.svg'));
        this.matIconRegistry.addSvgIcon('cGeo Viewer', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/location_searching.svg'));
        this.matIconRegistry.addSvgIcon('cVR Viewer', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/panorama_horizontal.svg'));

        this.matIconRegistry.addSvgIcon('cCytoscape Viewer', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/cyto.svg'));
        this.matIconRegistry.addSvgIcon('cMobius Cesium', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Geo2.svg'));
        this.matIconRegistry.addSvgIcon('cConsole', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Console.svg'));
        this.matIconRegistry.addSvgIcon('cDocumentation', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/doc.svg'));
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
        this.matIconRegistry.addSvgIcon('cHelp', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/Icons/Help.svg'));
        registerAframeComponents();
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
