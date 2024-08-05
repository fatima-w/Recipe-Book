import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GroupService } from '../group.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-start',
  templateUrl: './group-start.component.html',
  styleUrls: ['./group-start.component.css']
})
export class GroupStartComponent {
  groupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private router:Router
  ) {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      isPublic: [false]  
    });
  }

  onSubmit() {
    if (this.groupForm.valid) {
      const groupData = this.groupForm.value;
      this.groupService.createGroup(groupData).subscribe(
        {next: response => {
          console.log('Group created successfully:', response);
          this.groupForm.reset();
          this.router.navigate(['/home'])
        },
        error: error => {
          console.error('Error creating group:', error);
        }}
      );
    }
  }
}
