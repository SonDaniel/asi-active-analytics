import { Component} from '@angular/core';
import { AjaxService } from '../services/ajax.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private ajax : AjaxService) {

  }
  ngOnInit() {
    this.ajax.init();
  }
}
