import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { EmailValidator } from '@angular/forms';
import { Subject } from 'rxjs';

@Injectable({providedIn: "root"})

export class AuthService {
    private isAuthenticated = false;
    private token: string;
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient) {}
    
    getToken() {
        return this.token;
    }

    getIsAuth(){
        return this.isAuthenticated;
    }
    
    getAuthStatusListener(){
        return this.authStatusListener.asObservable();// can only omit value from service, but listen from anywhere
    }

    createUser(email, password){
        const authData: AuthData = {email: email, password: password};
        this.http.post("http://localhost:3000/api/user/signup", authData)
            .subscribe(response => {
                console.log(response);
            });
    }

    login(email: string, password: string){
        const authData: AuthData = {email: email, password: password};
        this.http.post<{token: string}>("http://localhost:3000/api/user/login", authData)
            .subscribe(response => {
                console.log(response); 
                const token = response.token;
                this.token = token;
                if(token){
                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                }

            })
    }
}