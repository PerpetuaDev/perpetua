// Libraries
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// Services
import { IArticle, APIResponseModel, IImage } from '../../util/interfaces';
import { StrapiService } from '../api/strapi.service';
import { environment } from '../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})

export class ArticleService {
    private articlesSubject = new BehaviorSubject<IArticle[]>([]);
    articles$ = this.articlesSubject.asObservable();

    private filteredArticlesSubject = new BehaviorSubject<IArticle[]>([]);
    filteredArticles$ = this.filteredArticlesSubject.asObservable();

    private selectedFilterSubject = new BehaviorSubject<string | null>('all');
    selectedFilter$ = this.selectedFilterSubject.asObservable();

    public moreArticlesSubject = new BehaviorSubject<IArticle[]>([]);
    moreArticles$ = this.moreArticlesSubject.asObservable();

    private loadingSubject = new BehaviorSubject<boolean>(true);
    isLoading$ = this.loadingSubject.asObservable();

    private searchResultsSubject = new BehaviorSubject<IArticle[]>([]);
    searchResults$ = this.searchResultsSubject.asObservable();

    strapiUrl = environment.strapiMediaUrl;

    constructor(private strapiService: StrapiService) {
        this.fetchArticles();
    }

    fetchArticles(): void {
        this.loadingSubject.next(true);
        this.strapiService.getAllArticles().subscribe((result: APIResponseModel) => {
            const articles = result.data.map((article: IArticle) => {
                // Log the thumbnail_image URL before assignment
                console.log("Data: ", article.thumbnail_image.url);

                // if (article.thumbnail_image) {
                //     console.log("Thumbnail Image URL before assignment: ", article.thumbnail_image.url);
                // } else {
                //     console.log("No thumbnail image for article with ID: ", article.documentId);
                // }

                return {
                    ...article,
                    thumbnail_image: article.thumbnail_image
                        ? {
                            ...article.thumbnail_image,
                            url: article.thumbnail_image.url
                        }
                        : { url: "../../../../../assets/images/img_n.a.png" }
                };
            });
            this.articlesSubject.next(articles);
            this.filteredArticlesSubject.next(articles);
            this.loadingSubject.next(false);
        }, error => {
            console.error('Error fetching articles:', error);
            this.loadingSubject.next(false);
        }); http://localhost:1337/uploads/project8_87cd6031bf.jpg
    }


    sortArticles(type: string): void {
        const articles = this.articlesSubject.getValue();

        if (type === 'all' || this.selectedFilterSubject.getValue() === type) {
            this.selectedFilterSubject.next('all');
            this.filteredArticlesSubject.next(articles);
        } else {
            this.selectedFilterSubject.next(type);
            const filteredArticles = articles.filter(article => article.type === type);
            this.filteredArticlesSubject.next(filteredArticles);
        }
    }

    public selectMoreArticleByDate(currentArticleDocumentId: string): void {
        this.strapiService.getAllArticles().subscribe((result: APIResponseModel) => {
            if (result && result.data) {
                const allArticles: IArticle[] = result.data.map((article: IArticle) => ({
                    ...article,
                    thumbnail_image: article.thumbnail_image
                        ? {
                            ...article.thumbnail_image,
                            url: article.thumbnail_image.url
                        } : { url: "../../../../../assets/images/img_n.a.png" }
                }));

                const filteredArticles = allArticles.filter(article => article.documentId !== currentArticleDocumentId);
                const sortedArticles = filteredArticles.sort((a, b) => {
                    const dateA = new Date(a.createdAt).getTime();
                    const dateB = new Date(b.createdAt).getTime();
                    return dateB - dateA;
                });

                const moreArticles = sortedArticles.slice(0, 12);
                this.moreArticlesSubject.next(moreArticles);
            }
        }, error => {
            console.error('Error fetching articles:', error);
        });
    }

    setSearchResults(results: IArticle[]): void {
        const dataWithTimestamp = {
            results,
            timestamp: Date.now(),
        };
        localStorage.setItem('articleSearchResults', JSON.stringify(dataWithTimestamp));
        this.searchResultsSubject.next(results);
    }

    getSearchResults(): IArticle[] {
        const savedResults = localStorage.getItem('articleSearchResults');
        if (savedResults) {
            const { results, timestamp } = JSON.parse(savedResults);
            const expiryTime = 60 * 60 * 1000; // 1 hour
            if (Date.now() - timestamp > expiryTime) {
                this.clearSearchResults();
                return [];
            }
            return results;
        }
        return [];
    }

    clearSearchResults(): void {
        this.searchResultsSubject.next([]);
        localStorage.removeItem('articleSearchResults');
    }
}