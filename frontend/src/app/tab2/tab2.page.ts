import { Component, OnInit } from '@angular/core';
import { AlertController, AnimationController, IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideInItem', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class Tab2Page implements OnInit {
  emergencyAlerts: any[] = [
    {
      type: 'Flood',
      location: 'Downtown District',
      time: '15 minutes ago',
      status: 'Active',
      priority: 'high',
      icon: 'assets/icons/flood.svg',
      read: false,
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
      type: 'Earthquake',
      location: 'Northern Region',
      time: '45 minutes ago',
      status: 'Active',
      priority: 'high',
      icon: 'assets/icons/earthquake.svg',
      read: false,
      coordinates: { lat: 40.7138, lng: -74.0070 }
    },
    {
      type: 'Medical Emergency',
      location: 'City Hospital',
      time: '1 hour ago',
      status: 'Resolved',
      priority: 'medium',
      icon: 'assets/icons/medical.svg',
      read: true,
      coordinates: { lat: 40.7148, lng: -74.0080 }
    },
    {
      type: 'Fire',
      location: 'Industrial Area',
      time: '2 hours ago',
      status: 'Active',
      priority: 'high',
      icon: 'assets/icons/fire.svg',
      read: true,
      coordinates: { lat: 40.7158, lng: -74.0090 }
    },
    {
      type: 'Power Outage',
      location: 'Residential Sector',
      time: '3 hours ago',
      status: 'Resolved',
      priority: 'medium',
      icon: 'assets/icons/power.svg',
      read: true,
      coordinates: { lat: 40.7168, lng: -74.0100 }
    }
  ];

  filteredAlerts: any[] = [];
  alertFilter: string = 'all';
  showFilters: boolean = false;
  isRefreshing: boolean = false;
  unreadAlerts: number = 0;
  criticalAlert: any = null;

  constructor(
    private animationCtrl: AnimationController,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.applyFilters();
    this.checkUnreadAlerts();
    this.setCriticalAlert();
  }

  applyFilters() {
    if (this.alertFilter === 'all') {
      this.filteredAlerts = [...this.emergencyAlerts];
    } else if (this.alertFilter === 'active') {
      this.filteredAlerts = this.emergencyAlerts.filter(alert => alert.status === 'Active');
    } else {
      this.filteredAlerts = this.emergencyAlerts.filter(alert => alert.type.toLowerCase().includes(this.alertFilter));
    }
  }

  checkUnreadAlerts() {
    this.unreadAlerts = this.emergencyAlerts.filter(alert => !alert.read).length;
  }

  setCriticalAlert() {
    const critical = this.emergencyAlerts.find(alert => 
      alert.status === 'Active' && alert.priority === 'high' && !alert.read
    );
    this.criticalAlert = critical || null;
  }

  getAlertCount(type: string): number {
    return this.emergencyAlerts.filter(alert => 
      alert.type.toLowerCase().includes(type) && alert.status === 'Active'
    ).length;
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'medium';
    }
  }

  toggleAlertFilter() {
    this.showFilters = !this.showFilters;
  }

  filterByType(type: string) {
    this.alertFilter = type;
    this.applyFilters();
  }

  async refreshAlerts() {
    this.isRefreshing = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isRefreshing = false;
      // In a real app, you would fetch new data here
      const toast = document.createElement('ion-toast');
      toast.message = 'Alerts updated';
      toast.duration = 2000;
      toast.color = 'success';
      document.body.appendChild(toast);
      toast.present();
    }, 1500);
  }

  viewAlertDetails(alert: any) {
    // Mark as read
    alert.read = true;
    this.checkUnreadAlerts();
    this.setCriticalAlert();
    
    // Navigate to detail page
    this.router.navigate(['/alert-detail'], { 
      state: { alert } 
    });
  }

  navigateToLocation(alert: any) {
    // Open navigation with the alert's coordinates
    this.router.navigate(['/navigation'], {
      state: { 
        destination: alert.coordinates,
        alertType: alert.type
      }
    });
  }

  openMapView() {
    this.router.navigate(['/map-view'], {
      state: { alerts: this.emergencyAlerts }
    });
  }

  playNotificationSound() {
    // Play notification sound
    console.log('Playing notification sound');
    // Actual implementation would use Capacitor or HTML5 audio
  }

  async reportEmergency() {
    const alert = await this.alertCtrl.create({
      header: 'Report Emergency',
      message: 'What type of emergency are you reporting?',
      buttons: [
        {
          text: 'Natural Disaster',
          handler: () => {
            this.router.navigate(['/report-emergency'], { 
              state: { type: 'natural' } 
            });
          }
        },
        {
          text: 'Medical Emergency',
          handler: () => {
            this.router.navigate(['/report-emergency'], { 
              state: { type: 'medical' } 
            });
          }
        },
        {
          text: 'Security Incident',
          handler: () => {
            this.router.navigate(['/report-emergency'], { 
              state: { type: 'security' } 
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }
}