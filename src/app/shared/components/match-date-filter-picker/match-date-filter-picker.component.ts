import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { tap } from 'rxjs';

@Component({
  selector: 'app-match-date-filter-picker',
  templateUrl: './match-date-filter-picker.component.html',
  styleUrls: ['./match-date-filter-picker.component.scss'],
})
export class MatchDateFilterPickerComponent implements OnInit {
  dateControl: FormControl = new FormControl({
    value: this.calculateInitialDate(),
    disabled: true,
  });

  calculateInitialDate(): Date {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilSunday = (7 - dayOfWeek) % 7;
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + daysUntilSunday);
    return nextSunday;
  }

  @Output() onChanges: EventEmitter<Date> = new EventEmitter<Date>();

  ngOnInit(): void {
    this.dateControl.valueChanges
      .pipe(tap((date) => this.setLastSelectedDate(date)))
      .subscribe();

    const lastSelectedDate = localStorage.getItem('matches-selectedDate');
    if (lastSelectedDate) {
      this.dateControl.setValue(new Date(lastSelectedDate));
    } else {
      this.setLastSelectedDate(this.dateControl.value);
    }
  }

  setLastSelectedDate(date: Date) {
    const dateString = date.toISOString();
    localStorage.setItem('matches-selectedDate', dateString);
    this.onChanges.emit(date);
  }
}
