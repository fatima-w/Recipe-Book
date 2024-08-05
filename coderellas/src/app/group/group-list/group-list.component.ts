import { Component, OnInit } from '@angular/core';
import { GroupService } from '../group.service';
import { Group } from '../group.model';
import { Router, ActivatedRoute } from '@angular/router';

interface Groupi {
  id: number;
  name: string;
  description: string;
}

interface Recipe {
  id: number;
  recipe: string;
  image_path: string;
  instructions: string;
  group_id: number;
}

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css'] 
})
export class GroupListComponent implements OnInit {
  groups: Groupi[] = [];
  recipes:Recipe[] = []
  publicGroups: Groupi[] = []; 
  publicRecipes: Recipe[] = []; 
  userId: number | null = null;

  constructor(
    private groupService: GroupService,
    private router: Router,
    private route:ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadGroups(); 
    if(this.router.url === '/home'){
      this.groups = this.publicGroups;
      // this.groupService.getGroups().subscribe(res=>{
      //   this.groups = res;
      // })
      this.recipes = this.publicRecipes;
    }
    console.log("group list recipes:", this.publicRecipes)
  }

  // Method to load public groups from the service
  loadGroups() {
    this.groupService.getPublicGroups().subscribe({
      next: (data) => {
        this.userId = data.user; 
        this.publicGroups = data.publicGroups; 
        this.publicRecipes = data.publicRecipes; 
        console.log('Public Groups:', this.publicGroups);
        console.log('Public Recipes:', this.publicRecipes);
      },
      error: (error) => {
        console.error('Error loading public groups:', error);
        alert('An error occurred while fetching public groups.');
      }
    });
  }
}