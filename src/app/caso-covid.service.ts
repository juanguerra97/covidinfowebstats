import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CasoCovidService {

  constructor(private http: HttpClient) { }

  public getAll(): Observable<any> {
    return this.http.get<any>(`${environment.apiURL}/api/reportecaso`);
  }
}
