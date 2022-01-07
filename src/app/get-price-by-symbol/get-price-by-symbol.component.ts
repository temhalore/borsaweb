import { Component, Inject, Injector, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, defer, interval, Subject, Subscription } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ActivatedRoute } from '@angular/router';
import { ajaxGet, ajaxGetJSON,ajaxPost } from 'rxjs/internal/observable/dom/AjaxObservable';
import * as moment from 'moment';
import { HttpHelper } from '../core/http.helper';
// import { StockChart } from 'angular-highcharts';

@Component({
  selector: 'app-get-price-by-symbol',
  templateUrl: './get-price-by-symbol.component.html',
  styleUrls: ['./get-price-by-symbol.component.css']
})

export class GetPriceBySymbolComponent implements OnInit, OnDestroy {
  selectedSymbol: string = "BTCUSDT";
  selectedInterval: string = "1m";

  apiUrl: string = "https://api.binance.com/api/v3/";

  price: binanceData = new binanceData;
  price$: BehaviorSubject<binanceData> = new BehaviorSubject<binanceData>(new binanceData);

  intervals: string[] = [
    "1m", "3m"
    , "5m"
    , "15m"
    , "30m"
    , "1h"
    , "2h"
    , "4h"
    , "6h"
    , "8h"
    , "12h"
    , "1d"
    , "3d"
    , "1w"
    , "1M"
  ]
  kline: binanceKlineData = new binanceKlineData;
  klines$: BehaviorSubject<binanceKlineData[]> = new BehaviorSubject<binanceKlineData[]>([]);

  lastPrices: binanceData[] = [];
  lastPrices$: Subject<binanceData[]> = new Subject<binanceData[]>();

  artisAzalis: number = 0;
  artisAzalis$: BehaviorSubject<number> = new BehaviorSubject<number>(this.artisAzalis);
  // stock: StockChart=new StockChart;
  binanceOrderBook$: BehaviorSubject<binanceOrderBookData> = new BehaviorSubject<binanceOrderBookData>(new binanceOrderBookData);


  constructor(private httphelper: HttpHelper, private route: ActivatedRoute,  

  ) {
    const sbSymbol = this.route.params.subscribe(params => {
      this.selectedSymbol = params['symbol'].toUpperCase();
    });
    this.subscriptions.push(sbSymbol);
  }

