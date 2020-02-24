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
import { FormService } from '../../service/form.service';
import { NgbModal, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { HttpParams } from '@angular/common/http';
import { LookupService } from '../../service/lookup.service';
import { UserService } from '../../_shared/service/user.service';
import { ActivatedRoute, Params } from '@angular/router';
import { AppService } from '../../service/app.service';
import { MailerService } from '../../service/mailer.service';
import { PlatformLocation } from '@angular/common';
import { NgbUnixTimestampAdapter } from 'src/app/_shared/service/date-adapter';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['../../../assets/css/side-menu.css','../../../assets/css/tile.css', './editor.component.css'],
    providers: [{ provide: NgbDateAdapter, useClass: NgbUnixTimestampAdapter }]
})
export class EditorComponent implements OnInit {

    formTotal: number = 0;
    formList: any;
    user: any;
    editTierItems: { sections: any; };
    items: any;
    lookupList: any;
    mailerList: any;
    curForm: any;
    prevForm: any;
    curFormId: any;
    formSearchText: string = "";
    data: any;
    formPageSize: number = 8;
    searchText: string = "";
    formPageNo: number = 1;
    element:any;

    sizeList: any[] = [
        { name: "100%", value: "col-sm-12" },
        { name: "67%", value: "col-sm-8" },
        { name: "58%", value: "col-sm-7" },
        { name: "50%", value: "col-sm-6" },
        { name: "42%", value: "col-sm-5" },
        { name: "33%", value: "col-sm-4" }
    ]
    heightList: any[] = [
        { name: "1w x 1h", value: "100" },
        { name: "2w x 1h", value: "50" },
        { name: "1w x 2h", value: "200" },
        { name: "3w x 1h", value: "33" },
        { name: "1h x 3w", value: "300" }
    ]

    typeList: any[] = [
        { name: "Simple Text", value: "text", type:['db','rest'] },
        { name: "Number", value: "number", type:['db','rest'] },
        { name: "Date", value: "date", type:['db','rest'] },
        { name: "Long Text", value: "textarea", type:['db','rest'] },
        { name: "Select Dropdown", value: "select",type:['db'] },
        { name: "Radio Option", value: "radio",type:['db'] },
        { name: "Checkbox", value: "checkbox",type:['db'] },
        { name: "Scale 1-5", value: "scaleTo5",type:['db'] },
        { name: "Scale 1-10", value: "scaleTo10",type:['db'] },
        { name: "File Upload", value: "file",type:['db'] },
        { name: "Image Preview", value: "imagePreview",type:['db','rest'] },
        { name: "Evaluated Field", value: "eval",type:['db','rest'] },
        { name: "Static Element", value: "static",type:['db','rest'] },
        { name: "QR Scanner", value: "qr",type:['db','rest'] }
        // { name: "Tab Set", value: "tabset",type:['db','rest'] },
        // { name: "Panel", value: "panel",type:['db','rest'] }
    ];
    subType:any={
        date:[
            {name:'Date (Normal)',code:'date'},
            {name:'Month',code:'month'},
            {name:'Year',code:'year'}
        ],
        file:[
            {name:'Image',code:'image'},
            {name:'Other',code:'other'}
        ],
        eval:[
            {name:'Text',code:'text'},
            {name:'QR Code',code:'qr'}
        ],
        static:[{name:'HTML Text',code:'html'},{name:'Clearfix',code:'clearfix'}]
    }

    scaleTo10 = ['1', '2', '..', '9', '10'];
    scaleTo5 = ['1', '2', '3', '4', '5'];

    filterItem = (list,type) => list.filter(e=> e.type.indexOf(type)>-1);
    filterPlottable = (list) => list.filter(e => ['select', 'radio'].indexOf(e.type) > -1)
    formLoading: boolean;
    curFormColumns: any[];


    constructor(private formService: FormService, private lookupService: LookupService,
        private mailerService: MailerService,
        private modalService: NgbModal, private userService: UserService,
        private route: ActivatedRoute, private appService: AppService,
        private location: PlatformLocation) {
        location.onPopState(() => this.modalService.dismissAll(''));
    }

