import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: Firestore) { }

  async addUserToFirestore(userData: any): Promise<void> {
    try {
      const userRef = collection(this.firestore, 'users');
      await addDoc(userRef, userData);
    } catch (error) {
      console.log('Error adding user to Firestore: ', error);
    }
  }

  async getUsersFromFirestore(): Promise<any[]> {
    try {
      const userRef = collection(this.firestore, 'users');
      const querySnapshot = await getDocs(userRef);
      const usersList: any[] = [];
      querySnapshot.forEach((doc) => {
        usersList.push(doc.data());
      });
      return usersList;
    } catch (error) {
      console.error('Error fetching users from Firestore: ', error);
      return [];
    }
  }
}