import { Component, NgZone } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoanService, EmiResponse, EligibilityResponse } from './loan.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, HttpClientModule ]
})
export class AppComponent {
  title = 'Loan EMI & Eligibility App';

  principal = 500000;
  annualInterestRate = 10;
  tenureMonths = 60;
  salary = 60000;

  loading = false;
  emiResult?: EmiResponse;
  eligibilityResult?: EligibilityResponse;
  errorMessage: string | null = null;

  constructor(
    private loanService: LoanService,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) { }

  onSubmit() {
    this.ngZone.run(() => {
      this.errorMessage = null;
      this.loading = true;
      this.emiResult = undefined;
      this.eligibilityResult = undefined;
      this.cd.detectChanges();
    });

    const emiPayload = {
      principal: this.principal,
      annualInterestRate: this.annualInterestRate,
      tenureMonths: this.tenureMonths
    };

    console.log('Calling EMI API with', emiPayload);

    this.loanService.calculateEmi(emiPayload).subscribe({
      next: (emiRes) => {
        console.log('EMI response', emiRes);

        this.ngZone.run(() => {
          this.emiResult = emiRes;
          this.cd.detectChanges();
        });

        const eligibilityPayload = {
          salary: this.salary,
          emi: emiRes.emi
        };

        this.loanService.checkEligibility(eligibilityPayload).subscribe({
          next: (eligRes) => {
            console.log('Eligibility response', eligRes);
            this.ngZone.run(() => {
              this.eligibilityResult = eligRes;
              this.loading = false;
              this.cd.detectChanges();   // force immediate view update
            });
          },
          error: (err) => {
            console.error('Eligibility error', err);
            this.ngZone.run(() => {
              this.errorMessage = 'Eligibility check failed';
              this.loading = false;
              this.cd.detectChanges();
            });
          }
        });
      },
      error: (err) => {
        console.error('EMI error', err);
        this.ngZone.run(() => {
          this.errorMessage = 'EMI calculation failed';
          this.loading = false;
          this.cd.detectChanges();
        });
      }
    });
  }
}
