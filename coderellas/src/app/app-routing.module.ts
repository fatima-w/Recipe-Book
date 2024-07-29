import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { GroupComponent } from './group/group.component';
import { MyrecipesComponent } from './myrecipes/myrecipes.component';
import { GroupStartComponent } from './group/group-start/group-start.component';
import { GroupDetailComponent } from './group/group-detail/group-detail.component';
import { NewRecipeComponent } from './group/group-detail/recipes/new-recipe/new-recipe.component';
import { RecipeDetailComponent } from './group/group-detail/recipes/recipe-detail/recipe-detail.component';
import { GroupEditComponent } from './group/group-edit/group-edit.component';
import { YourRecipesComponent } from './myrecipes/your-recipes/your-recipes.component';
import { YourGroupsComponent } from './myrecipes/your-groups/your-groups.component';

const routes: Routes = [
  {path: '', redirectTo: '', pathMatch:"full"},
  {path: 'home', component: HomeComponent},
  {path: 'group', component: GroupComponent},
  {path:'myrecipes', component:MyrecipesComponent, children:[
    { path: 'your-recipes', component: YourRecipesComponent },
    { path: 'your-categories', component: YourGroupsComponent },
  ]},
  {path: 'recipes', component: AppComponent},
  {path:'shopping-list', component: AppComponent},
  {path:'auth', component: AuthComponent},
  {path: 'create-group', component: GroupStartComponent},
  {path: 'category-detail/:id', component: GroupDetailComponent},
  {path: 'add-recipe/:id', component:NewRecipeComponent},
  {path:'recipe-detail/:id', component:RecipeDetailComponent},
  {path: 'edit-group/:id', component:GroupEditComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
