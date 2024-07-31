import { ChangeDetectorRef, Component, Input, ViewChildren, ElementRef } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { QueryList } from '@angular/core';
interface Slide {
  imageUrl: string;
  quote: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // userSub:Subscription;
  slides: Slide[] = [
    {
      imageUrl: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      quote: '"Food is the ingredient that binds us together."',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      quote: '"Eating is a necessity, but cooking is an art."',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1595763603216-41c9e72e41bc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      quote: '"Food is the universal language of happiness."',
    },
  ];
  currentSlideIndex: number = 0;
  slideInterval: any;

  isAuthenticated:boolean = false;
  
  
  constructor(private authService:AuthService, private cd: ChangeDetectorRef){}

  // ngOnint(){
  //   this.userSub = this.authService.user.subscribe(user =>{
  //     this.isAuthenticated = !!user;
  //     // console.log(!user);
  //     console.log("user authentication status: ",!!user);
  //     this.cd.detectChanges();
  //   });
  // }

  ngOnInit(){
    this.authService.isAuthenticated.subscribe(res =>{
      this.isAuthenticated = res;
    });
    this.startSlideshow();
  }
  
  

  // ngOnDestroy() { // Implement OnDestroy to clean up the subscription
  //   if (this.userSub) {
  //     this.userSub.unsubscribe();
  //   }
  // }


  // for slideshow
  
  startSlideshow(): void {
    this.slideInterval = setInterval(() => {
      this.showNextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  showNextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }
}
