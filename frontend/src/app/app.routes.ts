import { Routes } from '@angular/router';
import { BasicPageComponent } from './components/basic-page/basic-page.component';
import { SessionFlowComponent } from './components/session-flow/session-flow.component';
import { LoginComponent } from './components/login/login.component';
import { NowSupportComponent } from './components/now-support/now-support.component';
import { PageContent } from './shared/models/page-content.interface';
import { authGuard } from './core/auth.guard';

const loginPage: PageContent = {
  eyebrowKey: 'loginEyebrow',
  titleKey: 'loginTitle',
  descriptionKey: 'loginDescription',
  panelTitleKey: 'loginPanelTitle',
  panelTextKey: 'loginPanelText',
};
const historyPage: PageContent = {
  eyebrowKey: 'historyEyebrow',
  titleKey: 'historyTitle',
  descriptionKey: 'historyDescription',
  panelTitleKey: 'historyPanelTitle',
  panelTextKey: 'historyPanelText',
  isHistory: true,
};
const profilePage: PageContent = {
  eyebrowKey: 'profileEyebrow',
  titleKey: 'profileTitle',
  descriptionKey: 'profileDescription',
  panelTitleKey: 'profilePanelTitle',
  panelTextKey: 'profilePanelText',
  isProfile: true,
};

const ladderPage: PageContent = {
  eyebrowKey: 'ladderEyebrow',
  titleKey: 'ladderTitle',
  descriptionKey: 'ladderDescription',
  panelTitleKey: 'ladderPanelTitle',
  panelTextKey: 'ladderPanelText',
  isLadder: true,
};

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: SessionFlowComponent },
  { path: 'now', component: NowSupportComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'history',
    component: BasicPageComponent,
    canActivate: [authGuard],
    data: historyPage,
  },
  {
    path: 'profile',
    component: BasicPageComponent,
    canActivate: [authGuard],
    data: profilePage,
  },
  {
    path: 'ladder',
    component: BasicPageComponent,
    canActivate: [authGuard],
    data: ladderPage,
  },
  { path: '**', redirectTo: 'home' },
];
