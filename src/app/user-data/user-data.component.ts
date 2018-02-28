import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Chart } from 'chart.js';

import { AjaxService } from '../../services/ajax.service';

import * as randomColor from 'randomcolor';
import * as moment from 'moment';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {
  @ViewChild('userChart') userChart : ElementRef;
  userData : any;
  userDataChart: Chart;

  currentUserData : any;
  currentUserDataLog : Array<any> = [];

  constructor(private ajax: AjaxService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.loadChartPlugin();

    this.route.data.subscribe((data: {userData : any}) => {
      this.userData = data.userData;

      let userDataMap = new Map();

      this.currentUserData = this.userData[0];
      console.log(JSON.stringify(this.currentUserData));
      this.currentUserDataLog = this.currentUserDataLog.concat(this.currentUserData.categories).concat(this.currentUserData.events);

      for(let x of this.currentUserDataLog) {
        let date = moment(x['datetime']).format('M-DD');

        if(userDataMap.has(date)) {
          userDataMap.set(date, userDataMap.get(date) + x['points']);
        } else {
          userDataMap.set(date, x['points']);
        }
      }

      let userData = {
        labels: Array.from(userDataMap.keys()),
        datasets: [{
          label: 'number of points',
          borderColor:  randomColor({
            count: 1,
            lumininosity: 'light',
            alpha: 0.5
          }),
          borderCapStyle: 'butt',
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          fill: false,
          data : Array.from(userDataMap.values())
        }]
      };

      let userDataCtx = this.userChart.nativeElement.getContext('2d');

      this.userDataChart = new Chart(userDataCtx, {
        type: 'line',
        data : userData,
        options: {
          "horizontalLine": [{
            "y": 16,
            "style": "rgba(255, 0, 0, .4)",
            "text": "max"
          }]
        }
      });
    });
  }

  selectUser(userObj) {
    this.currentUserData = userObj;
    this.currentUserDataLog = userObj.categories.concat(userObj.events);

    let userDataMap = new Map();

    for(let x of this.currentUserDataLog) {
      let date = moment(x['datetime']).format('M-DD');

      if(userDataMap.has(date)) {
        userDataMap.set(date, userDataMap.get(date) + x['points']);
      } else {
        userDataMap.set(date, x['points']);
      }
    }

    this.userDataChart.data.labels = Array.from(userDataMap.keys());
    this.userDataChart.data.datasets[0].data = Array.from(userDataMap.values());
    this.userDataChart.update();
  }

  private loadChartPlugin() {
    // This code is a plugin to create a horizontal line for chartJS //
    let horizonalLinePlugin = {
      afterDraw: function(chartInstance) {
        let yValue;
        let yScale = chartInstance.scales["y-axis-0"];
        let canvas = chartInstance.chart;
        let ctx = canvas.ctx;
        let index;
        let line;
        let style;

        if (chartInstance.options.horizontalLine) {
          for (index = 0; index < chartInstance.options.horizontalLine.length; index++) {
            line = chartInstance.options.horizontalLine[index];

            if (!line.style) {
              style = "rgba(169,169,169, .6)";
            } else {
              style = line.style;
            }

            if (line.y) {
              yValue = yScale.getPixelForValue(line.y);
            } else {
              yValue = 0;
            }

            ctx.lineWidth = 3;

            if (yValue) {
              ctx.beginPath();
              ctx.moveTo(0, yValue);
              ctx.lineTo(canvas.width, yValue);
              ctx.strokeStyle = style;
              ctx.stroke();
            }

            if (line.text) {
              ctx.fillStyle = style;
              ctx.fillText(line.text, 0, yValue + ctx.lineWidth);
            }
          }
          return;
        }
      }
    };
    Chart.pluginService.register(horizonalLinePlugin);
  }
}
