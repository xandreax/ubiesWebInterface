import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

const baseUrl = 'http://localhost:8081/api/registration';

@Injectable({
    providedIn: 'root',
})
export class RegistrationService {
    constructor(private http: HttpClient) {
    }

    //stop the java importer
    stopRegistration(): Observable<any> {
        console.log("service send stop event to importer");
        return this.http.post(`${baseUrl}/stop`, '');
    }

    //start the java importer
    startRegistration(id: string): Observable<any> {
        console.log("service send start event to importer");
        return this.http.post(`${baseUrl}/start`, {registration_id: id});
    }

    //check status java importer
    checkRegistration(): Observable<boolean> {
        return this.http.get<boolean>(`${baseUrl}/status`);
    }
}
