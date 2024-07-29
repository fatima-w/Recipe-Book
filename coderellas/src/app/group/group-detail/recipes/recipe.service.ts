import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
interface Recipe {
  id: number;
  user_id: number;
  group_id: number;
  cooking_time: number;
  difficulty_level: string;
  recipe: string;
  image_path: string;
  ingredients: any[]; // You can replace `any` with a specific interface for ingredients
  instructions: string;
  recipe_type: string;
  public: boolean;
  reviews: any[]; // You can replace `any` with a specific interface for reviews
  comments: any[]; // You can replace `any` with a specific interface for comments
}
@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private baseUrl = 'http://127.0.0.1:5000';
  private apiUrl = "http://127.0.0.1:5000/add-recipe"; // Adjust API URL as needed

  constructor(private http: HttpClient) {}
   // Adjust the base URL if necessary  

  getRecipeById(id: number): Observable<any> {
    return this.http.get<Recipe>(`${this.baseUrl}/recipe/${id}`);
  }

  deleteRecipe(recipeId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete_recipe/${recipeId}`);
  }

  editRecipe(recipeId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/edit-recipe/${recipeId}`, formData);
  }
  // updateRecipe(recipeId: number, recipeData: any): Observable<any> {
  //   return this.http.put(`${this.baseUrl}/update-recipe/${recipeId}`, recipeData);
  // }

  // Create a new recipe
  createRecipe(recipeData: any): Observable<any> {
    const token = localStorage.getItem('authToken'); // Get JWT token if required
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Include token in headers if required
    });

    return this.http.post<any>(this.apiUrl, recipeData, { headers });

    
  }


  getPublicRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.baseUrl}/profile/public-recipes`);
  }

  getPersonalRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.baseUrl}/profile/personal-recipes`);
  }
  
}
     