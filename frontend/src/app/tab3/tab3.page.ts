import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab3Page implements AfterViewInit {
  @ViewChild('confettiCanvas') confettiCanvas!: ElementRef<HTMLCanvasElement>;
  
  isScrolled = false;
  isEditMode = false;
  selectedTab = 'connections';
  
  user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    photo: 'assets/img/profile.jpg',
    isActive: true,
    isFavorite: false,
    joinDate: 'Jan 2023',
    location: 'New York, USA'
  };
  
  userStats = [
    { type: 'alerts', icon: 'alert', value: '24', label: 'Alerts', trend: 12, action: () => this.viewAlerts() },
    { type: 'contacts', icon: 'people', value: '8', label: 'Contacts', trend: 5, action: () => this.viewContacts() },
    { type: 'locations', icon: 'location', value: '5', label: 'Places', trend: -2, action: () => this.viewLocations() }
  ];
  
  emergencyContacts = [
    { name: 'Sarah Wilson', relationship: 'Wife', phone: '+1 (555) 123-4567', photo: '', isEmergency: true, isOnline: true },
    { name: 'Mike Johnson', relationship: 'Brother', phone: '+1 (555) 987-6543', photo: '', isEmergency: true, isOnline: false },
    { name: 'Dr. Emily Chen', relationship: 'Doctor', phone: '+1 (555) 456-7890', photo: '', isEmergency: false, isOnline: true }
  ];
  
  recentActivities = [
    { type: 'success', icon: 'checkmark-circle', message: 'Password updated successfully', time: '2 hours ago' },
    { type: 'warning', icon: 'alert-circle', message: 'New login from unknown device', time: '1 day ago' },
    { type: 'danger', icon: 'location', message: 'Emergency alert triggered', time: '3 days ago' }
  ];
  
  savedLocations = [
    { name: 'Home', address: '123 Main St, New York', distance: '0.5 mi', category: 'Residence', icon: 'home', isFavorite: true },
    { name: 'Office', address: '456 Business Ave', distance: '2.1 mi', category: 'Work', icon: 'business', isFavorite: false },
    { name: 'Gym', address: '789 Fitness Rd', distance: '1.3 mi', category: 'Health', icon: 'barbell', isFavorite: true }
  ];
  
  settings = {
    darkMode: false,
    notifications: true,
    language: 'English'
  };

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {}

  ngAfterViewInit() {
    this.setupConfetti();
  }

  onScroll(event: any) {
    this.isScrolled = event.detail.scrollTop > 50;
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.showToast('Changes saved successfully');
    }
  }

  async playConfetti() {
    // Confetti animation implementation
    this.showToast('Celebration time! 🎉');
  }

  changePhoto() {
    if (this.isEditMode) {
      // Implement photo change logic
      this.showToast('Photo change feature');
    }
  }

  updateName(event: any) {
    this.user.name = event.target.textContent;
  }

  // Contact methods
  addContact() {
    this.showToast('Add contact feature');
  }

  viewContact(contact: any) {
    this.showToast(`Viewing ${contact.name}`);
  }

  callContact(contact: any) {
    this.showToast(`Calling ${contact.name}`);
  }

  messageContact(contact: any) {
    this.showToast(`Messaging ${contact.name}`);
  }

  // Location methods
  addLocation() {
    this.showToast('Add location feature');
  }

  navigateToLocation(location: any) {
    this.showToast(`Navigating to ${location.name}`);
  }

  toggleFavoriteLocation(location: any) {
    location.isFavorite = !location.isFavorite;
    this.showToast(location.isFavorite ? 'Added to favorites' : 'Removed from favorites');
  }

  // Quick actions
  addHomeLocation() {
    this.showToast('Add home location');
  }

  addWorkLocation() {
    this.showToast('Add work location');
  }

  showCurrentLocation() {
    this.showToast('Showing current location');
  }

  // Settings methods
  toggleDarkMode() {
    this.settings.darkMode = !this.settings.darkMode;
    this.showToast(`${this.settings.darkMode ? 'Dark' : 'Light'} mode enabled`);
  }

  changePassword() {
    this.showToast('Change password feature');
  }

  changeLanguage() {
    this.showToast('Change language feature');
  }

  managePrivacy() {
    this.showToast('Privacy settings');
  }

  backupData() {
    this.showToast('Backup data feature');
  }

  exportData() {
    this.showToast('Export data feature');
  }

  deleteAccount() {
    this.showToast('Delete account feature');
  }

  logout() {
    this.showToast('Logout feature');
  }

  shareProfile() {
    this.showToast('Share profile feature');
  }

  toggleFavorite() {
    this.user.isFavorite = !this.user.isFavorite;
    this.showToast(this.user.isFavorite ? 'Added to favorites' : 'Removed from favorites');
  }

  showJoinDateInfo() {
    this.showToast('Joined in January 2023');
  }

  showLocation() {
    this.showToast('Location: New York, USA');
  }

  openNotificationsSettings() {
    this.showToast('Notification settings');
  }

  openQuickActions() {
    this.showToast('Quick actions menu');
  }

  showProfileMenu() {
    this.showToast('Profile menu');
  }

  onTabChange() {
    // Handle tab changes
    this.showToast(`Switched to ${this.selectedTab} tab`);
  }

  // Add these methods to fix the error
  viewAlerts() {
    this.selectedTab = 'connections';
    this.showToast('Viewing your alerts');
    // Add any additional alert viewing logic here
  }

  viewContacts() {
    this.selectedTab = 'connections';
    this.showToast('Viewing your contacts');
    // Add any additional contact viewing logic here
  }

  viewLocations() {
    this.selectedTab = 'locations';
    this.showToast('Viewing saved locations');
    // Add any additional location viewing logic here
  }

  private setupConfetti() {
    // Confetti setup logic
    // You can implement canvas-based confetti animation here
    console.log('Confetti setup complete');
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}