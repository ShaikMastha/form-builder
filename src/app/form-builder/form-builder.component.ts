import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.css']
})
export class FormBuilderComponent implements OnInit {
  form: FormGroup;
  submittedData: any;
  editMode: boolean[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      questions: this.fb.array([])
    });
  }

  ngOnInit(): void {}

  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }

  addQuestion(): void {
    const questionGroup = this.fb.group({
      questionText: ['', Validators.required],
      questionType: ['text', Validators.required],
      options: this.fb.array([]),
      answer: ['']
    });
    this.questions.push(questionGroup);
    this.editMode.push(false);
  }

  getOptions(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  addOption(questionIndex: number): void {
    const optionControl = this.fb.group({
      optionText: ['', Validators.required]
    });
    this.getOptions(questionIndex).push(optionControl);
  }

  removeOption(questionIndex: number, optionIndex: number): void {
    this.getOptions(questionIndex).removeAt(optionIndex);
  }

  removeQuestion(questionIndex: number): void {
    this.questions.removeAt(questionIndex);
    this.editMode.splice(questionIndex, 1);
  }

  submitForm(): void {
    if (this.form.valid) {
      this.submittedData = this.form.value;
      this.editMode = Array(this.submittedData.questions.length).fill(false);
    }
  }

  enableEdit(index: number): void {
    this.editMode[index] = true;
  }

  saveChanges(index: number): void {
    this.editMode[index] = false;
    this.submittedData.questions[index] = { ...this.form.value.questions[index] };
  }

  deleteQuestion(index: number): void {
    this.submittedData.questions.splice(index, 1);
    this.editMode.splice(index, 1);
  }
}
