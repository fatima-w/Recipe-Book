// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { ActivatedRoute } from '@angular/router';
// import { RecipeService } from '../recipe.service';
// @Component({
//   selector: 'app-recipe-detail',
//   templateUrl: './recipe-detail.component.html',
//   styleUrl: './recipe-detail.component.css'
// })
// export class RecipeDetailComponent {
//   recipe: any; // Adjust type as needed

//   constructor(private route: ActivatedRoute, private recipeService: RecipeService) { }

//   ngOnInit(): void {
//     const recipeId = +this.route.snapshot.paramMap.get('id')!;
//     this.recipeService.getRecipeById(recipeId).subscribe(
//       data => this.recipe = data,
//       error => console.error('Error fetching recipe:', error)
//     );
//   }
// }
// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { ActivatedRoute } from '@angular/router';
// import { RecipeService } from '../recipe.service';
// import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';

// @Component({
//   selector: 'app-recipe-detail',
//   templateUrl: './recipe-detail.component.html',
//   styleUrls: ['./recipe-detail.component.css']
// })
// export class RecipeDetailComponent {
//   recipe: any; // Adjust type as needed
//   isEditing: boolean = false;
//   recipeForm: FormGroup;

//   constructor(
//     private route: ActivatedRoute,
//     private recipeService: RecipeService,
//     private fb: FormBuilder,
//     private router: Router
//   ) { 
//     this.recipeForm = this.fb.group({
//       name: ['', Validators.required],
//       ingredients: this.fb.array([]),
//       instructions: ['', Validators.required],
//       cookingTime: ['', Validators.required],
//       difficultyLevel: ['', Validators.required],
//       recipeType: ['', Validators.required],
//     });
//   }

//   ngOnInit(): void {
//     const recipeId = +this.route.snapshot.paramMap.get('id')!;
//     this.recipeService.getRecipeById(recipeId).subscribe(
//       data => {
//         this.recipe = data;
//         this.initializeForm(this.recipe);
//       },
//       error => console.error('Error fetching recipe:', error)
//     );
//   }

//   initializeForm(recipe: any): void {
//     this.recipeForm.patchValue({
//       name: recipe.recipe,
//       instructions: recipe.instructions,
//       cookingTime: recipe.cooking_time,
//       difficultyLevel: recipe.difficulty_level,
//       recipeType: recipe.recipe_type
//     });

//     const ingredientsArray = this.recipeForm.get('ingredients') as FormArray;
//     ingredientsArray.clear();
//     recipe.ingredients.forEach((ingredient: any) => {
//       ingredientsArray.push(this.fb.group({
//         quantity: [ingredient.quantity, Validators.required],
//         name: [ingredient.name, Validators.required],
//         id: [ingredient.id]
//       }));
//     });
//   }

//   deleteRecipe(): void {
//     const recipeId = this.recipe.id;
//     this.recipeService.deleteRecipe(recipeId).subscribe({
//       next: () => {
//         alert('Recipe deleted successfully!');
//         this.router.navigate(['/recipes']); // Navigate to the recipe list or home
//       },
//       error: (error) => {
//         console.error('Error deleting recipe:', error);
//         alert('Failed to delete recipe!');
//       }
//     });
//   }

//   editRecipe(): void {
//     if (this.recipeForm.invalid) {
//       alert('Please fill out all required fields!');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('name', this.recipeForm.get('name')?.value);
//     formData.append('instructions', this.recipeForm.get('instructions')?.value);
//     formData.append('cooking_time', this.recipeForm.get('cookingTime')?.value);
//     formData.append('difficulty_level', this.recipeForm.get('difficultyLevel')?.value);
//     formData.append('recipe_type', this.recipeForm.get('recipeType')?.value);

//     const ingredients = this.recipeForm.get('ingredients') as FormArray;
//     ingredients.controls.forEach((ingredient) => {
//       formData.append('ingredient_quantities[]', ingredient.get('quantity')?.value);
//       formData.append('ingredient_names[]', ingredient.get('name')?.value);
//       const id = ingredient.get('id')?.value;
//       if (id) {
//         formData.append('ingredient_ids[]', id);
//       }
//     });

