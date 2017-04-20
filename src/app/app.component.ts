import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import { AjaxService } from '../services/ajax.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  firstGraph = 'firstGraph';

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
        console.log(JSON.stringify(res.data));
      });
      this.ajax.get('feedback/').then(res => {
        this.feedbackData = res.data.results;
        this.feedbackCount = res.data.count;
      });
    });
  }
}
