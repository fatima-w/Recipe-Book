

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
  recipe: Recipe | null = null; 
  isEditing: boolean = false;
  recipeForm: FormGroup;
  newCommentText: string = ''; 
  hasLiked: boolean | null = null; 

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
        // Determine if the user has liked or disliked
        const currentUserReview = this.recipe.reviews.find(r => r.user_id === this.recipeService.getCurrentUserId());
        if (currentUserReview) {
          this.hasLiked = currentUserReview.thumbs_up;
        }
      },
      error: error => console.error('Error fetching recipe:', error)
    });
  }

  initializeForm(recipe: any): void {
    this.recipeForm.patchValue({
      name: recipe.recipe,
      instructions: recipe.instructions,
      cookingTime: recipe.cooking_time,
      difficultyLevel: recipe.difficulty_level,
      recipeType: recipe.recipe_type
    });

    const ingredientsArray = this.recipeForm.get('ingredients') as FormArray;
    ingredientsArray.clear();  // resetting form array
    recipe.ingredients.forEach((ingredient: any) => {
      ingredientsArray.push(this.fb.group({
        quantity: [ingredient.quantity, Validators.required],
        name: [ingredient.name, Validators.required],
        id: [ingredient.id]  
      }));
    });
  }



  // Method to add a new ingredient form group
  addIngredient(): void {
    const ingredients = this.recipeForm.get('ingredients') as FormArray;
    ingredients.push(this.fb.group({
      quantity: ['', Validators.required],
      name: ['', Validators.required],
      id: [null]  
    }));
  }

  // Method to remove an ingredient form group at an index
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
        this.router.navigate(['/home']); // Navigate to the recipe list or home
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
        this.recipe!.likes_count--; // Reduce like count if already liked
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


  // Method for adding recipe to favourites
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
