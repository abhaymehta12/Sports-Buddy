import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../../firebase.service';
import { Subscription } from 'rxjs';

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

  private chatDataSubscription: Subscription | null = null;

  constructor(private firebaseService: FirebaseService) { }

  async ngOnInit() {
    this.firebaseService.getUpdatedChat(this.userData.id);
    this.chatDataSubscription = this.firebaseService.chatData$.subscribe(data => {
      if (!data || !this.userData) return;
      const existingChats = new Set<string>();
      const newChats: any[] = [];
      let firstElement: any;
      this.chatList = [];
      data.forEach((ele: any) => {
        const chatKey = [ele.sender_id, ele.receiver_id].sort().join('_');
        if (existingChats.has(chatKey)) return;
        existingChats.add(chatKey);
        const haveNewChats = data.some((chat: any) =>
          chat.sender_id === ele.sender_id &&
          chat.receiver_id === this.userData.id &&
          !chat.seen
        );
        if (haveNewChats) {
          ele.seen = false;
        }
        if (this.selected && (this.selected.sender_id === ele.sender_id || this.selected.receiver_id === ele.receiver_id)) {
          firstElement = ele;
        }
        if (!firstElement) {
          const position = haveNewChats ? newChats.unshift : newChats.push;
          position.call(newChats, ele);
        }
      });
      if (firstElement) {
        newChats.unshift(firstElement);
      }
      this.chatList = newChats;
      this.myMessages = data;
    });

  }

  ngOnDestroy(): void {
    this.firebaseService.stopListening();
    if (this.chatDataSubscription) {
      this.chatDataSubscription.unsubscribe();
    }
  }

  openChat(param: any) {
    this.selected = param;
    this.chatMessages = this.myMessages.filter((el: any) =>
      (param.sender_id === el.sender_id && param.receiver_id === el.receiver_id) ||
      (param.sender_id === el.receiver_id && param.receiver_id === el.sender_id))

    this.chatMessages.forEach((ele: any) => {
      const date = ele.time.toDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      ele.format_time = `${hours}:${minutes}`;
    })
    this.chatMessages.sort((a, b) => a.time.toDate() - b.time.toDate());
    let obj = {
      receiver: this.userData.id,
      sender: this.userData.id === param.receiver_id ? param.sender_id : param.receiver_id
    }
    this.firebaseService.updateSeenFlags(obj);
  }

  async sendChat() {
    if (this.selected && this.message) {
      let obj = {
        sender_id: this.userData.id,
        sender: this.userData.name,
        receiver: this.userData.id === this.selected.receiver_id ? this.selected.sender : this.selected.receiver,
        receiver_id: this.userData.id === this.selected.receiver_id ? this.selected.sender_id : this.selected.receiver_id,
        receiver_img: this.userData.id === this.selected.receiver_id ? this.selected.sender_img : this.selected.receiver_img,
        sender_img: this.userData.imageData.url,
        message: this.message
      }
      this.message = "";
      await this.firebaseService.saveChats(obj);
      this.openChat(this.selected);
    }
  }
}