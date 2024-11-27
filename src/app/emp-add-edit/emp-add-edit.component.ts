import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-emp-add-edit',
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.scss'],
})
export class EmpAddEditComponent implements OnInit {
  empForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFileName: string = 'No file chosen';

  category: string[] = ['Saree', 'Chudi', 'Jewell', 'Kids', 'Nighty'];

  constructor(
    private _fb: FormBuilder,
    private _empService: EmployeeService,
    private _dialogRef: MatDialogRef<EmpAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService
  ) {
    this.empForm = this._fb.group({
      product: '',
      description: '',
      longdescription: '',
      image: '',
      category: '',
      price: '',
      stock: '',
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.empForm.patchValue(this.data);
    }
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.selectedFileName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result; // Preview the image
        this.empForm.patchValue({
          image: reader.result, // Add Base64 string to the form
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onFormSubmit() {
    if (this.empForm.valid) {
      console.log('Form Data:', this.empForm.value); // Debugging

      this._empService.addEmployee(this.empForm.value).subscribe({
        next: (val: any) => {
          alert('Employee added successfully');
          this._dialogRef.close();
        },
        error: (err: any) => {
          console.error(err);
        },
      });
    }
  }

  onCancel(): void {
    this._dialogRef.close();
  }
}
