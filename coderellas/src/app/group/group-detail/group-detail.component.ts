// import { Component } from '@angular/core';
// import { GroupService } from '../group.service';
// import { Group } from '../group.model';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Router } from '@angular/router';
// interface Groupi {
//   id: number;
//   name: string;
//   description: string;
// }
// interface Recipe {
//   id: number;
//   recipe: string;
//   image_path: string;
//   instructions: string;
//   group_id: number;
// }
// @Component({
//   selector: 'app-group-detail',
//   templateUrl: './group-detail.component.html',
//   styleUrl: './group-detail.component.css'
// })
// export class GroupDetailComponent {
//   group:Groupi;
//   groups: Groupi[] = [];
//   recipes:Recipe[] = []
//   publicGroups: Groupi[] = []; // Array to hold public groups
//   publicRecipes: Recipe[] = []; // Array to hold public recipes
//   userId: number | null = null; // User ID of the current user

//   private apiUrl = 'http://localhost:5000'; 
//   constructor(private groupService:GroupService, private http:HttpClient,
//     private router:Router
//   ){}
//   ngOnInit(){
//     // this.groupService.getGroup.subscribe(res=>
//     // {
//     //   this.group = res;
//     //   console.log(res)
//     // }
//     // )
//     this.group= this.groupService.storeSingleGroup;
//     this.loadGroups(); // Load public groups when component initializes
//     if(this.router.url === '/home'){
//       this.groups = this.publicGroups;
//     }
//     this.recipes = this.publicRecipes;
//   }

//   loadGroups() {
//     this.groupService.getPublicGroups().subscribe({
//       next: (data) => {
//         this.userId = data.user; // Store user ID
//         this.publicGroups = data.publicGroups; // Store public groups
//         this.publicRecipes = data.publicRecipes; // Store public recipes
//         console.log('Public Groups:', this.publicGroups);
//         console.log('Public Recipes:', this.publicRecipes);
//       },
//       error: (error) => {
//         console.error('Error loading public groups:', error);
//         alert('An error occurred while fetching public groups.');
//       }
//     });
//   }

 
//   deleteGroup(groupId: number): void {
//     if (confirm('Are you sure you want to delete this group?')) {
//       this.groupService.deleteGroup(groupId).subscribe({
//         next: (response) => {
//           console.log('Group deleted successfully!', response);
//           // Refresh the group list after deletion
//           this.loadGroups();
//           this.router.navigate(['/home'])
//         },
//         error: (error) => {
//           console.error('Error deleting group:', error);
//           // Handle error appropriately, e.g., show a message to the user
//         }
//       });
//     }
//   }

//   toAddRecipe(){
//     this.router.navigate(['/add-recipe', this.group.id])
//   }
// }



// import { Component } from '@angular/core';
// import { GroupService } from '../group.service';
// import { Group } from '../group.model';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Router } from '@angular/router';

// interface Groupi {
//   id: number;
//   name: string;
//   description: string;
//   public?:boolean;
//   user_id?: number; // Add user_id to track group ownership
// }

// interface Recipe {
//   user_id: number;
//   recipe: string;
//   image_path: string;
//   instructions: string;
//   group_id: number;
// }

// @Component({
//   selector: 'app-group-detail',
//   templateUrl: './group-detail.component.html',
//   styleUrls: ['./group-detail.component.css'],
// })
// export class GroupDetailComponent {
//   group: Groupi;
//   groups: Groupi[] = [];
//   recipes: Recipe[] = [];
//   publicGroups: Groupi[] = []; // Array to hold public groups
//   publicRecipes: Recipe[] = []; // Array to hold public recipes
//   currentUserId: number | null = null; // User ID of the current user

//   constructor(
//     private groupService: GroupService,
//     private http: HttpClient,
//     private router: Router
//   ) {}

//   ngOnInit() {
//     this.group = this.groupService.storeSingleGroup;
//     this.loadGroups(); // Load public groups when component initializes

//     // Check for public recipes for this group
//     this.recipes = this.publicRecipes.filter(
//       (recipe) => recipe.group_id === this.group.id
//     );
//   }

