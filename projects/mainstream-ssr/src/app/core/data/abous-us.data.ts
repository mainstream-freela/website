import { Injectable, signal, WritableSignal } from "@angular/core";
import { AboutUs, Faq } from "@core/models/about-us.model";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AboutUsData{
    loadedAbout = signal<boolean>(false);
    loadedFaqs = signal<boolean>(false);
    private aboutusContainer: BehaviorSubject<AboutUs | null> = new BehaviorSubject<AboutUs | null>(null);
    private faqsContainer: BehaviorSubject<Faq[]> = new BehaviorSubject<Faq[]>([]);

    insert<T>(data: T, dataType: 'about' | 'faqs' = 'about'): void{
        if(dataType === 'about'){
            this.aboutusContainer.next(data as AboutUs | null);
            if(data !== null){
                this.loadedAbout.set(true);
            }
        } else {
            this.faqsContainer.next(data as Faq[]);
            if((data as Faq[]).length > 0){
                this.loadedFaqs.set(true);
            }
        }
    }

    get aboutus(): Observable<AboutUs | null>{
        return this.aboutusContainer.asObservable();
    }

    get faqs(): Observable<Faq[]>{
        return this.faqsContainer.asObservable();
    }
}