import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { AjaxService } from '../../services/ajax.service';

import * as moment from 'moment';

@Component({
  selector: 'app-log-data',
  templateUrl: './log-data.component.html',
  styleUrls: ['./log-data.component.css']
})
export class LogDataComponent implements OnInit {
  @ViewChild('overallData') overallData : ElementRef;
  overalldataChart : Chart;
  
  // variables for frontend
  userCount: number;
  feedbackCount : number;

  userData : Array<Object>;
  feedbackData : Array<Object>;
  logData : Array<Object> = [];
  rankData : Array<Object>;

  monthData : Array<Object> = [];
  totalLogs : number;

  selected : any = -1;

  constructor(private ajax: AjaxService) {}

  ngOnInit() {
    this.ajax.init().then(() => {
      let getActivityLog = this.ajax.get('activity-logs/').then(res => {
        this.logData = this.logData.concat(res.data);
      });

      let getEventLog = this.ajax.get('event-logs/').then(res => {
        this.logData = this.logData.concat(res.data);
      });

      let getRank = this.ajax.get('users/rankings/').then(res => {
        this.rankData = res.data;
      });

      Promise.all([getActivityLog, getEventLog]).then(() => {
        this.totalLogs = this.logData.length;

        this.logData.sort(function(left, right) : number {
          return moment(left['datetime']).diff(moment(right['datetime']));
        });

        let dateSet = new Set();
        
        // Extract datetime for LogData
        for(let x of this.logData) {
          dateSet.add(moment(x['datetime']).format('MMMM'));
        }

        let data = {
          labels: Array.from(dateSet),
          datasets: [{
            label: 'Number of Logs',
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            data : this.countData('MMMM')
          }]
        };

        this.monthData = this.combineData(data.labels, data.datasets[0].data);

        let ctx = this.overallData.nativeElement.getContext('2d');

        this.overalldataChart = new Chart(ctx, {
          type: 'line',
          data : data,
          options: {

          }
        });
      });
    });
  }

  countData(format: string, start: any = null, end: any = null) : Array<Number> {
    let data = [];

    if(!start) {
      start = moment(this.logData[0]['datetime']);
    } else {
      start = moment(start);
    }

    if(!end) {
      end = moment(this.logData[this.logData.length - 1]['datetime']);
    } else {
      end = moment(end);
    }

    let dateComparable = start.format(format);
    let count = 0;
    for(let x in this.logData) {
      let date = moment(this.logData[x]['datetime']);

      if(start.diff(date) <= 0 && end.diff(date) >= 0) {
        if(dateComparable === date.format(format)) {
          count++;
        } else {
          dateComparable = date.format(format);
          data.push(count);
          count = 1;
        }
      }
    }

    data.push(count);

    return data;
  }

  combineData(labels : Array<String>, data : Array<Number>) : Array<Object> {
    return data.map((x, i) => {
      return {
        'date': labels[i],
        'data': x
      }
    });
  }

  selectList(event, selected : any) {
    event.preventDefault();
    this.selected = selected;
    var dateSet = new Set();

    if(this.selected != -1) {
      for(let x of this.logData) {
        let date = moment(x['datetime']);
        if(date.format('MMMM') === selected['date']) {
          dateSet.add(date.format('MM-DD'));
        }
      }
      let dataArray = Array.from(dateSet);
      this.overalldataChart.data.labels = dataArray;
      this.overalldataChart.data.datasets[0].data = this.countData('MM-DD', `2017-${dataArray[0]}`, `2017-${dataArray[dataArray.length -1]}`);
      console.log(this.overalldataChart.data.labels);
      console.log(this.overalldataChart.data.datasets[0].data);
    } else {
        for(let x of this.logData) {
          dateSet.add(moment(x['datetime']).format('MMMM'));
        }
        this.overalldataChart.data.labels = Array.from(dateSet);
        this.overalldataChart.data.datasets[0].data = this.countData('MMMM');
        console.log(this.overalldataChart.data.labels);
        console.log(this.overalldataChart.data.datasets[0].data);
    }

    this.overalldataChart.update();
  }

  onHover(event) {
    //TO DO: Show different Graph and activate
  }
}