    ngOnInit() {

        this.userService.getUser().subscribe((user) => {

            this.user = user;

            this.route.params
                // NOTE: I do not use switchMap here, but subscribe directly
                .subscribe((params: Params) => {

                    const appId = params['id'];
                    if (appId) {
                        let params = new HttpParams()
                            .set("email", user.email);

                        this.appService.getApp(appId, params)
                            .subscribe(res => {
                                this.data = res;
                                this.getFormList(1);
                                this.getLookupList();
                                this.getCopyRequestList();
                            });

                        
                    }


                });

            this.route.queryParams
                .subscribe((params: Params) => {

                    const fId = params['fId'];
                    if (fId) {
                        this.getFormData(fId);
                    }
                })

            this.getMailerList();


        });
    }


    getLookupList() {
        let params = new HttpParams()
            .set("email", this.user.email);

        this.lookupService.getFullLookupList(params)
            .subscribe(res => {
                this.lookupList = res.content;
            })

    }

    getMailerList() {
        let params = new HttpParams()
            .set("email", this.user.email);

        this.mailerService.getMailerList(params)
            .subscribe(res => {
                this.mailerList = res.content;
            })

    }

    itemExist = (f) => this.curForm.items[f.code] && !f.id;

    popShare(id) {
        let url = this.data.appPath ? this.data.appPath + '.' + window.location.host : window.location.host + "/x/ia/#/run/" + id;
        prompt('App URL (Press Ctrl+C to copy)', url);
    }

    getSectionItems(form,types: any[]) {
        let items = [];
        form.sections.filter(s => types.indexOf(s.type) > -1)
            .forEach(element => {
                items = items.concat(element.items);
            });
            // console.log(items);
        return items;
    }


    getFormList(pageNumber) {
        this.formPageNo = pageNumber;
        this.formLoading = true;

        let params = new HttpParams()
            .set("appId", this.data.id)
            .set("size", this.formPageSize.toString())
            .set("page", (pageNumber - 1).toString())
            .set("searchText", this.formSearchText);

        this.formService.getListBasic(params)
            .subscribe(res => {
                this.formList = res.content;
                this.formTotal = res.totalElements;
                this.formLoading = false;
            }, res => this.formLoading = false);
    }


    getHiddenList = (list) => list.filter(i => i.hidden == true);

    getFormData(id) {
        this.curFormId = id;
        this.formService.getForm(id)
            .subscribe(res => {
                this.curForm = res;
                this.getLookupIdList(this.curForm.id);
                if (this.curForm.prev){
                    this.formService.getForm(this.curForm.prev)
                    .subscribe(res=>{
                        this.prevForm = res;
                    })
                }else{
                    this.prevForm = null;
                }
                if (this.curForm.type=='rest'){
                    this.getFormColumns(id);
                }else{
                    this.curFormColumns = [];
                }
            })
    }

    getFormColumns(id){
        this.formService.getFormColumns(id)
        .subscribe(res=>{
            this.curFormColumns = res;
        })
    }

    toggleItem(parent, list, f, root, formId) {
        // if (parent[list]){
        //     parent[list]=[];
        // }
        var size = parent[list].filter(i => i.code == f.code).length;

        // console.log(parent[list]);

        // Is currently selected
        if (size > 0) {
            // console.log(parent[list].filter(i => i.code != f.code));
            parent[list] = parent[list].filter(i => i.code != f.code)
        } else {
            // delete f.id;
            parent[list].push({
                code: f.code,
                label: f.label,
                sortOrder: parent[list].length,
                root:root,
                formId: formId
            });
        }
    }

    checkItem(list, f) {
        // console.log(f);
        return list.filter(i => f.code == i.code).length > 0;
    }


    toggleNext(parent,next, id, text){
        if (!parent[next]){
            parent[next] = {};
        }
        if (parent[next][id]){
            delete parent[next][id]
        }else{            
            parent[next][id]=text;
        }
    }

    exceptCurForm=()=>this.formList.filter(f=>f.id!=this.curForm.id);

    checkNext(next,id){
        return next && next[id];
    }

    updateDatasetStatus(data){
        data.status = this.editDatasetStatusList;
        // this.editDatasetStatusList.push(h);
    }

