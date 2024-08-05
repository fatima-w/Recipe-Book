import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'coderellas';
  isProfile:boolean = false;
  constructor(private router: Router, private route:ActivatedRoute){}
  ngOnInit(){
    //User will be directed to log in or sign up page at first
    this.router.navigate(['/auth'])
  }
}
