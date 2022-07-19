import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Constellation} from "../models/constellationData.model";

const baseUrl = 'http://localhost:8081/api/getConstellation';

@Injectable({
  providedIn: 'root'
})
export class ReplayService {

  constructor(private http: HttpClient) {
  }
  //get constellation by registration id
  getConstellation(id: string): Observable<Constellation> {
    console.log("service send start event");
    return this.http.get<Constellation>(`${baseUrl}/${id}`);
  }
}
