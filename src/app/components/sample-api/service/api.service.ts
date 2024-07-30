import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
class ApiService {
    private baseUrl = "'https://fakestoreapi.com/products'"

    constructor(private http:HttpClient){

    }
}
