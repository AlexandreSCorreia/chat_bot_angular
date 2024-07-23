import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, take, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  baseURL = environment.apiURL;
  private http = inject(HttpClient);

  resetSession(userId: string): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/reset`, { user_id: userId }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      take(1),
      catchError(this.handleError)
    )
  }

  askQuestion(question: string, userId: string): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/ask`, { question, user_id: userId }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      take(1),
      catchError(this.handleError)
    )
  }

  uploadFile(file: File, userId: string): Observable<any> {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('user_id', userId);

    return this.http.post<any>(`${this.baseURL}/upload`, formData)
    .pipe(
      take(1),
      catchError(this.handleError)
    )
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`
    } else {
      errorMessage = `Backend returned code: ${err.status}: ${err.message}`
    }
    console.error(err);
    return throwError(() => errorMessage);
  }
}
