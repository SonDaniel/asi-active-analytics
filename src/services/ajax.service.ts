import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class AjaxService {
	private USERNAME : string = 'AdminApp'; //TO DO: Figure out how to hide Admin Credentials
	private PASSWORD : string = 'thereisnospoon'; //TO DO: Figure out how to hide Admin Credentials
	private JWT : string = '';

	private apiUrl = 'http://127.0.0.1:8000/api/';
	private headers = new Headers({ 'Content-Type': 'application/json' });

	/**
	 * Creates an AjaxService for interfacing with http request.
	 * @param {Http} http - Http class to perform http requests
	 * @param {ProfileService} profile - Represents the active user
	 */
	constructor(private http: Http) {}

	init() : Promise<any> {
		return this.request(RequestMethod.Post, `${this.apiUrl}get-token/`,{
			'username': this.USERNAME,
			'password': this.PASSWORD
		}).then(res => {
			this.JWT = res.data.token;
		});
	}

	check() : Promise<any> {
		if(!this.JWT) { 
			return this.init();
		} else {
			return Promise.resolve();
		}
	}

	/**
	 * Performs a GET Http request.
	 * @param {string} url - API URL
	 * @param {string|boolean} auth - Represents the JWT or if JWT should be provided by ProfileService.
	 * @param {string} etag - Optional. If provided, an 'If-None-Match' header will be inserted with given etag.
	 * @return {Promise<any>} A promise for the request.
	 */
	get(url: string, auth: string | boolean = true, etag?: string): Promise<any> {
		this.setHeaders(auth, etag);
		return this.request(RequestMethod.Get, this.apiUrl + url);
	}

	/**
	 * Performs the given http request.
	 * @param {RequestMethod} method - Http method. Expects Get, Post or Put.
	 * @param {string} url - API URL
	 * @param {Object} data - Optional. The data to add to the body of the request
	 * @return {Promise<any>} A promise for the request.
	 */
	private request(method: RequestMethod, url: string, data?: Object): Promise<any> {
		let options = new RequestOptions({
			method: method,
			headers: this.headers
		});

		if (data) {
			options.body = data;
		}

		return this.http.request(url, options)
			.toPromise()
			.then(this.extractData)
			.catch(this.handleError);
	}

	/**
	 * Deletes and sets request header.
	 * @param {string|boolean} auth - The JWT or either true or false if the JWT should be provided by ProfileService.
	 * @param {string} etag - Optional. If provided, an 'If-None-Match' header will be inserted with given etag.
	 */
	private setHeaders(auth: string | boolean, etag?: string): void {
		// Delete Authorization header if it exists
		if (this.headers.has('Authorization')) {
			this.headers.delete('Authorization');
		}

		// Delete Etag header if it exists
		if (this.headers.has('If-None-Match')) {
			this.headers.delete('If-None-Match');
		}

		if (etag) {
			this.headers.append('If-None-Match', etag);
		}

		if (typeof auth === 'string') {
			this.headers.append('Authorization', 'JWT ' + auth);
		}
		else if (auth) {
			this.headers.append('Authorization', 'JWT ' + this.JWT);
		}
	}

	/**
	 * Extracts the data from the Http response.
	 * @param {Response} res - The http response.
	 * @return {any} An Object containing the body and headers of the response.
	 */
	private extractData(res: Response): Object {
		const body = res.json() || {};
		return { 'data': body, 'headers': res.headers, 'status': res.status };
	}

	/**
	 * Handles any errors from http responses
	 * @param {Response|any} error - The error from the response.
	 * @return {Promise<string>} A promise with details about the errors.
	 */
	private handleError(error: Response | any): Promise<string> {
		let errMsg: string;
		if (error instanceof Response) {
			const body = error.json() || '';
			const err = JSON.stringify(body);
			errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		} else {
			errMsg = error.message ? error.message : error.toString();
		}
		return Promise.reject(errMsg);
	}
}
