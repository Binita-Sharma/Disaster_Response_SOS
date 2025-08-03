import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IonicModule, AlertController, AnimationController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { Chart, registerables } from 'chart.js';
import { image } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class Tab1Page implements OnInit, AfterViewInit {
  private socket: Socket;
  currentDate = new Date();
  
  @ViewChild('pieChart') pieChartRef!: ElementRef;
  private pieChart?: Chart;

  // Emergency categories with icons and colors
emergencyCategories = [
  { 
    type: 'Fire', 
    icon: 'flame', 
    color: 'fire',
    description: 'Report fires and explosions', 
    image: 'assets/img/fire.png'
  },
  { 
    type: 'Flood', 
    icon: 'water', 
    color: 'flood',
    description: 'Report flooding and water emergencies',
    image: 'assets/img/flood.png'
  },
  { 
    type: 'Medical', 
    icon: 'medkit', 
    color: 'medical',
    description: 'Request medical assistance', 
    image: 'assets/img/medical.png'
  },
  { 
    type: 'Earthquake', 
    icon: 'alert-circle', 
    color: 'earthquake',
    description: 'Report seismic activity',
    image: 'assets/img/earthquake.png'
  },
  { 
    type: 'Accident', 
    icon: 'car', 
    color: 'accident',
    description: 'Report vehicle collisions',
    image: 'assets/img/accident.png'
  },
  { 
    type: 'Other', 
    icon: 'help-circle', 
    color: 'other',
    description: 'All other emergencies',
    image: 'assets/img/other.png'
  }
];

  // Emergency statistics
  activeAlerts = 3;
  resolvedCases = 12;
  responseEfficiency = 0.67;
  totalCases = 31;
  activeHours = '40h 32m';
  resolvedPercentage = '22%';

  // Chart data configuration
  chartData = [
    { label: 'Medical', value: 35, color: '#36a2eb' },
    { label: 'Fire', value: 25, color: '#ff6384' },
    { label: 'Accident', value: 20, color: '#ffcd56' },
    { label: 'Other', value: 20, color: '#4bc0c0' }
  ];

  // Safety tips for the info card
  safetyTips = [
    { icon: 'battery-charging', text: 'Keep devices fully charged', color: 'success' },
    { icon: 'location', text: 'Enable location sharing', color: 'primary' },
    { icon: 'medkit', text: 'Know emergency contacts', color: 'danger' },
    { icon: 'alert-circle', text: 'Stay calm and provide details', color: 'warning' }
  ];

  constructor(
    private alertController: AlertController,
    private animationCtrl: AnimationController
  ) {
    // Initialize Socket.io connection
    this.socket = io('http://localhost:5000');
    this.setupSocketListeners();
    
    // Register Chart.js components
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.createButtonAnimation();
  }

  ngAfterViewInit() {
    this.setupPieChart();
  }

  private setupSocketListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to emergency server');
    });

    this.socket.on('alertResponse', (data: any) => {
      console.log('Emergency response received:', data);
      this.presentResponseAlert(data);
      this.updateStatsAfterResponse();
    });

    this.socket.on('disconnect', () => {
      console.warn('Disconnected from emergency server');
    });
  }

  private createButtonAnimation() {
    const animation = this.animationCtrl.create()
      .addElement(document.querySelector('.sos-button')!)
      .duration(1500)
      .iterations(Infinity)
      .keyframes([
        { offset: 0, transform: 'scale(1)', opacity: '1' },
        { offset: 0.5, transform: 'scale(1.05)', opacity: '0.9' },
        { offset: 1, transform: 'scale(1)', opacity: '1' }
      ]);
    animation.play();
  }

  private setupPieChart() {
    if (!this.pieChartRef) return;

    const ctx = this.pieChartRef.nativeElement.getContext('2d');
    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.chartData.map(item => item.label),
        datasets: [{
          data: this.chartData.map(item => item.value),
          backgroundColor: this.chartData.map(item => item.color),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}%`;
              }
            }
          }
        }
      }
    });
  }

  async sendSOS() {
    const alert = await this.alertController.create({
      header: 'Confirm Emergency',
      message: 'This will notify emergency services immediately. Only use in real emergencies.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'SEND SOS',
          cssClass: 'emergency-button',
          handler: () => {
            this.processSOS('General SOS');
          }
        }
      ]
    });

    await alert.present();
  }

  async sendCategory(type: string) {
    const alert = await this.alertController.create({
      header: `Report ${type} Emergency?`,
      message: `This will alert ${type} response teams with your location.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'CONFIRM',
          cssClass: 'emergency-button',
          handler: () => {
            this.processSOS(type);
          }
        }
      ]
    });

    await alert.present();
  }

  private async processSOS(type: string) {
    try {
      const sosData = {
        name: 'User', // In production, use actual user name
        location: await this.getApproximateLocation(),
        type: type,
        timestamp: new Date(),
        status: 'pending'
      };

      await axios.post('http://localhost:5000/sos', sosData);
      this.socket.emit('sendSOS', sosData);

      this.activeAlerts++;
      this.totalCases++;
      this.updateChartData();
      
      await this.presentSuccessAlert(type);
    } catch (error) {
      console.error('Error sending SOS:', error);
      await this.presentErrorAlert();
    }
  }

  private async getApproximateLocation(): Promise<string> {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(`Lat: ${position.coords.latitude}, Long: ${position.coords.longitude}`);
          },
          () => {
            resolve('Approximate Location (GPS not available)');
          }
        );
      } else {
        resolve('Location Unknown');
      }
    });
  }

  private updateChartData() {
    if (!this.pieChart) return;
    
    // Simulate data update - in real app, get from backend
    this.chartData.forEach(item => {
      if (item.label === 'Medical') item.value = 35 + Math.floor(Math.random() * 5);
      if (item.label === 'Fire') item.value = 25 + Math.floor(Math.random() * 5);
    });
    
    this.pieChart.data.datasets[0].data = this.chartData.map(item => item.value);
    this.pieChart.update();
  }

  private updateStatsAfterResponse() {
    this.activeAlerts = Math.max(0, this.activeAlerts - 1);
    this.resolvedCases++;
    this.resolvedPercentage = `${Math.round((this.resolvedCases / this.totalCases) * 100)}%`;
    this.responseEfficiency = parseFloat((0.6 + Math.random() * 0.3).toFixed(2));
  }

  private async presentSuccessAlert(type: string) {
    const alert = await this.alertController.create({
      header: 'Alert Received!',
      subHeader: `${type} Emergency Reported`,
      message: 'Emergency services have been notified. Help is on the way!',
      buttons: ['OK']
    });

    await alert.present();
  }

  private async presentErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Transmission Failed',
      message: 'Could not send emergency alert. Please try again or call emergency services directly.',
      buttons: ['OK']
    });

    await alert.present();
  }

  private async presentResponseAlert(data: any) {
    const alert = await this.alertController.create({
      header: 'Response Received',
      message: `${data.responder}: ${data.message}`,
      buttons: ['OK']
    });

    await alert.present();
  }

  refresh() {
    // Simulate data refresh
    this.activeAlerts = 3 + Math.floor(Math.random() * 3);
    this.resolvedCases = 12 + Math.floor(Math.random() * 5);
    this.totalCases = 31 + Math.floor(Math.random() * 10);
    this.resolvedPercentage = `${Math.round((this.resolvedCases / this.totalCases) * 100)}%`;
    this.updateChartData();
    
    this.presentAlert('System Updated', 'Emergency data has been refreshed.');
  }

  private async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}