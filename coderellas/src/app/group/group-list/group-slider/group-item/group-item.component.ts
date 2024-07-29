import { Component, Input } from '@angular/core';
import { Group } from '../../../group.model';
import { GroupService } from '../../../group.service';
import { Router } from '@angular/router';
interface Groupi {
  id: number;
  name: string;
  description: string;
  public?:boolean;
  user_id: number; // Add user_id to track group ownership
}

@Component({
  selector: 'app-group-item',
  templateUrl: './group-item.component.html',
  styleUrl: './group-item.component.css'
})
export class GroupItemComponent {
  constructor(private grouService:GroupService, private router:Router){}
  @Input() group!: Groupi;
  ngOnInit(){
    console.log("group =  ",this.group);
  }

  onItemClicked(group_id:number){
    // this.grouService.getGroup.next(this.group);
    this.grouService.getGroup(this.group)
    this.router.navigate(['/category-detail',group_id]);
  }
}
