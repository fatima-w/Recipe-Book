import { Component } from '@angular/core';
import { RecipeService } from '../../group/group-detail/recipes/recipe.service';
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
}
@Component({
  selector: 'app-your-recipes',
  templateUrl: './your-recipes.component.html',
  styleUrl: './your-recipes.component.css'
})
export class YourRecipesComponent {
  publicRecipes: Recipe[] = [];
  personalRecipes: Recipe[] = [];

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.loadPublicRecipes();
    this.loadPersonalRecipes();
  }

  loadPublicRecipes(): void {
    this.recipeService.getPublicRecipes().subscribe(
      (recipes) => {
        this.publicRecipes = recipes;
        console.log("your public recipes: ", this.publicRecipes)
      },
      (error) => {
        console.error('Failed to load public recipes', error);
      }    
    );
  }

  loadPersonalRecipes(): void {
    this.recipeService.getPersonalRecipes().subscribe(
      (recipes) => {
        this.personalRecipes = recipes;
        console.log("your personal recipes: ", this.publicRecipes)
      },
      (error) => {
        console.error('Failed to load personal recipes', error);
      }
    );
  }
}
