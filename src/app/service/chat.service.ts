import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  api: string = 'http://10.4.1.230:2023/api/chat/getAnswer'
  constructor(
    private http: HttpClient,
  ) { }

  callAPI(mess: string) {

    return this.http.get(`${this.api}`, { params: { 'message': mess } })
  }
}
