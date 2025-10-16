import { Component, computed, inject, signal  } from '@angular/core';
import { CsvProcesserService } from './csv-processer.service';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [MatTableModule, MatCardModule]
})

/**
 * Main application component that keeps view logic
 */
export class AppComponent {
  title = 'Sirma Group Holding Task';
 //Injecting the CsvParserService via Dependency Injection to use its functionality
  private csvProcesser = inject(CsvProcesserService);

  displayedColumns = ['EmpID1', 'EmpID2', 'ProjectID', 'DaysWorkedTogether'];
  pairwiseSignal = this.csvProcesser.pairOverlaps;
  globalMaxPair = this.csvProcesser.globalMaxPair
  csvProcessed = signal(false);

  onCsvUpload(event:Event): void {
    const input = event.target as HTMLInputElement;
    if(!input.files?.length) {
      return;
    }
    this.csvProcesser.parseCsv(input.files[0]);
    this.csvProcessed.set(true);
  }
}
