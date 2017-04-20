import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { AjaxService } from '../services/ajax.service';

@Component({
  selector: 'app-graph',
  template: `
    <div class="card">
        <div class="card-block">
    <canvas #graph width="auto" height="auto"></canvas>
        </div>
    </div>
  `,
})
export class Graph {
    @Input() graphIdentifier : string;
    @ViewChild('graph') graph: ElementRef;

    ngOnInit() {
    let firstChartCtx = this.graph.nativeElement.getContext('2d');
    let data = {
      labels: [
        'Value A',
        'Value B'
      ],
      datasets: [
        {
          'data': [101342, 55342],
          'backgroundColor': [
            '#1fc8f8',
            '#76a346'
          ]
        }]
    };
    
    let chart = new Chart(firstChartCtx, {
      'type': 'line',
      'data': data,
      'options': {
        'cutoutPercentage' : 50,
        'animation': {
          'animateScale': true,
          'aniateRotate': false
        }
      }
    });
    }
}
