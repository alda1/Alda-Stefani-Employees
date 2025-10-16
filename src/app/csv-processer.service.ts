import { computed, Injectable, signal } from '@angular/core';
import * as Papa from 'papaparse';
import { Employee } from './employee';
import { PairEmployeesWork } from './pair-employees-work';

@Injectable({
  providedIn: 'root'
})
/**
 * Service file that handles bussiness logic related to parsing and processing the CSV file
 */
export class CsvProcesserService {

  //Used Signal to store parsed data of the csv file 
  parsedData = signal<Employee[]>([]);

  parseCsv(file: File) {
    Papa.parse<Employee>(file, {
      header: true, 
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(), 
      transform: (value) => value.trim(), 
      complete: (result) => {
        console.log('CSV parse result:', result.data);
        //Parsing csv data and converting to array of objects data structure
        const formattedData: Employee[] = result.data.map(item => ({
          EmpID: Number(item.EmpID),
          ProjectID: Number(item.ProjectID),
          DateFrom: this.adjustDateFormat(item.DateFrom),
          DateTo: this.adjustDateFormat(item.DateTo)
        }));
        this.parsedData.set(formattedData);
      }
    });
  }
  
  //Create a Map where key is ProjectID and value is array of employee objects worked on that project
  employeesPerProject = computed(() => {
      const employeesPerProject = new Map<number, Employee[]>();
      this.parsedData().forEach(entry => {
        if (!employeesPerProject.has(entry.ProjectID)) {
          employeesPerProject.set(entry.ProjectID, []);
        }
        employeesPerProject.get(entry.ProjectID)?.push(entry);
      });
      //debugger;
      //console.log('employeesPerProject Map:', employeesPerProject);
      return employeesPerProject;
  });

  //Create a signal that holds array of PairEmployeesWork objects representing pairs of employees who worked together on projects
    pairOverlaps = computed<PairEmployeesWork[]>(() => {
    const result: PairEmployeesWork[] = [];
    this.employeesPerProject().forEach((employees, projectID) => {
      let maxEmployeePair: PairEmployeesWork | null = null;
      for (let i = 0; i < employees.length; i++) {
        for (let j = i + 1; j < employees.length; j++) {
          const days = this.getOverlapDays(employees[i], employees[j]);
          if (days > 0) {
            const employeeePair: PairEmployeesWork = {
              EmpID1: employees[i].EmpID,
              EmpID2: employees[j].EmpID,
              ProjectID: projectID,
              DaysWorkedTogether: days
            };
            // Keep only the max employee pair per project
            if (!maxEmployeePair || employeeePair.DaysWorkedTogether > maxEmployeePair.DaysWorkedTogether) {
              maxEmployeePair = employeeePair;
            }
          }
        }
      }
      //console.log('Max employee pair for project', projectID, ':', maxEmployeePair);
      if (maxEmployeePair) {
        result.push(maxEmployeePair);
      }
    });
    return result;
  });



  //Calculate overlapped days for two employees
  private getOverlapDays(emp1: Employee, emp2: Employee): number {
    const start = emp1.DateFrom > emp2.DateFrom ? emp1.DateFrom : emp2.DateFrom;
    const end = emp1.DateTo < emp2.DateTo ? emp1.DateTo : emp2.DateTo;
    /**
     * Date.UTC() reccomended to avoid timezone issues
     */
    const startUTC = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    const endUTC = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
    //+1 ensures that same-day work  counts as 1 day
    const diffDays = Math.floor((endUTC - startUTC) / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 0;
  }

  
  //Create a signal that holds the pair of employees with maximum days worked together across all projects
  globalMaxPair = computed<PairEmployeesWork | null>(() => {
    const pairs = this.pairOverlaps();
    if (!pairs.length) return null;

    let maxPair = pairs[0];
    for (const p of pairs) {
      if (p.DaysWorkedTogether > maxPair.DaysWorkedTogether) {
        maxPair = p;
      }
    }
    //console.log('Global max pair:', maxPair);
    return maxPair;
  });

  private adjustDateFormat(input: string | Date | null | undefined): Date {
    if (!input) return new Date(); 
    if (input instanceof Date) return input;

    const str = input.trim();

    //ISO format YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      return new Date(str);
    }

    //European / US differ ambiguous format DD/MM/YYYY or MM/DD/YYYY
    const match = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (match) {
      let [ , first, second, year ] = match.map(Number);

      if (first > 12) {
        // Definitely European
        return new Date(year, second - 1, first); // DD/MM/YYYY
      } else {
        // Treat as US format
        return new Date(year, first - 1, second); // MM/DD/YYYY
      }
    }

    const parsed = new Date(str);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }
}
