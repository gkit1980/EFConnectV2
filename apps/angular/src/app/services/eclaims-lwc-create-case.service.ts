import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Token {
  GeneratedToken: string;
}

interface DocsUploadedResponse {
  Success: boolean;
  Errors: [{ Message: string }] | null;
}

@Injectable({ providedIn: 'root' })
export class EclaimsLwcCreateCaseService {
  private TOKEN_URL = '/api/v1/middleware/lightningOut/GenerateEclaimsToken';

  private SF_DOCS_URL =
    '/api/v1/middleware/lightningOut/SalesforceDocsUploaded';

  constructor(private http: HttpClient) {}

  generateEclaimsToken(
    goldenRecordId: string,
    policyNumber: string,
    insuredId: string,
    dependentMemberId: string,
    claimInsuredName: string,
    ailmentId: string,
    personalContracts: string,
    email: string,
    customerCode: string,
    company: string,
    receiptAmount: string,
    taxNumber: string,
    issueDate: string,
    codeNumber: string,
    series: string,
    requestType: string,
    finalCover: string


  ): Observable<Token> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    return this.http.post<Token>(
      this.TOKEN_URL,
      {
        goldenRecordId,
        policyNumber,
        insuredId,
        dependentMemberId,
        claimInsuredName,
        ailmentId,
        personalContracts,
        email,
        customerCode,
        company,
        receiptAmount,
        taxNumber,
        issueDate,
        codeNumber,
        series,
        requestType,
        finalCover
      },
      { headers }
    );
  }

  salesforceDocsUploaded(caseId: string): Observable<DocsUploadedResponse> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    return this.http.post<DocsUploadedResponse>(
      this.SF_DOCS_URL,
      { caseId },
      { headers }
    );
  }
}
