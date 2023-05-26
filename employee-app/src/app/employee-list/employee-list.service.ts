import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const baseUrl = 'http://localhost:3000/api/employees';

@Injectable({
  providedIn: 'root'
})
export class EmployeeListService {

  constructor(private http: HttpClient) { }

  fetchEmployees() {
    return this.http.get<any>(baseUrl).pipe(
      map((res:any) => {
        return res;
      }),
      (err: any) => {
        return err;
      }
    );
  }

  addEmployee(data:any){
    return this.http.post<any>(baseUrl,data).pipe(
      map((res:any) => {
        return res;
      }),
      (err: any) => {
        return err;
      }
    );
  }

  updateEmployee(id: any, data: any){
    return this.http.put<any>(`${baseUrl}/${id}`, data).pipe(
      map((res: any) => {
        return res;
      }),
      (err: any) => {
        return err;
      })
  }

  deleteEmployee(id: any){
    return this.http.delete<any>(`${baseUrl}/${id}`).pipe(
      map((res: any) => {
        return res;
      }),
      (err: any) => {
        return err;
      })
  }

}
