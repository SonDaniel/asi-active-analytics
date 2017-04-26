import { Component, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { AjaxService } from '../services/ajax.service';

import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
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
      let getUser = this.ajax.get('users/').then(res => {
        this.userData = res.data;
        this.userCount = res.data.length;
      });

      let getFeedback = this.ajax.get('feedback/').then(res => {
        this.feedbackData = res.data;
        this.feedbackCount = res.data.length;
      });

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

        let obj = this.getData('MMMM');
        
        let data = {
          labels: obj['dates'],
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
            data : obj['data'].map((a) => {return a.count})
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

  getData(format: string, start: any = null, end: any = null) : Object {
    let dates = [];
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
    let dataObject = {
      count : 0,
      start: null,
      end: null
    }
    for(let x in this.logData) {
      let date = moment(this.logData[x]['datetime']);

      if(start.diff(date) <= 0 && end.diff(date) >= 0) {
        if(!dates.includes(date.format(format))) {
          dates.push(date.format(format));
        }

        if(dateComparable === date.format(format)) {
          dataObject.count++;
        } else {
          dateComparable = date.format(format);
          dataObject.end = date;
          data.push(dataObject);
          
          dataObject = {
            count : 1,
            start: date,
            end: null
          };
        }
      }
    }

    data.push(dataObject);

    return {
      'dates' : dates,
      'data' : data
    }
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
    console.log(JSON.stringify(selected));

    let data = this.getData('M-DD', selected.data.start, selected.data.end);
    console.log(JSON.stringify(data));
    // this.overalldataChart.datasets[0].data = 
  }

  onHover(event) {
    //TO DO: Show different Graph and activate
  }

}
