//component for extracting the recipe name , ingredients and instructions through provided youtube url.
import { Component } from '@angular/core';
import { RecipeService } from '../group/group-detail/recipes/recipe.service';

interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
}

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.css']
})
export class FeatureComponent {
  youtubeUrl: string = ''; 
  recipe: Recipe | null = null;  
  errorMessage: string = '';  
  constructor(private recipeService: RecipeService) {}

  // Method for habdling form submission
  onSubmit() {
    if (this.youtubeUrl) {      // Checking if the YouTube URL is provided by user
      this.recipeService.generateRecipe(this.youtubeUrl).subscribe(
        {
          next: (response: Recipe) => {
            this.recipe = response;  
            this.errorMessage = '';  // Clear any previous errors
          },
          error: (error) => {
            // Handling errors
            this.errorMessage = 'Error generating recipe. Please try again.';
            console.error('Error generating recipe:', error);
          }
        }
      );
    } else {
      this.errorMessage = 'Please provide a valid YouTube URL.';
    }
  }
}

