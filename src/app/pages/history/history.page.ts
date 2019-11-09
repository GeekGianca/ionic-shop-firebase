import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { RecordService } from 'src/app/services/record.service';
import { Subscription } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { Record } from 'src/app/interfaces/record';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  public allrecords = new Array<Record>();
  public userrecords = new Array<Record>();
  private loading: any;
  private recordSubscription: Subscription;

  constructor(private authService: AuthService,
    private loadingCtrl: LoadingController,
    private recordService: RecordService) {
    this.recordSubscription = this.recordService.getRecords().subscribe(data => {
      this.allrecords = data;
      this.allrecords.forEach(val => {
        if (val.userId = this.authService.getAuth().currentUser.uid) {
          this.userrecords.push(val);
        }
      });
    });
  }

  ngOnInit() {
  }

}
