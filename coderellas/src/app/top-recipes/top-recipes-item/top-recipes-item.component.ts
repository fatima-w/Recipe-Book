import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
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
  selector: 'app-top-recipes-item',
  templateUrl: './top-recipes-item.component.html',
  styleUrl: './top-recipes-item.component.css'
})
export class TopRecipesItemComponent {
  @Input() recipe!: Recipe;
  constructor(private router: Router){}
  viewDetails(){
    this.router.navigate(['/recipe-detail', this.recipe.id]);
  }
}
