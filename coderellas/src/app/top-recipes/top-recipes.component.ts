import { Component } from '@angular/core';
import { RecipeService } from '../group/group-detail/recipes/recipe.service';
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
  selector: 'app-top-recipes',
  templateUrl: './top-recipes.component.html',
  styleUrl: './top-recipes.component.css'
})
export class TopRecipesComponent {
  topRecipes: Recipe[] = [];

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.loadTopRecipes();
  }

  loadTopRecipes(): void {
    this.recipeService.getTopRecipes().subscribe(
      {next:(recipes: Recipe[]) => {
        this.topRecipes = recipes;
        console.log("top recipes: ",this.topRecipes)
      },
      error:(error) => {
        console.error('Failed to fetch top recipes', error);
      }}
    );
  }
}
