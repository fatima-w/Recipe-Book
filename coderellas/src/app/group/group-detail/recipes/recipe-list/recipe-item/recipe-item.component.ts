import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
interface Recipe {
  id: number;
  recipe: string;
  image_path: string;
  instructions: string;
  group_id: number;
}
@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrl: './recipe-item.component.css'
})
export class RecipeItemComponent {
  @Input() recipe: Recipe;
  constructor(private router:Router){}
  getImageUrl(imagePath: string): string {
    return `http://127.0.0.1:5000/static/${imagePath}`;
  }
  ngOnInit(){
    console.log(this.recipe)
  }
  viewDetails() {
    // Navigate to recipe-detail with the recipe ID
    this.router.navigate(['/recipe-detail', this.recipe.id]);
  }
}
