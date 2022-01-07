import { Inject, Injectable, Injector } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

// import { Http, Response, Headers, RequestOptions } from @angular/common/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
// import { ToastrHelperService } from './toastr-helper.service';

declare let $: any
@Injectable({
  providedIn: 'root'
})
export class HttpHelper {


  oysToken: string = "";
  constructor(
    private http: HttpClient,
    @Inject(Injector) private injector: Injector,
    // private messageHelper: MessageHelper,
    // private toastrHelper : ToastrHelperService,
    // public toastrService: ToastrService,
    // private spinner: NgxSpinnerService

  ) {
      // this.options = this.toastrService.toastrConfig;
    //this.options.positionClass = 'toast-bottom-full-width';
      // this.options.positionClass = 'toast-top-right';   https://localhost:44351/api/Binance/
  }
  // Need to get ToastrService from injector rather than constructor injection to avoid cyclic dependency error
 
  Post<T>(ApiControllerAction: string, request: any): Observable<any> {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' }) };
  debugger;

    return this.http.post<any>("https://localhost:44351/api/" + ApiControllerAction, request, httpOptions)
      .pipe(
        catchError(err => { return this.errorHandler(err) }),
        tap(x => {
        
        })
      );
  }
  // async PostAsync<T>(ApiControllerAction: string, request: any): Promise<ServiceResponse> {
  //   try {
  //     //   this.spinner.show();
  //     Globals.spinnerCount += 1
  //     this.loginResponse = LocalStorageHelper.getDecodedLocalStorageObject() as LoginResponseDTO;
  //     this.Token = this.loginResponse?.kisiTokenDto?.oysToken;
  //     // document.getElementById('preloader').classList.remove('hide');
  //     // document.getElementById('spinner-wrapper').classList.add('spinner-wrapper-hidden');
  //     // document.getElementById('spinner-wrapper').classList.add('hide');

  //     const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + this.Token }) };
  //     let data: ServiceResponse = await this.http.post<ServiceResponse>(Globals.ApiUrl + ApiControllerAction, request, httpOptions).toPromise();
  //     Globals.spinnerCount -= 1
  //     if (Globals.spinnerCount === 0) {
  //       // this.spinner.hide();

  //     }
  //     // document.getElementById('preloader').classList.add('hide')
  //     // document.getElementById('spinner-wrapper').classList.remove('spinner-wrapper-hidden');
  //     // document.getElementById('spinner-wrapper').classList.remove('hide');

  //     if (data.hasMessage && data.messageType === "success") {
  //       this.toastrService.success(data.message, data.messageHeader);
  //     }
  //     if (data.hasMessage && data.messageType === "error") {
  //       this.toastrService.error(data.message, data.messageHeader);
  //     }
  //     if (data.hasMessage && data.messageType === "info") {
  //       this.toastrService.info(data.message, data.messageHeader);
  //     }
  //     if (data.hasMessage && data.messageType === "warning") {
  //       this.toastrService.warning(data.message, data.messageHeader);
  //     }
  //     return data;
  //   }
  //   catch (e) {
  //     this.toastrService.error(e.message, e.statusText);
  //   }
  // }


  private errorHandler(error: HttpErrorResponse) {
    
    return throwError(error)
  }
}
