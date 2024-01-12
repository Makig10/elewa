import { Component, Input, OnInit ,OnDestroy, Output} from '@angular/core';
import { Router } from '@angular/router';

import { Observable, map, switchMap, tap } from 'rxjs';

import { orderBy as __orderBy } from 'lodash';

import { __DateFromStorage } from '@iote/time';

import { Bot } from '@app/model/convs-mgr/bots';


import { BotModule } from '@app/model/convs-mgr/bot-modules';//to access stories related to the bot
import { Story } from '@app/model/convs-mgr/stories/main';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';
import { BehaviorSubject,combineLatest } from 'rxjs';
import { BotMutationEnum } from '@app/model/convs-mgr/bots';
import { iTalBreadcrumb } from '@app/model/layout/ital-breadcrumb';
import { BreadcrumbService } from '@app/elements/layout/ital-bread-crumb';
import { ActionSortingOptions, CreateLessonModalComponent } from '@app/elements/layout/convs-mgr/story-elements';
import { TIME_AGO } from '@app/features/convs-mgr/conversations/chats';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'italanta-apps-bots-list-latest-courses',
  templateUrl: './bots-list-latest-courses.component.html',
  styleUrls: ['./bots-list-latest-courses.component.scss'],
})
export class BotsListLatestCoursesComponent implements OnInit {
  //added code
  //dataSource = new MatTableDataSource<Story>();
  @Input() modules: BotModule[]= [];
  //Input() modules$: Observable<BotModule[]>;
  //modules= BotModule[];
  @Input() stories: Story[] = [];
  //@Input() stories$: Observable<Story[]>;
  //stories = Story[];

  openMainStory(id: string) {
    this._router$$.navigate(['stories', id]);
  }
  
   //end of added code
  @Input() bots$: Observable<Bot[]>;
  defaultImageUrl = `https://res.cloudinary.com/dyl3rncv3/image/upload/v1695626490/photo-1541746972996-4e0b0f43e02a_o9ukmi.jpg`
  
  bots: Bot[];

  screenWidth: number;

  constructor(private _router$$: Router,
              private _dialog: MatDialog   //added                      
    ) {}

  ngOnInit(): void {

    this.screenWidth = window.innerWidth;
    if (this.modules) {
      console.log(`Here are the modules: ${this.modules}`);

    } else {
      console.log('No module data');
    }
  
    if (this.stories) {
      console.log(`Here are the stories: ${this.stories}`);
      
    } else {
      console.log('No story data');
    }
  

    if (this.bots$) {
      this.bots$.pipe(
        map((s) => __orderBy(s,(a) => __DateFromStorage(a.createdOn as Date).unix(), 'desc')),
        tap((s) => this.bots = s)).subscribe();
    }
    
  }
  openBot(id: string) {
    console.log("openBot div clicked");
    this._router$$.navigate(['bots', id]);
  }
}

 