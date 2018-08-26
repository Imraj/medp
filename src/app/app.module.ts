import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AboutPage } from "../pages/about/about";
import { ContactPage } from "../pages/contact/contact";
import { FaqsPage } from "../pages/faqs/faqs";
import { PrivacypolicyPage } from "../pages/privacypolicy/privacypolicy";
import { ProfilePage } from "../pages/profile/profile";
import { SharePage } from "../pages/share/share";
import { SubscriptionPage } from "../pages/subscription/subscription";
import { TermsofservicePage } from "../pages/termsofservice/termsofservice";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ExpirationdatePage } from '../pages/expirationdate/expirationdate';
import { RecallPage } from '../pages/recall/recall';
import { InsulinguidePage } from '../pages/insulinguide/insulinguide';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ForgotpwdPage } from '../pages/forgotpwd/forgotpwd';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import {firebaseConfig} from "../environment";

import { IonicStorageModule } from '@ionic/storage';

import { HttpModule } from '@angular/http';

import { Stripe } from "@ionic-native/stripe"
import { EmailComposer } from '@ionic-native/email-composer';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AboutPage,
    ContactPage,
    FaqsPage,
    PrivacypolicyPage,
    ProfilePage,
    SharePage,
    SubscriptionPage,
    TermsofservicePage,
    ExpirationdatePage,
    RecallPage,
    InsulinguidePage,
    LoginPage,
    RegisterPage,
    ForgotpwdPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AboutPage,
    ContactPage,
    FaqsPage,
    PrivacypolicyPage,
    ProfilePage,
    SharePage,
    SubscriptionPage,
    TermsofservicePage,
    
    ExpirationdatePage,
    RecallPage,
    InsulinguidePage,
    LoginPage,
    RegisterPage,
    ForgotpwdPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Stripe,
    EmailComposer,
    AngularFireDatabase,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
