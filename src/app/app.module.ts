import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from "./features/admin/admin.component";
import { UserComponent } from "./features/user/user.component";
import { SignInComponent } from "./features/signIn/signIn.component";
import { SignUpComponent } from "./features/signup/signup.component";
import { AddEventComponent } from "./features/add-event/addevent.component";
import { EditProfileComponent } from "./features/edit-profile/editprofile.component";
import { MatchBuddyComponent } from "./features/match-buddy/matchbuddy.component";
import { ChatComponent } from "./features/chat/chat.component";
import { environment } from '../environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { FirebaseService } from './firebase.service';

import { SharedModule } from "./shared.module";

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    AdminComponent,
    UserComponent,
    AddEventComponent,
    EditProfileComponent,
    MatchBuddyComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
