import { Component, Input } from '@angular/core';
import { Group } from '../../../group.model';
import { GroupService } from '../../../group.service';
import { Router } from '@angular/router';
interface Groupi {
  id: number;
  name: string;
  description: string;
  public?:boolean;
  user_id: number;
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
  selector: 'app-group-item',
  templateUrl: './group-item.component.html',
  styleUrl: './group-item.component.css'
})
export class GroupItemComponent {
  constructor(private groupService:GroupService, private router:Router){}
  recipes: Recipe[] = [];
  imagepath:string;
  @Input() group!: Groupi;
  ngOnInit(){
    console.log("group =  ",this.group);
    this.loadGroupRecipes();
    console.log('group recipes: ',this.recipes)
  }

  onItemClicked(group_id:number){
    // this.grouService.getGroup.next(this.group);
    this.groupService.getGroup(this.group)
    this.router.navigate(['/category-detail',group_id]);
  }

  //  method to load group recipes by group ID
  loadGroupRecipes() {
    this.groupService.getGroupRecipes(this.group.id).subscribe({
      next: (res) => {
        
        this.recipes = res.recipes;
        this.imagepath = this.recipes[0].image_path;
        console.log('image path', this.imagepath)
        // console.log("userid for this group: ", this.groupUserId)
        console.log('Recipes for this group:', this.recipes);
      },
      error: (error) => {
        console.error('Error loading recipes:', error);
        alert('An error occurred while fetching recipes for this group.');
      },
    });
  }
}
