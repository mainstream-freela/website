import { Injectable } from "@angular/core";
import { Category } from "@core/models/category.model";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CategoriesData{
    private categoriesContainer: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);

    public insert(data: Category[]): void{
        this.categoriesContainer.next(data);
    }

    public get categories(): Observable<Category[]>{
        return this.categoriesContainer.asObservable();
    }

}