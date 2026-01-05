import { inject, Injectable } from "@angular/core";
import { AboutUsApiService } from "@core/api/about-us.api.service";
import { AboutUsData } from "@core/data/abous-us.data";
import { AboutUs, Faq } from "@core/models/about-us.model";
import { map, Observable, of, switchMap, take } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AboutFacade{
    private dataContainer = inject(AboutUsData);
    private api = inject(AboutUsApiService);

    public aboutus(): Observable<AboutUs | null>{
        return this.dataContainer.aboutus.pipe(
            take(1),
            switchMap(response => {
                if((response === null)){
                    return this.api.about().pipe(
                        map(incoming => {
                            this.dataContainer.insert(incoming, 'about');
                            return incoming;
                        })
                    );
                }

                return of(response);
            })
        )
    }

    public faqs(): Observable<Faq[]>{
        return this.dataContainer.faqs.pipe(
            take(1),
            switchMap(response => {
                if(!(response.length > 0)){
                    return this.api.faqs().pipe(
                        map(incoming => {
                            this.dataContainer.insert(incoming, 'faqs');
                            return incoming;
                        })
                    )
                }

                return of(response);
            }),
        )
    }
}