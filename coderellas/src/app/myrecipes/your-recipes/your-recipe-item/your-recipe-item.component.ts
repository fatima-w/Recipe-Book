import { Component , Input} from '@angular/core';
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
  selector: 'app-your-recipe-item',
  templateUrl: './your-recipe-item.component.html',
  styleUrl: './your-recipe-item.component.css'
})
export class YourRecipeItemComponent {
  @Input() recipe!: Recipe;
}
