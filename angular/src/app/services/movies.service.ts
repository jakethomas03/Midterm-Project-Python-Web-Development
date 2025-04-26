import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api } from './constants';

export interface Movie {
  _id: string;
  title: string;
  year: number;
  created_by: string;
}

export interface MovieRequest {
  title: string;
  year: number;
}

@Injectable({ providedIn: 'root' })
export class MoviesService {
  private readonly url = api + '/movies';
  constructor(private httpClient: HttpClient) {}

  getAllMovies(): Observable<Movie[]> {
    return this.httpClient.get<Movie[]>(this.url);
  }

  getMyMovies(): Observable<Movie[]> {
    return this.httpClient.get<Movie[]>(this.url + '/my');
  }

  addMovie(request: MovieRequest): Observable<Movie> {
    return this.httpClient.post<Movie>(this.url, request);
  }

  deleteMovie(id: string): Observable<any> {
    return this.httpClient.delete<any>(this.url + '/' + id);
  }
}
