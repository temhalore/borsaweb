import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GetPriceBySymbolComponent } from './get-price-by-symbol/get-price-by-symbol.component';
// import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
// import stock from 'highcharts/modules/stock.src';
// import more from 'highcharts/highcharts-more.src';
import { GetAlSatComponent } from './getAlSat/getAlSat.component';
// export function highchartsModules() {
//   // apply Highcharts Modules to this array
//   // return [stock, more];
// }
@NgModule({
  declarations: [	
    AppComponent,
    GetPriceBySymbolComponent,
      GetAlSatComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    // ChartModule
  ],
  bootstrap: [AppComponent],
  providers: [
    // { provide: HIGHCHARTS_MODULES, useFactory: highchartsModules } // add as factory to your providers
  ]
})
export class AppModule { }
