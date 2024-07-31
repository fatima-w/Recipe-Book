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
    this.router.navigate(['/auth'])
    // if(this.router.url === '/myrecipes' || this.router.url === '/myrecipes/your-recipes' || this.router.url === '/myrecipes/your-categories'){
    //   this.isProfile = true;
    // }
  }
}
