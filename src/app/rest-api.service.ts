import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

    private REST_API_SERVER = "http://localhost:8080/";

    headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json').set('Access-Control-Allow-Origin', 'http://localhost:8080');
    httpOptions = {
        headers: this.headers
    };

    constructor(private httpClient: HttpClient) { }

    public get_data(data) {
        let url = this.REST_API_SERVER + data
        return this.httpClient.get(url);
    }

    public post_data(data, body) {
        console.log(this.httpOptions);
        let url = this.REST_API_SERVER + data;
        return this.httpClient.post(url, body);
    }

    public put_data(data,body) {
        let url = this.REST_API_SERVER + data
        return this.httpClient.put(url, body);
    }

    public delete_data(data) {
        let url = this.REST_API_SERVER + data
        return this.httpClient.delete(url);
    }
}
