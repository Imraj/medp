import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ExpirationdatePage } from '../expirationdate/expirationdate';
import { RecallPage } from '../recall/recall';
import { InsulinguidePage } from '../insulinguide/insulinguide';
import { EmailComposer } from '@ionic-native/email-composer';

/**
 * Generated class for the SharePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-share',
  templateUrl: 'share.html',
})
export class SharePage {

  share = {
    email1:"",
    email2:"",
    email3:""
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,private emailComposer: EmailComposer) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SharePage');
  }

  navToExpirationdate(){
    this.navCtrl.push(ExpirationdatePage)
  }

  navToRecall(){
    this.navCtrl.push(RecallPage)
  }

  navToInsulin(){
    this.navCtrl.push(InsulinguidePage)
  }

  shareWithContacts(){

    let email1 = this.share.email1
    let email2 = this.share.email2
    let email3 = this.share.email3

    let email = {
      to: email1,
      cc: email2,
      bcc:[email3],
      subject:"MedExp",
      body:"",
    }    
    this.emailComposer.open(email)
  }

}
