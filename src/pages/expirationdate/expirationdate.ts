import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { RecallPage } from '../recall/recall';
import { InsulinguidePage } from '../insulinguide/insulinguide';
/**
 * Generated class for the ExpirationdatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-expirationdate',
  templateUrl: 'expirationdate.html',
})
export class ExpirationdatePage {

  showRes = false
  resExpdate : string = "";
  resNote: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpirationdatePage');
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

  calExpirationDate(){
    let loader = this.loadingCtrl.create({
      content:"Processing..."
    });
    loader.present();

    this.showRes = true;
    this.resExpdate = "July 1, 2018";
    this.resNote = "Notes about medication appears here via ion-card";
  }

}
