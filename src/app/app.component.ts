import { Component, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { AjaxService } from '../services/ajax.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('overallData') overallData : ElementRef;

  // variables for frontend
  userCount: number;
  feedbackCount : number;

  userData : any;
  feedbackData : any;

  constructor(private ajax: AjaxService) {}

  ngOnInit() {
    this.ajax.init().then(() => {
      this.ajax.get('users/').then(res => {
        this.userData = res.data.results;
        this.userCount = res.data.count;
      });
      this.ajax.get('feedback/').then(res => {
        this.feedbackData = res.data.results;
        this.feedbackCount = res.data.count;
      });
      this.ajax.get('activity-logs/').then(res => {
        console.log(JSON.stringify(res));
      });
      this.ajax.get('event-logs/').then(res => {
        console.log(JSON.stringify(res));
      });
    });
    let ctx = this.overallData.nativeElement.getContext('2d');
    let overalldataChart = new Chart(ctx, {
      type: 'line',
      data: this.userData
    })
  }
}
