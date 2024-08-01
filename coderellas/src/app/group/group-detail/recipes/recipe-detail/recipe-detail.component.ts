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



// import { Component, OnInit } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';
// import { RecipeService } from '../recipe.service';
// import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
// interface Recipe {
//   id: number;
//   user_id: number;
//   group_id: number;
//   cooking_time: number;
//   difficulty_level: string;
//   recipe: string;
//   image_path: string;
//   ingredients: any[];
//   instructions: string;
//   recipe_type: string;
//   public: boolean;
//   reviews: any[];
//   comments: any[];
// }
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
//       {next: data => {
//         this.recipe = data;
//         this.initializeForm(this.recipe);
//       },
//       error: error => console.error('Error fetching recipe:', error)}
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

// interface Recipe {
//   id: number;
//   user_id: number;
//   group_id: number;
//   cooking_time: number;
//   difficulty_level: string;
//   recipe: string;
//   image_path: string;
//   ingredients: any[];
//   instructions: string;
//   recipe_type: string;
//   public: boolean;
//   reviews: any[];
//   comments: any[];
// }

// @Component({
//   selector: 'app-recipe-detail',
//   templateUrl: './recipe-detail.component.html',
//   styleUrls: ['./recipe-detail.component.css']
// })
// export class RecipeDetailComponent implements OnInit {
//   recipe: Recipe | null = null;
//   isEditing: boolean = false;
//   recipeForm: FormGroup;
//   commentForm: FormGroup;
//   isLiked: boolean = false;
//   isDisliked: boolean = false;
//   isFavourite: boolean = false;
//   recipeId: number;
//   comments: Comment[] = [];

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

//     // Form for handling comments
//     this.commentForm = this.fb.group({
//       commentText: ['', Validators.required]
//     });
//   }

//   ngOnInit(): void {
//     const recipeId = +this.route.snapshot.paramMap.get('id')!;
//     this.recipeService.getRecipeById(recipeId).subscribe({
//       next: (data: Recipe) => {
//         this.recipe = data;
//         this.initializeForm(this.recipe);
//         this.checkUserReview();
//         this.checkUserFavourite();
//       },
//       error: error => console.error('Error fetching recipe:', error)
//     });
//   }

//   // Initialize the form with the recipe data
//   initializeForm(recipe: Recipe): void {
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

//   // Method to add a new ingredient form group
//   addIngredient(): void {
//     const ingredients = this.recipeForm.get('ingredients') as FormArray;
//     ingredients.push(this.fb.group({
//       quantity: ['', Validators.required],
//       name: ['', Validators.required],
//       id: [null]
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
//     const recipeId = this.recipe?.id;
//     this.recipeService.deleteRecipe(recipeId!).subscribe({
//       next: () => {
//         alert('Recipe deleted successfully!');
//         this.router.navigate(['/recipes']);
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
//         formData.append('ingredient_ids[]', id);
//       } else {
//         formData.append('ingredient_ids[]', '');
//       }
//     });

//     const recipeId = this.recipe?.id;
//     this.recipeService.editRecipe(recipeId!, formData).subscribe({
//       next: (response) => {
//         alert('Recipe edited successfully!');
//         this.recipe = response.recipe;
//         this.isEditing = false;
//         this.initializeForm(this.recipe!);
//         this.comments = this.recipe.comments;
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

//   //Add a comment to the recipe
//   addComment(): void {
//     if (this.commentForm.invalid) {
//       alert('Please enter a comment!');
//       return;
//     }

//     const commentText = this.commentForm.get('commentText')?.value;
//     const recipeId = this.recipe?.id;

//     this.recipeService.addComment(recipeId!, commentText).subscribe({
//       next: (response) => {
//         alert('Comment added successfully!');
//         this.recipe?.comments.push(response.comment);
//         this.commentForm.reset();
//       },
//       error: (error) => {
//         console.error('Error adding comment:', error);
//         alert('Failed to add comment!');
//       }
//     });
//   }
  
//   // Like the recipe
//   likeRecipe(): void {
//     if (this.isLiked) {
//       alert('You have already liked this recipe!');
//       return;
//     }

//     const recipeId = this.recipe?.id;
//     this.recipeService.likeRecipe(recipeId!).subscribe({
//       next: () => {
//         this.isLiked = true;
//         this.isDisliked = false;
//         alert('You liked the recipe!');
//       },
//       error: (error) => {
//         console.error('Error liking recipe:', error);
//         alert('Failed to like recipe!');
//       }
//     });
//   }

//   // Dislike the recipe
//   dislikeRecipe(): void {
//     if (this.isDisliked) {
//       alert('You have already disliked this recipe!');
//       return;
//     }

