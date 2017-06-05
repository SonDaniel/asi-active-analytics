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
  timedataChart : Chart;
  categoryDataChart: Chart;
  
  logData : Array<Object> = [];
  selectedData : Array<Object>;

  monthData : Array<Object> = [];
  totalLogs : number;

  //selected is defaulted to -1 to show overall log data
  selected : any = -1;

  showList : boolean = true;

  constructor(private ajax: AjaxService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe((dataSet: {logData : any}) => {
        this.logData = dataSet.logData;
        this.totalLogs = this.logData.length;

        this.logData.sort(function(left, right) : number {
          return moment(left['datetime']).diff(moment(right['datetime']));
        });

        this.selectedData = this.logData;

        let overallDataMap = new Map();
        let timeDataMap = new Map();
        let categoryDataMap = new Map();

        // Extract datetime for LogData
        for(let x of this.logData) {
          if(overallDataMap.has(moment(x['datetime']).format('MMMM'))) {
            overallDataMap.set(moment(x['datetime']).format('MMMM') , overallDataMap.get(moment(x['datetime']).format('MMMM')) + 1);
          } else {
            overallDataMap.set(moment(x['datetime']).format('MMMM'), 1);
          }          
          
          if(timeDataMap.has(x['profile_name'])) {
            timeDataMap.set(x['profile_name'], timeDataMap.get(x['profile_name']) + 1);
          } else {
            timeDataMap.set(x['profile_name'], 1);
          }

          if(categoryDataMap.has(x['log_name'])) {
            categoryDataMap.set(x['log_name'], categoryDataMap.get(x['log_name']) + 1);
          } else {
            categoryDataMap.set(x['log_name'], 1);
          }
        }


        let overallData = {
          labels: Array.from(overallDataMap.keys()),
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
            data : Array.from(overallDataMap.values())
          }]
        };

        let timeData = {
          labels: Array.from(timeDataMap.keys()),
          datasets: [{
            label: 'Number of User Logs',
            backgroundColor: randomColor({
              count: timeDataMap.size,
              lumininosity: 'dark',
            }),
            borderColor: "#000",
            borderWidth: 1,
            data: Array.from(timeDataMap.values())
          }]
        };

        let categoryData = {
          labels: Array.from(categoryDataMap.keys()),
          datasets: [{
            label: 'Trending Categories',
            backgroundColor: randomColor({
              count: categoryDataMap.size,
              lumininosity: 'dark',
            }),
            borderColor: "#000",
            borderWidth: 1,
            data: Array.from(categoryDataMap.values())
          }]
        };

        this.monthData = this.combineData(overallData.labels, overallData.datasets[0].data);

        let overallDataCtx = this.overallData.nativeElement.getContext('2d');
        let timeDataCtx = this.timeData.nativeElement.getContext('2d');
        let categoryDataCtx = this.categoryData.nativeElement.getContext('2d');

        this.overallDataChart = new Chart(overallDataCtx, {
          type: 'line',
          data : overallData
        });

        this.timedataChart = new Chart(timeDataCtx, {
          type: 'horizontalBar',
          data: timeData
        });

        this.categoryDataChart = new Chart(categoryDataCtx, {
          type: 'horizontalBar',
          data: categoryData
        })
    });
  }

  countData(format: string, start: any = null, end: any = null, dataMap: Map<string, number>) : Map<string, number> {
    this.selectedData = [];
    if(!start) {
      start = moment(this.logData[0]['datetime']).format('YYYY-MM-DD');
    } else {
      start = moment(start).format('YYYY-MM-DD');
    }

    if(!end) {
      end = moment(this.logData[this.logData.length - 1]['datetime']).add(1, 'days').format('YYYY-MM-DD');
    } else {
      end = moment(end).add(1, 'days').format('YYYY-MM-DD');
    }

    for(let x of this.logData) {
      let date = moment(x['datetime']);
      if(date.isBetween(start, end, null , '[]') && dataMap.has(date.format(format))) {
          dataMap.set(date.format(format), dataMap.get(date.format(format)) + 1);
          this.selectedData.push(x);
      }
    }
    return dataMap;
  }

  combineData(labels : Array<String>, data : Array<Number>) : Array<Object> {
    return data.map((x, i) => {
      return {
        'date': labels[i],
        'data': x
      }
    });
  }

  selectList(obj) {
    this.selected = obj;
    let overallDataMap = new Map();
    let timeDataMap = new Map();
    let categoryDataMap = new Map();

    if(this.selected != -1) {
      for(let x of this.logData) {
        let date = moment(x['datetime']);
        if(date.format('MMMM') === obj['date']) {
          overallDataMap.set(date.format('MM-DD'), 0);
        }
      }

      let dateArray = Array.from(overallDataMap.keys());

      overallDataMap = this.countData('MM-DD', `2017-${dateArray[0]}`, `2017-${dateArray[dateArray.length -1]}`, overallDataMap);

      for(let x of this.selectedData) {
          if(timeDataMap.has(x['profile_name'])) {
            timeDataMap.set(x['profile_name'], timeDataMap.get(x['profile_name']) + 1);
          } else {
            timeDataMap.set(x['profile_name'], 1);
          }

          if(categoryDataMap.has(x['log_name'])) {
            categoryDataMap.set(x['log_name'], categoryDataMap.get(x['log_name']) + 1);
          } else {
            categoryDataMap.set(x['log_name'], 1);
          }
      }
      
      this.overallDataChart.data.labels = dateArray;

      this.overallDataChart.data.datasets[0].data = Array.from(overallDataMap.values());

    } else {
        // Extract datetime for LogData
        for(let x of this.logData) {
          if(overallDataMap.has(moment(x['datetime']).format('MMMM'))) {
            overallDataMap.set(moment(x['datetime']).format('MMMM') , overallDataMap.get(moment(x['datetime']).format('MMMM')) + 1);
          } else {
            overallDataMap.set(moment(x['datetime']).format('MMMM'), 1);
          }          
          
          if(timeDataMap.has(x['profile_name'])) {
            timeDataMap.set(x['profile_name'], timeDataMap.get(x['profile_name']) + 1);
          } else {
            timeDataMap.set(x['profile_name'], 1);
          }

          if(categoryDataMap.has(x['log_name'])) {
            categoryDataMap.set(x['log_name'], categoryDataMap.get(x['log_name']) + 1);
          } else {
            categoryDataMap.set(x['log_name'], 1);
          }
        }

        this.overallDataChart.data.labels = Array.from(overallDataMap.keys());

        this.overallDataChart.data.datasets[0].data = Array.from(overallDataMap.values());

        this.selectedData = this.logData;
    }
      this.timedataChart.data.labels = Array.from(timeDataMap.keys());
      this.categoryDataChart.data.labels = Array.from(categoryDataMap.keys());

      this.timedataChart.data.datasets[0].data = Array.from(timeDataMap.values());
      this.categoryDataChart.data.datasets[0].data = Array.from(categoryDataMap.values());

    this.overallDataChart.update();
    this.timedataChart.update();
    this.categoryDataChart.update();

    this.totalLogs = this.selectedData.length;
  }

  onHover(event) {
    //TO DO: Show different Graph and activate
  }

  formatDate(date : string) : string {
    return moment(date).format('LLL');
  }
}
