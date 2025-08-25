import { Component, ElementRef, ViewChild, OnInit, Renderer2, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AnimationController, IonicModule, IonSlides } from '@ionic/angular';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class Tab3Page implements OnInit {
  @ViewChild('confettiCanvas') confettiCanvas!: ElementRef;
  @ViewChild(IonSlides) slides!: IonSlides;
  
  isScrolled = false;
  isEditMode = false;
  
  user = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    photo: '',
    isActive: true,
    joinDate: 'June 2022'
  };
  
  userStats = [
    { value: '24', label: 'Connections', action: () => this.slideTo(0) },
    { value: '8', label: 'Places', action: () => this.slideTo(1) },
    { value: '142', label: 'Points', action: () => this.showPointsInfo() }
  ];
  
  emergencyContacts = [
    { name: 'Sarah Smith', phone: '(555) 123-4567', relationship: 'Spouse', photo: '', isEmergency: true },
    { name: 'Michael Johnson', phone: '(555) 987-6543', relationship: 'Brother', photo: '', isEmergency: true },
    { name: 'Dr. Emily Wilson', phone: '(555) 456-7890', relationship: 'Physician', photo: '', isEmergency: false }
  ];
  
  savedLocations = [
    { name: 'Home', address: '123 Main St, Apt 4B' },
    { name: 'Work', address: '456 Business Ave, Floor 3' },
    { name: 'Gym', address: '789 Fitness Lane' }
  ];
  
  settings = {
    darkMode: false,
    notifications: true
  };
  
  slideOpts = {
    initialSlide: 0,
    speed: 300,
    slidesPerView: 1,
    spaceBetween: 20,
    centeredSlides: true,
    effect: 'slide'
  };

  constructor(
    private animationCtrl: AnimationController,
    private renderer: Renderer2
  ) {}
  
  ngOnInit() {
    this.setupAvatarAnimation();
  }
  
  setupAvatarAnimation() {
    const avatar = document.querySelector('.profile-avatar');
    if (avatar) {
      const animation = this.animationCtrl.create()
        .addElement(avatar)
        .duration(1500)
        .iterations(Infinity)
        .keyframes([
          { offset: 0, transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(110, 142, 251, 0.4)' },
          { offset: 0.7, transform: 'scale(1.05)', boxShadow: '0 0 0 10px rgba(110, 142, 251, 0)' },
          { offset: 1, transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(110, 142, 251, 0)' }
        ]);
      animation.play();
    }
  }
  
  onScroll(event: any) {
    this.isScrolled = event.detail.scrollTop > 30;
  }
  
  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    
    if (this.isEditMode) {
      this.pulseEditButton();
    }
  }
  
  pulseEditButton() {
    const button = document.querySelector('.edit-icon');
    if (button) {
      const animation = this.animationCtrl.create()
        .addElement(button)
        .duration(300)
        .iterations(1)
        .keyframes([
          { offset: 0, transform: 'scale(1)' },
          { offset: 0.5, transform: 'scale(1.3)' },
          { offset: 1, transform: 'scale(1)' }
        ]);
      animation.play();
    }
  }
  
  slideTo(index: number) {
    this.slides.slideTo(index);
  }
  
  showPointsInfo() {
    // Implement points info modal
    console.log('Show points information');
  }
  
  changePhoto() {
    // Implement photo change logic
    console.log('Change photo clicked');
  }
  
  addContact() {
    // Implement add contact logic
    console.log('Add contact clicked');
  }
  
  viewContact(contact: any) {
    // Implement view contact logic
    console.log('View contact:', contact);
  }
  
  deleteContact(contact: any) {
    // Implement delete contact logic
    console.log('Delete contact:', contact);
  }
  
  addLocation() {
    // Implement add location logic
    console.log('Add location clicked');
  }
  
  deleteLocation(location: any) {
    // Implement delete location logic
    console.log('Delete location:', location);
  }
  
  toggleDarkMode() {
    document.body.classList.toggle('dark', this.settings.darkMode);
  }
  
  changePassword() {
    // Implement change password logic
    console.log('Change password clicked');
  }
  
  logout() {
    // Implement logout logic
    console.log('Logout clicked');
  }
  
  playConfetti() {
    this.createConfetti();
  }
  
  createConfetti() {
    const canvas = this.confettiCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const colors = ['#6e8efb', '#a777e3', '#ff6b6b', '#4caf50', '#ffeb3b'];
    type ConfettiPiece = {
      x: number;
      y: number;
      r: number;
      d: number;
      color: string;
      tilt: number;
      tiltAngle: number;
      tiltAngleIncrement: number;
    };
    const confettiPieces: ConfettiPiece[] = [];
    
    for (let i = 0; i < 100; i++) {
      confettiPieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 4 + 1,
        d: Math.random() * 7 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngle: Math.random() * 0.1,
        tiltAngleIncrement: Math.random() * 0.07
      });
    }
    
    let animationFrame : number;
    const animateConfetti = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let remaining = 0;
      confettiPieces.forEach((p, i) => {
        if (p.y < canvas.height) {
          remaining++;
          p.tiltAngle += p.tiltAngleIncrement;
          p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
          p.tilt = Math.sin(p.tiltAngle) * 15;
          
          ctx.beginPath();
          ctx.lineWidth = p.r;
          ctx.strokeStyle = p.color;
          ctx.moveTo(p.x + p.tilt, p.y);
          ctx.lineTo(p.x + p.tilt + p.r * 2, p.y + p.tilt);
          ctx.stroke();
        } else if (i < 50 && p.y < canvas.height + 50 && p.d > 0.1) {
          p.y = canvas.height;
          p.d *= 0.96;
        }
      });
      
      if (remaining > 0) {
        animationFrame = requestAnimationFrame(animateConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    };
    
    animateConfetti();
  }
}