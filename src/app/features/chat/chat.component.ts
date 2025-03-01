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
      }
    });

    try {
      await this.firebaseService.getChats(this.userData.id);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }
}