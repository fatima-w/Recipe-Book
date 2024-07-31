import { ChangeDetectorRef, Component, Input, ViewChildren, ElementRef } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { QueryList } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  slides: Slide[] = [
    {
      imageUrl: 'https://images.unsplash.com/photo-1482017276394-d2ddc6d4c978?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTYxfHxmb29kfGVufDB8MHwwfHx8Mg%3D%3D',
      quote: '“The best memories are made around the table.” ',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1457460866886-40ef8d4b42a0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTY2fHxmb29kfGVufDB8MHwwfHx8Mg%3D%3D',
      quote: '“Food is a bridge between hearts.”',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1457666134378-6b77915bd5f2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fGZvb2R8ZW58MHx8MHx8fDI%3D',
      quote: '"The joy of cooking is in the sharing."',
    },
  ];
  currentSlideIndex: number = 0;
  slideInterval: any;

  isAuthenticated:boolean = false;

  searchValue: string = '';
  searchBy: string = 'recipe_name'; // Default search by recipe name
  searchedRecipes: Recipe[] = [];
  
  
  constructor(private authService:AuthService, private cd: ChangeDetectorRef, private http:HttpClient){}

  // ngOnint(){
  //   this.userSub = this.authService.user.subscribe(user =>{
  //     this.isAuthenticated = !!user;
  //     // console.log(!user);
  //     console.log("user authentication status: ",!!user);
  //     this.cd.detectChanges();
  //   });
  // }

  ngOnInit(){
    this.authService.isAuthenticated.subscribe(res =>{
      this.isAuthenticated = res;
    });
    this.startSlideshow();
  }
  
  

  // ngOnDestroy() { // Implement OnDestroy to clean up the subscription
  //   if (this.userSub) {
  //     this.userSub.unsubscribe();
  //   }
  // }


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
        },
        error:(error) => {
          console.error('Error searching recipes:', error);
        }}
      );
  }
}
