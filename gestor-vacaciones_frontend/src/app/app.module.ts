import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GeneralModule } from './components/general/general.module';
import { HomeComponent } from './components/superadmin/home/home.component';
import { SuperadminModule } from './components/superadmin/superadmin.module';
import { AdminModule } from './components/admin/admin/admin.module';
import { TrabajadoresModule } from './components/trabajadores/trabajadores.module';
import { CalendarioComponent } from './components/admin/calendario/calendario.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GeneralModule,
    SuperadminModule,
    AdminModule,
    TrabajadoresModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
