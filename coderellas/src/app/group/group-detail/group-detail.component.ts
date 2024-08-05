import { Component } from '@angular/core';
import { GroupService } from '../group.service';
import { Group } from '../group.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Groupi {
  id: number;
  name: string;
  description: string;
  public?: boolean;
  user_id: number; // Add user_id to track group owner
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
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css'],
})
export class GroupDetailComponent {
  isUserAllowed:boolean = false;
  group: Groupi;
  recipes: Recipe[] = [];
  publicGroups: Groupi[] = []; 
  publicRecipes: Recipe[] = []; 
  currentUserId: number; 

  constructor(
    private groupService: GroupService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.groupService.groupChanged.subscribe(res=>{
      this.group = res;
    })
    this.group = this.groupService.storeSingleGroup;
    this.groupService.getCurrentUserId().subscribe({
      next: (userId) => {
        this.currentUserId = userId;
        this.loadGroupRecipes();
      },
      error: (error) => {
        console.error('Error retrieving current user ID:', error);
      }
    });
    
    this.loadGroups(); 
    this.loadGroupRecipes();
  }

  loadGroups() {
    this.groupService.getPublicGroups().subscribe({
      next: (data) => {
        this.currentUserId = data.user; 
        console.log('Current user id: ', this.currentUserId);
        this.publicGroups = data.publicGroups; 
        this.publicRecipes = data.publicRecipes; 
        console.log('Public Groups:', this.publicGroups);
        console.log('Public Recipes:', this.publicRecipes);
      },
      error: (error) => {
        console.error('Error loading public groups:', error);
        alert('An error occurred while fetching public groups.');
      },
    });
  }

  //  method to load group recipes by group ID
  loadGroupRecipes() {
    this.groupService.getGroupRecipes(this.group.id).subscribe({
      next: (recipes) => {
        this.isUserAllowed = recipes.isUserAllowed;
        this.recipes = recipes.recipes;
        console.log('Recipes for this group:', this.recipes);
      },
      error: (error) => {
        console.error('Error loading recipes:', error);
        alert('An error occurred while fetching recipes for this group.');
      },
    });
  }

//  method to delete group by group ID
  deleteGroup(groupId: number): void {
    if (confirm('Are you sure you want to delete this group?')) {
      this.groupService.deleteGroup(groupId).subscribe({
        next: (response) => {
          console.log('Group deleted successfully!', response);
          this.loadGroups();
          //Routing to home after recipe delete
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Error deleting group:', error);
          
        },
      });
    }
  }

  editGroup() {
    // Navigate to the edit group component with the current group ID when clicked on edit
    this.router.navigate(['/edit-group', this.group.id]);
  }

  toAddRecipe() {
    this.router.navigate(['/add-recipe', this.group.id]);
  }
}
