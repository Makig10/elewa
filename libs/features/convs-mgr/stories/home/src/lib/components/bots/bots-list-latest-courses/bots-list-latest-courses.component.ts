import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, map, switchMap, tap } from 'rxjs';

import { orderBy as __orderBy } from 'lodash';

import { __DateFromStorage } from '@iote/time';

import { Bot } from '@app/model/convs-mgr/bots';

//import { ActivatedRoute } from '@angular/router'; //to get the botId

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
  filteredModules:BotModule[];
  @Input() stories$: Observable<Story[]>;
  stories:Story[];
  

  @Input() bots$: Observable<Bot[]>;
  defaultImageUrl = `https://res.cloudinary.com/dyl3rncv3/image/upload/v1695626490/photo-1541746972996-4e0b0f43e02a_o9ukmi.jpg`
  bots: Bot[];

  botId:string | undefined;

  screenWidth: number;

  constructor(private _router$$: Router,
              private _dialog: MatDialog,
              private botModulesService: BotModulesStateService , //added 
            
            //  private route: ActivatedRoute // Inject ActivatedRoute                      
    ) {}

  ngOnInit(): void {
  this.screenWidth = window.innerWidth;

     
  if (this.bots$) {
    this.bots$.pipe(
      map((s) => __orderBy(s, (a) => __DateFromStorage(a.createdOn as Date).unix(), 'desc')),
      tap((s) => {
        this.bots = s;
        console.log('Here are the bots:', this.bots);
      }),
      map((bots) => bots.map(bot => bot.id)),
      tap((botIds) => {
      //  this.botId = botIds
        console.log('Here are the botIds:', botIds);
      })
    ).subscribe(
      
    );
  }

  this.modules$ = this.botModulesService.getBotModules();
  this.modules$.subscribe(modules => {
    if (modules && modules.length > 0) {
      console.log('Modules emitted:', modules);
      this.modules = modules;
      // Assuming you want to fetch modules for each parentBot
      this.fetchModulesForBots(modules.map(module => module.parentBot));
    } else {
      console.log('No module data');
    }
  });
}
 fetchModulesForBots(parentBotIds: string[]): void {
    if (parentBotIds && parentBotIds.length > 0) {
      this.filteredModules = []; // Clear the array before populating
      parentBotIds.forEach((parentBotId, i) => {
        this.botModulesService.getBotModulesFromParentBot(parentBotId).subscribe(
          (response: BotModule[]) => {
            console.log(`Modules for parentBot ${parentBotId}:`, response);
            // Assuming you want to push the first module to filteredModules
            if (response.length > 0) {
              this.filteredModules.push(response[0]);
            }
          },
          (error) => {
            console.error(`Error fetching modules for parentBot ${parentBotId}:`, error);
          }
        );
      });
    }

/*fetchModulesForBots(parentBotIds: string[]): void {
  if (parentBotIds && parentBotIds.length > 0) {
    parentBotIds.forEach(parentBotId => {
      this.botModulesService.getBotModulesFromParentBot(parentBotId).subscribe(
        (filteredModules: BotModule[]) => {
          console.log(`Modules for parentBot ${parentBotId}:`, filteredModules);
          
        },
        error => {
          console.error(`Error fetching modules for parentBot ${parentBotId}:`, error);
        }
      );
    });
  }*/

  
    // this.modules$ = this.botModulesService.getBotModules();
    // this.modules$.subscribe(modules => {
    //   if (modules && modules.length > 0) {
    //   console.log('Modules emitted:', modules);
    //   this.modules = modules;
    //       }else {
    //        console.log('No module data');
    //       }
    // });

    // if(this.modules){
    //   moduleIds= this.modules.map((modules)=>{module.parentBot})
    //   this.botModulesService.getBotModulesFromParentBot(moduleId[i]).subscribe(
    //     (response:BotModule[])=>{
    //       this.modules=response;
    //     }
    //   )
    // }
   
  

   
    
  
  }


  
  openBot(id: string) {
    console.log("openBot div clicked");
    this._router$$.navigate(['bots', id]);
  }
  openMainStory(id: string) {
    this._router$$.navigate(['stories', id]);
  }


}