//     const recipeId = this.recipe?.id;
//     this.recipeService.dislikeRecipe(recipeId!).subscribe({
//       next: () => {
//         this.isDisliked = true;
//         this.isLiked = false;
//         alert('You disliked the recipe!');
//       },
//       error: (error) => {
//         console.error('Error disliking recipe:', error);
//         alert('Failed to dislike recipe!');
//       }
//     });
//   }

//   // Add the recipe to favorites
//   addToFavourites(): void {
//     if (this.isFavourite) {
//       alert('This recipe is already in your favorites!');
//       return;
//     }

//     const recipeId = this.recipe?.id;
//     this.recipeService.addToFavourites(recipeId!).subscribe({
//       next: () => {
//         this.isFavourite = true;
//         alert('Recipe added to favorites!');
//       },
//       error: (error) => {
//         console.error('Error adding recipe to favorites:', error);
//         alert('Failed to add recipe to favorites!');
//       }
//     });
//   }

//   // Check if the user has liked or disliked the recipe
//   private checkUserReview(): void {
//     if (!this.recipe) return;

//     const userId = this.getCurrentUserId(); // Assume a method to get the current user's ID
//     const userReview = this.recipe.reviews.find((review: any) => review.user_id === userId);
    
//     if (userReview) {
//       this.isLiked = userReview.thumbs_up;
//       this.isDisliked = !userReview.thumbs_up;
//     }
//   }

//   // Check if the recipe is in the user's favourites
//   private checkUserFavourite(): void {
//     this.recipeService.getFavourites().subscribe({
//       next: (favourites) => {
//         const isFavourite = favourites.some((fav: any) => fav.id === this.recipe?.id);
//         this.isFavourite = isFavourite;
//       },
//       error: (error) => {
//         console.error('Error fetching favourites:', error);
//       }
//     });
//   }

//   // Mock function to get the current user ID
//   private getCurrentUserId(): number {
//     // Replace this with actual implementation to get current user ID
//     return 1;
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
  likes_count: number;
  dislikes_count: number;
}
interface Comment {
  text: string;
  username: string;  // Add username here
}

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe | null = null; // Use the Recipe interface for type safety
  isEditing: boolean = false;
  recipeForm: FormGroup;
  newCommentText: string = ''; // For holding the new comment text
  hasLiked: boolean | null = null; // To track if the current user liked/disliked

  instructions: string[] = [];
  username:string;
  isUserAllowed:boolean = false;

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
    this.recipeService.getRecipeById(recipeId).subscribe({
      next: data => {
        this.isUserAllowed=data.isUserAllowed
        this.username = data.comments.username;
        this.recipe = data;
        this.initializeForm(this.recipe);
        this.instructions = this.recipe.instructions.split('|||');
        // Determine if the user has liked/disliked
        const currentUserReview = this.recipe.reviews.find(r => r.user_id === this.recipeService.getCurrentUserId());
        if (currentUserReview) {
          this.hasLiked = currentUserReview.thumbs_up;
        }
      },
      error: error => console.error('Error fetching recipe:', error)
    });
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
    const recipeId = this.recipe!.id;
    this.recipeService.deleteRecipe(recipeId).subscribe({
      next: () => {
        alert('Recipe deleted successfully!');
        this.router.navigate(['/category-detail/:id']); // Navigate to the recipe list or home
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
        formData.append('ingredient_ids[]', id);
      } else {
        formData.append('ingredient_ids[]', '');
      }
    });

    const recipeId = this.recipe?.id;
    this.recipeService.editRecipe(recipeId!, formData).subscribe({
      next: (response) => {
        alert('Recipe edited successfully!');
        this.recipe = response.recipe;
        this.isEditing = false;
        this.initializeForm(this.recipe!);
        //this.comments = this.recipe.comments;
      },
      error: (error) => {
        console.error('Error editing recipe:', error);
        alert('Failed to edit recipe!');
      }
    });
  }
  // editRecipe(): void {
  //   if (this.recipeForm.invalid) {
  //     alert('Please fill out all required fields!');
  //     return;
  //   }
  
  //   const formData = new FormData();
  //   formData.append('name', this.recipeForm.get('name')?.value);
  
  //   // Handle instruction steps with delimiter
  //   const instructions = this.recipeForm.get('instructions')?.value.split('\n');
  //   instructions.forEach((instruction, index) => {
  //     formData.append(`instructions[]`, instruction.trim());
  //   });
  
  //   formData.append('cooking_time', this.recipeForm.get('cookingTime')?.value);
  //   formData.append('difficulty_level', this.recipeForm.get('difficultyLevel')?.value);
  //   formData.append('recipe_type', this.recipeForm.get('recipeType')?.value);
  
  //   const ingredients = this.recipeForm.get('ingredients') as FormArray;
  //   ingredients.controls.forEach((ingredient) => {
  //     formData.append('ingredient_quantities[]', ingredient.get('quantity')?.value);
  //     formData.append('ingredient_names[]', ingredient.get('name')?.value);
  //     const id = ingredient.get('id')?.value;
  //     if (id) {
  //       formData.append('ingredient_ids[]', id);
  //     } else {
  //       formData.append('ingredient_ids[]', '');
  //     }
  //   });
  
  //   const recipeId = this.recipe?.id;
  //   this.recipeService.editRecipe(recipeId!, formData).subscribe({
  //     next: (response) => {
  //       alert('Recipe edited successfully!');
  //       this.recipe = response.recipe;
  //       this.isEditing = false;
  //       this.initializeForm(this.recipe!);
  //     },
  //     error: (error) => {
  //       console.error('Error editing recipe:', error);
  //       alert('Failed to edit recipe!');
  //     }
  //   });
  // }
  

    // Toggle edit mode
  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  // Method to add a new comment
  addComment(): void {
    if (!this.newCommentText) {
      alert('Comment cannot be empty!');
      return;
    }

    const recipeId = this.recipe!.id;
    this.recipeService.addComment(recipeId, this.newCommentText).subscribe({
      next: (response: any) => {
        alert('Comment added successfully!');
        this.recipe!.comments.push({ text: this.newCommentText, user_id: this.recipeService.getCurrentUserId() });
        this.newCommentText = '';  // Clear the input
      },
      error: (error) => {
        console.error('Error adding comment:', error);
        alert('Failed to add comment!');
      }
    });
  }

  // Method to like a recipe
