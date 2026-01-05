import { Injectable, signal, WritableSignal } from "@angular/core";
import { SearchTerm } from "@core/contracts/search-term.contract";

@Injectable({
    providedIn: 'root'
})
export class SearchTermCatcher{
    terms: WritableSignal<SearchTerm> = signal({});
}