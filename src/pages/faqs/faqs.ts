import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ExpirationdatePage } from '../expirationdate/expirationdate';
import { RecallPage } from '../recall/recall';
import { InsulinguidePage } from '../insulinguide/insulinguide';
import { AngularFireDatabase } from 'angularfire2/database';
import { SplitPaneProvider } from '../../providers/split-pane/split-pane';

/**
 * Generated class for the FaqsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-faqs',
  templateUrl: 'faqs.html',
})
export class FaqsPage {

  information : any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, 
              public afDb:AngularFireDatabase, public splitPane:SplitPaneProvider,
              private platform: Platform) {

    const faqs = this.afDb.list("/faqs").valueChanges();
    faqs.subscribe( rec => {
      
      let items = []
      for(var r in rec)
      {
        let faq = rec[r]
        let faqF1 = {
          "name":faq["question"],
          "children":[{
              name: faq["answer"]
          }]
        }
        items.push(faqF1)
      }
      this.information = items
    })

  }

  ionViewDidLoad() {
    
  }

  ionViewWillEnter() {  
    if(this.platform.width() > 700){
      this.splitPane.splitPaneState = true;
    }   
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

  toggleSection(i) {
    this.information[i].open = !this.information[i].open;
  }
 
  toggleItem(i, j) {
    this.information[i].children[j].open = !this.information[i].children[j].open;
  }


}
