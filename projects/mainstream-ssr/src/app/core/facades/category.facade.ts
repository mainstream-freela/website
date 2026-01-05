import { inject, Injectable } from "@angular/core";
import { CategoriesApiService } from "@core/api/categories.api.service";
import { CategoriesData } from "@core/data/categories.data";
import { Category } from "@core/models/category.model";
import { map, Observable, of, switchMap, take } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CategoryFacade{
    private dataContainer = inject(CategoriesData);
    private api = inject(CategoriesApiService);

    public all(): Observable<Category[]>{
        return this.dataContainer.categories.pipe(
            take(1),
            switchMap(response => {
                if(!(response.length > 0)){
                    return this.api.all().pipe(
                        map(incoming => {
                            this.dataContainer.insert(incoming);
                            return incoming;
                        })
                    );
                }
                
                return of(response);
            })
        )
    }
}