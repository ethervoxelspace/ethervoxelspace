import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


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
    BrowserModule,
    FormsModule
  ],
  providers: [ContractService],
  bootstrap: [AppComponent]
})
export class AppModule { }