  getTickerPriceBySymbolURL(symbol: string): string {
    return `${this.apiUrl}ticker/price?symbol=${symbol}`;
  }
  getKlinesURL(symbol: string, interval: string): string {
    return `${this.apiUrl}klines?symbol=${symbol}&interval=${interval}`;
  }
  geOrderBookURL(symbol: string, interval: string): string {
    return `${this.apiUrl}depth?symbol=${symbol}&limit=${interval}`;
  }
  ngOnInit(): void {
    // this.getPriceBySymbol()
    // this.getKlinesBySymbolAndInterval();
    this.getOrderBookBySymbolAndInterval();

  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  changeSybmol(symbol: string) {
    this.selectedSymbol = symbol;
    this.subscriptions.forEach((sb) => sb.unsubscribe());
    this.getPriceBySymbol();
    this.getKlinesBySymbolAndInterval();

  }
  changeInterval(interval: string) {
    this.selectedInterval = interval;
    this.subscriptions.forEach((sb) => sb.unsubscribe());
    this.getPriceBySymbol();
    this.getKlinesBySymbolAndInterval();
  }
  getPriceBySymbol() {
    const tickerPriceURl: string = this.getTickerPriceBySymbolURL(this.selectedSymbol)
    const interval$ = interval(1000)
    const price$ = defer(() => { return ajaxGetJSON<binanceData>(tickerPriceURl) });
    const sbPrice = interval$.pipe(
      switchMap(() => {
        return price$;
      })
    ).subscribe((data) => {
      this.price = data;
      this.price$.next(this.price)




      if (this.lastPrices[0]?.price !== data.price) {
        if (this.lastPrices.length < 5) {
          this.lastPrices.unshift(data);
        }
        else {
          this.lastPrices.pop();
          this.lastPrices.unshift(data);
          if (this.lastPrices[1]?.price < data.price) {
            this.artisAzalis += 1
          }
          else if (this.lastPrices[1]?.price > data.price) {
            this.artisAzalis += -1
          }
          else {
            this.artisAzalis += 0
          }

        }
      }

      this.lastPrices$.next(this.lastPrices)
      this.artisAzalis$.next(this.artisAzalis)

    });
    this.subscriptions.push(sbPrice);
  }

  // https://api.binance.me/api/v3/depth?symbol=BTCUSDT&limit=100
  getKlinesBySymbolAndInterval() {
    const klinesUrl: string = this.getKlinesURL(this.selectedSymbol, this.selectedInterval)
    const interval$ = interval(1000)
    const klines$ = defer(() => { return ajaxGetJSON<binanceKlineData[]>(klinesUrl) });
    const sbKlines = interval$.pipe(
      switchMap(() => {
        return klines$;
      })
    ).subscribe((data) => {
      let klineList: binanceKlineData[] = []
      // let stockData :any[]=[]

      data.forEach(x => {

        const newKline = new binanceKlineData()
        newKline.openTime = moment((x as any)[0] as number).format('DD/MM/YYYY, HH:mm:ss');

        newKline.open = (x as any)[1] as number
        newKline.high = (x as any)[2] as number
        newKline.low = (x as any)[3] as number
        newKline.close = (x as any)[4] as number
        newKline.volume = (x as any)[5] as number
        newKline.closeTime = moment((x as any)[6] as number).format('DD/MM/YYYY, HH:mm:ss');
        newKline.quoteAssetVolume = (x as any)[7] as number
        newKline.numberOfTrades = (x as any)[8] as number
        newKline.takerBuyBaseAssetVolume = (x as any)[9] as number
        newKline.takerBuyQuoteAssetVolume = (x as any)[10] as number
        newKline.ignore = (x as any)[11] as number
        newKline.closeTimeNumber = (x as any)[6] as number;
        klineList.push(newKline)
        // console.log(stockData)

      })
      // klineList.forEach(x=>{
      //   stockData.push([x.closeTimeNumber,x.close]);

      // })

      // this.stock = new StockChart({

      //   title: {
      //     text: 'AAPL Stock Price'
      //   },
      //   series: [{
      //     tooltip: {
      //       valueDecimals: 2
      //     },          type: "abands",

      //     name: 'AAPL',        

      //     data:stockData
      //   }]
      // });this.klines$.next(klineList);

      // this.price$.next(this.price)




      // if (this.lastPrices[0]?.price !== data.price) {
      //   if (this.lastPrices.length < 5) {
      //     this.lastPrices.unshift(data);
      //   }
      //   else {
      //     this.lastPrices.pop();
      //     this.lastPrices.unshift(data);
      //     if (this.lastPrices[1]?.price < data.price) {
      //       this.artisAzalis += 1
      //     }
      //     else if (this.lastPrices[1]?.price > data.price) {
      //       this.artisAzalis += -1
      //     }
      //     else {
      //       this.artisAzalis += 0
      //     }

      //  }
      // }

      // this.lastPrices$.next(this.lastPrices)
      // this.artisAzalis$.next(this.artisAzalis)

    });
    this.subscriptions.push(sbKlines);
  }

  sendTelegramMessage(request:string){
    // let req:any = {Value:request}

    //  return this.httphelper.Post("Common/mesajGonder", req )
    //  .pipe(
    //    catchError(err => {return this.errorHandler(err) }),
    //    tap(x => {
        
    //     console.log(x)
    //    })
    //  ).subscribe(x=>{});
 }


 ////ahmet
 alSatGecmis:any;
 bilgiDto:any;
 alSatYapilabilir:boolean=true;


 alSAtYontem1Cagir(symbol:string){
  this.alSatYapilabilir = false;
  let req:any = {
    symbol:symbol,
    harcanabilecekUsdDeger:10,
    orderSize:100
  }
   return this.httphelper.Post("Binance/AlSatYapYontem1", req )
   .pipe(
     catchError(err => { return this.errorHandler(err) }),
     tap(x => {  
      console.log(x)
     })
   ).subscribe((data: any) => {
    debugger;
    this.bilgiDto = data.Data;
    this.alSatYapilabilir = true;
   });
}

alSAtGecmisGetir(symbol:string){
  let req:any = {
    symbol:symbol
  }
  //debugger;
 
   return this.httphelper.Post("Binance/postAlisSatisListBySymbol", req )
   .pipe(
     catchError(err => { return this.errorHandler(err) }),
     tap(x => {
      console.log(x)
     })
   ).subscribe((data: any) => {
    debugger;
    this.alSatGecmis = data.Data;
   });
}

/// ahmet bitti


  errorHandler(err: any): any {
    throw new Error('Method not implemented.');
  }
  // satmangerekenFiyat:number=0;
  alindiMi:boolean=false;
  toplamKarZarar:number=0;
  alisFiyati:number=0;
  hedefSatisFiyati:number=0;
  stopLossFiyati:number=0;

  getOrderBookBySymbolAndInterval() {
    const interval$ = interval(1000)

    interval$.subscribe(x=> 
        {
          if (this.alSatYapilabilir) {
            this.alSAtYontem1Cagir(this.selectedSymbol);
          }

              
                this.alSAtGecmisGetir(this.selectedSymbol);
        }
      )    
  }

  
  getOrderBookBySymbolAndIntervalvolkiiii() {
    const orderBookUrl: string = this.geOrderBookURL(this.selectedSymbol, "100")
    const interval$ = interval(2000)
    const orderBook$ = defer(() => { return ajaxGetJSON<any[]>(orderBookUrl) });
    
    const sbOrderBook = interval$.pipe(
      switchMap(() => {
        return orderBook$;
      })
    ).subscribe((data: any) => {

// api çağır
if (this.alSatYapilabilir) {
  this.alSAtYontem1Cagir(this.selectedSymbol);
}
     
      this.alSAtGecmisGetir(this.selectedSymbol);


      let bids: binanceOrderData[] = [];
      let asks: binanceOrderData[] = [];
      let totalBidsQuota: number = 0
      let totalAsksQuota: number = 0
      let totalBidsPrice: number = 0
      let totalAsksPrice: number = 0
      let maxBidsPrice:number=0;
      let minBidsPrice:number=0;
      let maxAsksPrice:number=0;
      let minAsksPrice:number=0;
      let bidsAsksOld:number=0;
      let asksBidsOld:number=0;

      data.bids.forEach((x: any) => {
        bids.push({ price: +x[0], quote: +x[1] })
        totalBidsPrice += (+x[0]);
        totalBidsQuota += (+x[1]);
        if(maxBidsPrice<+x[0]){maxBidsPrice=+x[0]}
        if(minBidsPrice==0){minBidsPrice=+x[0]}
        if(minBidsPrice>+x[0]){minBidsPrice=+x[0]}

      });
      data.asks.forEach((x: any) => {
        asks.push({ price: +x[0], quote: +x[1] })
        totalAsksPrice += (+x[0]);
        totalAsksQuota += (+x[1]);
        if(maxAsksPrice<+x[0]){maxAsksPrice=+x[0]}
        if(minAsksPrice==0){minAsksPrice=+x[0]}
        if(minAsksPrice>+x[0]){minAsksPrice=+x[0]}
      });
      let orderBook: binanceOrderBookData = new binanceOrderBookData;
      orderBook.bids = bids;
      orderBook.asks = asks;
      orderBook.totalBidsQuota = totalBidsQuota
      orderBook.totalAsksQuota = totalAsksQuota
      orderBook.totalBidsPrice = totalBidsPrice
      orderBook.totalAsksPrice = totalAsksPrice
      orderBook.maxBidsPrice = maxBidsPrice
      orderBook.minBidsPrice = minBidsPrice
      orderBook.maxAsksPrice = maxAsksPrice
      orderBook.minAsksPrice = minAsksPrice
      orderBook.bidsAsks = totalBidsQuota/totalAsksQuota
      orderBook.asksBids = totalAsksQuota/totalBidsQuota
      // \n\n
      this.binanceOrderBook$.next(orderBook);
      if(this.stopLossFiyati<maxBidsPrice && this.alindiMi==true)//anlıkfiyatolmalı
      {        if(orderBook.bidsAsks<1.2){
        
        this.toplamKarZarar=this.toplamKarZarar+(minAsksPrice-this.alisFiyati)
        this.alindiMi=false;

          this.sendTelegramMessage(this.selectedSymbol+"\n=> Sat Emri : "+minAsksPrice.toString()+"\nstopLossnedeniyle satıldı:"+this.stopLossFiyati+"\n ToplamKarZarar=>"+this.toplamKarZarar)

        }


      }
      if(orderBook.bidsAsks>1.2 && this.alindiMi==false){
        this.alisFiyati=maxBidsPrice;
        this.hedefSatisFiyati=orderBook.maxBidsPrice*1.003;
        this.stopLossFiyati=this.alisFiyati*0.995;
        this.alindiMi=true
        this.sendTelegramMessage(this.selectedSymbol+"=> Al Emri : "+maxBidsPrice.toString()+"Hedef Satış Fiyatı =>"+orderBook.maxBidsPrice*1.003+" ToplamKarZarar=>"+this.toplamKarZarar)

      }
      if(maxBidsPrice>=this.hedefSatisFiyati && this.alindiMi==true){
//Emir Güncelleme olumlu
        this.alindiMi=false

        this.hedefSatisFiyati=orderBook.maxBidsPrice*1.002;
        //guncelleme emir iptal yenileme
        this.stopLossFiyati=this.stopLossFiyati*1.002
        this.alindiMi=true
        this.sendTelegramMessage(this.selectedSymbol+"=> Emir Güncelleme olumlu : "+maxBidsPrice.toString()+"Hedef Satış Fiyatı =>"+orderBook.maxBidsPrice*1.002+"EmirİPtal"+" ToplamKarZarar=>"+this.toplamKarZarar)

      }
      if(orderBook.asksBids>1.05 && this.alindiMi==true){
        this.toplamKarZarar=this.toplamKarZarar+(minAsksPrice-this.alisFiyati)
        this.alindiMi=false;
        this.sendTelegramMessage(this.selectedSymbol+"=> Sat Emri : "+minAsksPrice.toString()+"Satıcvılar Yükseldi =>"+"Kar=>"+(minAsksPrice-this.alisFiyati)+" ToplamKarZarar=>"+this.toplamKarZarar)

      }
      // 
    })


    this.subscriptions.push(sbOrderBook);
  }
  fpFix(n:any) {
    return Math.round(n * 100)/100;
  };
}


export class binanceData {
  symbol: string = "";
  price: number = 0;
}

export class binanceKlineData {
  openTime: string = "";
  open: number = 0;
  high: number = 0;
  low: number = 0;
  close: number = 0;
  volume: number = 0;
  closeTime: string = "";
  closeTimeNumber: number = 0;
  quoteAssetVolume: number = 0;
  numberOfTrades: number = 0;
  takerBuyBaseAssetVolume: number = 0;
  takerBuyQuoteAssetVolume: number = 0;
  ignore: number = 0;

}

export class binanceOrderBookData {
  bids: binanceOrderData[] = []
  asks: binanceOrderData[] = []
  totalBidsQuota: number = 0;
  totalBidsPrice: number = 0;
  totalAsksQuota: number = 0;
  totalAsksPrice: number = 0;
  maxAsksPrice:number=0;
  minBidsPrice:number=0;
  maxBidsPrice:number=0;
  minAsksPrice:number=0;
  bidsAsks:number=0;
  asksBids:number=0;
}

export class binanceOrderData {
  price: number = 0
  quote: number = 0
}