import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from '../../recipe.service';
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
  username?:string;
}

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrl: './recipe-item.component.css'
})
export class RecipeItemComponent {
  @Input() recipe: Recipe;
  creatorUsername: string = '';
  constructor(private router:Router, private recipeService: RecipeService){}
  getImageUrl(imagePath: string): string {
    return `http://127.0.0.1:5000/static/${imagePath}`;
  }
  ngOnInit(){
    console.log(this.recipe)
    this.fetchCreatorUsername();
  }
  viewDetails() {
    // Navigate to recipe-detail with the recipe ID after clicking the current recipe item
    this.router.navigate(['/recipe-detail', this.recipe.id]);
  }
  fetchCreatorUsername(): void {
    this.recipeService.getRecipeCreatorUsername(this.recipe.id).subscribe(
      (data) => {
        this.creatorUsername = data.username;
        console.log(this.creatorUsername)
      },
      (error) => {
        console.error('Error fetching creator username:', error);
      }
    );
  }
}
