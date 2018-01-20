import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { PlaceExplorerComponent } from './place-explorer/place-explorer.component';
import { ContractService } from './contract.service';
import { ToolboxComponent } from './toolbox/toolbox.component';


@NgModule({
  declarations: [
    AppComponent,
    PlaceExplorerComponent,
    ToolboxComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [ContractService],
  bootstrap: [AppComponent]
})
export class AppModule { }
