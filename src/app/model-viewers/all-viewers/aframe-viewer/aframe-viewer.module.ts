import { AngularSplitModule } from 'angular-split';
import { NgxPaginationModule} from 'ngx-pagination';
// import @angular stuff
import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule} from '@angular/material/expansion';
import { ColorPickerModule } from 'ngx-color-picker';

// import app components
import { AframeViewerComponent } from './aframe-viewer.component';

import { ModalService } from './html/modal-window.service';
import { DataAframeService } from './data/data.aframe.service';
import { AframeMainComponent } from './main/aframe-main.component';
import { ModalWindowComponent } from './html/modal-window.component';
import { DropdownMenuComponent } from './html/dropdown-menu.component';
import { TabsComponent } from './html/tabs.component';
import { TabComponent } from './html/tab.component';

/**
 * GIViewer
 * A viewer for Geo-Info models.
 */
@NgModule({
    declarations: [
        AframeViewerComponent,
        AframeMainComponent,
        TabComponent,
        TabsComponent,
        DropdownMenuComponent,
        ModalWindowComponent
    ],
    exports: [
        AframeViewerComponent
    ],
    imports: [
        CommonModule,
        AngularSplitModule,
        MatSliderModule,
        MatIconModule,
        NgxPaginationModule,
        MatExpansionModule,
        MatTooltipModule,
        FormsModule,
        ColorPickerModule
    ],
    providers: [
        ModalService,
        DataAframeService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AframeViewerModule {
     static forRoot(): ModuleWithProviders {
        return {
            ngModule: AframeViewerModule
        };
    }
}