//   loadGroups() {
//     this.groupService.getPublicGroups().subscribe({
//       next: (data) => {
//         this.currentUserId = data.user; // Store current user ID
//         console.log("current user id: ", this.currentUserId)
//         this.publicGroups = data.publicGroups; // Store public groups
//         this.publicRecipes = data.publicRecipes; // Store public recipes
//         console.log('Public Groups:', this.publicGroups);
//         console.log('Public Recipes:', this.publicRecipes);
//       },
//       error: (error) => {
//         console.error('Error loading public groups:', error);
//         alert('An error occurred while fetching public groups.');
//       },
//     });
//   }

//   deleteGroup(groupId: number): void {
//     if (confirm('Are you sure you want to delete this group?')) {
//       this.groupService.deleteGroup(groupId).subscribe({
//         next: (response) => {
//           console.log('Group deleted successfully!', response);
//           // Refresh the group list after deletion
//           this.loadGroups();
//           this.router.navigate(['/home']);
//         },
//         error: (error) => {
//           console.error('Error deleting group:', error);
//           // Handle error appropriately, e.g., show a message to the user
//         },
//       });
//     }   
//   }

//   editGroup() {
//     // Navigate to the edit group component with the current group ID
//     this.router.navigate(['/edit-group', this.group.id]);
//   }

//   toAddRecipe() {
//     this.router.navigate(['/add-recipe', this.group.id]);
//   }
// }



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
  user_id: number; // Add user_id to track group ownership
}

interface Recipe {
  id: number; // Include ID for editing, deleting recipes
  recipe: string;
  image_path: string;
  instructions: string;
  group_id: number;
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
  publicGroups: Groupi[] = []; // Array to hold public groups
  publicRecipes: Recipe[] = []; // Array to hold public recipes
  currentUserId: number; // User ID of the current user

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
        this.loadGroupRecipes(); // Load recipes after fetching user ID
      },
      error: (error) => {
        console.error('Error retrieving current user ID:', error);
      }
    });
    
    this.loadGroups(); // Load public groups when component initializes
    // this.userId = this.groupService.userId;
    // console.log('group user id: ', this.userId)
    // Load recipes for this specific group
    this.loadGroupRecipes();
  }

  loadGroups() {
    this.groupService.getPublicGroups().subscribe({
      next: (data) => {
        this.currentUserId = data.user; // Store current user ID
        console.log('Current user id: ', this.currentUserId);
        this.publicGroups = data.publicGroups; // Store public groups
        this.publicRecipes = data.publicRecipes; // Store public recipes
        console.log('Public Groups:', this.publicGroups);
        console.log('Public Recipes:', this.publicRecipes);
      },
      error: (error) => {
        console.error('Error loading public groups:', error);
        alert('An error occurred while fetching public groups.');
      },
    });
  }

  // New method to load group recipes by group ID
  loadGroupRecipes() {
    this.groupService.getGroupRecipes(this.group.id).subscribe({
      next: (recipes) => {
        this.isUserAllowed = recipes.isUserAllowed;
        this.recipes = recipes.recipes;
        // console.log("userid for this group: ", this.groupUserId)
        console.log('Recipes for this group:', this.recipes);
      },
      error: (error) => {
        console.error('Error loading recipes:', error);
        alert('An error occurred while fetching recipes for this group.');
      },
    });
  }

  deleteGroup(groupId: number): void {
    if (confirm('Are you sure you want to delete this group?')) {
      this.groupService.deleteGroup(groupId).subscribe({
        next: (response) => {
          console.log('Group deleted successfully!', response);
          // Refresh the group list after deletion
          this.loadGroups();
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Error deleting group:', error);
          // Handle error appropriately, e.g., show a message to the user
        },
      });
    }
  }

  editGroup() {
    // Navigate to the edit group component with the current group ID
    this.router.navigate(['/edit-group', this.group.id]);
  }

  toAddRecipe() {
    this.router.navigate(['/add-recipe', this.group.id]);
  }
}
