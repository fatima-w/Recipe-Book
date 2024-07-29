import { Component } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupService } from '../group.service';
interface Groupi {
  id: number;
  name: string;
  description: string;
  public?:boolean;
  user_id: number; // Add user_id to track group ownership
}
@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrl: './group-edit.component.css'
})
export class GroupEditComponent {
  currentUserId: number;
  editGroupForm: FormGroup;
  groupId: number;
  group: Groupi;

  constructor(
    private formBuilder: FormBuilder,
    private groupService: GroupService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.groupId = +this.route.snapshot.paramMap.get('id')!;
    this.group = this.groupService.storeSingleGroup;

    // Initialize the form with the current group details
    this.editGroupForm = this.formBuilder.group({
      name: [this.group.name, Validators.required],
      description: [this.group.description, Validators.required],
      public: [this.group.public],
    });
  }

  onSubmit(): void {
    if (this.editGroupForm.invalid) {
      return;
    }
    this.groupService.getCurrentUserId().subscribe({
      next: (userId) => {
        this.currentUserId = userId;
        console.log('Current User ID:', this.currentUserId);
        console.log('group user id: ', this.group.user_id)
        // this.loadGroupRecipes(); // Load recipes after fetching user ID
      },
      error: (error) => {
        console.error('Error retrieving current user ID:', error);
      }})
    const updatedGroup: Groupi = {
      id: this.groupId,
      name: this.editGroupForm.get('name')?.value,
      description: this.editGroupForm.get('description')?.value,
      public: this.editGroupForm.get('public')?.value,
      user_id: this.currentUserId
    };

    this.groupService.editGroup(updatedGroup).subscribe({
      next: (response) => {
        console.log('Group updated successfully!', response);
        this.groupService.updateGroup(response.group)
        this.router.navigate(['/category-detail', this.groupId]);
      },
      error: (error) => {
        console.error('Error updating group:', error);
        // Handle error appropriately, e.g., show a message to the user
      },
    });
  }

  cancelEdit(): void {
    this.router.navigate(['/category-detail', this.groupId]);
  }
}
