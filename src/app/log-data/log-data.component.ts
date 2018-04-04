import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Chart } from 'chart.js';

import { AjaxService } from '../../services/ajax.service';

import * as randomColor from 'randomcolor';
import * as moment from 'moment';

@Component({
  selector: 'app-log-data',
  templateUrl: './log-data.component.html',
  styleUrls: ['./log-data.component.css']
})
export class LogDataComponent implements OnInit {
  @ViewChild('overallData') overallData : ElementRef;
  @ViewChild('timeData') timeData : ElementRef;
  @ViewChild('categoryData') categoryData : ElementRef;

  overallDataChart : Chart;
  
  logData : Array<Object> = [];
  overallDataMap = new Map();

  monthData : Array<Object> = [];
  totalLogs : number;

  constructor(private ajax: AjaxService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe((dataSet: {logData : any}) => {
        for(var log of dataSet.logData) {
          this.logData = this.logData.concat(log.activitylog_set).concat(log.eventlog_set);
        }

        this.totalLogs = this.logData.length;

        this.logData.sort(function(left, right) : number {
          return moment(left['datetime']).diff(moment(right['datetime']));
        });

        this.overallDataMap = new Map();

        // Extract datetime for LogData
        for(let x of this.logData) {
          if(this.overallDataMap.has(moment(x['datetime']).format('MMMM'))) {
            this.overallDataMap.set(moment(x['datetime']).format('MMMM') , this.overallDataMap.get(moment(x['datetime']).format('MMMM')) + 1);
          } else {
            this.overallDataMap.set(moment(x['datetime']).format('MMMM'), 1);
          }
        }
        
        let overallData = {
          labels: Array.from(this.overallDataMap.keys()),
          datasets: [{
            label: 'Number of Logs',
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            data : Array.from(this.overallDataMap.values())
          }]
        };

        let overallDataCtx = this.overallData.nativeElement.getContext('2d');

        this.overallDataChart = new Chart(overallDataCtx, {
          type: 'line',
          data : overallData,
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });
    });
  }
}
