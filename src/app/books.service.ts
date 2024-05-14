import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BooksInfo, Reduction, offer } from './books.interface';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private bookUrl = 'http://henri-potier.xebia.fr/books';

  constructor(private http: HttpClient) { }

  getBooks(): Observable<BooksInfo[]> {
    return this.http.get<BooksInfo[]>(this.bookUrl);
  }

  getReduc(isbns : string): Observable<Reduction> {
    return this.http.get<Reduction>(this.bookUrl + "/" + isbns + "/commercialOffers");
  }
}
