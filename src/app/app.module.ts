import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
import { DashModule } from './dash/dash.module';

@NgModule({
  imports: [
    BrowserModule,
    DashModule,
    HomeModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent]
  // entryComponents: [AppComponent]
})
export class AppModule {
  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    /*
    const MyAppElement = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('my-app', MyAppElement);
    */
  }
}
