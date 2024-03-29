import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http'
import { HttpParams } from "@angular/common/http"
import { SplitPaneProvider } from '../../providers/split-pane/split-pane';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  regData = {
    email:"",
    fullname:"",
    password: "",
    password2: ""
  }

  profiles : Observable<any>

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
              public afAuth: AngularFireAuth,public db: AngularFireDatabase,public alertCtrl: AlertController,
              public http: HttpClient, public splitPane: SplitPaneProvider) {
  
      this.profiles = db.list("/profiles").valueChanges()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  ionViewWillEnter() {    
    this.splitPane.splitPaneState = false; 
  } 

  createAccount(){
    var app = this
    let email = this.regData.email;
    let fullname = this.regData.fullname;
    let pwd = this.regData.password;

    if(email == "" || fullname == "" || pwd == "")
    {
      let alert = app.alertCtrl.create({
        title: "Error",
        subTitle: "Fullname, Email and Password is required",
        buttons: ['Ok']
      });
      alert.present();
    }
    else
    {

      let loader = app.loadingCtrl.create({
        content:"Please wait..."    
      });
      loader.present();

      firebase.database().ref('profiles').push({
          admin:false,
          age:"",
          email:email,
          ethnicity:"",
          gender:"",
          occupation:"",
          state:"",
          country:"",
          subscribed:false,
          subscribed_date:"",
          fullname:fullname,
          newsletter: false,
          
          card_last4: "",
          card_exp_month: "",
          card_exp_year: "",
          card_id: "",
          card_brand: "",
          token_id: "",
      });

      return this.afAuth.auth.createUserWithEmailAndPassword(email,pwd)
        .then(function(res){
        
            loader.dismiss();
            let alert = app.alertCtrl.create({
              title: "Success",
              subTitle: "Account created successfully. Login to continue",
              buttons: ['Ok']
             });
             alert.present();

             firebase.auth().currentUser.sendEmailVerification()
                     .then(function(){

                     })
                     .catch(function(error){

                     })

            const params = new HttpParams().set("email",email)
            this.http.get('https://www.medexpiration.com/welcome.php', {params})
            .subscribe(data => {},error=>{});

            const newAcctParams = new HttpParams().set("email",email)
                                                  .set("fullname",fullname)
            this.http.get('http://www.medexpiration.com/new_account.php',{newAcctParams})
            .subscribe(data=>{},error=>{})
          
        },
        function(error){
          loader.dismiss();
          let alert = app.alertCtrl.create({
            title: "Error",
            subTitle: error.message,
            buttons: ['Ok']
          });
          alert.present();
        })
    }
  }

  navToLogin(){
    this.navCtrl.push(LoginPage)
  }

  

}
