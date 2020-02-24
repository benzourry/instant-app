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
import { MailerService } from '../../service/mailer.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { UtilityService } from 'src/app/_shared/service/utility.service';

@Component({
    selector: 'app-mailer',
    templateUrl: './mailer.component.html',
    styleUrls: ['../../../assets/css/side-menu.css', './mailer.component.css']
})
export class MailerComponent implements OnInit {

    offline = false;

    mailerTotal: any;
    loading: boolean;
    mailerList: any;
    mailerEntryTotal: any;
    mailerEntryList: any;
    totalItems: any;
    mailer: any;
    itemLoading: boolean;
    constructor(private userService: UserService, private route: ActivatedRoute, private mailerService: MailerService,
        private modalService: NgbModal,
        private location: PlatformLocation, private utilityService: UtilityService) {
            location.onPopState(() => this.modalService.dismissAll(''));
            this.utilityService.testOnline$().subscribe(online=>this.offline = !online);
         }

    ngOnInit() {
        this.userService.getUser()
            .subscribe((user) => {
                this.user = user;
                this.loadMailerList(1);

                this.route.queryParams
                .subscribe((params: Params) => {
                    const id = params['id'];
                    if (id) {
                        this.loadMailer(id);
                    }
                })
            });
    }

    user: any;
    mailerId = '';
    data = { 'list': [] };
    pageSize = 45;
    currentPage = 1;
    itemsPerPage = 15;
    maxSize = 5;
    startAt = 0;
    searchText: string = "";

    pageNumber: number = 1;
    entryPageNumber: number = 1;

    // this.loadMailerList = loadMailerList;
    loadMailerList(pageNumber) {
        this.pageNumber = pageNumber;
        this.itemLoading = true;

        let params = new HttpParams()
            .append("searchText", this.searchText)
            .append("email", this.user.email)
            .append("page", (pageNumber - 1).toString())
            .append("size", this.itemsPerPage.toString());

        this.mailerService.getMailerList(params)
            .subscribe(res => {
                this.mailerList = res.content;
                this.mailerTotal = res.totalElements;
                this.itemLoading = false;
            }, res => this.itemLoading = false)
    }

    editMailerData: any;
    editMailer(content, mailer, isNew) {
        // console.log(mailer);
        mailer.content = this.br2nl(mailer.content);
        this.editMailerData = mailer;
        history.pushState(null, null, window.location.href);
        this.modalService.open(content)
            .result.then(data => {
                data.content = this.nl2br(data.content);
                this.mailerService.save(this.user.email, data)
                    .subscribe(res => {
                        this.loadMailerList(this.pageNumber);
                        this.loadMailer(res.id);
                    }, res => {
                        // alertService.addAlert('danger', "Mailer update failure: " + res.data.error);
                    });
            }, res => { })
    }

    removeMailerData: any;
    removeMailer(content, mailer) {
        this.removeMailerData = mailer;
        history.pushState(null, null, window.location.href);
        this.modalService.open(content)
            .result.then(data => {
                this.mailerService.deleteMailer(mailer.id, data)
                    .subscribe(res => {
                        this.loadMailerList(1);
                        delete this.mailer;
                    }, res => {
                        // alertService.addAlert('danger', "Mailer update failure: " + res.data.error);
                    });
            }, res => { });
    }

    loadMailer(id) {
        this.mailerId = id;
        this.mailerService.getMailer(id)
        .subscribe(mailer=>{
            this.mailer = mailer;
        })

    }

    nl2br=(text)=>text?text.replace(/\n/g, "<br/>"):text;
    br2nl=(text)=>text?text.replace(/<br\s*[\/]?>/gi, "\n"):text;

}