    editDatasetData: any;
    editDatasetStatusList:any={};
    editDataset(content, data, isNew) {
        if (this.curForm.type=='rest'){
            data['type']='all';
        }
        if (isNew) {
            // data['fields'] = [];
            data['items'] = [];
            data['filters'] = [];
            data['next'] = {};
            data['status'] = "";
        }
        this.editDatasetData = data;

        var splitted = data.status?data.status.split(","):[];
        this.editDatasetStatusList = [];
        splitted.forEach(element => {
            this.editDatasetStatusList[element]=true;
        });

        // this.editDatasetData['type'] = key;
        // this.loadItems()
        // .subscribe(res => {
        // var items = {items:this.items,toggleItem:this.toggleItem,checkItem:this.checkItem};
        history.pushState(null, null, window.location.href);
        this.modalService.open(content)
            .result.then((rItem) => {

                var statusArrays = [];
                for (var k in this.editDatasetStatusList){
                    if (this.editDatasetStatusList[k]===true){
                        statusArrays.push(k);
                    }
                }
                rItem.status=statusArrays.join(",");


                this.formService.saveDataset(this.curForm.id, rItem)
                    .subscribe((res) => {
                        this.getFormList(this.formPageNo);
                        this.getFormData(this.curForm.id);
                    });
            }, res => { });
        // })

    }

    removeDatasetData: any;
    removeDataset(content, data, key) {
        this.removeDatasetData = data;
        history.pushState(null, null, window.location.href);
        this.modalService.open(content)
            .result.then(data => {
                this.formService.removeDataset(data.id, key)
                    .subscribe(res => {
                        this.getFormData(this.curForm.id);
                    }, res => {
                        // alertService.addAlert('danger', "Report Form removal failure: " + res.data.error);
                    });
            }, res => { });
    }
    removeDsItem(ds){
        this.formService.removeDatasetItem(ds.id, null)
        .subscribe(data => {
            this.getFormData(this.curForm.id);
        })
    }


    chartTypeList = [
        { code: 'pie', name: 'Pie', parent: 'chart', icon: ['fas', 'chart-pie'] },
        { code: 'doughnut', name: 'Doughnut', parent: 'chart', icon: ['far', 'circle'] },
        { code: 'bar', name: 'Vertical Bar', parent: 'chart', icon: ['fas', 'chart-bar'] },
        { code: 'line', name: 'Line', parent: 'chart', icon: ['fas', 'chart-line'] },
        { code: 'area', name: 'Area', parent: 'chart', icon: ['fas', 'chart-area'] }
    ]

    aggType = [
        { code: 'sum', name: "Sum" },
        { code: 'count', name: "Count" },
        { code: 'avg', name: "Average" },
        { code: 'max', name: "Max" },
        { code: 'min', name: "Min" }
    ]

    lookupIds = [];
    lookupKey = {};
    lookup = {};
    mod = {};

    getLookupIdList(id) {
        this.lookupService.getInForm(id)
            .subscribe(res => {
                this.lookupIds = res;
                this.lookupIds.forEach(key => {
                    this.lookupKey[key.code] = key.dataSource;
                    this.getLookup(key.code, key.dataSourceInit ? this.parseJson(key.dataSourceInit) : null);
                });
            });
    }

    parseJson(str){
        var g = {};
        try{ g = JSON.parse(str)}catch(e){};
        return g;
    }

    getLookup = (code, params?: any) => {
        if (code) {
            this.lookupService.getByKey(this.lookupKey[code], params)
                .subscribe(res => {
                    this.lookup[code] = res.content;
                })
        }
    }

    editChartData: any;
    editChartStatusList:any={};
    editChart(content, dashboardId, data, isNew) {
        this.editChartData = data;


        var splitted = data.status?data.status.split(","):[];
        this.editChartStatusList = [];
        splitted.forEach(element => {
            this.editChartStatusList[element]=true;
        });

        history.pushState(null, null, window.location.href);
        this.modalService.open(content)
            .result.then(ch => {

                var statusArrays = [];
                for (var k in this.editChartStatusList){
                    if (this.editChartStatusList[k]===true){
                        statusArrays.push(k);
                    }
                }
                ch.status=statusArrays.join(",");


                this.formService.saveChart(dashboardId, ch)
                    .subscribe((res) => {
                        this.getFormData(this.curForm.id);
                    });
            }, res => { });
    }

