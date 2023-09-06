import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';



@NgModule({
  declarations: [
    LandingComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule
  ]
})
export class GeneralModule { }
