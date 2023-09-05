import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ISponsor } from 'src/app/models/sponsor';
import { StandingsViewComponent } from '../../standings-view/standings-view.component';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { firstValueFrom } from 'rxjs';
import { SponsorService } from 'src/app/services/sponsor.service';

@Component({
  selector: 'app-sponsor-create',
  templateUrl: './sponsor-create.component.html',
  styleUrls: ['./sponsor-create.component.scss']
})
export class SponsorCreateComponent {
  auth: AngularFireAuth = inject(AngularFireAuth)
  storage = inject(AngularFireStorage);
  sponsorService = inject(SponsorService);
  bottomSheetRef: MatBottomSheetRef<SponsorCreateComponent> = inject(MatBottomSheetRef<StandingsViewComponent>);

  form: FormGroup<CreateSponsor>;
  loading: boolean = false;
  hasLogo: boolean = false;
  imageChanged: boolean = false;

  constructor(fb: FormBuilder) {
    this.form = new SponsorCreator(fb).createForm();
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
    const data = {
      name: this.form.value?.name ?? '',
      logoUrl: this.form.value?.logoUrl ?? '',
      priority: this.form.value?.priority ?? 0,
      website: this.form.value?.website ?? ''
    };
    await this.sponsorService.add(data);
    this.loading = false;
    this.close();
  }

  onLoad(file: any) {
    this.imageChanged = true;
    this.hasLogo = file.length > 0;
    this.logoUrlControl?.setValue(file);
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

  createForm(): FormGroup<CreateSponsor> {
    const frm = this.fb.group<CreateSponsor>({
      name: new FormControl('', { validators: [Validators.required], nonNullable: true }),
      logoUrl: new FormControl('', { validators: [Validators.required], nonNullable: true }),
      priority: new FormControl(1, { validators: [Validators.required], nonNullable: true }),
      website: new FormControl('', { nonNullable: false })
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