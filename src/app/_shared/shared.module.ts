// Copyright (C) 2018 Razif Baital
// 
// This file is part of Instant App.
// 
// Instant App is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 2 of the License, or
// (at your option) any later version.
// 
// Instant App is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with Instant App.  If not, see <http://www.gnu.org/licenses/>.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from './pipe/filter.pipe';
import { PageTitleService } from './service/page-title-service';
import { AuthenticationInterceptor } from './service/auth-interceptor.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';
import { OrderByPipe } from './pipe/order-by.pipe';
import { PageTitleComponent } from '../_shared/component/page-title.component';

import { NgbDropdownModule, NgbPaginationModule, NgbModalModule, NgbButtonsModule, NgbDatepickerModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faCheckSquare, faSquare, faQuidditch, faTh, faPlusCircle, faChartBar, faChartPie, faChartLine, faPencilAlt, faCog, faTrash, faPlus,
    faThLarge, faSignOutAlt, faSave, faAngleRight, faFile, faTimes, faPlay, faTachometerAlt, faPlusSquare,
    faListOl, faCalendar, faPaperPlane, faQuestion, faArrowUp, faArrowDown, faDotCircle, faInfoCircle, faArrowLeft, faArrowRight, faExclamationTriangle, faReply, faShare, faCheck, faCaretDown, faCaretUp,
    faUpload, faCircle as fasCircle,
    faAngleDoubleRight,
    faWindowRestore,
    faSitemap,
    faGlobe,
    faColumns,
    faThumbsUp,
    faSort,
    faShareAlt,
    faCircleNotch,
    faLock,
    faReceipt,
    faListAlt,
    faFileExcel,
    faFileDownload,
    faMailBulk,
    faSlidersH,
    faUsersCog,
    faChartArea,
    faTable,
    faFilter,
    faMicrophone,
    faQrcode,
    faList,
    faShoppingBag,
    faShareAltSquare,
    faAsterisk, faUniversity,
    faSearch,
    faEllipsisH,
    fas,
    faCopy
} from '@fortawesome/free-solid-svg-icons';
import {
    faQuestionCircle,faCircle as farCircle, faUser, faCaretSquareDown, faEnvelope, faCommentDots
} from '@fortawesome/free-regular-svg-icons';
import {
    faGoogle, faFacebookF, faGithub, faLinkedin
} from '@fortawesome/free-brands-svg-icons';
import { FieldEditComponent } from './field-edit/field-edit.component';
import { GroupByPipe } from './pipe/group-by.pipe';
import { MinDirective } from './directive/min.directive';
import { MaxDirective } from './directive/max.directive';
import { UniqueAppPathDirective } from './app-path-validator';


@NgModule({
    declarations: [
        PageTitleComponent,
        FilterPipe,
        OrderByPipe,
        FieldEditComponent,
        GroupByPipe,
        MinDirective,
        MaxDirective,
        UniqueAppPathDirective
        // CompileDirective
    ],
    imports: [CommonModule, FormsModule, NgSelectModule,
        NgbPaginationModule, NgbModalModule, NgbButtonsModule, NgbDatepickerModule, NgbDropdownModule, NgbTabsetModule, NgbTooltipModule, FontAwesomeModule],
    exports: [PageTitleComponent, FilterPipe, OrderByPipe, GroupByPipe, UniqueAppPathDirective, FieldEditComponent, CommonModule, FormsModule, NgSelectModule,
        NgbPaginationModule, NgbModalModule, NgbButtonsModule, NgbDatepickerModule, NgbDropdownModule, NgbTabsetModule, NgbTooltipModule, FontAwesomeModule],
    providers: [PageTitleService, AuthenticationInterceptor]
    // declarations: []
})
export class SharedModule {
    constructor(library: FaIconLibrary) {
        // library.addIconPacks(fas);
        library.addIcons(faGoogle, faFacebookF, faUniversity, faGithub, faLinkedin, faEllipsisH, faCheckSquare, faCheck, faSquare, faQuidditch, faTh, faPlusCircle, faThumbsUp, faChartBar, faChartArea, faChartLine, faChartPie, faChartLine, faDotCircle, faPencilAlt, faCog, faTrash, faPlus,faTimes,faCopy,
            faThLarge, faEnvelope, faCommentDots, faSearch, faFilter, faAsterisk, faCaretSquareDown, faShoppingBag, faQuestionCircle, faUser, faSignOutAlt, faSave, faAngleRight, faFile, faTimes, faPlay, faTachometerAlt, faPlusSquare,
            faListOl, faMicrophone, faCalendar, faPaperPlane, faQuestion, faArrowUp, faArrowDown, faShareAltSquare, faInfoCircle, faAngleRight, faArrowLeft, faArrowRight, faExclamationTriangle,
            faReply, faQrcode, faShare, faTable, faList, farCircle, fasCircle, faCaretDown, faMailBulk, faSlidersH, faUsersCog, faFileExcel, faFileDownload, faCaretUp, faListAlt, faCircleNotch, faUpload, faAngleDoubleRight, faWindowRestore, faSitemap, faGlobe, faColumns, faSort, faShareAlt, faLock);
    }
}
