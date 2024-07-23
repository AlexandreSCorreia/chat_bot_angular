import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ChatbotPopupComponent } from '@app/components/chatbot-popup/chatbot-popup.component';

@NgModule({
  declarations: [
    HomeComponent,
    ChatbotPopupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HomeRoutingModule,
  ]
})
export class HomeModule { }
