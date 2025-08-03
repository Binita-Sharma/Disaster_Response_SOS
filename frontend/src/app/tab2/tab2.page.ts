import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class Tab2Page {

  // Dummy emergency alerts
  emergencyAlerts = [
    {
      type: 'Fire',
      icon: 'assets/img/fire.png',
      location: 'Near City Hospital, Sector 21',
      time: '2 mins ago',
      status: 'Active'
    },
    {
      type: 'Medical',
      icon: 'assets/img/medical.png',
      location: 'Central Mall, 3rd Floor',
      time: '10 mins ago',
      status: 'Active'
    },
    {
      type: 'Flood',
      icon: 'assets/img/flood.png',
      location: 'River Bank Road, Block B',
      time: '30 mins ago',
      status: 'Resolved'
    }
  ];

}
