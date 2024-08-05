import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
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
export class RecipeService {
  private baseUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {}

  getRecipeById(id: number): Observable<any> {
    return this.http.get<Recipe>(`${this.baseUrl}/recipe/${id}`);
  }

  deleteRecipe(recipeId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete_recipe/${recipeId}`);
  }

  editRecipe(recipeId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/edit-recipe/${recipeId}`, formData);
  }

  // Create a new recipe
  createRecipe(recipeData: any): Observable<any> {
    const token = localStorage.getItem('authToken'); // Get JWT token if required
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Include token in headers if required
    });

    return this.http.post<any>("http://127.0.0.1:5000/add-recipe", recipeData, { headers });

    
  }


  getPublicRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.baseUrl}/profile/public-recipes`);
  }

  getPersonalRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.baseUrl}/profile/personal-recipes`);
  }
  

 // Add a comment to a recipe
 addComment(recipeId: number, commentText: string): Observable<any> {
  const headers = new HttpHeaders({'Content-Type': 'application/json'});
  return this.http.post(`${this.baseUrl}/recipe/${recipeId}`, { comment_text: commentText }, { headers });
}

// Add a like or dislike to a recipe
addLikeDislike(recipeId: number, thumbsUp: boolean): Observable<any> {
  const headers = new HttpHeaders({'Content-Type': 'application/json'});
  return this.http.post(`${this.baseUrl}/recipe/${recipeId}`, { thumbs_up: thumbsUp }, { headers });
}

// Add a recipe to favourites
addRecipeToFavourites(recipeId: number): Observable<any> {
  const headers = new HttpHeaders({'Content-Type': 'application/json'});
  return this.http.post(`${this.baseUrl}/recipe/${recipeId}`, { add_to_favourites: true }, { headers });
}

getCurrentUserId(): Observable<number> {
  const token = localStorage.getItem('authToken'); 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` 
    });

    return this.http.get<any>(`http://localhost:5000/current-user`, { headers }).pipe(
      map(response => response.user_id) // Map the response to extract the user_id
    );
}

// Method to get favourite recipes
getFavouriteRecipes(): Observable<Recipe[]> {
  return this.http.get<Recipe[]>(`${this.baseUrl}/favourites`);
}

getTopRecipes(): Observable<Recipe[]> {
  return this.http.get<Recipe[]>(`${this.baseUrl}/top-recipes-week`);
}

getRecipeCreatorUsername(recipeId: number): Observable<{ username: string }> {
  const token = localStorage.getItem('authToken'); 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` 
    });

    return this.http.get<{ username: string }>(`${this.baseUrl}/recipe-creator/${recipeId}`, { headers });
}


 // Function to generate recipe using youtube url
 generateRecipe(youtubeUrl: string): Observable<any> {
  const headers = new HttpHeaders().set('Content-Type', 'application/json');
  return this.http.post(`${this.baseUrl}/api/generate`, { youtube_url: youtubeUrl }, { headers });
}

chat(message: string, token: string): Observable<any> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.post(`${this.baseUrl}/chat`, { message }, { headers });
}
}
     