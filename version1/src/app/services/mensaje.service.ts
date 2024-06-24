
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EstructurasDatos } from '../interfaces/estructuras-datos';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private _http: HttpClient) {}

  sendMessage(datos:EstructurasDatos['email_Data']) {
    return this._http.post(environment.emailSettings.emailEndPoint, datos);
  }
}
