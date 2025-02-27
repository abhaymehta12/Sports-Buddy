import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Firestore, collection, addDoc, getDocs, doc, updateDoc, query, where, deleteDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private userDataSubject = new BehaviorSubject<any>(null);
  private eventDataSubject = new BehaviorSubject<any>(null);
  userData$ = this.userDataSubject.asObservable();
  eventData$ = this.eventDataSubject.asObservable();

  constructor(private firestore: Firestore) { }

  setUserData(data: any) {
    this.userDataSubject.next(data);
  }

  setEventData(data: any) {
    this.eventDataSubject.next(data);
  }

  clearAllData() {
    this.userDataSubject.next(null);
    this.eventDataSubject.next(null);
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
      this.setUserData(userData)
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
      const userRef = collection(this.firestore, 'events');
      const resp = await addDoc(userRef, data);
      const userDocRef = doc(this.firestore, 'events', resp.id);
      await updateDoc(userDocRef, {
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
      const userDocRef = doc(this.firestore, 'events', data.id);
      await updateDoc(userDocRef, data);
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
      querySnapshot.forEach((doc) => {
        let data = {
          name: doc.data().name,
          imageData: doc.data().imageData,
          id: doc.data().id,
          sport: doc.data().sport,
          level: doc.data().level
        }
        usersList.push(data);
      });
      return usersList;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  async getAllevents(): Promise<void> {
    try {
      const userRef = collection(this.firestore, 'events');
      const querySnapshot = await getDocs(userRef);
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
}