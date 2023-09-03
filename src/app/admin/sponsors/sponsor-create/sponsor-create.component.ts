import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ISponsor } from 'src/app/models/sponsor';

@Component({
  selector: 'app-sponsor-create',
  templateUrl: './sponsor-create.component.html',
  styleUrls: ['./sponsor-create.component.scss']
})
export class SponsorCreateComponent {
  form: FormGroup<CreateSponsor>;
  loading: boolean = false;
  hasLogo: boolean = false;

  constructor(fb: FormBuilder) {
    this.form = new SponsorCreator(fb).createForm();
  }
  
  get logo() { return this.form.value.logoUrl ?? ''; }
  get title() { return this.form.value.name ?? ''; }
  publish() { }

  onLoad(file: any) {

    this.hasLogo = file.length > 0;
    this.form.get('logoUrl')?.setValue(file);
  }
}


class SponsorCreator {
  constructor(private fb: FormBuilder) { }

  createForm(): FormGroup<CreateSponsor> {
    const frm = this.fb.group<CreateSponsor>({
      name: new FormControl('', { nonNullable: true }),
      logoUrl: new FormControl('', { nonNullable: true }),
      priority: new FormControl(1, { nonNullable: true }),
      website: new FormControl('', { nonNullable: false })
    });

    return frm
  }
}

interface CreateSponsor {
  name: FormControl<string>;
  logoUrl: FormControl<string>;
  priority: FormControl<number>;
  website?: FormControl<string | null>;
}