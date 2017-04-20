import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AjaxService } from '../services/ajax.service';
import { Graph } from '../components/graph';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    Graph
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    AjaxService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
