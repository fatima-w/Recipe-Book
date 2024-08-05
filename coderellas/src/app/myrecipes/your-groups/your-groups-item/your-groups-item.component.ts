import { Component, Input } from '@angular/core';
import { GroupService } from '../../../group/group.service';
import { Router } from '@angular/router';
interface Groupi {
  id: number;
  name: string;
  description: string;
  public?: boolean;
  user_id: number; // Add user_id to track group ownership
}
@Component({
  selector: 'app-your-groups-item',
  templateUrl: './your-groups-item.component.html',
  styleUrl: './your-groups-item.component.css'
})
export class YourGroupsItemComponent {
  @Input() group: Groupi;
  constructor(private groupService: GroupService, private router:Router){}
  viewDetails(){

  }

  onItemClicked(group_id:number){
    // this.grouService.getGroup.next(this.group);
    this.groupService.getGroup(this.group)
    this.router.navigate(['/category-detail',group_id]);
  }
}
