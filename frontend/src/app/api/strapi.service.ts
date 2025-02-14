import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponseModel } from '../../util/interfaces';
import { environment } from '../../environments/environment.development'

@Injectable({
  providedIn: 'root'
})

export class StrapiService {
  private apiUrl = environment.strapiUrl;
  private apiToken = environment.strapiApi;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.apiToken}`);
  }

  getSlides(): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(`${this.apiUrl}/slides?populate[project_image][populate]=thumbnail_image`, {
      headers: this.getHeaders(),
    });
  }

  getAllProjects(): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(`${this.apiUrl}/projects?populate=*`, {
      headers: this.getHeaders(),
    });
  }

  getProjectById(id: string): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(`${this.apiUrl}/projects/${id}?populate=*`, {
      headers: this.getHeaders(),
    });
  }

  getAllClients(): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(`${this.apiUrl}/clients?populate=*`, {
      headers: this.getHeaders(),
    });
  }

  getClientById(id: string): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(`${this.apiUrl}/clients/${id}?populate=*`, {
      headers: this.getHeaders(),
    });
  }

  getAllMembers(): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(`${this.apiUrl}/members?populate=*`, {
      headers: this.getHeaders(),
    });
  }

  getAllArticles(): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(`${this.apiUrl}/articles?populate=*`, {
      headers: this.getHeaders(),
    });
  }

  getArticleById(id: string): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(`${this.apiUrl}/articles/${id}?populate=*`, {
      headers: this.getHeaders(),
    });
  }

  getAllOffices(): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(`${this.apiUrl}/offices?populate=*`, {
      headers: this.getHeaders(),
    });
  }

  getAllCareers(): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(`${this.apiUrl}/careers?populate=*`, {
      headers: this.getHeaders(),
    });
  }

  getCareerById(id: string): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(`${this.apiUrl}/careers/${id}?populate=*`, {
      headers: this.getHeaders(),
    });
  }

  getAllFlags(): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(
      `${this.apiUrl}/flags?pagination[pageSize]=200&populate=*`,
      { headers: this.getHeaders() }
    );
  }

}