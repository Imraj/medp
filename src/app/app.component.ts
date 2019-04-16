import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, SplitPane } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { AboutPage } from "../pages/about/about";
import { ContactPage } from "../pages/contact/contact";
import { FaqsPage } from "../pages/faqs/faqs";
import { PrivacypolicyPage } from "../pages/privacypolicy/privacypolicy";
import { ProfilePage } from "../pages/profile/profile";
import { SharePage } from "../pages/share/share";
import { SubscriptionPage } from "../pages/subscription/subscription";
import { TermsofservicePage } from "../pages/termsofservice/termsofservice";
import { LoginPage } from '../pages/login/login';
import { SplitPaneProvider } from "../providers/split-pane/split-pane";

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from "@ionic/storage";




@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  currentUser : string

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
              public storage: Storage, public splitPane:SplitPaneProvider) {
    this.initializeApp();
    
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'App Home', component: HomePage },
      { title: 'Profile', component: ProfilePage  },
      { title: 'About', component: AboutPage  },
      { title: 'Share', component: SharePage  },
      { title: 'FAQs', component: FaqsPage  },
      { title: 'Subscription', component: SubscriptionPage  },
      { title: 'Contact / Provide Feedback', component: ContactPage  },
      { title: 'Privacy Policy', component: PrivacypolicyPage  },
      { title: 'Terms of Service', component: TermsofservicePage  },
    ];

    // const profile = this.db.list("/profiles", ref=> ref.orderByChild("email").equalTo(email)).valueChanges()
    // profile.subscribe(data => {
    
    //   let user = {"age":data[0]["age"],
    //               "admin":data[0]["admin"],
    //               "email":data[0]["email"],
    //               "ethnicity":data[0]["ethnicity"],
    //               "fullname":data[0]["fullname"],
    //               "gender":data[0]["gender"],
    //               "occupation":data[0]["occupation"],
    //               "state":data[0]["state"],
    //               "country":data[0]["country"],
    //               "subscribed":data[0]["subscribed"],
    //               "subscribed_date":data[0]["subscribed_date"]
    //   }
      
    //   console.log("str-user",user)
    //   this.storage.setItem("user",user).subscribe(()=>{})

    // },err=>{
    //   console.log("Err")
    //   console.log(err)
    // });

  }

  initializeApp(){
    var app = this
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.storage.get("currentEmail").then((val)=>{
        app.currentUser = val
        app.rootPage = app.currentUser ? HomePage : LoginPage
      })
      
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  navToHome(){
    this.nav.push(HomePage)
  }
  navToProfile(){
    this.nav.push(ProfilePage)
  }
  navToAbout(){
    this.nav.push(AboutPage)
  }
  navToShare(){
    this.nav.push(SharePage)
  }
  navToFaqs(){
    this.nav.push(FaqsPage)
  }
  navToSub(){
    this.nav.push(SubscriptionPage)
  }
  navToContact(){
    this.nav.push(ContactPage)
  }
  navToPrivacy(){
    this.nav.push(PrivacypolicyPage)
  }
  navToTOS(){
    this.nav.push(TermsofservicePage)
  }
  logout(){

    this.storage.clear()
    this.nav.setRoot(LoginPage).then( ()=>{
      this.nav.popToRoot().then( ()=> {}).catch(err=>{});
    }).catch(err=>{

  });
    
  }

}
