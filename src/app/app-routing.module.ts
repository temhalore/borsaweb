import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GetPriceBySymbolComponent } from './get-price-by-symbol/get-price-by-symbol.component';
import { GetAlSatComponent } from './getAlSat/getAlSat.component';

const routes: Routes = [
 // {path:"getpricebysybol/:symbol", component:GetPriceBySymbolComponent}, 

  {path:"getAlSat/:symbol", component:GetAlSatComponent}, 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
