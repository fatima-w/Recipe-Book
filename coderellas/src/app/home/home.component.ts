import { ChangeDetectorRef, Component, Input, ViewChildren, ElementRef } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { QueryList } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
interface Slide {
  imageUrl: string;
  quote: string;
}
interface Recipe {
  id: number;
  user_id: number;
  group_id: number;
  cooking_time: number;
  difficulty_level: string;
  recipe: string;
  image_path: string;
  ingredients: any[];
  instructions: string;
  recipe_type: string;
  public: boolean;
  reviews: any[];
  comments: any[];
  likes_count: number;
  dislikes_count: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // userSub:Subscription;
  isSearched:boolean = false;
  slides: Slide[] = [
    {
      imageUrl: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      quote: '"Food is the ingredient that binds us together."',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      quote: '"Eating is a necessity, but cooking is an art."',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1595763603216-41c9e72e41bc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      quote: '"Food is the universal language of happiness."',
    },
  ];
  currentSlideIndex: number = 0;
  slideInterval: any;

  isAuthenticated:boolean = false;

  searchValue: string = '';
  searchBy: string = 'recipe_name'; // Default search by recipe name
  searchedRecipes: Recipe[] = [];
  
  
  constructor(private authService:AuthService, private cd: ChangeDetectorRef, private http:HttpClient, private router:Router){}

  ngOnInit(){
    this.authService.isAuthenticated.subscribe(res =>{
      this.isAuthenticated = res;
    });
    this.startSlideshow();
  }

  // for slideshow
  
  startSlideshow(): void {
    this.slideInterval = setInterval(() => {
      this.showNextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  showNextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  searchRecipes() {
    this.http
      .get<Recipe[]>('http://localhost:5000/search-recipes', {
        params: {
          search_by: this.searchBy,
          search_value: this.searchValue,
        },
      })
      .subscribe(
        {next:(recipes) => {
          this.searchedRecipes = recipes;
          console.log("searched recipes: ", this.searchedRecipes)
          this.isSearched = true;
        },
        error:(error) => {
          console.error('Error searching recipes:', error);
        }}
      );
  }

  toCreateCategory(){
    this.router.navigate(['/create-group'])
  }
}
