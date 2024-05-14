import { Component, OnInit } from '@angular/core';
import { BooksInfo, offer, Reduction } from './books.interface';
import { BooksService } from './books.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'HenryPotier-app';
  books: BooksInfo[] = [];
  reduction: offer[] = [];
  cart: Array<BooksInfo> = [];
  totalPrice: number = 0;
  RealPrice: number = 0;

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
    this.booksService.getBooks().pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(() => new Error('Something bad happened; please try again later.'));
      }))
    .subscribe((books) => { 
        this.books = books;
    });
  }

  addButton(book : BooksInfo) {
    let copy = JSON.parse(JSON.stringify(book));

    for (var item of this.cart)
    {
      if (item.title == book.title) {
        item.quantity += 1;
        item.price += book.price;
        this.getPrice();
        return;
      }
    }
    copy.isbn = book.isbn;
    copy.quantity = 1;
    this.cart.push(copy);
    this.getPrice();
  }

  getPrice()
  {
    let isbns = "";
    var tmpPrice = 0;

    for (var item of this.cart)
    {
      for (let i = 0; i < item.quantity; i++) {
        if ( i != 0)
          isbns = isbns.concat(",")
        isbns = isbns.concat(item.isbn.toString())
      }
      tmpPrice += item.price;
    }
   // this.totalPrice = tmpPrice; } //tmp
    this.booksService.getReduc(isbns).pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(() => new Error('Something bad happened; please try again later.'));
      }))
    .subscribe((offer) => { 
      this.reduction = offer.offers;
      console.log(this.reduction);
      this.RealPrice = tmpPrice;
      this.totalPrice = this.addReduction(tmpPrice, this.reduction);
    });
  }

  addReduction(Price: number, Reducs: offer[]): number
  {
    var reducPrice = Price;
    var tmpPrice = 0;

    for (var reduc of Reducs)
    {
      if (reduc.type == "percentage")
      {
        reducPrice = Price - (Price * (8/100));
     //   console.log("Reduc1 " + (Price * (8/100)))
        if (tmpPrice == 0 || reducPrice < tmpPrice)
          tmpPrice = reducPrice;
      }
      else if (reduc.type == "minus")
      {
        reducPrice = Price - reduc.value;
     //   console.log("Reduc2 " + reduc.value)
        if (tmpPrice == 0 || reducPrice < tmpPrice)
          tmpPrice = reducPrice;
      }
      else if (reduc.type == "slice")
      {
        reducPrice = Price - ((Price/reduc.sliceValue) * reduc.value);
      //  console.log("Reduc3 " + ((Price/reduc.sliceValue) * reduc.value))
        if (tmpPrice == 0 || reducPrice < tmpPrice)
          tmpPrice = reducPrice;
      }
    }
    return tmpPrice;
  }
}

