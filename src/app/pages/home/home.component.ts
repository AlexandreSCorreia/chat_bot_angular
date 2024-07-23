import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  defaultTxt: string = `<h2>Bem-vindo!</h2>
  <p>Converse com seus arquivos e extraia informações valiosas de forma simples e descomplicada.</p>
  <ul>
    <li>Envie um arquivo.</li>
    <li>Faça uma pergunta.</li>
    <li>Troque de arquivo a qualquer momento.</li>
    <li>Digite "sair" ou "exit" para reiniciar o chat.</li>
  </ul>`
}
