import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Group } from './group.model';
import { map } from 'rxjs';
import { Subject } from 'rxjs';
interface Groupi {
  id: number;
  name: string;
  description: string;
  public?: boolean;
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
@Injectable({
  providedIn: 'root'
})
export class GroupService {
  // getGroup = new Subject<Groupi>();
  isUserAllowed:boolean = false;
  storeSingleGroup: Groupi;
  userId: number;
  groupChanged = new Subject<Groupi>();
  private apiUrl = 'http://localhost:5000/create-group';
  
  constructor(private http: HttpClient) { }
  getPublicGroups(): Observable<any> {
    const token = localStorage.getItem('authToken'); // JWT token if authentication is required
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Include token in headers if necessary
    });

    return this.http.get<any>("http://localhost:5000/", { headers }).pipe(
      map(response => {
        console.log("user", response.user)
        // Transform the response if needed, otherwise return directly
        return {
          user: response.user,
          publicGroups: response.public_groups,
          publicRecipes: response.public_recipes
        };
      })
    );
  }
  createGroup(group: Group): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>("http://localhost:5000/create-group", group, { headers });


  }
  getGroup(group:Groupi){
    this.storeSingleGroup = group;
    this.userId = group.user_id;
  }

  deleteGroup(groupId: number): Observable<any> {
    const url = `http://localhost:5000/delete-group/${groupId}`;
    return this.http.delete(url);
  }
  
  editGroup(group: Groupi): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(
      `http://localhost:5000/edit-group/${group.id}`,
      group,
      { headers }   
    );
  }
  getGroupRecipes(groupId: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`http://localhost:5000/group/${groupId}`, { headers }).pipe(
      map(response => {
        console.log("isUserAllowed:", response.isUserAllowed)
        return {
          currentUserId: response.current_user_id,
          recipes: response.recipes,
          isUserAllowed: response.isUserAllowed
        };
      })
    );
  }   


    // Method to get the current user ID
  getCurrentUserId(): Observable<number> {
    const token = localStorage.getItem('authToken'); // JWT token if authentication is required
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Include token in headers if necessary
    });

    return this.http.get<any>(`http://localhost:5000/current-user`, { headers }).pipe(
      map(response => response.user_id) // Map the response to extract the user_id
    );
  }

  updateGroup(group:Groupi){
    this.groupChanged.next(group);
  }

  getPersonalGroups(): Observable<Groupi[]> {
    return this.http.get<Groupi[]>("http://localhost:5000/profile/groups");
  }
   
}