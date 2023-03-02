import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from './service/chat.service';

export interface ResultInterface {
  message: string,
  sender: string,
  isBot?: boolean,
  time: Date
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('messageScroll') messageScroll: any;
  mess: string = '';
  oldMessage: string = '';

  isBotType: boolean = false;
  isYouType: boolean = false;
  typingTimer: any = 0;                //timer identifier
  doneTypingInterval = 3000;

  messagesFake = [
    'Hi there, I\'m Fabio and you?',
    'Nice to meet you',
    'How are you?',
    'Not too bad, thanks',
    'What do you do?',
    'That\'s awesome',
    'Codepen is a nice place to stay',
    'I think you\'re a nice person',
    'Why do you think that?',
    'Can you explain?',
    'Anyway I\'ve gotta go now',
    'It was a pleasure chat with you',
    'Time to make a new codepen',
    'Bye',
    ':)'
  ]
  typing: boolean = false;
  messageList: ResultInterface[] = [];
  scrollTo: Element | any;
  constructor(private service: ChatService) { }
  ngAfterViewInit(): void {
  }
  ngOnInit(): void {
    this.fakeData();

  }
  title = 'Chat';

  callAPI() {
    let messToSend: string = this.mess;
    this.messageList.push({ message: this.mess, sender: 'self', time: new Date() })
    // this.scrollTo!.scrollTop = this.scrollTo!.scrollHeight;
    window.scrollTo(0, 999999999999999);
    this.typing = true;
    this.mess = '';
    this.service.callAPI(messToSend).subscribe({
      next: (res: any) => {
        this.messageList.push({ message: res.result, sender: 'other', time: new Date() })
        window.scrollTo(0, 999999999999999);
        this.typing = false;
      },
      error: (errr) => {
        console.log(errr);
      }
    })
  }

  fakeData() {
    this.isBotType = true;

    setTimeout(() => {
      this.isBotType = false;
      this.messageList = [
        <ResultInterface>{
          message: 'Can I help you?',
          sender: 'Bot',
          isBot: true,
          time: new Date()
        },
      ]
    }, 1000);

  }

  sendMessage() {
    let question = this.mess;
    this.mess = '';
    this.messageList.push(<ResultInterface>{
      message: question,
      sender: 'Bot',
      isBot: false,
      time: new Date()
    },)
    this.isYouType = false;
    this.scollToBottom(500);
    setTimeout(() => {
      this.botAnswer();
    }, 0);
  }

  botAnswer() {
    this.isBotType = true;
    setTimeout(() => {
      this.isBotType = false;
      this.scollToBottom(100);
      this.messageList.push(<ResultInterface>{
        message: this.messagesFake[Math.floor(Math.random() * (3 - 0 + 1) + 0)],
        sender: 'Bot',
        isBot: true,
        time: new Date()
      },)
      this.messageScroll.nativeElement.scrollTop = this.messageScroll.nativeElement.scrollHeight + 1000;
    }, 2000);
    this.scollToBottom(500);

  }

  scollToBottom(time: number) {
    setTimeout(() => {
      this.messageScroll.nativeElement.scrollTop = this.messageScroll.nativeElement.scrollHeight + 1000;
    }, time);
  }


  //#region  Events 
  onYouTyping(event: any) {
    this.isYouType = true;
    this.messageScroll.nativeElement.scrollTop = this.messageScroll.nativeElement.scrollHeight + 1000;
  }

  onKeyUp() {
    clearTimeout(this.typingTimer);
    if (this.mess.trim() != '')
      this.typingTimer = setTimeout(this.doneTyping, this.doneTypingInterval);
  }

  doneTyping() {
    this.isYouType = false;
    this.typingTimer = 0;
  }


  onEnterPress(event: any) {
    if (this.mess.trim() != '')
      this.sendMessage();
  }


  onListenVoice(event: any) {

  }

  onTurnOffVoice(){
    
  }
  //#endregion

}
