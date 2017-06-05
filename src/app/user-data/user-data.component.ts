import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { AjaxService } from '../../services/ajax.service';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {
  userData : any;
  
  constructor(private ajax: AjaxService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe((data: {userData : any}) => {
      this.userData = data.userData;
    });
  }

}
