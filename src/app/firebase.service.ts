import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, updateDoc, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: Firestore) { }

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
      console.log('Error adding user to Firestore: ', error);
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