import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {

  @Input() dynamicForm: FormGroup;
  @Output() methods = new EventEmitter<any>();

  checkbox_data = {}
  formData = {}
  
  constructor() { }
  ngOnInit() {
  }

  onClick(btn_data,obj) {
    var method = btn_data.method
    if(btn_data.validate){
        let _data = {}
        var count = 0, size = 0;
        for (var i in obj.form.controls) {
            if (obj.form.controls[i].status == 'VALID') {
                _data[i] = obj.form.controls[i].value;
                count++
            }
            if (obj.form.controls.hasOwnProperty(i)) size++;
        }
        if (count == size) this.methods.emit({ method, _data })
    } else {
        let _data = btn_data.value;
        this.methods.emit({ method, _data })
    }
    
  }

  onChange(data: string, key: string, isChecked: boolean) {
    debugger;
    if (!this.checkbox_data[key]) this.checkbox_data[key] = []

    if (isChecked) this.checkbox_data[key].push(data);
    else this.checkbox_data[key].splice(this.checkbox_data[key].indexOf(data), 1);
  }

}
