import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Firestore, collection, addDoc, getDocs, doc, updateDoc, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private userDataSubject = new BehaviorSubject<any>(null);
  userData$ = this.userDataSubject.asObservable();

  constructor(private firestore: Firestore) { }

  setUserData(data: any) {
    this.userDataSubject.next(data);
  }

  clearUserData() {
    this.userDataSubject.next(null);
  }

  async addGoolgeUser(userData: any): Promise<any> {
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
            imageData: doc.data().imageData
          }
          localStorage.setItem("id", doc.data().id)
          this.setUserData(data)
        });
      }
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
      console.log(error);
      return [];
    }
  }
}