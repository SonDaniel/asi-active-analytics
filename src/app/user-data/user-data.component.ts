import { Component, OnInit } from '@angular/core';
import { AjaxService } from '../../services/ajax.service';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {
  userData : any;
  userCount : number;
  
  constructor(private ajax: AjaxService) { }

  ngOnInit() {
    let getUser = this.ajax.get('users/').then(res => {
      this.userData = res.data;
      this.userCount = res.data.length;
    });
  }

}
