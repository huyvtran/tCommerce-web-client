import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../shared/services/user/user.service';
import { HttpClient } from '@angular/common/http';
import { inputMediaAcceptTypes } from '../shared/constants';
import { MediaDto } from '../shared/dtos/media.dto';

enum EAddReviewFormControl {
  Name = 'name',
  Text = 'text',
  Email = 'email',
  Rating = 'rating'
}

export interface IAddReviewFormValue {
  name: string;
  text: string;
  email: string;
  rating: number;
  medias: MediaDto[];
}

@Component({
  selector: 'add-review-modal',
  templateUrl: './add-review-modal.component.html',
  styleUrls: ['./add-review-modal.component.scss']
})
export class AddReviewModalComponent implements OnInit {

  isModalVisible: boolean = false;
  form: FormGroup;
  controlNames = EAddReviewFormControl;
  medias: MediaDto[] = [];
  private unlisten: () => void;

  @Input() uploadUrl: string;
  @Output() addReview = new EventEmitter<IAddReviewFormValue>();

  constructor(private formBuilder: FormBuilder,
              private renderer: Renderer2,
              private http: HttpClient,
              private userService: UserService) { }

  ngOnInit(): void {
    if (!this.uploadUrl) {
      throw new Error(`Input property 'uploadUrl' is mandatory`);
    }

    this.buildForm();
  }

  openModal() {
    this.isModalVisible = true;
    this.unlisten = this.renderer.listen('window', 'keyup', event => this.onKeyPress(event));
  }

  closeModal() {
    if (this.unlisten) { this.unlisten(); }
    this.isModalVisible = false;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      [EAddReviewFormControl.Name]: this.userService.getName(),
      [EAddReviewFormControl.Text]: '',
      [EAddReviewFormControl.Email]: this.userService.getEmail(),
      [EAddReviewFormControl.Rating]: 5
    });
  }

  private onKeyPress(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
        this.closeModal();
        break;
    }
  }

  onSubmit() {
    const formValue = this.form.value;

    this.addReview.emit({
      ...formValue,
      medias: this.medias
    });
  }

  uploadPhotos() {
    const fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('accept', inputMediaAcceptTypes);
    fileInput.click();

    fileInput.addEventListener('change', () => {
      const file = fileInput.files && fileInput.files.item(0);
      if (!file) { return; }

      const payload = new FormData();
      payload.append('file', file, file.name);

      this.http.post<MediaDto>(this.uploadUrl, payload)
        .subscribe(
          media => {
            this.medias.push(media);
          },
          error => console.warn(error)
        );
    });
  }

  removeMedia(idx: number) {
    this.medias.splice(idx, 1);
  }
}
