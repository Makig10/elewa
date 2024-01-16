import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, map, switchMap, tap } from 'rxjs';

import { orderBy as __orderBy } from 'lodash';

import { __DateFromStorage } from '@iote/time';

import { Bot } from '@app/model/convs-mgr/bots';

//import { ActivatedRoute } from '@angular/router'; //to get the botId
import { forkJoin } from 'rxjs';
import { BotModule } from '@app/model/convs-mgr/bot-modules';//to access stories related to the bot
import { BotModulesStateService } from '@app/state/convs-mgr/modules';
import { StoryStateService } from '@app/state/convs-mgr/stories';
import { Story } from '@app/model/convs-mgr/stories/main';

import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'italanta-apps-bots-list-latest-courses',
  templateUrl: './bots-list-latest-courses.component.html',
  styleUrls: ['./bots-list-latest-courses.component.scss'],
  providers:[BotModulesStateService,StoryStateService]
})
export class BotsListLatestCoursesComponent implements OnInit {

  modules$: Observable<BotModule[]>;
  modules:BotModule[];
  @Input() stories$: Observable<Story[]>;
  stories:Story[];
  

  @Input() bots$: Observable<Bot[]>;
  defaultImageUrl = `https://res.cloudinary.com/dyl3rncv3/image/upload/v1695626490/photo-1541746972996-4e0b0f43e02a_o9ukmi.jpg`
  
  bots: Bot[];

  screenWidth: number;

  constructor(private _router$$: Router,
              private _dialog: MatDialog,
              private botModulesService: BotModulesStateService , //added 
              private storyStateService: StoryStateService,
            //  private route: ActivatedRoute // Inject ActivatedRoute                      
    ) {}

  ngOnInit(): void {
  this.screenWidth = window.innerWidth;
     

    // if (this.bots$) {
    //   // console.log(`Here are the bots:`,bots);
    //   this.bots$.pipe(
    //     map((s) => __orderBy(s,(a) => __DateFromStorage(a.createdOn as Date).unix(), 'desc')),
    //     tap((s) => this.bots = s),
    //     map((bots) => bots.map(bot => bot.id)),
    //     tap((botIds) => {
    //         console.log('Here are the botIds:', botIds);})
    //     ).subscribe();
    //     console.log(`Here are the bots:`,this.bots);
    // }

    // this.modules$ = this.botModulesService.getBotModulesFromParentBot(botId);
    // this.modules$.subscribe(modules => {
    //   if (modules && modules.length > 0) {
    //   console.log('Modules emitted:', modules);
    //   this.modules = modules;
    //       }else {
    //        console.log('No module data');
    //       }
    // });
    // this.stories$ = this.storyStateService.getStoriesFromParentModule(moduleId: string);
    // this.stories$.subscribe(stories => {
    //   if (stories && stories.length > 0) {
    //   console.log('Stories emitted:', stories);
    //   this.stories = stories;
    //       }else {
    //        console.log('No Stories data');
    //       }
    // });

    let botIds: string[] = [];

    if (this.bots$) {
      this.bots$.pipe(
        map((s) => __orderBy(s, (a) => __DateFromStorage(a.createdOn as Date).unix(), 'desc')),
        tap((s) => this.bots = s),
        map((bots) => bots.map(bot => bot.id)),
        tap((resultBotIds) => {
          // Filter out undefined or null values
          botIds = resultBotIds.filter(id => id !== undefined && id !== null) as string[];
          console.log('Here are the botIds:', botIds);
        })
      ).subscribe(() => {
        // Inside the subscribe block to ensure asynchronous completion
    
        // Access botIds outside the observable chain
        console.log('Access botIds outside the observable chain:', botIds);
    
        // Use the first botId or handle multiple botIds as needed
        const firstBotId = botIds.length > 0 ? botIds[0] : null;
    
        // Use the botId in the modules block
        if (firstBotId) {
          this.modules$ = this.botModulesService.getBotModulesFromParentBot(firstBotId);
          this.modules$.subscribe(modules => {
            if (modules && modules.length > 0) {
              console.log('Modules emitted:', modules);
              this.modules = modules;
            } else {
              console.log('No module data');
            }
          });
        } else {
          console.log('No valid botId to fetch modules.');
        }
      });
    
      // Note: This console.log will execute before the asynchronous operations within the observable chain.
      console.log(`Here are the bots:`, this.bots);
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

 