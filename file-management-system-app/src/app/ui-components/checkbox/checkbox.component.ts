import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'fms-checkbox',
  host: {
    "class": "checkbox"
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true
  }],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() id: string = crypto.randomUUID();
  @Input() name: string = "";
  @Input() placeholder: string = "";
  @Input() disabled: boolean = false;

  _checked: boolean = false;
  @Input()
  get checked() {
    return this._checked;
  }
  set checked(val: boolean) {
    this._checked = val;
    this.onChange(val);
  }
  onChange(val: boolean) { }
  _onChange(target: EventTarget | null) { 
    this.onChange((<HTMLInputElement>target).checked);
  }

  onTouch() { }

  writeValue(obj: any): void {
    this.checked = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
