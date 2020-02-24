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

import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';
@Injectable()
export class PageTitleService {
  private openSource = new Subject<boolean>();
  openAnnounced$ = this.openSource.asObservable();
  open(opened: boolean) {
    this.openSource.next(opened);
  }
}