//     const recipeId = this.recipe.id;
//     this.recipeService.editRecipe(recipeId, formData).subscribe({
//       next: (response) => {
//         alert('Recipe edited successfully!');
//         this.recipe = response.recipe;
//         this.isEditing = false;
//       },
//       error: (error) => {
//         console.error('Error editing recipe:', error);
//         alert('Failed to edit recipe!');
//       }
//     });
//   }

//   toggleEdit(): void {
//     this.isEditing = !this.isEditing;
//   }
// }

// import { Component, OnInit } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';
// import { RecipeService } from '../recipe.service';
// import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

// @Component({
//   selector: 'app-recipe-detail',
//   templateUrl: './recipe-detail.component.html',
//   styleUrls: ['./recipe-detail.component.css']
// })
// export class RecipeDetailComponent implements OnInit {
//   recipe: any; // Adjust type as needed
//   isEditing: boolean = false;
//   recipeForm: FormGroup;

//   constructor(
//     private route: ActivatedRoute,
//     private recipeService: RecipeService,
//     private fb: FormBuilder,
//     private router: Router
//   ) { 
//     this.recipeForm = this.fb.group({
//       name: ['', Validators.required],
//       ingredients: this.fb.array([]),  // Using FormArray for ingredients
//       instructions: ['', Validators.required],
//       cookingTime: ['', Validators.required],
//       difficultyLevel: ['', Validators.required],
//       recipeType: ['', Validators.required],
//     });
//   }

//   ngOnInit(): void {
//     const recipeId = +this.route.snapshot.paramMap.get('id')!;
//     this.recipeService.getRecipeById(recipeId).subscribe(
//       data => {
//         this.recipe = data;
//         this.initializeForm(this.recipe);
//       },
//       error => console.error('Error fetching recipe:', error)
//     );
//   }

//   // Initialize the form with the recipe data
//   initializeForm(recipe: any): void {
//     this.recipeForm.patchValue({
//       name: recipe.recipe,
//       instructions: recipe.instructions,
//       cookingTime: recipe.cooking_time,
//       difficultyLevel: recipe.difficulty_level,
//       recipeType: recipe.recipe_type
//     });

//     const ingredientsArray = this.recipeForm.get('ingredients') as FormArray;
//     ingredientsArray.clear();  // Clear existing form array
//     recipe.ingredients.forEach((ingredient: any) => {
//       ingredientsArray.push(this.fb.group({
//         quantity: [ingredient.quantity, Validators.required],
//         name: [ingredient.name, Validators.required],
//         id: [ingredient.id]  // Hidden field to track existing ingredients
//       }));
//     });
//   }

//   // Method to add a new ingredient form group
//   addIngredient(): void {
//     const ingredients = this.recipeForm.get('ingredients') as FormArray;
//     ingredients.push(this.fb.group({
//       quantity: ['', Validators.required],
//       name: ['', Validators.required],
//       id: [null]  // New ingredients won't have an ID initially
//     }));
//   }

//   // Method to remove an ingredient form group at a specific index
//   removeIngredient(index: number): void {
//     const ingredients = this.recipeForm.get('ingredients') as FormArray;
//     if (ingredients.length > 1) {
//       ingredients.removeAt(index);
//     } else {
//       alert('At least one ingredient is required!');
//     }
//   }

//   // Method to handle recipe deletion
//   deleteRecipe(): void {
//     const recipeId = this.recipe.id;
//     this.recipeService.deleteRecipe(recipeId).subscribe({
//       next: () => {
//         alert('Recipe deleted successfully!');
//         this.router.navigate(['/recipes']); // Navigate to the recipe list or home
//       },
//       error: (error) => {
//         console.error('Error deleting recipe:', error);
//         alert('Failed to delete recipe!');
//       }
//     });
//   }

//   // Method to handle recipe editing
//   editRecipe(): void {
//     if (this.recipeForm.invalid) {
//       alert('Please fill out all required fields!');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('name', this.recipeForm.get('name')?.value);
//     formData.append('instructions', this.recipeForm.get('instructions')?.value);
//     formData.append('cooking_time', this.recipeForm.get('cookingTime')?.value);
//     formData.append('difficulty_level', this.recipeForm.get('difficultyLevel')?.value);
//     formData.append('recipe_type', this.recipeForm.get('recipeType')?.value);

