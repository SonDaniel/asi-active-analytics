import { Component, OnInit } from '@angular/core';
import { AjaxService } from '../../services/ajax.service';

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
      let getFeedback = this.ajax.get('feedback/').then(res => {
        this.feedbackData = res.data;
        this.feedbackCount = res.data.length;
      });
  }

}
