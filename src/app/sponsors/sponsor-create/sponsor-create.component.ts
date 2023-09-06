import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { SponsorService } from 'src/app/services/sponsor.service';
import { ISponsor } from 'src/app/models/sponsor';

@Component({
  selector: 'app-sponsor-create',
  templateUrl: './sponsor-create.component.html',
  styleUrls: ['./sponsor-create.component.scss']
})
export class SponsorCreateComponent {
  auth: AngularFireAuth = inject(AngularFireAuth)
  storage = inject(AngularFireStorage);
  sponsorService = inject(SponsorService);
  bottomSheetRef: MatBottomSheetRef<SponsorCreateComponent> = inject(MatBottomSheetRef<SponsorCreateComponent>);
  fb = inject(FormBuilder);

  form: FormGroup<CreateSponsor>;
  loading = false;
  hasLogo = false;
  imageChanged = false;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data?: { sponsor?: ISponsor }) {
    this.form = new SponsorCreator(this.fb).createForm(data?.sponsor);
  }

  get logo() { return this.form.value.logoUrl ?? ''; }
  get title() { return this.form.value.name ?? ''; }

  async publish() {
    this.loading = true;
    if (this.imageChanged) {
      // const user = await firstValueFrom(this.auth.authState);
      // if (user) {
      const refStorage = this.storage.ref(`images/sponsors/${this.title}`);
      const task = await refStorage.putString(this.logo, 'data_url', { contentType: 'image/png' });
      const url = await task.ref.getDownloadURL();
      this.logoUrlControl?.setValue(url);
      // }
    }
    const data: any = {
      name: this.form.value?.name ?? '',
      logoUrl: this.form.value?.logoUrl ?? '',
      priority: this.form.value?.priority ?? 0,
      website: this.form.value?.website ?? ''
    };
    if (this.data?.sponsor?.id) {
      data['id'] = this.data?.sponsor?.id;
    }
    await this.sponsorService.add(data);
    this.loading = false;
    this.close();
  }

  onLoad(base64String: string) {
    this.imageChanged = true;
    this.hasLogo = base64String.length > 0;
    this.logoUrlControl?.setValue(base64String);
  }

  get logoUrlControl() {
    return this.form.get('logoUrl');
  }

  close() {
    this.bottomSheetRef.dismiss();
  }

}


class SponsorCreator {
  constructor(private fb: FormBuilder) { }

  createForm(sponsor?: ISponsor): FormGroup<CreateSponsor> {
    const frm = this.fb.group<CreateSponsor>({
      name: new FormControl(sponsor?.name ?? '', { validators: [Validators.required], nonNullable: true }),
      logoUrl: new FormControl(sponsor?.logoUrl ?? '', { validators: [Validators.required], nonNullable: true }),
      priority: new FormControl(sponsor?.priority ?? 0, { validators: [Validators.required], nonNullable: true }),
      website: new FormControl(sponsor?.website ?? '', { nonNullable: false })
    });

    return frm
  }
}

export interface CreateSponsor {
  name: FormControl<string>;
  logoUrl: FormControl<string>;
  priority: FormControl<number>;
  website?: FormControl<string | null>;
}