    removeChartData: any;
    removeChart(content, data) {
        this.removeChartData = data;
        history.pushState(null, null, window.location.href);
        this.modalService.open(content)
            .result.then(data => {
                this.formService.removeChart(data.id)
                    .subscribe(res => {
                        this.getFormData(this.curForm.id);
                    }, res => {
                        // alertService.addAlert('danger', "Report Form removal failure: " + res.data.error);
                    });
            }, res => { });
    }

    editFormData: any;
    editForm(content, data, isNew) {
        this.editFormData = data;
        var items = {};
        history.pushState(null, null, window.location.href);
        this.modalService.open(content)
            .result.then(rItem => {
                this.formService.saveForm(this.data.id, rItem)
                    .subscribe(res => {
                        this.getFormList(this.formPageNo);
                        this.getFormData(res.id);
                    });
            }, res => { });
    }

    removeFormData: any;
    removeForm(content, data) {
        this.removeFormData = data;
        history.pushState(null, null, window.location.href);
        this.modalService.open(content)
            .result.then(data => {
                this.formService.removeForm(data)

                    .subscribe(res => {
                        this.getFormList(1);
                        delete this.curForm;
                    }, res => {
                        // alertService.addAlert('danger', "Report Form removal failure: " + res.data.error);
                    });
            }, res => { });
    }

    editItemData: any;
    editItem(content, sectionId, data, sortOrder, isNew) {
        if (!data.v) {
            data['v'] = {};
        }
        this.editItemData = data;
        // var items = {sizeList:this.sizeList, typeList:this.typeList, lookupList: this.lookupList , toSnakeCase: toSnakeCase};
        history.pushState(null, null, window.location.href);
        this.modalService.open(content)
            .result.then(rItem => {
                this.formService.saveItem(this.curForm.id, sectionId, rItem, sortOrder)
                    .subscribe(res => {
                        this.getFormData(this.curForm.id);
                        this.getLookupIdList(this.curForm.id);
                    });
            }, res => { });
    }

    editTierData: any;
    editTier(content, data, isNew) {
        this.editTierData = data;
        this.editTierItems = { sections: this.curForm.sections.filter(function (res) { return res.type == 'approval' }) };
        history.pushState(null, null, window.location.href);
        this.modalService.open(content)
            .result.then(rItem => {
                this.formService.saveTier(this.curForm.id, rItem)
                    .subscribe((res) => {
                        this.getFormData(this.curForm.id);
                    });
            }, res => { });
    }
    clearTier(tier) {
        // delete tier.approver;
    }

    removeTierData: any;
    removeTier(content, tier) {
        this.removeTierData = tier;
        history.pushState(null, null, window.location.href);
        this.modalService.open(content)
            .result.then(rItem => {
                this.formService.removeTier(tier.id)
                    .subscribe((res) => {
                        this.getFormData(this.curForm.id);
                    });
            }, res => { });
    }

    reorderTier(index, op) {
        this.reorder(this.curForm.tiers, index, op);
        this.saveTierOrder()
    }

    reorderChart(dashboard, index, op) {
        this.reorder(dashboard.charts, index, op);
        this.saveChartOrder(dashboard);
    }

    editDashboardData: any;
    editDashboard(content, data, isNew) {
        this.editDashboardData = data;
        // var items = {sizeList: this.sizeList, toSnakeCase: toSnakeCase};
        history.pushState(null, null, window.location.href);
        this.modalService.open(content)
            .result.then(dashboard => {
                this.formService.saveDashboard(this.curForm.id, dashboard)
                    .subscribe(res => {
                        this.getDashboardList(1)
                    });
            }, res => { });
    }
    
    removeDashboardData: any;
    removeDashboard(content, data) {
        this.removeDashboardData = data;
        history.pushState(null, null, window.location.href);
        this.modalService.open(content)
            .result.then(data => {
                this.formService.removeDashboard(data.id,null)
                    .subscribe(res => {
                        this.getFormData(this.curForm.id);
                    }, res => {
                        // alertService.addAlert('danger', "Report Form removal failure: " + res.data.error);
                    });
            }, res => { });
    }

