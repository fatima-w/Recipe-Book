// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-new-recipe',
//   templateUrl: './new-recipe.component.html',
//   styleUrl: './new-recipe.component.css'
// })
// export class NewRecipeComponent {

// }
// recipe.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { HttpClient } from '@angular/common/http'; // Ensure this is imported if you're making HTTP requests
import { ActivatedRoute, Router } from '@angular/router'; // Import Router if needed for navigation

@Component({
    selector: 'app-new-recipe',
    templateUrl: './new-recipe.component.html',
    styleUrl: './new-recipe.component.css'
})
export class NewRecipeComponent implements OnInit {
  recipeForm!: FormGroup;
  selectedFile: File | null = null;
  groupId:number;

  constructor(private fb: FormBuilder, private http: HttpClient, private route:ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      ingredients: this.fb.array([this.createIngredientGroup()]), // Initialize with one ingredient
      instructions: ['', Validators.required],
      cookingTime: ['', [Validators.required, Validators.min(1)]],
      difficultyLevel: ['Easy', Validators.required],
      recipeType: ['Vegetarian', Validators.required],
      public: [true],
    });
  }

  createIngredientGroup(): FormGroup {
    return this.fb.group({
      quantity: ['', Validators.required],
      name: ['', Validators.required],
    });
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  addIngredient(): void {
    this.ingredients.push(this.createIngredientGroup());
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.recipeForm.invalid) {
      alert('Please fill out all required fields!');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.recipeForm.get('name')?.value);
    formData.append(
      'instructions',
      this.recipeForm.get('instructions')?.value
    );
    formData.append(
      'cooking_time',
      this.recipeForm.get('cookingTime')?.value
    );
    formData.append(
      'difficulty_level',
      this.recipeForm.get('difficultyLevel')?.value
    );
    formData.append('recipe_type', this.recipeForm.get('recipeType')?.value);
    formData.append('public', this.recipeForm.get('public')?.value ? '1' : '0');

    this.ingredients.controls.forEach((ingredient) => {
      formData.append(
        `ingredient_quantities[]`,
        ingredient.get('quantity')?.value
      );
      formData.append(`ingredient_names[]`, ingredient.get('name')?.value);
    });

    if (this.selectedFile) {
      formData.append(
        'recipe_image',
        this.selectedFile,
        this.selectedFile.name
      );
    }

    // Replace 'group_id' with the actual ID of the group you want to add the recipe to
    this.groupId = +this.route.snapshot.paramMap.get('id')!;

    this.http.post(`http://127.0.0.1:5000/add-recipe/${this.groupId}`, formData).subscribe(
      {next:(response) => {
        alert('Recipe added successfully!');
        this.recipeForm.reset({
          name: '',
          ingredients: [this.createIngredientGroup()],
          instructions: '',
          cookingTime: '',
          difficultyLevel: 'Easy',
          recipeType: 'Vegetarian',
          public: true,
          
        }
      );
      this.router.navigate(['/category-detail', this.groupId])
      },
      error:(error) => {
        console.error('Error adding recipe:', error);
        alert('Failed to add recipe!');
      }}
    );
  }
}

// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { ActivatedRoute, Router } from '@angular/router';

// @Component({
//   selector: 'app-new-recipe',
//   templateUrl: './new-recipe.component.html',
//   styleUrls: ['./new-recipe.component.css']
// })
// export class NewRecipeComponent implements OnInit {
//   recipeForm!: FormGroup;
//   selectedFile: File | null = null;
//   groupId: number;

//   constructor(
//     private fb: FormBuilder, 
//     private http: HttpClient, 
//     private route: ActivatedRoute, 
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.recipeForm = this.fb.group({
//       name: ['', Validators.required],
//       description: ['', Validators.required], // Add description field
//       ingredients: this.fb.array([this.createIngredientGroup()]),
//       instructions: ['', Validators.required],
//       cookingTime: ['', [Validators.required, Validators.min(1)]],
//       difficultyLevel: ['Easy', Validators.required],
//       recipeType: ['Vegetarian', Validators.required],
//       public: [true],
//     });
//   }

//   createIngredientGroup(): FormGroup {
//     return this.fb.group({
//       quantity: ['', Validators.required],
//       name: ['', Validators.required],
//     });
//   }

//   get ingredients(): FormArray {
//     return this.recipeForm.get('ingredients') as FormArray;
//   }

//   addIngredient(): void {
//     this.ingredients.push(this.createIngredientGroup());
//   }

//   removeIngredient(index: number): void {
//     this.ingredients.removeAt(index);
//   }

//   onFileSelected(event: any): void {
//     this.selectedFile = event.target.files[0];
//   }

//   onSubmit(): void {
//     if (this.recipeForm.invalid) {
//       alert('Please fill out all required fields!');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('name', this.recipeForm.get('name')?.value);
//     formData.append('description', this.recipeForm.get('description')?.value); // Include description
//     formData.append('instructions', this.recipeForm.get('instructions')?.value);
//     formData.append('cooking_time', this.recipeForm.get('cookingTime')?.value);
//     formData.append('difficulty_level', this.recipeForm.get('difficultyLevel')?.value);
//     formData.append('recipe_type', this.recipeForm.get('recipeType')?.value);
//     formData.append('public', this.recipeForm.get('public')?.value ? '1' : '0');

//     this.ingredients.controls.forEach((ingredient) => {
//       formData.append('ingredient_quantities[]', ingredient.get('quantity')?.value);
//       formData.append('ingredient_names[]', ingredient.get('name')?.value);
//     });

//     if (this.selectedFile) {
//       formData.append('recipe_image', this.selectedFile, this.selectedFile.name);
//     }

//     this.groupId = +this.route.snapshot.paramMap.get('id')!;

//     this.http.post(`http://127.0.0.1:5000/add-recipe/${this.groupId}`, formData).subscribe({
//       next: (response) => {
//         alert('Recipe added successfully!');
//         this.recipeForm.reset({
//           name: '',
//           description: '', // Reset description
//           ingredients: [this.createIngredientGroup()],
//           instructions: '',
//           cookingTime: '',
//           difficultyLevel: 'Easy',
//           recipeType: 'Vegetarian',
//           public: true,
//         });
//         this.router.navigate(['/category-detail', this.groupId]);
//       },
//       error: (error) => {
//         console.error('Error adding recipe:', error);
//         alert('Failed to add recipe!');
//       }
//     });
//   }
// }

