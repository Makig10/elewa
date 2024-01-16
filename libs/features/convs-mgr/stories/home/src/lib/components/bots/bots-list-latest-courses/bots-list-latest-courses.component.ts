import { Component, Input, OnInit ,OnDestroy, Output} from '@angular/core';
import { Router } from '@angular/router';

import { Observable, map, switchMap, tap } from 'rxjs';

import { orderBy as __orderBy } from 'lodash';

import { __DateFromStorage } from '@iote/time';

import { Bot } from '@app/model/convs-mgr/bots';


import { BotModule } from '@app/model/convs-mgr/bot-modules';//to access stories related to the bot
import { BotModulesStateService } from '@app/state/convs-mgr/modules';
import { Story } from '@app/model/convs-mgr/stories/main';

import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'italanta-apps-bots-list-latest-courses',
  templateUrl: './bots-list-latest-courses.component.html',
  styleUrls: ['./bots-list-latest-courses.component.scss'],
  providers:[BotModulesStateService]
})
export class BotsListLatestCoursesComponent implements OnInit {

  modules$: Observable<BotModule[]>;
  modules:BotModule[];
  @Input() stories$: Observable<Story[]>;
  stories:Story[];
  
  
  
   //end of added code
  @Input() bots$: Observable<Bot[]>;
  defaultImageUrl = `https://res.cloudinary.com/dyl3rncv3/image/upload/v1695626490/photo-1541746972996-4e0b0f43e02a_o9ukmi.jpg`
  
  bots: Bot[];

  screenWidth: number;

  constructor(private _router$$: Router,
              private _dialog: MatDialog,
              private botModulesService: BotModulesStateService  //added                      
    ) {}

  ngOnInit(): void {

    this.screenWidth = window.innerWidth;
    this.modules$ = this.botModulesService.getBotModules();
    this.modules$.subscribe(modules => {
      if (modules && modules.length > 0) {
      console.log('Modules emitted:', modules);
      this.modules = modules;
          }else {
           console.log('No module data');
          }
    });
  
    if (this.stories$) {
      // console.log(`Here are the stories: ${this.stories$}`);
      this.stories$.subscribe(stories => {
        console.log('Stories emitted:', stories);
        this.stories = stories; // Assign the stories to the component property
      });
      
    } else {
      console.log('No story data');
    }
  

    if (this.bots$) {
      // console.log(`Here are the bots:`,bots);
      this.bots$.pipe(
        map((s) => __orderBy(s,(a) => __DateFromStorage(a.createdOn as Date).unix(), 'desc')),
        tap((s) => this.bots = s)).subscribe();
        console.log(`Here are the bots:`,this.bots);
    }
    
  }
  openBot(id: string) {
    console.log("openBot div clicked");
    this._router$$.navigate(['bots', id]);
  }
  openMainStory(id: string) {
    this._router$$.navigate(['stories', id]);
  }
}

 