import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {AutoCompleteService} from 'ionic2-auto-complete';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'

/*
  Generated class for the CompletetestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CompletetestProvider {

  labelAttribute = "name";

  constructor(private http:Http) {

  }
  getResults(keyword:string) {
    return this.http.get("https://restcountries.eu/rest/v1/name/"+keyword)
      .map(
        result =>
        {
          return result.json()
            .filter(item => item.name.toLowerCase().startsWith(keyword.toLowerCase()) )
        });
  }

}
