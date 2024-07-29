import { Component, Input } from '@angular/core';
interface Recipe {
  id: number;
  recipe: string;
  image_path: string;
  instructions: string;
  group_id: number;
}
@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css'
})
export class RecipeListComponent {
  @Input() recipes: Recipe[] = [];

  constructor() {}

  ngOnInit(): void {
    console.log('Recipes:', this.recipes);
  }
}
