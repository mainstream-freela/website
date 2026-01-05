import { Directive, signal } from "@angular/core";
@Directive()
export abstract class PaginatedPage{
    isLoadingEvents = signal(true);

    currentPage = signal<number>(1);
    limit = signal<number>(6);
    
    hasLoadMoreButtonAppear = signal<boolean>(false);

    abstract loadMoreEvents(): void;

}