import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AjaxService } from '../services/ajax.service';
import { Graph } from '../components/graph';
import { AppComponent } from './app.component';
import { LogDataComponent } from './log-data/log-data.component';
import { HomeComponent } from './home/home.component';
import { UserDataComponent } from './user-data/user-data.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { ChartComponent } from './chart/chart.component';

const appRoutes : Routes = [
  {path: 'log-data', component: LogDataComponent},
  {path: 'user-data', component: UserDataComponent},
  {path: 'feedback', component: FeedbackComponent},
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo:'/home', pathMatch:'full'},
  {path: '**', redirectTo:'/home', pathMatch:'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    Graph,
    LogDataComponent,
    HomeComponent,
    UserDataComponent,
    FeedbackComponent,
    SidebarMenuComponent,
    ChartComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
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
