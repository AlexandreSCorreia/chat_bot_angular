import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ChatbotService } from 'src/app/services/chatbot.service';

@Component({
  selector: 'app-chatbot-popup',
  templateUrl: './chatbot-popup.component.html',
  styleUrls: ['./chatbot-popup.component.scss']
})
export class ChatbotPopupComponent implements AfterViewInit {
  @ViewChild('chatBox', { static: true }) chatBox!: ElementRef;

  @Input() chatHeaderTitle:string = ""
  @Input() defaultTextMsg:string = ""
  @Input() copy:string = ""
  @Input() linkCopy:string = ""

  isTyping: boolean = false;

  msgErrorDefault: string = `Houve um problema ao enviar sua mensagem.
  Isso pode ter ocorrido porque um arquivo não foi enviado antes de fazer uma pergunta ou sua sessão pode ter expirado.
  Se você já enviou um arquivo e a sessão não expirou, por favor, entre em contato com o suporte técnico para obter assistência.`;
  userMessage: string = '';
  isChatVisible = false;
  chatMessages: { sender: string, message: string }[] = [];

  constructor(private chatbotService: ChatbotService) {}

  toggleChat() {
    this.isChatVisible = !this.isChatVisible;
  }

  ngAfterViewInit() {
    this.clearChat();
  }

  public sendMessage() : void {
    this.isTyping = true;
    const userInput = this.userMessage.trim();
    if (userInput !== '') {
      this.appendMessage('user', userInput);

      if (userInput === 'exit' || userInput === 'sair') {
        this.chatbotService.resetSession('1').subscribe(
          () => {
            this.clearChat();
            this.respondToUser("Sua sessão foi reiniciada.");
            this.respondToUser("Envie um arquivo para fazer suas perguntas 😉");
            this.isTyping = false;
          },
          error => {
            this.respondToUser("Não foi possivel reiniciada sua sessão, tente novamente mais tarde");
            console.error('Error:', error);
            this.isTyping = false;
          }
        );
      } else {
        this.chatbotService.askQuestion(userInput, '1').subscribe(
          data => {
            this.respondToUser(data.response);
            this.isTyping = false;
          },
          error => {
              this.respondToUser(this.msgErrorDefault);
              console.error('Error:', error);
              this.isTyping = false;
          }
        );
      }
      this.userMessage = '';
    }
  }

  public sendFile(event: any) : void {
    this.isTyping = true;
    const file: File = event.target.files[0];
    const maxSizeInBytes = 200 * 1024 * 1024; // 200 MB

    if (file) {
      if (file.size > maxSizeInBytes) {
        this.respondToUser("O arquivo é muito grande. O tamanho máximo permitido é 200 MB.");
        return;
      }

      this.appendMessage('user', `Enviando o arquivo: ${file.name}...`);
      this.chatbotService.uploadFile(file, '1').subscribe(
        () => {
          this.isTyping = false;
          this.respondToUser("Arquivo enviado com sucesso! 🚀🚀");
          this.respondToUser("Você pode fazer perguntas sobre o arquivo enviado.");
        },
        error => {
          this.isTyping = false;
          this.respondToUser("Não foi possivel enviar o arquivo, tente novamente mais tarde");
        }
      );
    }
  }

  private respondToUser(response: string) : void {
    setTimeout(() => this.appendMessage('bot', response), 500);
  }

  private appendMessage(sender: string, message: string) : void {
    this.chatMessages.push({ sender, message });
    setTimeout(() => this.scrollToBottom(), 0);
  }

  private clearChat() : void {
    this.chatMessages = [];
    setTimeout(() => this.scrollToBottom(), 0);
  }

  private scrollToBottom() : void {
    if (this.chatBox) {
      const chatBoxElement = this.chatBox.nativeElement;
      chatBoxElement.scrollTop = chatBoxElement.scrollHeight;
    }
  }

  public onKeyPress(event: KeyboardEvent) : void {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }
}
