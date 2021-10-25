import { Component, HostListener, Input } from '@angular/core';
import { DataService } from '@shared/services';

@Component({
  selector: 'publish-header',
  templateUrl:  'publish-header.component.html',
  styleUrls: ['publish-header.component.scss']
})
export class PublishHeaderComponent {

    @Input() title: string;
    expando_href: string;

    constructor(private dataService: DataService) {
    }

    getTitle() {
        return this.title.replace(/_/g, ' ');
    }

    notifyMessage(event) {
        this.dataService.notifyMessage(event.target.value);
        event.target.value = '';
    }

    @HostListener('window:click', ['$event'])
    onWindowClick(event: MouseEvent) {
        if ((<HTMLElement>event.target).id === 'addBackup' || (<HTMLElement>event.target).id === 'addBackupButton') {
            return;
        }
        const helpMenu = document.getElementById('helpMenu');
        if (helpMenu) {
            helpMenu.style.display = 'none';
        }
        const objDropdown = document.getElementById('object_dropdown');
        if (objDropdown) {
            objDropdown.style.display = 'none';
        }
    }
}
