import { ElementRef, ViewChild } from '@angular/core';
import minimapModule from 'diagram-js-minimap';
import BpmnColorPickerModule from 'bpmn-js-color-picker';
import { Component } from '@angular/core';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel/dist';
import { MenuComponent } from './menu/menu.component';
import { BpmnService } from '../shared/services/bpmn.service';
import { SaveXMLResult } from 'bpmn-js/lib/BaseViewer';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-diagram',
  standalone: true,
  imports: [
    MenuComponent
  ],
  templateUrl: './diagram.component.html',
  styleUrl: './diagram.component.css'
})
export class DiagramComponent {

  public modeler: BpmnModeler
  private panel: any;

  @ViewChild('ref', { static: true }) private el!: ElementRef;
  @ViewChild('properties', { static: true }) private propertiesPanel!: ElementRef;

  constructor(
    private bpmnService: BpmnService,
    private httpClient: HttpClient
  ){
    this.modeler = new BpmnModeler({
      position: 'absolute',
      additionalModules: [
        minimapModule,
        BpmnColorPickerModule,
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule
      ]
    })
  }

  ngOnInit(): void{
    const existingDataXML = this.bpmnService.getXML();

    if(!existingDataXML) {
      this.httpClient.get<string>('assets/template.bpmn').subscribe({
          next: (xml: string) => { this.modeler.importXML(xml) },
          error: (e) => console.error(e),
          complete: () => console.info('Get city list request...')
      });
    } else {
      this.modeler.importXML(existingDataXML)
    }
  }
  
  ngAfterContentInit(): void{
    this.modeler.attachTo(this.el.nativeElement);
    this.panel = this.modeler.get('propertiesPanel');
    this.panel.attachTo(this.propertiesPanel.nativeElement);
    this.bpmnService.setModeler(this.modeler);
  }

  ngOnDestroy(): void {
    this.modeler.destroy();
  }

  
}
