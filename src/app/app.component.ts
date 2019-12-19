import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestApiService } from './rest-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'project4';

  @ViewChild('addUser', { static: false }) addUser: ElementRef;
  @ViewChild('addRole', { static: false }) addRole: ElementRef;
  @ViewChild('editUser', { static: false }) editUser: ElementRef;
  @ViewChild('deleteUser', { static: false }) deleteUser: ElementRef;

  constructor(private modalService: NgbModal, private service: RestApiService) { }

  ngOnInit() {
    let obj = JSON.stringify({
      $project: {
        "Name": {
          $concat: ["$firstname", " ", "$lastname"]
        },
        "Email": "$_email",
        "Role": "$role"
      }
    });
    this.service.get_data('user?condition=' + obj).subscribe((data: any[]) => {
      this.table_data.data = data;
    })
    this.service.get_data('role').subscribe((data: any[]) => {
      if(data.length > 0){
        for(let i in data){
          this.user_form_data.fields[3].options[data[i].name] = data[i].name
        }
      }
    })
  }

  role_form_data = {
    "button_main_class": "float-right",
    "buttons": [{
      "type": "submit",
      "class": "btn btn-primary",
      "method": "saveRole",
      "label": "Ok",
      "validate": true
    }, {
      "type": "click",
      "class": "btn btn-outline-secondary",
      "method": "cancelModal",
      "label": "Cancel",
      "value": "addRole"
    }],
    "fields": [{
      "id": "role",
      "name": "name",
      "label": "Role Name",
      "required": true,
      "placeholder": "Enter Role Name",
      "type": "text",
      "fieldType": "input",
      "message": "Role Name is required.",
      "class": "col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
    }]
  }

  user_form_data = {
    "button_main_class": "float-right",
    "buttons": [{
      "type": "submit",
      "class": "btn btn-primary",
      "method": "saveUser",
      "label": "Ok",
      "validate": true
    }, {
      "type": "click",
      "class": "btn btn-outline-secondary",
      "method": "cancelModal",
      "label": "Cancel",
      "value": "addUser"
    }],
    "fields": [{
      "id": "firstname",
      "name": "firstname",
      "label": "First Name",
      "required": true,
      "placeholder": "Enter your firstname",
      "type": "text",
      "fieldType": "input",
      "message": "First Name is required.",
      "class": "col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6"
    }, {
      "id": "lastname",
      "name": "lastname",
      "label": "Last Name",
      "required": true,
      "placeholder": "Enter your lastname",
      "type": "text",
      "fieldType": "input",
      "message": "Last Name is required.",
      "class": "col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6"
    }, {
      "id": "email",
      "name": "_email",
      "label": "Email",
      "required": true,
      "placeholder": "Enter your email",
      "type": "text",
      "fieldType": "input",
      "message": "Email is required.",
      "class": "col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
    }, {
      "fieldType": "select",
      "id": "role",
      "name": "role",
      "label": "Role",
      "placeholder": "Select the Role type",
      "required": true,
      "options": {},
      "type": "dropdown",
      "message": "Please select a Type.",
      "class": "col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12",
      "addNew": {
        "label": "Add a new Role",
        "icon": true,
        "method": "openModal",
        "value": "addRole"
      }
    }]
  }

  table_data = {
    "data": [],
    "headers": ['Name', 'Email', 'Role'],
    "class": "table-hover",
    "options": {
      "dropdown_option": ['Edit', 'Delete'],
      "Edit": {
        "method": "editMethod"
      },
      "Delete": {
        "method": "deleteMethod"
      }
    },
    "checkbox": "_id",
    "search": {
      "class": "col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9"
    },
    "bulk_actions": {

      "class": "col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3",
      "buttons": [{
        "icon": "add",
        "label": "Add user",
        "class": "btn-primary",
        "title": "Add",
        "method": "openModal",
        "value": "addUser"
      },{
        "icon": "delete",
        "label": "Delete users",
        "class": "ml-2 btn-danger",
        "title": "Delete user",
        "method": "deleteMethod",
        "value": "{{this.checkbox_data}}"
      }]
    },
    "pagination": {
      "itemsPerPage": 10,
      "currentPage": 1
    }
  }

  mainMethod($event) {
    this[$event.method]($event._data);
  }

  edit_user_form_data;
  modalRef = {}; //used for modal reference open and close
  deleteData = { _id: '' }; //used for deleting data
  user_id; //used for editing data

  openModal(modal) {
    this.modalRef[modal] = this.modalService.open(this[modal]);
  }

  cancelModal(modal) {
    if (modal == 'addUser') {
      for (var i in this.user_form_data.fields) {
        delete this.user_form_data.fields[i]['value'];
      }
    }
    else if (modal == 'editUser') {
      for (var i in this.edit_user_form_data.fields) {
        delete this.edit_user_form_data.fields[i]['value'];
      }
      this.user_form_data.buttons[0].method = "saveUser"
      this.user_form_data.buttons[1].value = "addUser"
    }
    this.modalRef[modal].close();
  }

  saveUser(data) {
    this.service.post_data('user', data).subscribe((response: any) => {
      if (response.result.ok) {
        let obj = {
          _id: response.ops[0]._id,
          Name: response.ops[0].firstname + ' ' + response.ops[0].lastname,
          Email: response.ops[0]._email,
          Role: response.ops[0].role
        }
        this.table_data.data.push(obj);
        for (var i in this.user_form_data.fields) {
          delete this.user_form_data.fields[i]['value'];
        }
        this.cancelModal('addUser');
      }
    })
  }

  saveRole(data) {
    this.service.post_data('role', data).subscribe((response: any) => {
      if (response.result.ok) {
        this.user_form_data.fields[3].options[response.ops[0].name] = response.ops[0].name
        this.cancelModal('addRole');
      }
    })
  }

  editMethod(data) {
    this.user_id = data._id
    let obj = JSON.stringify({ $match: { _id: this.user_id} })
    this.service.get_data('user?condition=' + obj).subscribe((response: any[]) => {
      this.edit_user_form_data = this.user_form_data
      for (var i in this.edit_user_form_data.fields) {
        this.edit_user_form_data.fields[i].value = response[0][this.edit_user_form_data.fields[i].name]
      }
      this.edit_user_form_data.buttons[0].method = 'editUserMethod';
      this.edit_user_form_data.buttons[1].value = 'editUser';
      this.openModal('editUser');
    })
  }

  editUserMethod(data) {
    this.service.put_data('user?_id=' + this.user_id, data).subscribe((response: any) => {
      if (response.ok) {
        let index = this.table_data.data.findIndex(item => item._id == this.user_id);
        let obj = {
          _id: this.user_id,
          Name: data.firstname + ' ' + data.lastname,
          Email: data._email,
          Role: data.role
        }
        this.table_data.data[index] = obj;
        for (var i in this.edit_user_form_data.fields) {
          delete this.edit_user_form_data.fields[i]['value'];
        }
        this.user_form_data.buttons[0].method = "saveUser"
        this.user_form_data.buttons[1].value = "addUser"
        this.cancelModal('editUser');
      }
    });
  }

  deleteMethod(data) {
    this.deleteData = data;
    this.openModal('deleteUser');
  }

  deleteUserMethod(type) {
    console.log(type);
    if (type == 'ok' && this.deleteData) {
      this.service.delete_data('user?_id=' + this.deleteData._id).subscribe((response: any) => {
        if (response.ok) {
          this.table_data.data.splice(this.table_data.data.findIndex(item => item._id == this.deleteData._id), 1);
          if (this.table_data.data.findIndex(item => item._id == this.deleteData._id) == -1) {
            this.cancelModal('deleteUser');
            this.deleteData = { _id: '' }
          }
        }
      })

    }
    else if (type == 'cancel') {
      this.cancelModal('deleteUser');
      this.deleteData = { _id: '' }
    }
  }

}
