import { Component, Input, Output, EventEmitter } from '@angular/core';
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
}