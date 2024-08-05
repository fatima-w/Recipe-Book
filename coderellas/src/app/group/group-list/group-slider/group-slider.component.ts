import { Component, Input } from '@angular/core';
import { Group } from '../../group.model';
interface Groupi {
  id: number;
  name: string;
  description: string;
}
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
  selector: 'app-group-slider',
  templateUrl: './group-slider.component.html',
  styleUrls: ['./group-slider.component.css']
})
export class GroupSliderComponent {
  @Input() recipes: Recipe[] = [];
  @Input() groups: Group[] = [];
  currentIndex: number = 0;

  itemsVisible: number = 5;
  ngOnInit(){
    console.log(this.groups)
    console.log('group recipes slider:', this.recipes)
  }
  nextSlide() {
    if (this.currentIndex < this.groups.length - this.itemsVisible) {
      this.currentIndex++;
      console.log('Next Slide:', this.currentIndex);
    } else {
      console.log('At the end of the slider');
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      console.log('Previous Slide:', this.currentIndex);
    } else {
      console.log('At the beginning of the slider');
    }
  }
}
