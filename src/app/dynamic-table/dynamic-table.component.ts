import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css']
})
export class DynamicTableComponent implements OnInit {

  search = '';

  @Input() table_data;
  @Output() methods = new EventEmitter();

  checkbox_data;

  checkbox_toggle(data) {
    if (this.checkbox_data.includes(data)) {
      this.checkbox_data.splice(this.checkbox_data.indexOf(data), 1);
    } else {
      this.checkbox_data.push(data);
    }
    console.log(this.checkbox_data);
  }

  onClick(data) {
    console.log(data);
    if (data.method) {
      //if(data.value.includes('{{') && data.value.includes('}}')) data.value = eval(data.value)
      let _data = data.value;
      let method = data.method
      this.methods.emit({ method , _data })
    }
    else if (data.url) {
      window.location.href = data.url
    }
  }

  select_current_all: boolean = false;

  selectAll(event) {
    console.log(event)
    this.checkbox_data = [];
    if (this.select_current_all) {
      for (var i = (this.table_data.pagination.itemsPerPage) * (this.table_data.pagination.currentPage - 1); i < (this.table_data.pagination.itemsPerPage) * (this.table_data.pagination.currentPage); i++) {
        this.table_data.data[i].checked = false
      }
    } else {
      for (var i = (this.table_data.pagination.itemsPerPage) * (this.table_data.pagination.currentPage - 1); i < (this.table_data.pagination.itemsPerPage) * (this.table_data.pagination.currentPage) && i < this.table_data.data.length ; i++) {
        if (!this.checkbox_data.includes(this.table_data.data[i][this.table_data.checkbox]) && !this.table_data.data[i].checked) {
          this.checkbox_data.push(this.table_data.data[i][this.table_data.checkbox]);
          this.table_data.data[i].checked = true
        }
      }
    }
    console.log(this.checkbox_data);
    let obj = {
      _id : this.checkbox_data.toString()
    }
    this.checkbox_data = obj;
  }

  pageChanged(event) {
    this.table_data.pagination.currentPage = event;
    this.checkbox_data = [];
    this.search = '';
    this.select_current_all = false;
    for (var i = (this.table_data.pagination.itemsPerPage) * (this.table_data.pagination.currentPage - 2); i < (this.table_data.pagination.itemsPerPage) * (this.table_data.pagination.currentPage - 1); i++) {
      this.table_data.data[i].checked = false
    }
  }

  constructor() { }

  ngOnInit() {
  }

}
