import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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

import { HTTP } from '@ionic-native/http';

import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { Stripe } from "@ionic-native/stripe"
import { EmailComposer } from '@ionic-native/email-composer';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { AutoCompleteModule } from "ionic2-auto-complete";

import { IonicSelectableModule } from 'ionic-selectable';

import { TooltipsModule } from 'ionic-tooltips';

import { FormsModule } from "@angular/forms";
import { Ng2CompleterModule } from "ng2-completer";

import { ChangeCardPage } from '../pages/change-card/change-card';

import { AnimationService, AnimatesDirective } from 'css-animator';

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
    ForgotpwdPage,
    ChangeCardPage,
    AnimatesDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpClientModule,
    HttpModule,
    IonicSelectableModule,
    TooltipsModule,
    FormsModule,
    Ng2CompleterModule
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
    ForgotpwdPage,
    ChangeCardPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Stripe,
    EmailComposer,
    HTTP,
    InAppBrowser,
    AngularFireDatabase,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AnimationService
  ]
})
export class AppModule {}
