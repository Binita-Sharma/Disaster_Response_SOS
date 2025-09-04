import { Component, OnInit, HostListener, ViewEncapsulation } from '@angular/core';
import { 
  IonicModule, 
  AlertController, 
  ToastController, 
  Platform, 
  LoadingController,
  AnimationController 
} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

// Define the Alert interface
interface EmergencyAlert {
  id: string;
  type: 'natural' | 'medical' | 'security';
  priority: 'high' | 'medium' | 'low';
  status: 'Active' | 'Responded' | 'Resolved';
  description: string;
  location: string;
  time: Date;
  read: boolean;
  bookmarked: boolean;
  affectedPeople: number;
  tags: string[];
  expiresAt?: Date;
  mapX: number;
  mapY: number;
}

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ height: 0, opacity: 0 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideInUp', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('bounceIn', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('500ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
          style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]),
    trigger('staggerSlideIn', [
      transition('* => *', [
        query(':enter', [
          style({ transform: 'translateX(-20px)', opacity: 0 }),
          stagger('100ms', [
            animate('500ms ease-out', 
              style({ transform: 'translateX(0)', opacity: 1 }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class Tab2Page implements OnInit {
  // State variables
  emergencyAlerts: EmergencyAlert[] = [];
  filteredAlerts: EmergencyAlert[] = [];
  criticalAlert: EmergencyAlert | null = null;
  unreadAlerts: number = 0;
  totalAlerts: number = 0;
  activeAlertsCount: number = 0;
  respondedAlertsCount: number = 0;
  alertTrend: number = 5;
  responseRate: number = 75;
  responseTrend: number = 2;
  
  // UI state
  showFilters: boolean = false;
  showSearch: boolean = false;
  isListView: boolean = true;
  isScrolled: boolean = false;
  isConnected: boolean = true;
  isLoading: boolean = false;
  isRefreshing: boolean = false;
  soundEnabled: boolean = true;
  
  // Filter and sort
  alertFilter: string = 'all';
  searchQuery: string = '';
  sortOrder: 'newest' | 'priority' = 'newest';
  
  // Interactive guide
  showInteractiveGuide: boolean = false;
  currentGuideStep: number = 1;
  
  // Pagination
  hasMoreAlerts: boolean = true;
  private alertsPerPage: number = 10;
  private currentPage: number = 1;
  
  // Mock data for demonstration
  private mockAlerts: EmergencyAlert[] = [
    {
      id: '1',
      type: 'natural',
      priority: 'high',
      status: 'Active',
      description: 'Flash flood warning issued for downtown area',
      location: 'Downtown District',
      time: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      read: false,
      bookmarked: false,
      affectedPeople: 250,
      tags: ['flood', 'weather', 'evacuation'],
      expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
      mapX: 35,
      mapY: 45
    },
    {
      id: '2',
      type: 'medical',
      priority: 'high',
      status: 'Active',
      description: 'Multi-vehicle accident on Highway 101',
      location: 'Highway 101, Exit 24',
      time: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      read: false,
      bookmarked: true,
      affectedPeople: 8,
      tags: ['accident', 'traffic', 'injuries'],
      expiresAt: new Date(Date.now() + 1000 * 60 * 45), // 45 minutes from now
      mapX: 60,
      mapY: 30
    },
    {
      id: '3',
      type: 'security',
      priority: 'medium',
      status: 'Responded',
      description: 'Reported suspicious activity near city hall',
      location: 'City Hall Plaza',
      time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: true,
      bookmarked: false,
      affectedPeople: 0,
      tags: ['suspicious', 'investigation'],
      mapX: 50,
      mapY: 60
    },
    {
      id: '4',
      type: 'natural',
      priority: 'low',
      status: 'Resolved',
      description: 'Minor earthquake felt in suburban areas',
      location: 'North Suburbs',
      time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: true,
      bookmarked: false,
      affectedPeople: 0,
      tags: ['earthquake', 'minor'],
      mapX: 25,
      mapY: 20
    },
    {
      id: '5',
      type: 'medical',
      priority: 'medium',
      status: 'Active',
      description: 'COVID-19 testing site at capacity',
      location: 'Community Health Center',
      time: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      read: false,
      bookmarked: true,
      affectedPeople: 150,
      tags: ['health', 'covid', 'testing'],
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours from now
      mapX: 70,
      mapY: 50
    }
  ];

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private platform: Platform,
    private loadingController: LoadingController,
    private animationCtrl: AnimationController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAlerts();
    this.checkConnection();
    this.setupMockData();
  }

  // HostListener for scroll events
  @HostListener('ionScroll', ['$event'])
  onContentScroll(event: any) {
    this.isScrolled = event.detail.scrollTop > 50;
  }

  // Load alerts from storage or API
  async loadAlerts() {
    this.isLoading = true;
    
    // In a real app, you would fetch from an API
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.emergencyAlerts = [...this.mockAlerts];
      this.applyFilters();
      this.updateStats();
      
      // Check for critical alerts
      this.checkForCriticalAlerts();
    } catch (error) {
      console.error('Error loading alerts:', error);
      this.presentToast('Failed to load alerts', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  // Setup mock data for demonstration
  setupMockData() {
    // Set up periodic updates for demonstration
    setInterval(() => {
      this.updateMockData();
    }, 30000); // Update every 30 seconds
  }

  // Update mock data for live demo
  updateMockData() {
    // Randomly update some alerts for demonstration
    if (Math.random() > 0.7 && this.emergencyAlerts.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.emergencyAlerts.length);
      const alert = this.emergencyAlerts[randomIndex];
      
      // Toggle status or add new alert
      if (Math.random() > 0.5) {
        // Update existing alert
        alert.status = alert.status === 'Active' ? 'Responded' : 
                      alert.status === 'Responded' ? 'Resolved' : 'Active';
        alert.read = false;
        
        this.presentToast(`Alert status updated: ${alert.description.substring(0, 30)}...`, 'primary');
      } else {
        // Add new alert occasionally
        this.addNewMockAlert();
      }
      
      this.applyFilters();
      this.updateStats();
      this.checkForCriticalAlerts();
    }
  }

  // Add a new mock alert for demonstration
  addNewMockAlert() {
    const types: ('natural' | 'medical' | 'security')[] = ['natural', 'medical', 'security'];
    const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
    const statuses: ('Active' | 'Responded' | 'Resolved')[] = ['Active'];
    
    const newAlert: EmergencyAlert = {
      id: (this.emergencyAlerts.length + 1).toString(),
      type: types[Math.floor(Math.random() * types.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status: statuses[0],
      description: `New emergency situation reported in ${['Downtown', 'Uptown', 'Midtown'][Math.floor(Math.random() * 3)]} area`,
      location: `${['Main St', 'Oak Ave', 'Pine Rd'][Math.floor(Math.random() * 3)]} and ${['1st', '2nd', '3rd'][Math.floor(Math.random() * 3)]} St`,
      time: new Date(),
      read: false,
      bookmarked: false,
      affectedPeople: Math.floor(Math.random() * 100),
      tags: ['new', 'emergency'],
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * (1 + Math.floor(Math.random() * 3))),
      mapX: 10 + Math.floor(Math.random() * 80),
      mapY: 10 + Math.floor(Math.random() * 80)
    };
    
    this.emergencyAlerts.unshift(newAlert);
    this.playNotificationSound();
    this.presentToast('New emergency alert received', 'warning');
  }

  // Check for critical alerts to show in banner
  checkForCriticalAlerts() {
    const critical = this.emergencyAlerts.find(alert => 
      alert.priority === 'high' && 
      alert.status === 'Active' && 
      !alert.read
    );
    
    this.criticalAlert = critical || null;
  }

  // Update statistics
  updateStats() {
    this.totalAlerts = this.emergencyAlerts.length;
    this.activeAlertsCount = this.emergencyAlerts.filter(a => a.status === 'Active').length;
    this.respondedAlertsCount = this.emergencyAlerts.filter(a => a.status === 'Responded').length;
    this.unreadAlerts = this.emergencyAlerts.filter(a => !a.read).length;
    
    // Calculate response rate
    const totalRespondedOrResolved = this.emergencyAlerts.filter(a => 
      a.status === 'Responded' || a.status === 'Resolved').length;
    this.responseRate = this.totalAlerts > 0 ? 
      Math.round((totalRespondedOrResolved / this.totalAlerts) * 100) : 0;
  }

  // Apply filters and search
  applyFilters() {
    let filtered = [...this.emergencyAlerts];
    
    // Apply type filter
    if (this.alertFilter !== 'all') {
      if (this.alertFilter === 'active') {
        filtered = filtered.filter(alert => alert.status === 'Active');
      } else {
        filtered = filtered.filter(alert => alert.type === this.alertFilter);
      }
    }
    
    // Apply search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(alert => 
        alert.description.toLowerCase().includes(query) ||
        alert.location.toLowerCase().includes(query) ||
        alert.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    if (this.sortOrder === 'newest') {
      filtered.sort((a, b) => b.time.getTime() - a.time.getTime());
    } else {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      filtered.sort((a, b) => {
        if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return b.time.getTime() - a.time.getTime();
      });
    }
    
    // Apply pagination
    const startIndex = 0;
    const endIndex = this.currentPage * this.alertsPerPage;
    this.filteredAlerts = filtered.slice(startIndex, endIndex);
    
    // Check if there are more alerts to load
    this.hasMoreAlerts = endIndex < filtered.length;
  }

  // Load more alerts for pagination
  loadMoreAlerts() {
    this.currentPage++;
    this.applyFilters();
  }

  // Get alert count by type
  getAlertCount(type: string): number {
    return this.emergencyAlerts.filter(alert => alert.type === type).length;
  }

  // Get alert icon based on type
  getAlertIcon(type: string): string {
    switch (type) {
      case 'natural': return 'flash';
      case 'medical': return 'medkit';
      case 'security': return 'shield-checkmark';
      default: return 'alert-circle';
    }
  }

  // Get priority color
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'medium';
    }
  }

  // Get time ago string
  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    return `${diffDays} days ago`;
  }

  // Get time remaining for expiring alerts
  getTimeRemaining(alert: EmergencyAlert): string {
    if (!alert.expiresAt) return '';
    
    const now = new Date();
    const diffMs = alert.expiresAt.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 0) return 'Expired';
    if (diffMins < 60) return `${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours} hr`;
  }

  // Get progress width for expiring alerts
  getProgressWidth(alert: EmergencyAlert): number {
    if (!alert.expiresAt || !alert.time) return 0;
    
    const totalTime = alert.expiresAt.getTime() - alert.time.getTime();
    const elapsedTime = new Date().getTime() - alert.time.getTime();
    
    return Math.min(100, Math.max(0, (elapsedTime / totalTime) * 100));
  }

  // Get absolute value
  getAbs(value: number): number {
    return Math.abs(value);
  }

  // Toggle alert filter panel
  toggleAlertFilter() {
    this.showFilters = !this.showFilters;
    if (this.showFilters) {
      this.showSearch = false;
    }
  }

  // Toggle search panel
  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
      this.showFilters = false;
    }
  }

  // Clear all filters
  clearFilters() {
    this.alertFilter = 'all';
    this.searchQuery = '';
    this.applyFilters();
    this.presentToast('Filters cleared', 'success');
  }

  // Toggle sort order
  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'newest' ? 'priority' : 'newest';
    this.applyFilters();
    this.presentToast(`Sorted by ${this.sortOrder}`, 'primary');
  }

  // Toggle view mode (list/grid)
  toggleViewMode() {
    this.isListView = !this.isListView;
  }

  // Toggle sound settings
  toggleSoundSettings() {
    this.soundEnabled = !this.soundEnabled;
    this.presentToast(`Sound ${this.soundEnabled ? 'enabled' : 'muted'}`, 'primary');
  }

  // Play notification sound
  playNotificationSound() {
    if (!this.soundEnabled) return;
    
    // In a real app, you would play an actual sound
    console.log('Notification sound played');
    this.presentToast('Notification sound played', 'success');
  }

  // Refresh alerts
  async refreshAlerts() {
    this.isRefreshing = true;
    await this.loadAlerts();
    this.isRefreshing = false;
    this.presentToast('Alerts refreshed', 'success');
  }

  // Check connection status
  checkConnection() {
    // In a real app, you would check actual network connectivity
    this.isConnected = navigator.onLine;
    if (!this.isConnected) {
      this.presentToast('You are currently offline', 'warning');
    }
  }

  // Mark all alerts as read
  markAllAsRead() {
    this.emergencyAlerts.forEach(alert => alert.read = true);
    this.unreadAlerts = 0;
    this.criticalAlert = null;
    this.presentToast('All alerts marked as read', 'success');
  }

  // View alert details
  viewAlertDetails(alert: EmergencyAlert) {
    alert.read = true;
    this.unreadAlerts = this.emergencyAlerts.filter(a => !a.read).length;
    
    // In a real app, you would navigate to a details page
    this.presentToast(`Viewing details for ${alert.type} alert`, 'primary');
  }

  // Navigate to alert location
  navigateToLocation(alert: EmergencyAlert) {
    // In a real app, you would open a map with the location
    this.presentToast(`Navigating to ${alert.location}`, 'primary');
  }

  // Share alert
  shareAlert(alert: EmergencyAlert) {
    // In a real app, you would use the Web Share API
    if (navigator.share) {
      navigator.share({
        title: `${alert.type.toUpperCase()} Alert`,
        text: `${alert.description} at ${alert.location}`,
        url: window.location.href
      })
      .then(() => console.log('Alert shared successfully'))
      .catch(error => console.log('Error sharing alert:', error));
    } else {
      this.presentToast('Web Share API not supported', 'warning');
    }
  }

  // Bookmark alert
  bookmarkAlert(alert: EmergencyAlert) {
    alert.bookmarked = !alert.bookmarked;
    this.presentToast(
      `Alert ${alert.bookmarked ? 'bookmarked' : 'removed from bookmarks'}`,
      'primary'
    );
  }

  // Dismiss critical alert
  dismissCriticalAlert() {
    if (this.criticalAlert) {
      this.criticalAlert.read = true;
      this.criticalAlert = null;
      this.unreadAlerts = this.emergencyAlerts.filter(a => !a.read).length;
    }
  }

  // Report emergency
  async reportEmergency() {
    const alert = await this.alertController.create({
      header: 'Report Emergency',
      message: 'What type of emergency would you like to report?',
      buttons: [
        {
          text: 'Natural Disaster',
          handler: () => {
            this.presentToast('Natural disaster reported', 'success');
          }
        },
        {
          text: 'Medical Emergency',
          handler: () => {
            this.presentToast('Medical emergency reported', 'success');
          }
        },
        {
          text: 'Security Incident',
          handler: () => {
            this.presentToast('Security incident reported', 'success');
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

  // Open settings
  openSettings() {
    this.presentToast('Settings opened', 'primary');
  }

  // Open map view
  openMapView() {
    this.presentToast('Map view opened', 'primary');
  }

  // Refresh map
  refreshMap() {
    this.presentToast('Map refreshed', 'primary');
  }

  // Filter by status
  filterByStatus(status: string) {
    this.alertFilter = status;
    this.applyFilters();
  }

  // Filter by type
  filterByType(type: string) {
    this.alertFilter = type;
    this.applyFilters();
  }

  // Show stats info
  showStatsInfo() {
    this.presentToast('Emergency statistics information', 'primary');
  }

  // Export stats
  exportStats() {
    this.presentToast('Statistics exported', 'success');
  }

  // Export alerts
  exportAlerts() {
    this.presentToast('Alerts exported', 'success');
  }

  // Toggle interactive guide
  toggleInteractiveGuide() {
    this.showInteractiveGuide = !this.showInteractiveGuide;
    if (this.showInteractiveGuide) {
      this.currentGuideStep = 1;
    }
  }

  // Close interactive guide
  closeInteractiveGuide() {
    this.showInteractiveGuide = false;
  }

  // Next guide step
  nextGuideStep() {
    if (this.currentGuideStep < 3) {
      this.currentGuideStep++;
    }
  }

  // Previous guide step
  prevGuideStep() {
    if (this.currentGuideStep > 1) {
      this.currentGuideStep--;
    }
  }

  // Set guide step
  setGuideStep(step: number) {
    this.currentGuideStep = step;
  }

  // Track by function for ngFor
  trackByAlertId(index: number, alert: EmergencyAlert): string {
    return alert.id;
  }

  // Handle swipe events
  onSwipe(event: any, alert: EmergencyAlert) {
    // In a real app, you would handle swipe gestures
    console.log('Swipe event:', event, alert);
  }

  // Present toast notification
  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}