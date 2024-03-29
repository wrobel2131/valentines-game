import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { CharacterService } from '../../services/character.service';
import { CommonModule } from '@angular/common';
import { CharacterPosition } from '../../models/position';
import { Subscription } from 'rxjs';
import { DialogModule } from '@angular/cdk/dialog';
import { EnvelopeDialogComponent } from '../envelope-dialog/envelope-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-standing-character',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './standing-character.component.html',
  styleUrl: './standing-character.component.scss',
})
export class StandingCharacterComponent implements OnInit {
  @Input() initPosition: CharacterPosition = {
    top: '120px',
    left: '1320px',
  };

  @HostBinding('style') get hostStyles() {
    return this.initPosition;
  }

  distance!: number;
  isDialogOpened = false;

  secondCharacterPositionValue!: CharacterPosition;
  secondCharacterPositionSubscription!: Subscription;

  constructor(
    public characterService: CharacterService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.secondCharacterPositionSubscription =
      this.characterService.characterPosition$.subscribe(
        (secondCharacterPosition) => {
          this.secondCharacterPositionValue = secondCharacterPosition;
          this.distance = this.calculateDistance(secondCharacterPosition);

          if (this.distance < 50) {
            this.characterService.setIsInteractive(true);
          } else {
            this.characterService.setIsInteractive(false);

          }
        }
      );
  }
  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(EnvelopeDialogComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  calculateDistance(secondCharacterPosition: CharacterPosition): number {
    return this.characterService.calculateDistanceBetweenCharacters(
      this.initPosition,
      secondCharacterPosition
    );
  }
}