    getDashboardList(pageNumber) {
        this.formService.getDashboardList(this.curForm.id, pageNumber)
            .subscribe(res => {
                this.curForm.dashboards = res.content;
            })
    }


    saveChartOrder(dashboard) {
        var list = dashboard.charts
            .map((val) => {
                return { id: val.id, sortOrder: val.sortOrder }
            });
        return this.formService.saveChartOrder(list)
            .subscribe((res) => {
                return res;
            });
    }

    saveTierOrder() {
        var list = this.curForm.tiers
            .map((val) => {
                return { id: val.id, sortOrder: val.sortOrder }
            });
        return this.formService.saveTierOrder(list)
            .subscribe((res) => {
                return res;
            });
    }

    removeItemData: any;
    removeItem(content, data) {
        this.removeItemData = data;
        history.pushState(null, null, window.location.href);
        this.modalService.open(content)
            .result.then(rItem => {
                this.formService.removeItem(this.curForm.id, rItem.id)
                    .subscribe(res => {
                        // this.getSectionList(1);
                        this.getFormData(this.curForm.id)
                    }, res => {
                        // alertService.addAlert('danger', "Report item removal failure: " + res.data.error);
                    });
            }, res => { });
    }

    removeItemSource(formId, id) {
        this.formService.removeItemSource(formId, id)
            .subscribe(res => this.getFormData(this.curForm.id))
    }

    reorderItem(section, index, op) {
        // console.log(section.items);
        this.reorder(section.items, index, op);
        this.saveItemOrder(section);
    }
    reorderDs(ds, index, op) {
        this.reorder(ds.items, index, op);
        this.saveDsOrder(ds);
    }

    getTab = (id) => this.curForm.tabs.filter(e => e.id == id)[0];

    saveDsOrder(ds) {
        var list = ds.items
            .map(function (val) {
                return { id: val.id, sortOrder: val.sortOrder }
            });
        return this.formService.saveDsOrder(list)
            .subscribe((res) => {
                return res;
            });
    }

    saveItemOrder(section) {
        var list = section.items
            .map((val) => {
                return { id: val.id, sortOrder: val.sortOrder }
            });
        return this.formService.saveItemOrder(list)
            .subscribe(res => {
                return res;
            });
    }

    // getSectionList(pageNumber) {
    //     this.formService.getSectionList(this.curForm.id, pageNumber)
    //         .subscribe(res => {
    //             this.curForm.sections = res.content;
    //         })
    // }

    getTabList(pageNumber) {
        this.formService.getTabList(this.curForm.id, pageNumber)
            .subscribe(res => {
                this.curForm.tabs = res.content;
            })
    }

    editSectionData: any;
    editSection(content, data, isNew) {
        this.editSectionData = data;
        // var items = {sizeList: this.sizeList, toSnakeCase: toSnakeCase};
        history.pushState(null, null, window.location.href);
        this.modalService.open(content)
            .result.then(section => {
                this.formService.saveSection(this.curForm.id, section)
                    .subscribe(res => {
                        this.getFormData(this.curForm.id)
                        // this.getSectionList(1)
                    });
            }, res => { });
    }

    viewItems(content) {
        history.pushState(null, null, window.location.href);
        this.modalService.open(content)
            .result.then(res => { });
    }

    removeSectionData: any;
    removeSection(content, data) {
        this.removeSectionData = data;
        history.pushState(null, null, window.location.href);
        this.modalService.open(content)
            .result.then((data) => {
                this.formService.removeSection(data.id)
                    .subscribe(res => {
                        this.getFormData(this.curForm.id);
                        // this.getSectionList(1);
                        //alertService.addAlert("success", "Section successfully removed");
                    }, (res) => {
                        // alertService.addAlert('danger', "Section removal failure: " + res.data.error);
                    });
            }, res => { });
    }

    reorderSection(list, index, op) {
        this.reorder(list, index, op);
        this.saveSectionOrder()
    }