//     const ingredients = this.recipeForm.get('ingredients') as FormArray;
//     ingredients.controls.forEach((ingredient) => {
//       formData.append('ingredient_quantities[]', ingredient.get('quantity')?.value);
//       formData.append('ingredient_names[]', ingredient.get('name')?.value);
//       const id = ingredient.get('id')?.value;
//       if (id) {
//         formData.append('ingredient_ids[]', id);  // Append existing ID if present
//       } else {
//         formData.append('ingredient_ids[]', '');  // Ensure new ingredients have empty ID
//       }
//     });

//     const recipeId = this.recipe.id;
//     this.recipeService.editRecipe(recipeId, formData).subscribe({
//       next: (response) => {
//         alert('Recipe edited successfully!');
//         this.recipe = response.recipe;
//         this.isEditing = false;
//         this.initializeForm(this.recipe);  // Reinitialize form with updated data
//       },
//       error: (error) => {
//         console.error('Error editing recipe:', error);
//         alert('Failed to edit recipe!');
//       }
//     });
//   }

//   // Toggle edit mode
//   toggleEdit(): void {
//     this.isEditing = !this.isEditing;
//   }
// }
// import { Component, OnInit } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';
// import { RecipeService } from '../recipe.service';
// import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

// @Component({
//   selector: 'app-recipe-detail',
//   templateUrl: './recipe-detail.component.html',
//   styleUrls: ['./recipe-detail.component.css']
// })
// export class RecipeDetailComponent implements OnInit {
//   recipe: any; // Adjust type as needed
//   isEditing: boolean = false;
//   recipeForm: FormGroup;

//   constructor(
//     private route: ActivatedRoute,
//     private recipeService: RecipeService,
//     private fb: FormBuilder,
//     private router: Router
//   ) { 
//     this.recipeForm = this.fb.group({
//       name: ['', Validators.required],
//       description: ['', Validators.required], // Add description field
//       ingredients: this.fb.array([]),
//       instructions: ['', Validators.required],
//       cookingTime: ['', Validators.required],
//       difficultyLevel: ['', Validators.required],
//       recipeType: ['', Validators.required],
//     });
//   }

//   ngOnInit(): void {
//     const recipeId = +this.route.snapshot.paramMap.get('id')!;
//     this.recipeService.getRecipeById(recipeId).subscribe(
//       {next:data => {
//         this.recipe = data;
//         this.initializeForm(this.recipe);
//       },
//       error:error => console.error('Error fetching recipe:', error)}
//     );
//   }

//   // Initialize the form with the recipe data
//   initializeForm(recipe: any): void {
//     this.recipeForm.patchValue({
//       name: recipe.name,
//       // description: recipe.description, // Set description value
//       instructions: recipe.instructions,
//       cookingTime: recipe.cooking_time,
//       difficultyLevel: recipe.difficulty_level,
//       recipeType: recipe.recipe_type,
//     });

//     // Initialize ingredients
//     const ingredientsFormArray = this.recipeForm.get('ingredients') as FormArray;
//     recipe.ingredients.forEach((ingredient: any) => {
//       ingredientsFormArray.push(
//         this.fb.group({
//           name: [ingredient.name, Validators.required],
//           quantity: [ingredient.quantity, Validators.required],
//         })
//       );
//     });
//   }

//   get ingredients(): FormArray {
//     return this.recipeForm.get('ingredients') as FormArray;
//   }

//   addIngredient(): void {
//     this.ingredients.push(
//       this.fb.group({
//         name: ['', Validators.required],
//         quantity: ['', Validators.required],
//       })
//     );
//   }

//   removeIngredient(index: number): void {
//     this.ingredients.removeAt(index);
//   }

//   toggleEdit(): void {
//     this.isEditing = !this.isEditing;
//   }

//   saveChanges(): void {
//     if (this.recipeForm.invalid) {
//       alert('Please fill out all required fields!');
//       return;
//     }

//     const updatedRecipe = {
//       ...this.recipe,
//       name: this.recipeForm.get('name')?.value,
//       // description: this.recipeForm.get('description')?.value, // Get updated description
//       instructions: this.recipeForm.get('instructions')?.value,
//       cooking_time: this.recipeForm.get('cookingTime')?.value,
//       difficulty_level: this.recipeForm.get('difficultyLevel')?.value,
//       recipe_type: this.recipeForm.get('recipeType')?.value,
//       ingredients: this.ingredients.value,
//     };
//     const recipeId = this.recipe.id;
//     this.recipeService.editRecipe(recipeId,updatedRecipe).subscribe(
//       () => {
//         alert('Recipe updated successfully!');
//         this.isEditing = false;
//         this.router.navigate(['/recipe-detail', updatedRecipe.id]);
//       },
//       error => console.error('Error updating recipe:', error)
//     );
//   }
// }



