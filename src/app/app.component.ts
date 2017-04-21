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
        
        let data = {
          labels: this.getDates(),
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
            data : this.getData()
          }]
        };

        this.combineData(data.labels, data.datasets[0].data);

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

  getDates() : Array<String> {
    let data = [];
    for(let x in this.logData) {
      let date = moment(this.logData[x]['datetime']).format('MMMM');
      if(!data.includes(date)) {
        data.push(date);
      }
    }
    return data;
  }

  getData() : Array<Number> {
    let data = [];
    let count = 0;
    let date = moment(this.logData[0]['datetime']).format('MMMM');
    for(let x in this.logData) {
      let tempDate = moment(this.logData[x]['datetime']).format('MMMM');
      if(tempDate === date) {
        count++;
      } else {
        date = tempDate;
        data.push(count);
        count = 0;
      }
    }
    data.push(count);
    return data;
  }

  combineData(labels : Array<String>, data : Array<Number>) {
    for(let x in data) {
      {
        let object = {
          month: labels[x],
          data: data[x],
          selected: false
        }
        this.monthData.push(object);
      }
    }
  }

  selectList(event, selected : any) {
    event.preventDefault();
    this.selected = selected;
    console.log(JSON.stringify(selected));
    
  }

  onHover(event) {
    //TO DO: Show different Graph and activate
  }
}
