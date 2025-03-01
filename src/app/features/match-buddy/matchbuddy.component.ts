import { Component, Input } from '@angular/core';
import { FirebaseService } from '../../firebase.service';

@Component({
    selector: 'app-matchbuddy',
    templateUrl: './matchbuddy.component.html',
    styleUrls: ['./matchbuddy.component.scss']
})
export class MatchBuddyComponent {
    @Input() userData: any;

    selected: string = 'Table Tennis';
    sliderValue: number = 1.5;
    allusers: any[] = [];
    currentCard: any;

    constructor(private firebaseService: FirebaseService) { }

    async matchPlayers() {
        const resp = await this.firebaseService.getUsersFromFirestore();
        this.allusers = resp;
        this.currentCard = resp[0];
        let obj = {
            data: {
                sport: this.selected,
                level: this.sliderValue
            },
            doc_id: this.userData.id
        };
        this.firebaseService.addUserSport(obj);
    }

    swipeRight() {
        const index = this.allusers.findIndex((obj: any) => obj.id === this.currentCard.id);
        if (!index) {
            this.currentCard = this.allusers[this.allusers.length - 1];
        } else {
            this.currentCard = this.allusers[index - 1];
        }
    }

    swipeLeft() {
        const index = this.allusers.findIndex((obj: any) => obj.id === this.currentCard.id);
        if (index === (this.allusers.length - 1)) {
            this.currentCard = this.allusers[0];
        } else {
            this.currentCard = this.allusers[index + 1];
        }
    }

    startChat() {
        let obj = {
            sender_id: this.userData.id,
            sender: this.userData.name,
            reciever: this.currentCard.name,
            reciever_id: this.currentCard.id,
            reciever_img: this.currentCard.imageData.url,
            sender_img: this.userData.imageData.url,
            message: "Lets Play"
        }
        this.firebaseService.saveChats(obj)
    }
}