    saveSectionOrder() {
        var list = this.curForm.sections
            .map(function (val) {
                return { id: val.id, sortOrder: val.sortOrder }
            });
        return this.formService.saveSectionOrder(list)
            .subscribe((res) => {
                return res;
            });
    }

    trackByFn = (index, item) => index;

    editTabData: any;
    editTab(content, data, isNew) {
        this.editTabData = data;
        history.pushState(null, null, window.location.href);
        this.modalService.open(content)
            .result.then(tab => {
                this.formService.saveTab(this.curForm.id, tab)
                    .subscribe(res => {
                        this.getTabList(1)
                    });
            }, res => { });
    }

    removeTabData: any;
    removeTab(content, data) {
        this.removeTabData = data;
        history.pushState(null, null, window.location.href);
        this.modalService.open(content)
            .result.then((data) => {
                this.formService.removeTab(data.id)

                    .subscribe(res => {
                        this.getTabList(1);
                    }, (res) => {
                    });
            }, res => { });
    }

    reorderTab(index, op) {
        this.reorder(this.curForm.tabs, index, op);
        this.saveTabOrder()
    }

    saveTabOrder() {
        var list = this.curForm.tabs
            .map(function (val) {
                return { id: val.id, sortOrder: val.sortOrder }
            });
        return this.formService.saveTabOrder(list)
            .subscribe((res) => {
                return res;
            });
    }


    
    editScreenData: any;
    editScreen(content, data, isNew) {
        this.editScreenData = data;
        history.pushState(null, null, window.location.href);
        this.modalService.open(content)
            .result.then(screen => {
                this.formService.saveScreen(this.curForm.id, screen)
                    .subscribe(res => {
                        this.getScreenList(1)
                    });
            }, res => { });
    }

    removeScreenData: any;
    removeScreen(content, data) {
        this.removeScreenData = data;
        history.pushState(null, null, window.location.href);
        this.modalService.open(content)
            .result.then((data) => {
                this.formService.removeScreen(data.id)

                    .subscribe(res => {
                        this.getScreenList(1);
                    }, (res) => {
                    });
            }, res => { });
    }

    getScreenList(pageNumber) {
        this.formService.getScreenList(this.curForm.id, pageNumber)
            .subscribe(res => {
                this.curForm.screens = res.content;
            })
    }

    addScreenAction(list,action){
        if (list['actions']==null){
            list['actions'] = [];
        }
        console.log(action);
        list['actions'].push(action);
        // action = {};
    }



    getCode = (id) => encodeURI(btoa(id));

    getAsList = (str) => str&&str.split(',');

    reorder(items, index, op) {
        items[index + op].altClass = 'swapStart';
        items[index].altClass = 'swapStart';
        var temp = items[index + op];
        var tempSortOrder = items[index + op].sortOrder;
        items[index + op].sortOrder = items[index].sortOrder;
        items[index + op] = items[index];

        items[index].sortOrder = tempSortOrder;
        items[index] = temp;
        setTimeout(() => {
            items[index + op].altClass = 'swapEnd';
            items[index].altClass = 'swapEnd';
        }, 1000);
    }

    toSpaceCase = (string) => string.replace(/[\W_]+(.|$)/g, (matches, match) => match ? ' ' + match : '').trim();

    toSnakeCase = (string) => string ? this.toSpaceCase(string).replace(/\s/g, '_').toLowerCase() : '';


    addIndex(list, att) {
        delete att.id;
        list.push(att);
    }
    checkIndex = (list, code) => list.filter(i => i.code == code)[0];

    removeIndex(parent, list, code) {
        parent[list] = parent[list].filter(el => {
            return el.code !== code;
        })
    }

    copyRequestList:any=[];
    getCopyRequestList(){
        this.appService.getCopyRequestList(this.data.id)
        .subscribe(res=>{
            this.copyRequestList = res.content;
        })
    }

    viewCopyRequest(content) {
        history.pushState(null, null, window.location.href);
        this.modalService.open(content)
            .result.then(res => { });
    }
    activateCp(id, action) {
        this.appService.activateCp(id, action)
        .subscribe(res=>{
            this.getCopyRequestList();
        })
    }


}
