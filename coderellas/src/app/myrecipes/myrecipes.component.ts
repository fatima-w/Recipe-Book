import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myrecipes',
  templateUrl: './myrecipes.component.html',
  styleUrl: './myrecipes.component.css'
})
export class MyrecipesComponent {

  constructor(private router:Router){}

  onCreate(){
    this.router.navigate(['/create'])
  }

  activeSection: string = 'yourRecipes'; // Default section

  // showSection(section: string): void {
  //   this.activeSection = section;
  // }

  toYourRecipes(){
    this.activeSection = 'yourRecipes';
    this.router.navigate(['/myrecipes/your-recipes'])

  }
  toYourCategories(){
    this.activeSection = 'yourCategories';
    this.router.navigate(['/myrecipes/your-categories'])

  }
}
