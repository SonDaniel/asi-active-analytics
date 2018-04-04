import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { Chart } from 'chart.js';
import * as randomColor from 'randomcolor';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('milestoneChart') milestoneChart: ElementRef;
  @ViewChild('badgeChart') badgeChart: ElementRef;
  @ViewChild('userChart') userChart: ElementRef;

  public rankList = [];
  public departmentList = [];
  public userData = [];
  public milestoneData = [];
  public badgeData = [];
  milestoneDataChart: Chart;
  badgeDataChart: Chart;
  userDataChart: Chart;
  numOfUsers: any;
  
  constructor(private http: AjaxService) { }

  ngOnInit() {
    this.http.init().then(() => {
      let deptMap = new Map();

      this.http.get('api/users/rankings').then((res) => {
        this.rankList = res.data;
        this.numOfUsers = this.rankList.length;
        console.log(this.rankList);

        for(var x of this.rankList) {
          let dept = x['dept'];
          if(deptMap.has(dept)) {
            deptMap.set(dept, deptMap.get(dept) + 1);
          } else {
            deptMap.set(dept, 1);
          }
        }

        this.departmentList = Array.from(deptMap);
        
      }).catch((err) => {
        console.log(err);
      });


      this.http.get('wellness/logs/').then((res) => {
        this.userData = res.data;
        for (var x of res.data) {
          this.milestoneData = this.milestoneData.concat(x.usermilestone_set);
          this.badgeData = this.badgeData.concat(x.userbadge_set);
        }

        let milestoneMap = new Map();
        let badgeMap = new Map();
        let userMap = new Map();

        for (let x of this.milestoneData) {
          let milestone = x['milestone'];
          if (milestoneMap.has(milestone)) {
            milestoneMap.set(milestone, milestoneMap.get(milestone) + 1);
          } else {
            milestoneMap.set(milestone, 1);
          }
        }

        for (let x of this.badgeData) {
          let badge = x['badge'];
          if (badgeMap.has(badge)) {
            badgeMap.set(badge, badgeMap.get(badge) + 1);
          } else {
            badgeMap.set(badge, 1);
          }
        }

        for(let x of this.userData) {
          let year = moment(x['user']['date_joined']).format('YYYY');
          if(userMap.has(year)) {
            userMap.set(year, userMap.get(year) + 1);            
          } else {
            userMap.set(year, 1);
          }
        }

        let milestoneData = {
          labels: Array.from(milestoneMap.keys()),
          datasets: [{
            label: 'number of users',
            backgroundColor: randomColor({
              count: Array.from(milestoneMap.keys()).length,
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
            data: Array.from(milestoneMap.values())
          }]
        };

        let badgeData = {
          labels: Array.from(badgeMap.keys()),
          datasets: [{
            label: 'number of users',
            backgroundColor: randomColor({
              count: Array.from(badgeMap.keys()).length,
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
            data: Array.from(badgeMap.values())
          }]
        };

        let userData = {
          labels: Array.from(userMap.keys()),
          datasets: [{
            label: 'users joined per year',
            backgroundColor: randomColor({
              count: Array.from(userMap.keys()).length,
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
            data: Array.from(userMap.values())
          }]
        };

        let milestoneDataCtx = this.milestoneChart.nativeElement.getContext('2d');
        let badgeDataCtx = this.badgeChart.nativeElement.getContext('2d');
        let userDataCtx = this.userChart.nativeElement.getContext('2d');

        this.milestoneDataChart = new Chart(milestoneDataCtx, {
          type: 'bar',
          data: milestoneData,
          options: {
            scales: {
              xAxes: [{
                ticks: {
                  autoSkip: false
                }
              }],
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                }
              }]
            }
          }
        });

        this.badgeDataChart = new Chart(badgeDataCtx, {
          type: 'bar',
          data: badgeData,
          options: {
            scales: {
              xAxes: [{
                ticks: {
                  autoSkip: false
                }
              }],
              yAxes: [{
                ticks: {         
                  beginAtZero: true
                }
              }]
            }
          }
        });

        this.userDataChart = new Chart(userDataCtx, {
          type: 'bar',
          data: userData,
          options: {
            scales: {
              xAxes: [{
                ticks: {
                  autoSkip: false
                }
              }],
              yAxes: [{
                ticks: {         
                  beginAtZero: true
                }
              }]
            }
          }
        });

      });
    }).catch((err) => {
      console.log(err);
    });

  }

}
