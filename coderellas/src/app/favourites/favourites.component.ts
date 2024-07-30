import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../group/group-detail/recipes/recipe.service';
interface Recipe {
  id: number;
  group_id: number;
  cooking_time: number;
  difficulty_level: string;
  recipe: string;
  image_path: string;
  instructions: string;
  recipe_type: string;
  public: boolean;
  likes_count: number;
  dislikes_count: number;
}

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit {
  favouriteRecipes: Recipe[] = [];

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.fetchFavouriteRecipes();
  }

  fetchFavouriteRecipes(): void {
    this.recipeService.getFavouriteRecipes().subscribe({
      next: (recipes) => {
        this.favouriteRecipes = recipes;
        console.log('Favourite Recipes:', this.favouriteRecipes);
      },
      error: (error) => {
        console.error('Error fetching favourite recipes:', error);
        alert('Failed to fetch favourite recipes!');
      }
    });
  }
}
