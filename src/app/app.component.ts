import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
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

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
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

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  navToHome(){
    
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
    
  }

}
