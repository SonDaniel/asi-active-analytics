import { Injectable } from '@angular/core';
import {
    Router, Resolve,
    ActivatedRouteSnapshot
} from '@angular/router';
import { AjaxService } from './ajax.service';

@Injectable()
export class LogDataResolve implements Resolve<any> {
    constructor(private ajax : AjaxService) {}

    resolve(route: ActivatedRouteSnapshot) : Promise<any> | boolean {
        let logData = [];
        return this.ajax.check().then(() => {
            let getActivityLog = this.ajax.get('activity-logs/').then(res => {
                logData = logData.concat(res.data);
            });

            let getEventLog = this.ajax.get('event-logs/').then(res => {
                logData = logData.concat(res.data);
            });

            return Promise.all([getActivityLog, getEventLog]).then(() => {
                return logData;
            });
        });
    }
}