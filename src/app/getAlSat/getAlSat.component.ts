import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpHelper } from '../core/http.helper';

@Component({
  selector: 'app-getAlSat',
  templateUrl: './getAlSat.component.html',
  styleUrls: ['./getAlSat.component.css']
})
export class GetAlSatComponent implements OnInit {

//değişkenler
  selectedSymbol: string = "BTCUSDT";
  private subscriptions: Subscription[] = [];
  alSatYapilabilir:boolean=true;

  constructor(private httphelper: HttpHelper, private route: ActivatedRoute,  ) {
    const sbSymbol = this.route.params.subscribe(params => {
      this.selectedSymbol = params['symbol'].toUpperCase();
    });
    this.subscriptions.push(sbSymbol);
  }

  alSatGecmis:any;
  ngOnInit() {
    debugger;
    //this.getSaniyedeBirCalis();
    this.getSymbolOzetGetir(this.selectedSymbol);
  }



  getSymbolOzetGetir(symbol:string) {

    let req:any = {
      symbol:symbol,
      gecmisSaat:1000,
      telegramdanMesajAt:true,
    }

    this.httphelper.Post("AlisSatis/getAlisSatisKarZararOzetByKarZararRequestDTO", req )
    .pipe(      
      tap(x => {  
       console.log(x)
      })
    ).subscribe((data: any) => {
     debugger;

     this.alSatGecmis=data.Data.Data;
     
    });
  }

  getSaniyedeBirCalis(){
    const interval$ = interval(1000);
    interval$.pipe(tap(()=>{
        this.getAlSatYapCagir(this.selectedSymbol);

    } ))

  }

  getAlSatYapCagir(symbol:string){
    this.alSatYapilabilir = false;
    let req:any = {
      symbol:symbol,
      alSatYontemId:1040005,
      isAlimYapilsin:true,
      gercekIslemYap:false,
      harcanacakToplamTutar:20,
      bakilacakEmirSayisi:100,
      alicilarYukseklikOrani: 1.2,
      saticilarYukseklikOrani : 1.2,
      hedefFiyatBelirlemeOrani:1.003,
      hedefFiyatGuncellemeOrani:1.002,
      stopLostBelirlemeOrani:1.005,
      stopLostSatisindaAliciYuksekligineBakilsin:true,

    }
    
     return this.httphelper.Post("AlisSatis/AlSatYapByAlSatRequestDto", req )
     .pipe(
       catchError(err => { return this.errorHandler(err) }),
       tap(x => {  
        console.log(x)
       })
     ).subscribe((data: any) => {
      debugger;

      
      this.alSatYapilabilir = true;
      this.getSymbolOzetGetir(symbol);

     });
  }



  errorHandler(err: any): any {
    throw new Error('Method not implemented.');
  }

}
