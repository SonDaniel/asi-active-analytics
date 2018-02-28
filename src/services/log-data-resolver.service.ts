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
            return this.ajax.get('wellness/logs/').then(res => {
                return logData = res.data;
            });
        });
    }
}