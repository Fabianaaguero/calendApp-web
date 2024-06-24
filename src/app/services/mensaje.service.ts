
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EstructurasDatos } from '../interfaces/estructuras-datos';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private _http: HttpClient) {}

  sendMessage(datos:EstructurasDatos['email_Data']) {
    return this._http.post('http://calendapp.sytes.net:50505/emaildata', datos);
  }
}
