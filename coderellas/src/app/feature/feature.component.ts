// // feature.component.ts

// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { RecipeService } from '../group/group-detail/recipes/recipe.service';


// interface Recipe {
//   name: string;
//   ingredients: string[];
//   instructions: string[];
// }

// @Component({
//   selector: 'app-feature',
//   templateUrl: './feature.component.html',
//   styleUrls: ['./feature.component.css']
// })
// export class FeatureComponent {
//   youtubeUrl = '';  // Variable to store the inputted YouTube URL
//   recipeJson;  // Variable to store the generated JSON
//   errorMessage = '';  // Variable to store any error messages

//   name;
//   ingredients:any[];
//   instructiions:any[];

//   constructor(private recipeService: RecipeService) {}

//   // Function to handle form submission
//   onSubmit() {
//     // Check if the YouTube URL is provided
//     if (this.youtubeUrl) {
//       this.recipeService.generateRecipe(this.youtubeUrl).subscribe(
//         {next:(response) => {
//           // Successfully received response from backend
//           // this.recipeJson = JSON.stringify(response, null, 2); // Pretty-print the JSON
//           this.recipeJson = response;
//           console.log(this.recipeJson)
//           // console.log("response:",response);
//           this.errorMessage = '';  // Clear any previous errors
//         },
//         error:(error) => {
//           // Handle any errors from backend
//           this.errorMessage = 'Error generating recipe. Please try again.';
//           console.error('Error generating recipe:', error);
//         }}
//       );
//     } else {
//       this.errorMessage = 'Please provide a valid YouTube URL.';
//     }
//   }
// }

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
  youtubeUrl: string = '';  // Variable to store the inputted YouTube URL
  recipe: Recipe | null = null;  // Variable to store the generated recipe data
  errorMessage: string = '';  // Variable to store any error messages

  constructor(private recipeService: RecipeService) {}

  // Function to handle form submission
  onSubmit() {
    // Check if the YouTube URL is provided
    if (this.youtubeUrl) {
      this.recipeService.generateRecipe(this.youtubeUrl).subscribe(
        {
          next: (response: Recipe) => {
            // Successfully received response from backend
            this.recipe = response;  // Store the recipe data
            this.errorMessage = '';  // Clear any previous errors
          },
          error: (error) => {
            // Handle any errors from backend
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

