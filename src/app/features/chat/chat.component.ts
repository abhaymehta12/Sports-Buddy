import { Component, Input, OnInit } from '@angular/core';
import { FirebaseService } from '../../firebase.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @Input() userData: any;
  chatList: any[] = [];
  myMessages: any[] = [];
  chatMessages: any[] = [];
  message: string = '';
  selected: any = null;

  constructor(private firebaseService: FirebaseService) { }

  async ngOnInit() {
    this.firebaseService.chatData$.subscribe(data => {
      if (data && this.userData) {
        data.forEach((ele: any) => {
          if (ele.sender_id === this.userData.id || ele.reciever_id === this.userData.id) {
            const isChatExist = this.chatList.some((chat: any) =>
              (chat.sender_id === ele.sender_id && chat.reciever_id === ele.reciever_id) ||
              (chat.sender_id === ele.reciever_id && chat.reciever_id === ele.sender_id)
            );
            if (!isChatExist) {
              this.chatList.push(ele);
            }
          }
        });
        this.myMessages = data;
      }
    });

    try {
      await this.firebaseService.getChats(this.userData.id);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }

  openChat(param: any) {
    this.selected = param;
    this.chatMessages = this.myMessages.filter((el: any) =>
      (param.sender_id === el.sender_id && param.reciever_id === el.reciever_id) ||
      (param.sender_id === el.reciever_id && param.reciever_id === el.sender_id))

    this.chatMessages.forEach((ele: any) => {
      const date = ele.time.toDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      ele.format_time = `${hours}:${minutes}`;
    })
    this.chatMessages.sort((a, b) => a.time.toDate() - b.time.toDate());
  }

  async sendChat() {
    if (this.selected && this.message) {
      let obj = {
        sender_id: this.userData.id,
        sender: this.userData.name,
        reciever: this.userData.id === this.selected.reciever_id ? this.selected.sender : this.selected.reciever,
        reciever_id: this.userData.id === this.selected.reciever_id ? this.selected.sender_id : this.selected.reciever_id,
        reciever_img: this.userData.id === this.selected.reciever_id ? this.selected.sender_img : this.selected.reciever_img,
        sender_img: this.userData.imageData.url,
        message: this.message
      }
      this.message = "";
      this.firebaseService.saveChats(obj);
      await this.firebaseService.getChats(this.userData.id);
      this.openChat(this.selected);
    }
  }
}