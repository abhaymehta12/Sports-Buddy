import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Firestore, collection, addDoc, getDocs, doc, updateDoc, query, writeBatch, where, deleteDoc, Timestamp, onSnapshot, Unsubscribe } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private userDataSubject = new BehaviorSubject<any>(null);
  private eventDataSubject = new BehaviorSubject<any>(null);
  private chatDataSubject = new BehaviorSubject<any>(null);
  userData$ = this.userDataSubject.asObservable();
  eventData$ = this.eventDataSubject.asObservable();
  chatData$ = this.chatDataSubject.asObservable();

  constructor(private firestore: Firestore) { }

  private unsubscribeSender: Unsubscribe | null = null;
  private unsubscribeReceiver: Unsubscribe | null = null;

  setUserData(data: any) {
    this.userDataSubject.next(data);
  }

  setEventData(data: any) {
    this.eventDataSubject.next(data);
  }

  setchatData(data: any) {
    this.chatDataSubject.next(data);
  }

  clearAllData() {
    this.userDataSubject.next(null);
    this.eventDataSubject.next(null);
    this.chatDataSubject.next(null);
  }

  async addGoolgeUser(userData: any): Promise<void> {
    try {
      const userRef = collection(this.firestore, 'users');
      const queryuser = await getDocs(query(userRef, where('provider_id', '==', userData.provider_id)));
      if (queryuser.empty) {
        const resp = await addDoc(userRef, userData);
        const userDocRef = doc(this.firestore, 'users', resp.id);
        await updateDoc(userDocRef, {
          id: resp.id
        });
      }
      queryuser.forEach((doc) => {
        userData.id = doc.data().id;
      });
      this.setUserData(userData);
    } catch (error) {
      console.log(error);
    }
  }
  async addUserToFirestore(userData: any): Promise<any> {
    try {
      const userRef = collection(this.firestore, 'users');
      const queryuser = await getDocs(query(userRef, where('username', '==', userData.username)));
      const querypass = await getDocs(query(userRef, where('password', '==', userData.password)));
      if (!queryuser.empty) {
        return "Username already used."
      } else if (!querypass.empty) {
        return "Password already used."
      } else {
        const resp = await addDoc(userRef, userData);
        const userDocRef = doc(this.firestore, 'users', resp.id);
        await updateDoc(userDocRef, {
          id: resp.id
        });
        return { doc_id: resp.id }
      }
    } catch (error) {
      console.log(error);
    }
  }
  async saveImage(data: any): Promise<void> {
    try {
      const userDocRef = doc(this.firestore, 'users', data.doc_id);
      await updateDoc(userDocRef, {
        imageData: {
          id: data.id,
          url: data.url
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  async login(userData: any): Promise<any> {
    try {
      const userRef = collection(this.firestore, 'users');
      const querydata = await getDocs(query(userRef, where('password', '==', userData.password)));
      if (querydata.empty) {
        return "Invalid credentials."
      } else {
        querydata.forEach((doc) => {
          let data = {
            name: doc.data().name,
            address: doc.data().address,
            contact: doc.data().contact,
            imageData: doc.data().imageData,
            id: doc.data().id
          }
          localStorage.setItem("id", doc.data().id)
          this.setUserData(data)
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async saveEvent(data: any): Promise<any> {
    try {
      const eventRef = collection(this.firestore, 'events');
      const resp = await addDoc(eventRef, data);
      const eventDocRef = doc(this.firestore, 'events', resp.id);
      await updateDoc(eventDocRef, {
        id: resp.id
      });
      this.getAllevents();
      return 'Event added successfully!';
    } catch (error) {
      console.log(error);
      return 'Try again later'
    }
  }
  async updateEvent(data: any): Promise<any> {
    try {
      const eventDocRef = doc(this.firestore, 'events', data.id);
      await updateDoc(eventDocRef, data);
      this.getAllevents();
      return 'Event updated successfully!';
    } catch (error) {
      console.log(error);
    }
  }
  async deleteEvent(data: string): Promise<any> {
    try {
      const docRef = doc(this.firestore, 'events', data);
      await deleteDoc(docRef);
      this.getAllevents();
      return 'Event deleted successfully!';
    } catch (error) {
      console.log(error);
    }
  }
  async getUsersFromFirestore(): Promise<any[]> {
    try {
      const userRef = collection(this.firestore, 'users');
      const querySnapshot = await getDocs(userRef);
      const usersList: any[] = [];
      const currentUserData = this.userDataSubject.getValue();
      querySnapshot.forEach((doc) => {
        if (currentUserData && currentUserData.id !== doc.data().id) {
          let data = {
            name: doc.data().name,
            imageData: doc.data().imageData,
            id: doc.data().id,
            sport: doc.data().sport,
            level: doc.data().level
          }
          usersList.push(data);
        }
      });
      return usersList;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  async getAllevents(): Promise<void> {
    try {
      const eventRef = collection(this.firestore, 'events');
      const querySnapshot = await getDocs(eventRef);
      const eventList = querySnapshot.docs.map((doc, index) => ({
        'S. no': index + 1,
        sport: doc.data().sport,
        category: doc.data().category,
        sport_place: doc.data().sport_place,
        location: doc.data().location,
        id: doc.data().id,
        user_id: doc.data().user_id
      }));
      this.setEventData(eventList);
    } catch (error) {
      console.log(error);
    }
  }
  async addUserSport(data: any): Promise<void> {
    try {
      const userDocRef = doc(this.firestore, 'users', data.doc_id);
      await updateDoc(userDocRef, data.data);
    } catch (error) {
      console.log(error);
    }
  }
  async saveChats(data: any): Promise<void> {
    try {
      const chatRef = collection(this.firestore, 'chats');
      data.time = Timestamp.now();
      const resp = await addDoc(chatRef, data);
      const chatDocRef = doc(this.firestore, 'chats', resp.id);
      await updateDoc(chatDocRef, {
        id: resp.id
      });
    } catch (error) {
      console.log(error);
    }
  }
  async updateSeenFlags(data: any): Promise<void> {
    try {
      const chatRef = collection(this.firestore, 'chats');
      const chatQuery = query(
        chatRef,
        where('sender_id', '==', data.sender),
        where('receiver_id', '==', data.receiver)
      );
      
      const querySnapshot = await getDocs(chatQuery);
      const batch = writeBatch(this.firestore);
      querySnapshot.forEach((doc) => {
        batch.update(doc.ref, { seen: true });
      });
      await batch.commit();
    } catch (error) {
      console.log(error);
    }
  }
  getUpdatedChat(userId: string) {
    try {
      const chatsRef = collection(this.firestore, 'chats');
      const senderQuery = query(chatsRef, where('sender_id', '==', userId));
      const receiverQuery = query(chatsRef, where('receiver_id', '==', userId));

      const allDocs: Map<string, any> = new Map();

      this.unsubscribeSender = onSnapshot(senderQuery, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          allDocs.set(doc.id, { id: doc.id, ...data });
        });
        this.setchatData(Array.from(allDocs.values()));
      });

      this.unsubscribeReceiver = onSnapshot(receiverQuery, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          allDocs.set(doc.id, { id: doc.id, ...data });
        });
        this.setchatData(Array.from(allDocs.values()));
      });
    } catch (error) {
      console.error(error);
    }
  }
  stopListening() {
    if (this.unsubscribeSender) {
      this.unsubscribeSender();
    }
    if (this.unsubscribeReceiver) {
      this.unsubscribeReceiver();
    }
  }
}