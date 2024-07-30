import { Component } from '@angular/core';
import { GroupService } from '../../group/group.service';
interface Groupi {
  id: number;
  name: string;
  description: string;
  public?: boolean;
  user_id: number; // Add user_id to track group ownership
}
@Component({
  selector: 'app-your-groups',
  templateUrl: './your-groups.component.html',
  styleUrl: './your-groups.component.css'
})
export class YourGroupsComponent {
  groups: Groupi[] = [];

  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    this.groupService.getPersonalGroups().subscribe((data: Groupi[]) => {
      this.groups = data;
    });
  }
}
