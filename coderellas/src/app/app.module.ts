import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { authInterceptor } from './shared/auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { GroupComponent } from './group/group.component';
import { GroupListComponent } from './group/group-list/group-list.component';
import { GroupItemComponent } from './group/group-list/group-slider/group-item/group-item.component';
import { GroupDetailComponent } from './group/group-detail/group-detail.component';
import { GroupEditComponent } from './group/group-edit/group-edit.component';
import { GroupStartComponent } from './group/group-start/group-start.component';
import { RecipesComponent } from './group/group-detail/recipes/recipes.component';
import { NewRecipeComponent } from './group/group-detail/recipes/new-recipe/new-recipe.component';
import { RecipeDetailComponent } from './group/group-detail/recipes/recipe-detail/recipe-detail.component';
import { RecipeListComponent } from './group/group-detail/recipes/recipe-list/recipe-list.component';
import { RecipeItemComponent } from './group/group-detail/recipes/recipe-list/recipe-item/recipe-item.component';
import { MyrecipesComponent } from './myrecipes/myrecipes.component';
import { GroupSliderComponent } from './group/group-list/group-slider/group-slider.component';
import { YourRecipesComponent } from './myrecipes/your-recipes/your-recipes.component';
import { YourGroupsComponent } from './myrecipes/your-groups/your-groups.component';
import { YourRecipeItemComponent } from './myrecipes/your-recipes/your-recipe-item/your-recipe-item.component';
import { YourGroupsItemComponent } from './myrecipes/your-groups/your-groups-item/your-groups-item.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FooterComponent } from './footer/footer.component';
import { TopRecipesComponent } from './top-recipes/top-recipes.component';
import { TopRecipesItemComponent } from './top-recipes/top-recipes-item/top-recipes-item.component';
import { SearchItemComponent } from './home/search-item/search-item.component';
import { FeatureComponent } from './feature/feature.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    HomeComponent,
    LoadingComponent,
    GroupComponent,
    GroupListComponent,
    GroupItemComponent,
    GroupDetailComponent,
    GroupEditComponent,
    GroupStartComponent,
    RecipesComponent,
    NewRecipeComponent,
    RecipeDetailComponent,
    RecipeListComponent,
    RecipeItemComponent,
    MyrecipesComponent,
    GroupSliderComponent,
    YourRecipesComponent,
    YourGroupsComponent,
    YourRecipeItemComponent,
    YourGroupsItemComponent,
    FavouritesComponent,
    FooterComponent,
    TopRecipesComponent,
    TopRecipesItemComponent,
    SearchItemComponent,
    FeatureComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  providers: [provideHttpClient(withInterceptors([authInterceptor]))],
  bootstrap: [AppComponent]
})
export class AppModule { }
