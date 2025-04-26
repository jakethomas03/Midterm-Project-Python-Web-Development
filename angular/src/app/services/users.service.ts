import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { api } from './constants';

export interface LoginResult {
  username: string;
  role: string;
  access_token: string;
  token_type: string;
}

export interface UserDto {
  id: string;
  username: string;
  role: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly url = api + '/users';

  constructor(private http: HttpClient, private router: Router) {}

  signUp(username: string, password: string, email: string): Observable<any> {
    return this.http.post<any>(this.url + '/signup', {
      username,
      password,
      email,
    });
  }

  signIn(username: string, password: string): Observable<LoginResult> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    return this.http.post<LoginResult>(this.url + '/sign-in', formData).pipe(
      map((x) => {
        localStorage.setItem('user', JSON.stringify(x));
        this._user.next(x);
        return x;
      })
    );
  }
  logout() {
    localStorage.setItem('user', JSON.stringify(this._defaultUser));
    this._user.next(this._defaultUser);
    this.router.navigate(['login']);
  }

  private readonly _defaultUser: LoginResult = {
    username: '',
    role: '',
    access_token: '',
    token_type: '',
  };
  private _user = new BehaviorSubject<LoginResult>(this._defaultUser);
  user$: Observable<LoginResult> = this._user.asObservable();

  getToken(): string {
    const user = localStorage.getItem('user') || '';
    return JSON.parse(user).access_token;
  }
  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.url);
  }

  updateUserRole(id: string): Observable<any> {
    return this.http.post<any>(this.url + '/' + id, {});
  }
}
