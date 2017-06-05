import { Component, OnInit } from '@angular/core';
import { AjaxService } from '../../services/ajax.service';

import * as moment from 'moment';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  feedbackData : any;
  feedbackCount : number;

  constructor(private ajax: AjaxService) { }

  ngOnInit() {
    this.ajax.check().then(() => {
      let getFeedback = this.ajax.get('feedback/').then(res => {
        this.feedbackData = res.data;
      });
    });
  }

  getDate(date: string) : string {
    return moment(date).format('L');
  }

}