likeRecipe(): void {
  const recipeId = this.recipe!.id;
  this.recipeService.addLikeDislike(recipeId, true).subscribe({
    next: (response: any) => {
      alert('You liked this recipe!');
      if (this.hasLiked === false) {
        this.recipe!.dislikes_count--; // Reduce dislike count if previously disliked
      }
      if (this.hasLiked !== true) {
        this.recipe!.likes_count++;
        this.hasLiked = true;
      }
    },
    error: (error) => {
      console.error('Error liking recipe:', error);
      alert('Failed to like recipe!');
    }
  });
}

// Method to dislike a recipe
dislikeRecipe(): void {
  const recipeId = this.recipe!.id;
  this.recipeService.addLikeDislike(recipeId, false).subscribe({
    next: (response: any) => {
      alert('You disliked this recipe!');
      if (this.hasLiked === true) {
        this.recipe!.likes_count--; // Reduce like count if previously liked
      }
      if (this.hasLiked !== false) {
        this.recipe!.dislikes_count++;
        this.hasLiked = false;
      }
    },
    error: (error) => {
      console.error('Error disliking recipe:', error);
      alert('Failed to dislike recipe!');
    }
  });
}


  // Method to add recipe to favourites
  addToFavourites(): void {
    const recipeId = this.recipe!.id;
    this.recipeService.addRecipeToFavourites(recipeId).subscribe({
      next: (response: any) => {
        alert('Recipe added to favourites!');
      },
      error: (error) => {
        console.error('Error adding recipe to favourites:', error);
        alert('Failed to add recipe to favourites!');
      }
    });
  }

  addStep(): void {
    const newStep = this.recipeForm.get('newStep')?.value;
    if (newStep) {
      this.instructions.push(newStep);
      this.recipeForm.get('newStep')?.reset();
    }
  }
}



// Method to handle recipe editing
  // editRecipe(): void {
  //   if (this.recipeForm.invalid) {
  //     alert('Please fill out all required fields!');
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('name', this.recipeForm.get('name')?.value);
  //   formData.append('instructions', this.recipeForm.get('instructions')?.value);
  //   formData.append('cooking_time', this.recipeForm.get('cookingTime')?.value);
  //   formData.append('difficulty_level', this.recipeForm.get('difficultyLevel')?.value);
  //   formData.append('recipe_type', this.recipeForm.get('recipeType')?.value);

  //   const ingredientsArray = this.recipeForm.get('ingredients') as FormArray;
  //   ingredientsArray.controls.forEach((group, index) => {
  //     formData.append(`ingredients[][quantity]`, group.get('quantity')?.value);
  //     formData.append(`ingredients[][name]`, group.get('name')?.value);
  //     formData.append(`ingredients[][id]`, group.get('id')?.value);
  //   });

  //   const recipeId = this.recipe!.id;
  //   this.recipeService.editRecipe(recipeId, formData).subscribe({
  //     next: (updatedRecipe: Recipe) => {
  //       alert('Recipe updated successfully!');
  //       this.recipe = updatedRecipe;
  //       this.isEditing = false;
  //     },
  //     error: (error) => {
  //       console.error('Error updating recipe:', error);
  //       alert('Failed to update recipe!');
  //     }
  //   });
  // }