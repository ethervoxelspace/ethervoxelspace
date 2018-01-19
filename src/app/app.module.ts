import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { PlaceExplorerComponent } from './place-explorer/place-explorer.component';
import { ContractService } from './contract.service';


@NgModule({
  declarations: [
    AppComponent,
    PlaceExplorerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [ContractService],
  bootstrap: [AppComponent]
})
export class AppModule { }
