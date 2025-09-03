import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger, keyframes } from '@angular/animations';
//import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideDown', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ height: 0, opacity: 0 }))
      ])
    ]),
    trigger('slideInUp', [
      transition(':enter', [
        style({ transform: 'translateY(50px)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('staggerSlideIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: 'translateX(-20px)' }), { optional: true }),
        query(':enter', stagger('100ms', [
          animate('300ms ease-out', keyframes([
            style({ opacity: 0, transform: 'translateX(-20px)', offset: 0 }),
            style({ opacity: 0.5, transform: 'translateX(5px)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
          ]))
        ]), { optional: true })
      ])
    ]),
    trigger('bounceIn', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
          style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class Tab2Page implements OnInit, OnDestroy {
  // Alert data
  emergencyAlerts: any[] = [];
  filteredAlerts: any[] = [];
  criticalAlert: any = null;
  
  // UI states
  showFilters = false;
  alertFilter = 'all';
  sortOrder: 'newest' | 'priority' = 'newest';
  isRefreshing = false;
  isLoading = true;
  unreadAlerts = 3;
  
  // Statistics
  totalAlerts = 0;
  alertTrend = 12;
  responseRate = 85;
  responseTrend = 8;

  // Mock data for demonstration
  private mockAlerts = [
    {
      id: 1,
      type: 'Flood',
      priority: 'high',
      location: 'Downtown District',
      description: 'Severe flooding reported in downtown area',
      time: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      status: 'Active',
      read: false,
      mapX: 30,
      mapY: 40
    },
    {
      id: 2,
      type: 'Medical',
      priority: 'high',
      location: 'Central Hospital',
      description: 'Multiple injuries reported at hospital entrance',
      time: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      status: 'Active',
      read: false,
      mapX: 60,
      mapY: 70
    },
    {
      id: 3,
      type: 'Earthquake',
      priority: 'medium',
      location: 'Northern Suburbs',
      description: 'Minor earthquake detected, magnitude 4.2',
      time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      status: 'Monitoring',
      read: true,
      mapX: 20,
      mapY: 25
    },
    {
      id: 4,
      type: 'Security',
      priority: 'medium',
      location: 'Shopping Mall',
      description: 'Security incident reported, avoid area',
      time: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      status: 'Responded',
      read: true,
      mapX: 75,
      mapY: 55
    }
  ];

  constructor(
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadAlerts();
    this.simulateRealTimeUpdates();
  }

  ngOnDestroy() {
    // Clean up any intervals or subscriptions
  }

  async loadAlerts() {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.emergencyAlerts = [...this.mockAlerts];
      this.applyFilters();
      this.updateStatistics();
      this.isLoading = false;
      
      // Set critical alert if any high priority active alerts
      const critical = this.emergencyAlerts.find(a => 
        a.priority === 'high' && a.status === 'Active' && !a.read
      );
      if (critical) {
        this.criticalAlert = critical;
      }
    }, 1000);
  }

  simulateRealTimeUpdates() {
    // Simulate real-time alert updates
    setInterval(() => {
      if (Math.random() > 0.7) {
        const newAlert = {
          id: Date.now(),
          type: ['Flood', 'Medical', 'Security', 'Fire'][Math.floor(Math.random() * 4)],
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          location: `Location ${Math.floor(Math.random() * 100)}`,
          description: 'New emergency situation reported',
          time: new Date(),
          status: 'Active',
          read: false,
          mapX: Math.random() * 80 + 10,
          mapY: Math.random() * 80 + 10
        };
        
        this.emergencyAlerts.unshift(newAlert);
        this.applyFilters();
        this.updateStatistics();
        this.unreadAlerts++;
        
        if (newAlert.priority === 'high') {
          this.criticalAlert = newAlert;
          this.playNotificationSound();
        }
      }
    }, 30000); // Every 30 seconds
  }

  updateStatistics() {
    this.totalAlerts = this.emergencyAlerts.length;
    this.unreadAlerts = this.emergencyAlerts.filter(a => !a.read).length;
  }

  applyFilters() {
    let filtered = [...this.emergencyAlerts];
    
    // Apply type filter
    if (this.alertFilter !== 'all') {
      filtered = filtered.filter(alert => 
        this.alertFilter === 'active' ? alert.status === 'Active' : alert.type.toLowerCase() === this.alertFilter
      );
    }
    
    // Apply sort order
    const priorityOrder: { [key: string]: number } = { high: 3, medium: 2, low: 1 };
    
    filtered.sort((a, b) => {
      if (this.sortOrder === 'newest') {
        return new Date(b.time).getTime() - new Date(a.time).getTime();
      } else {
        return priorityOrder[b.priority] - priorityOrder[a.priority] || 
               new Date(b.time).getTime() - new Date(a.time).getTime();
      }
    });
    
    this.filteredAlerts = filtered;
  }

  async refreshAlerts() {
    this.isRefreshing = true;
    await this.loadAlerts();
    
    // Show refresh complete toast
    const toast = await this.toastController.create({
      message: 'Alerts refreshed',
      duration: 2000,
      position: 'top',
      color: 'success'
    });
    await toast.present();
    
    this.isRefreshing = false;
  }

  toggleAlertFilter() {
    this.showFilters = !this.showFilters;
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'newest' ? 'priority' : 'newest';
    this.applyFilters();
  }

  filterByType(type: string) {
    this.alertFilter = type;
    this.applyFilters();
  }

  filterByStatus(status: string) {
    this.alertFilter = status;
    this.applyFilters();
  }

  getAlertCount(type: string): number {
    return this.emergencyAlerts.filter(alert => alert.type.toLowerCase() === type.toLowerCase()).length;
  }

  getAlertIcon(type: string): string {
    const icons: { [key: string]: string } = {
      flood: 'water',
      medical: 'medkit',
      security: 'shield-checkmark',
      earthquake: 'alert-circle',
      fire: 'flame'
    };
    return icons[type.toLowerCase()] || 'warning';
  }

  getPriorityColor(priority: string): string {
    const colors: { [key: string]: string } = {
      high: 'danger',
      medium: 'warning',
      low: 'success'
    };
    return colors[priority] || 'medium';
  }

  async viewAlertDetails(alert: any) {
    alert.read = true;
    this.unreadAlerts = this.emergencyAlerts.filter(a => !a.read).length;
    
    const modal = await this.alertController.create({
      header: `${alert.type} Alert`,
      message: `
        <p><strong>Location:</strong> ${alert.location}</p>
        <p><strong>Status:</strong> ${alert.status}</p>
        <p><strong>Priority:</strong> ${alert.priority}</p>
        <p><strong>Description:</strong> ${alert.description}</p>
        <p><strong>Time:</strong> ${this.formatTime(alert.time)}</p>
      `,
      buttons: [
        {
          text: 'Navigate',
          handler: () => this.navigateToLocation(alert)
        },
        {
          text: 'Share',
          handler: () => this.shareAlert(alert)
        },
        {
          text: 'Close',
          role: 'cancel'
        }
      ]
    });
    
    await modal.present();
  }

  async navigateToLocation(alert: any) {
    // In a real app, this would open maps with the location
    const toast = await this.toastController.create({
      message: `Navigating to ${alert.location}`,
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }

  async shareAlert(alert: any) {
    try {
      await Share.share({
        title: `${alert.type} Alert`,
        text: `Emergency Alert: ${alert.type} at ${alert.location}. ${alert.description}`,
        url: 'https://resqnet.com/alerts',
        dialogTitle: 'Share Emergency Alert'
      });
    } catch (error) {
      console.error('Error sharing alert:', error);
    }
  }

  async reportEmergency() {
    const alert = await this.alertController.create({
      header: 'Report Emergency',
      inputs: [
        {
          name: 'type',
          type: 'text',
          placeholder: 'Emergency Type'
        },
        {
          name: 'location',
          type: 'text',
          placeholder: 'Location'
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Emergency Description'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Report',
          handler: (data) => {
            this.submitEmergencyReport(data);
          }
        }
      ]
    });
    
    await alert.present();
  }

  async submitEmergencyReport(data: any) {
    // Simulate report submission
    const toast = await this.toastController.create({
      message: 'Emergency report submitted! Help is on the way.',
      duration: 3000,
      position: 'top',
      color: 'success'
    });
    await toast.present();
  }

  dismissCriticalAlert() {
    this.criticalAlert = null;
  }

  async playNotificationSound() {
    // In a real app, this would play a sound
    const toast = await this.toastController.create({
      message: 'New emergency alert!',
      duration: 2000,
      position: 'top',
      color: 'warning'
    });
    await toast.present();
  }

  async openMapView() {
    // In a real app, this would open a map view
    const toast = await this.toastController.create({
      message: 'Opening emergency map view',
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }

  trackByAlertId(index: number, alert: any): number {
    return alert.id;
  }

  formatTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short'
    }).format(date);
  }

  getTimeAgo(date: Date): string {
    if (!date) return '';
    
    const now = new Date();
    const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  }
}