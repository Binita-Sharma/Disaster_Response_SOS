import { Component, OnInit } from '@angular/core';
import { AlertController, AnimationController, IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,]
  
})
export class Tab3Page implements OnInit {
  contentScrolled = false;
  isEditMode = false;
  showConfetti = false;
  confettiPieces: any[] = [];
  
  user = {
    name: 'Alex Johnson',
    profileImage: '',
    role: 'Disaster Responder',
    isVerified: true,
    responseLevel: 'Advanced',
    medicalInfo: {
      bloodType: 'O+',
      allergies: ['Penicillin', 'Peanuts']
    }
  };
  
  quickStats = [
    { value: '12', label: 'Missions', action: () => this.viewMissions() },
    { value: '8', label: 'Trainings', action: () => this.viewTrainings() },
    { value: '24', label: 'Badges', action: () => this.viewBadges() }
  ];
  
  emergencyContacts = [
    { name: 'Sarah Smith', relationship: 'Spouse', phone: '(555) 123-4567', isPrimary: true },
    { name: 'Dr. Emily Wilson', relationship: 'Physician', phone: '(555) 987-6543', isPrimary: false }
  ];
  
  preparednessItems = [
    { name: 'Emergency Kit', description: '72-hour supply ready', icon: 'briefcase', completed: true },
    { name: 'Evacuation Plan', description: 'Family meeting points', icon: 'map', completed: true },
    { name: 'Documents', description: 'Important papers secured', icon: 'document', completed: false },
    { name: 'First Aid Certified', description: 'Current certification', icon: 'medkit', completed: true }
  ];
  
  settings = {
    darkMode: false,
    emergencyAlerts: true,
    locationSharing: true
  };
  
  get preparednessScore(): number {
    const completed = this.preparednessItems.filter(item => item.completed).length;
    return Math.round((completed / this.preparednessItems.length) * 100);
  }

  constructor(
    private animationCtrl: AnimationController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    this.setupAvatarAnimation();
  }
  
  setupAvatarAnimation() {
    const avatar = document.querySelector('.user-avatar');
    if (avatar) {
      const animation = this.animationCtrl.create()
        .addElement(avatar)
        .duration(2000)
        .iterations(Infinity)
        .keyframes([
          { offset: 0, transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(var(--ion-color-primary-rgb), 0.4)' },
          { offset: 0.5, transform: 'scale(1.03)', boxShadow: '0 0 0 8px rgba(var(--ion-color-primary-rgb), 0)' },
          { offset: 1, transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(var(--ion-color-primary-rgb), 0)' }
        ]);
      animation.play();
    }
  }
  
  handleScroll(event: any) {
    this.contentScrolled = event.detail.scrollTop > 30;
  }
  
  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.pulseEditButton();
    }
  }
  
  pulseEditButton() {
    const button = document.querySelector('.edit-mode-icon');
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
  
  triggerCelebration() {
    this.showConfetti = true;
    this.createConfetti();
    setTimeout(() => this.showConfetti = false, 3000);
  }
  
  createConfetti() {
    const colors = [
      'var(--ion-color-primary)',
      'var(--ion-color-secondary)',
      'var(--ion-color-tertiary)',
      'var(--ion-color-success)',
      'var(--ion-color-warning)',
      'var(--ion-color-danger)'
    ];
    
    this.confettiPieces = Array.from({ length: 50 }, () => ({
      left: Math.random() * window.innerWidth,
      delay: Math.random() * 2000,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
  }
  
  // Profile Actions
  changeProfilePhoto() {
    console.log('Change profile photo');
    // Implement photo change logic
  }
  
  // Emergency Actions
  editEmergencyInfo() {
    console.log('Edit emergency info');
    // Implement edit emergency info
  }
  
  manageContacts() {
    console.log('Manage contacts');
    // Implement contact management
  }
  
  // Preparedness Actions
  updatePreparedness() {
    console.log('Preparedness updated:', this.preparednessScore);
    if (this.preparednessScore === 100) {
      this.triggerCelebration();
    }
  }
  
  // Settings Actions
  toggleDarkMode() {
    document.body.classList.toggle('dark', this.settings.darkMode);
  }
  
  toggleEmergencyAlerts() {
    console.log('Emergency alerts toggled:', this.settings.emergencyAlerts);
  }
  
  openLocationSettings() {
    console.log('Open location settings');
  }
  
  // Navigation Actions
  viewMissions() {
    console.log('View missions');
    // this.router.navigate(['/missions']);
  }
  
  viewTrainings() {
    console.log('View trainings');
    // this.router.navigate(['/trainings']);
  }
  
  viewBadges() {
    console.log('View badges');
    // this.router.navigate(['/badges']);
  }
  
  openTraining() {
    console.log('Open training resources');
  }
  
  async confirmLogout() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to sign out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Logout',
          handler: () => {
            this.logout();
          }
        }
      ]
    });
    
    await alert.present();
  }
  
  logout() {
    console.log('User logged out');
    // Implement logout logic
  }
}