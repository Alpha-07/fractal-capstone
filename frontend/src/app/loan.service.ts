import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EmiResponse {
  emi: number;
  totalPayment: number;
  totalInterest: number;
}

export interface EligibilityResponse {
  status: string;
  ratio: number;
  maxRecommendedEmi: number;
}

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private baseUrl = '';  // empty = same host

  constructor(private http: HttpClient) { }

  calculateEmi(payload: any): Observable<EmiResponse> {
    return this.http.post<EmiResponse>(`${this.baseUrl}/api/emi`, payload);
  }

  checkEligibility(payload: any): Observable<EligibilityResponse> {
    return this.http.post<EligibilityResponse>(`${this.baseUrl}/api/eligibility`, payload);
  }
}
