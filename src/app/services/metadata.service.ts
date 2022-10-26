import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Metadata } from '../models/metadata.model';

const baseUrl = 'http://localhost:8081/api/metadata';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {

  constructor(private http: HttpClient) {}

  //get list of all metadata in the db
  getAll(): Observable<Metadata[]> {
    return this.http.get<Metadata[]>(baseUrl);
  }

  //add new metadata to the list and create the new collection
  create(match: Metadata): Observable<any> {
    return this.http.post(baseUrl, match);
  }

  //update a metadata in the list
  update(metadata: Metadata): Observable<any> {
    return this.http.put(baseUrl, metadata);
  }

  //delete a metadata and relative collection in db
  delete(id: string): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  //update metadata with end of registration timestamp
  updateEndTimestamp(id: string, date: Date): Observable<any>{
    return this.http.post(`${baseUrl}/end/${id}`, {end_timestamp: date});
  }

  //get a metadata by id
  getMetadataById(id: string): Observable<Metadata> {
    return this.http.get<Metadata>(`${baseUrl}/match/${id}`);
  }
}
