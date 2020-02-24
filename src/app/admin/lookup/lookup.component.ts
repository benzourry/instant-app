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

import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_shared/service/user.service';
import { LookupService } from '../../service/lookup.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { UtilityService } from 'src/app/_shared/service/utility.service';

@Component({
    selector: 'app-lookup',
    templateUrl: './lookup.component.html',
    styleUrls: ['../../../assets/css/side-menu.css', './lookup.component.css']
})
export class LookupComponent implements OnInit {

    // onlineEvent: Observable<Event>;
    // offlineEvent: Observable<Event>;
    // subscriptions: Subscription[] = [];
    offline = false;

    lookupTotal: any;
    loading: boolean;
    lookupList: any;
    lookupEntryTotal: any;
    lookupEntryList: any;
    totalItems: any;
    lookup: any;
    itemLoading: boolean;
    constructor(private userService: UserService, private route: ActivatedRoute, private lookupService: LookupService,
        private modalService: NgbModal,
        private location: PlatformLocation, private utilityService: UtilityService) {
        location.onPopState(() => this.modalService.dismissAll(''));
        this.utilityService.testOnline$().subscribe(online=>this.offline = !online);
    }

    ngOnInit() {
        this.userService.getUser()
            .subscribe((user) => {
                this.user = user;
                this.loadLookupList(1);

                this.route.queryParams
                    .subscribe((params: Params) => {
                        const id = params['id'];
                        if (id) {
                            this.loadLookup(id);
                        }
                    })
            });
    }

    user: any;
    lookupId = '';
    data = { 'list': [] };
    pageSize = 45;
    currentPage = 1;
    itemsPerPage = 15;
    maxSize = 5;
    startAt = 0;
    searchText: string = "";

    pageNumber: number = 1;
    entryPageNumber: number = 1;

    // this.loadLookupList = loadLookupList;
    loadLookupList(pageNumber) {
        this.itemLoading = true;
        this.pageNumber = pageNumber;

        let params = new HttpParams()
            .append("searchText", this.searchText)
            .append("email", this.user.email)
            .append("page", (pageNumber - 1).toString())
            .append("size", this.itemsPerPage.toString());

        this.lookupService.getLookupList(params)
            .subscribe(res => {
                this.lookupList = res.content;
                this.lookupTotal = res.totalElements;
                this.itemLoading = false;
            }, res => this.itemLoading = false)
    }

    editLookupData: any;
    editLookup(content, lookup, isNew) {
        this.editLookupData = lookup;
        history.pushState(null, null, window.location.href);
        this.modalService.open(content)
            .result.then(data => {
                this.lookupService.save(this.user.email, data)
                    .subscribe(res => {
                        this.loadLookupList(this.pageNumber);
                        this.loadLookup(res.id);
                    }, res => {
                        // alertService.addAlert('danger', "Lookup update failure: " + res.data.error);
                    });
            }, res => { })
    }

    removeLookupData: any;
    removeLookup(content, lookup) {
        this.removeLookupData = lookup;
        history.pushState(null, null, window.location.href);
        this.modalService.open(content)
            .result.then(data => {
                this.lookupService.deleteLookup(lookup.id, data)
                    .subscribe(res => {
                        this.loadLookupList(1);
                        delete this.lookup;
                    }, res => {
                        // alertService.addAlert('danger', "Lookup update failure: " + res.data.error);
                    });
            }, res => { });
    }

    editLookupEntryData: any;
    editLookupEntry(content, lookup, isNew) {
        this.editLookupEntryData = lookup;
        history.pushState(null, null, window.location.href);
        this.modalService.open(content)
            .result.then(data => {
                this.lookupService.saveEntry(this.lookupId, data)
                    .subscribe(res => {
                        if (isNew) {
                            this.lookupEntryList.push(res);
                        } else {
                            Object.assign(lookup, res);
                        }
                    }, res => {
                        // alertService.addAlert('danger', "Lookup update failure: " + res.data.error);
                    });
            }, res => { })
    }

    removeLookupEntryData: any;
    removeLookupEntry(content, obj) {
        this.removeLookupEntryData = obj;
        history.pushState(null, null, window.location.href);
        this.modalService.open(content)
            .result.then(data => {
                this.lookupService.removeEntry(obj.id, data)
                    .subscribe(res => {
                        this.loadLookup(this.lookupId);
                    }, res => {
                        // alertService.addAlert('danger', "Lookup removal failure: " + res.data.error);
                    });
            }, res => { });
    }

    loadLookup(id) {
        this.lookupId = id;
        this.lookupService.getLookup(id)
            .subscribe(lookup => {
                this.lookup = lookup;
                this.getLookupEntryList(this.entryPageNumber);
            })

    }

    getLookupEntryList(pageNumber) {
        this.loading = true;
        let params = new HttpParams()
            .append('page', (pageNumber - 1).toString())
            .append('size', this.pageSize.toString())
            .append('searchText', this.searchText)
            .append('docFlag', '2')

        this.lookupService.getEntryList(this.lookupId, params)
            .subscribe(response => {
                this.loading = false;
                this.lookupEntryTotal = response.totalElements;
                this.lookupEntryList = response.content;
            });
    }

}
