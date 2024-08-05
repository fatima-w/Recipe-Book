import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-recipe',
  templateUrl: './new-recipe.component.html',
  styleUrls: ['./new-recipe.component.css']
})
export class NewRecipeComponent implements OnInit {
  recipeForm!: FormGroup;
  selectedFile: File | null = null;
  groupId: number;
  instructionSteps: string[] = [];  // To store each step of instructions
  currentStep: string = '';  // To hold the current instruction step

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      ingredients: this.fb.array([this.createIngredientGroup()]),
      instructions: ['', Validators.required],  // This will hold the final instructions
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

  addInstructionStep(): void {
    if (this.currentStep.trim() === '') {
      alert('Please enter a valid instruction step.');
      return;
    }

    this.instructionSteps.push(this.currentStep.trim());
    this.currentStep = ''; // resetting the input field for the next step

   
    const instructionsWithDelimiter = this.instructionSteps.join('|||'); 
    this.recipeForm.get('instructions')?.setValue(instructionsWithDelimiter);
  }

  // Method to remove an instruction step
  removeInstructionStep(index: number): void {
    this.instructionSteps.splice(index, 1);
    
    // Updating the form control with the updated instruction steps
    const instructionsWithDelimiter = this.instructionSteps.join('|||');
    this.recipeForm.get('instructions')?.setValue(instructionsWithDelimiter);
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
    formData.append('instructions', this.recipeForm.get('instructions')?.value);
    formData.append('cooking_time', this.recipeForm.get('cookingTime')?.value);
    formData.append('difficulty_level', this.recipeForm.get('difficultyLevel')?.value);
    formData.append('recipe_type', this.recipeForm.get('recipeType')?.value);
    formData.append('public', this.recipeForm.get('public')?.value ? '1' : '0');

    this.ingredients.controls.forEach((ingredient) => {
      formData.append('ingredient_quantities[]', ingredient.get('quantity')?.value);
      formData.append('ingredient_names[]', ingredient.get('name')?.value);
    });

    if (this.selectedFile) {
      formData.append('recipe_image', this.selectedFile, this.selectedFile.name);
    }

    this.groupId = +this.route.snapshot.paramMap.get('id')!;

    this.http.post(`http://127.0.0.1:5000/add-recipe/${this.groupId}`, formData).subscribe(
      {
        next: (response) => {
          alert('Recipe added successfully!');
          this.recipeForm.reset({     //resetting the input feilds after submitting the form
            name: '', 
            ingredients: [this.createIngredientGroup()],
            instructions: '',
            cookingTime: '',
            difficultyLevel: 'Easy',
            recipeType: 'Vegetarian',
            public: true,
          });
          this.instructionSteps = []; // resetting the steps after submission
          this.router.navigate(['/category-detail', this.groupId]);
        },
        error: (error) => {
          console.error('Error adding recipe:', error);
          alert('Failed to add recipe!');
        }
      }
    );
  }
}