import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
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
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: any; // Adjust type as needed
  isEditing: boolean = false;
  recipeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private fb: FormBuilder,
    private router: Router
  ) { 
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      ingredients: this.fb.array([]),  // Using FormArray for ingredients
      instructions: ['', Validators.required],
      cookingTime: ['', Validators.required],
      difficultyLevel: ['', Validators.required],
      recipeType: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const recipeId = +this.route.snapshot.paramMap.get('id')!;
    this.recipeService.getRecipeById(recipeId).subscribe(
      {next: data => {
        this.recipe = data;
        this.initializeForm(this.recipe);
      },
      error: error => console.error('Error fetching recipe:', error)}
    );
  }

  // Initialize the form with the recipe data
  initializeForm(recipe: any): void {
    this.recipeForm.patchValue({
      name: recipe.recipe,
      instructions: recipe.instructions,
      cookingTime: recipe.cooking_time,
      difficultyLevel: recipe.difficulty_level,
      recipeType: recipe.recipe_type
    });

    const ingredientsArray = this.recipeForm.get('ingredients') as FormArray;
    ingredientsArray.clear();  // Clear existing form array
    recipe.ingredients.forEach((ingredient: any) => {
      ingredientsArray.push(this.fb.group({
        quantity: [ingredient.quantity, Validators.required],
        name: [ingredient.name, Validators.required],
        id: [ingredient.id]  // Hidden field to track existing ingredients
      }));
    });
  }

  // Method to add a new ingredient form group
  addIngredient(): void {
    const ingredients = this.recipeForm.get('ingredients') as FormArray;
    ingredients.push(this.fb.group({
      quantity: ['', Validators.required],
      name: ['', Validators.required],
      id: [null]  // New ingredients won't have an ID initially
    }));
  }

  // Method to remove an ingredient form group at a specific index
  removeIngredient(index: number): void {
    const ingredients = this.recipeForm.get('ingredients') as FormArray;
    if (ingredients.length > 1) {
      ingredients.removeAt(index);
    } else {
      alert('At least one ingredient is required!');
    }
  }

  // Method to handle recipe deletion
  deleteRecipe(): void {
    const recipeId = this.recipe.id;
    this.recipeService.deleteRecipe(recipeId).subscribe({
      next: () => {
        alert('Recipe deleted successfully!');
        this.router.navigate(['/recipes']); // Navigate to the recipe list or home
      },
      error: (error) => {
        console.error('Error deleting recipe:', error);
        alert('Failed to delete recipe!');
      }
    });
  }

  // Method to handle recipe editing
  editRecipe(): void {
    if (this.recipeForm.invalid) {
      alert('Please fill out all required fields!');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.recipeForm.get('name')?.value);
    formData.append('instructions', this.recipeForm.get('instructions')?.value);
    formData.append('cooking_time', this.recipeForm.get('cookingTime')?.value);
    formData.append('difficulty_level', this.recipeForm.get('difficultyLevel')?.value);
    formData.append('recipe_type', this.recipeForm.get('recipeType')?.value);

    const ingredients = this.recipeForm.get('ingredients') as FormArray;
    ingredients.controls.forEach((ingredient) => {
      formData.append('ingredient_quantities[]', ingredient.get('quantity')?.value);
      formData.append('ingredient_names[]', ingredient.get('name')?.value);
      const id = ingredient.get('id')?.value;
      if (id) {
        formData.append('ingredient_ids[]', id);  // Append existing ID if present
      } else {
        formData.append('ingredient_ids[]', '');  // Ensure new ingredients have empty ID
      }
    });

    const recipeId = this.recipe.id;
    this.recipeService.editRecipe(recipeId, formData).subscribe({
      next: (response) => {
        alert('Recipe edited successfully!');
        this.recipe = response.recipe;
        this.isEditing = false;
        this.initializeForm(this.recipe);  // Reinitialize form with updated data
      },
      error: (error) => {
        console.error('Error editing recipe:', error);
        alert('Failed to edit recipe!');
      }
    });
  }

  // Toggle edit mode
  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  
}